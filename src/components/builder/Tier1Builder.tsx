'use client';

import { useState } from 'react';
import Script from 'next/script';
import Tier1Template from '@/components/templates/Tier1Template';
import { ALLOWED_ACCENT_COLORS } from '@/lib/services/validation';
import type { Tier1Config } from '@/types/order';

const EMPTY_CONFIG: Tier1Config = {
  recipientName: '',
  senderName: '',
  message: '',
  photoUrls: [],
  accentColor: ALLOWED_ACCENT_COLORS[0],
};

type Stage = 'editing' | 'creating' | 'paying' | 'done';

export default function Tier1Builder() {
  const [config, setConfig] = useState<Tier1Config>(EMPTY_CONFIG);
  const [pinCode, setPinCode] = useState('');
  const [stage, setStage] = useState<Stage>('editing');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [finalSlug, setFinalSlug] = useState<string | null>(null);

  function updateField<K extends keyof Tier1Config>(key: K, value: Tier1Config[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  async function handlePayAndPublish() {
    setErrorMessage(null);

    if (pinCode.length !== 4) {
      setErrorMessage('Choose a 4-digit PIN for the recipient first.');
      return;
    }
    if (config.photoUrls.length === 0) {
      setErrorMessage('Add at least one photo URL.');
      return;
    }

    setStage('creating');

    try {
      const createRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ config: { tier: 'tier1', data: config }, pinCode }),
      });

      if (!createRes.ok) {
        const body = await createRes.json();
        throw new Error(body.error ?? 'Could not create order');
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
        description: `For ${config.recipientName}`,
        handler: () => {
          // Publishing itself happens via the server-side webhook, which is
          // the only trusted source of truth — this just improves UX.
          setFinalSlug(slug);
          setStage('done');
        },
        modal: {
          ondismiss: () => setStage('editing'),
        },
      });

      rzp.open();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Something went wrong');
      setStage('editing');
    }
  }

  if (stage === 'done' && finalSlug) {
    const liveUrl = `${window.location.origin}/p/${finalSlug}?pin=${pinCode}`;
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6">
        <h2 className="text-xl font-semibold mb-3">Payment received 🎉</h2>
        <p className="text-white/70 mb-4">
          It may take a few seconds to go live. Share this link (with the PIN) once it does:
        </p>
        <code className="block break-all rounded-lg bg-white/10 p-3 text-sm">{liveUrl}</code>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto px-6 py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-2xl font-semibold mb-2">Build your surprise page</h1>

        <label className="flex flex-col gap-1 text-sm">
          Recipient&apos;s name
          <input
            className="rounded-lg bg-white/10 px-3 py-2"
            value={config.recipientName}
            onChange={(e) => updateField('recipientName', e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Your name
          <input
            className="rounded-lg bg-white/10 px-3 py-2"
            value={config.senderName}
            onChange={(e) => updateField('senderName', e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Message
          <textarea
            className="rounded-lg bg-white/10 px-3 py-2 min-h-[120px]"
            value={config.message}
            onChange={(e) => updateField('message', e.target.value)}
            maxLength={600}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          Photo URL(s) — comma separated, up to 3
          <input
            className="rounded-lg bg-white/10 px-3 py-2"
            placeholder="https://..."
            onChange={(e) =>
              updateField(
                'photoUrls',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 3)
              )
            }
          />
        </label>

        <div className="flex gap-2">
          {ALLOWED_ACCENT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateField('accentColor', color)}
              className="h-8 w-8 rounded-full ring-2"
              style={{
                backgroundColor: color,
                borderColor: config.accentColor === color ? '#fff' : 'transparent',
              }}
              aria-label={`Choose ${color}`}
            />
          ))}
        </div>

        <label className="flex flex-col gap-1 text-sm">
          4-digit PIN for the recipient
          <input
            className="rounded-lg bg-white/10 px-3 py-2 w-24 tracking-widest"
            inputMode="numeric"
            maxLength={4}
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
          />
        </label>

        {errorMessage && <p className="text-sm text-red-400">{errorMessage}</p>}

        <button
          type="button"
          onClick={handlePayAndPublish}
          disabled={stage === 'creating' || stage === 'paying'}
          className="mt-2 rounded-full bg-brand-500 px-6 py-3 font-medium disabled:opacity-50"
        >
          {stage === 'editing' && 'Pay ₹99 & get link'}
          {stage === 'creating' && 'Creating order…'}
          {stage === 'paying' && 'Opening payment…'}
        </button>
      </form>

      <div className="rounded-2xl overflow-hidden ring-1 ring-white/10">
        <Tier1Template config={config} isPreview />
      </div>
    </div>
  );
}
