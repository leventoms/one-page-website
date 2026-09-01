import { useState } from 'react';
import type { TemplateConfig } from '@/types';

export type CheckoutStage = 'editing' | 'creating' | 'paying' | 'done';

interface UseOrderCheckoutResult {
  stage: CheckoutStage;
  errorMessage: string | null;
  finalSlug: string | null;
  payAndPublish: (config: TemplateConfig, pinCode: string) => Promise<void>;
  reset: () => void;
}

/**
 * The create-order → Razorpay-checkout → publish flow is identical for
 * every template tier; only the config shape differs. Centralising it here
 * means Tier2Builder (and Tier3/4 later) don't re-implement payment logic
 * — they just supply a validated TemplateConfig (SRP: this hook owns
 * checkout, each builder owns its own form fields).
 */
export function useOrderCheckout(): UseOrderCheckoutResult {
  const [stage, setStage] = useState<CheckoutStage>('editing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finalSlug, setFinalSlug] = useState<string | null>(null);

  function reset() {
    setStage('editing');
    setErrorMessage(null);
  }

  async function payAndPublish(config: TemplateConfig, pinCode: string) {
    setErrorMessage(null);
    setStage('creating');

    try {
      const createRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config, pinCode }),
      });

      if (!createRes.ok) {
        const body = await createRes.json();
        const problems = body.details?.fieldErrors
          ? Object.values(body.details.fieldErrors).flat().filter(Boolean).join(' ')
          : '';
        throw new Error(problems || body.error || 'Could not create order');
      }

      const { slug } = await createRes.json();
      setStage('paying');

      const payRes = await fetch(`/api/orders/${slug}/pay`, { method: 'POST' });
      if (!payRes.ok) throw new Error('Could not start payment');
      const { razorpayOrderId, amountInPaise, keyId } = await payRes.json();

      const rzp = new (window as any).Razorpay({
        key: keyId,
        amount: amountInPaise,
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'Surprise Pages',
        description: `For ${config.data.recipientName}`,
        handler: async (payment: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payment),
            });
            const result = await verifyRes.json();
            if (!verifyRes.ok) throw new Error(result.error ?? 'Payment verification failed');

            setFinalSlug(result.slug);
            setStage('done');
          } catch (err) {
            setErrorMessage(err instanceof Error ? err.message : 'Payment verification failed');
            setStage('editing');
          }
        },
        modal: {
          ondismiss: () => setStage('editing'),
        },
      });

      rzp.on('payment.failed', (response: any) => {
        setErrorMessage(response.error?.description ?? 'Payment failed. Please try again.');
        setStage('editing');
      });

      rzp.open();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setStage('editing');
    }
  }

  return { stage, errorMessage, finalSlug, payAndPublish, reset };
}
