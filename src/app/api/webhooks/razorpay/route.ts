import { NextRequest, NextResponse } from 'next/server';
import { createOrderService } from '@/lib/composition-root';
import { createRazorpayGatewayFromEnv } from '@/lib/payments/razorpay-gateway';

/**
 * Razorpay calls this after a payment completes. We verify the signature
 * BEFORE trusting anything in the body — this is the fraud guard: a page
 * only ever gets published because Razorpay cryptographically confirmed
 * money moved, never because the client claimed it did.
 */
export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-razorpay-signature') ?? '';

  const gateway = createRazorpayGatewayFromEnv();
  const isValid = gateway.verifyWebhookSignature(rawBody, signature);

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);
  const event = payload.event as string;

  if (event !== 'payment.captured') {
    // Acknowledge other events without acting on them.
    return NextResponse.json({ received: true });
  }

  const razorpayOrderId: string = payload.payload.payment.entity.order_id;
  const razorpayPaymentId: string = payload.payload.payment.entity.id;
  const receiptSlug: string | undefined = payload.payload.order?.entity?.receipt;

  if (!receiptSlug) {
    console.error('Webhook missing receipt/slug', { razorpayOrderId });
    return NextResponse.json({ error: 'Missing receipt' }, { status: 400 });
  }

  try {
    const orderService = createOrderService();
    await orderService.markPaidAndPublished(receiptSlug, razorpayPaymentId);
    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Failed to mark order paid', err);
    // Return 500 so Razorpay retries the webhook.
    return NextResponse.json({ error: 'Processing failed' }, { status: 500 });
  }
}
