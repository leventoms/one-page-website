import { notFound } from 'next/navigation';
import { createOrderService } from '@/lib/composition-root';
import { getTemplateDefinition } from '@/lib/templates/template-registry';
import { InvalidPinError, OrderNotFoundError } from '@/lib/services/order-service';
import PinGate from '@/components/PinGate';

interface PageProps {
  params: { slug: string };
  searchParams: { pin?: string };
}

/**
 * This route never imports Tier1Template directly — it asks the registry
 * for whichever component matches order.config.tier. Tier2/3/4 pages will
 * reuse this exact route with zero changes (Open/Closed).
 */
export default async function LivePage({ params, searchParams }: PageProps) {
  const orderService = createOrderService();
  const pin = searchParams.pin ?? '';

  if (pin.length !== 4) {
    return <PinGate slug={params.slug} />;
  }

  try {
    const order = await orderService.getPublishedOrder(params.slug, pin);

    if (order.status !== 'published') {
      return (
        <main className="min-h-screen flex items-center justify-center text-white/70 px-6 text-center">
          This link isn&apos;t active yet — the recipient may still be waiting on payment.
        </main>
      );
    }

    const { Component } = getTemplateDefinition(order.config.tier);
    return <Component config={order.config.data} isPreview={false} />;
  } catch (err) {
    if (err instanceof InvalidPinError) {
      return <PinGate slug={params.slug} error="Incorrect PIN — try again." />;
    }
    if (err instanceof OrderNotFoundError) {
      notFound();
    }
    throw err;
  }
}
