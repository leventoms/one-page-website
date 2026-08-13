import { NextRequest, NextResponse } from 'next/server';
import { createOrderService } from '@/lib/composition-root';
import { createRazorpayGatewayFromEnv } from '@/lib/payments/razorpay-gateway';
import { OrderNotFoundError } from '@/lib/services/order-service';

/**
 * POST /api/orders/:slug/pay
 * Creates a Razorpay order for the given draft and returns what the
 * client-side Razorpay Checkout widget needs to open the payment sheet.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const orderService = createOrderService();
    const order = await orderService.getOrderForPreview(params.slug);

    if (order.status === 'published') {
      return NextResponse.json({ error: 'Order already paid' }, { status: 409 });
    }

    const gateway = createRazorpayGatewayFromEnv();
    const paymentOrder = await gateway.createOrder(order.priceInPaise, order.slug);

    await orderService.markRazorpayOrderCreated(order.slug, paymentOrder.gatewayOrderId);

    return NextResponse.json({
      razorpayOrderId: paymentOrder.gatewayOrderId,
      amountInPaise: paymentOrder.amountInPaise,
      currency: paymentOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    if (err instanceof OrderNotFoundError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    console.error('Failed to initiate payment', err);
    return NextResponse.json({ error: 'Could not start payment' }, { status: 500 });
  }
}
