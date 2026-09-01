import { NextRequest, NextResponse } from 'next/server';
import { getOrderByRazorpayOrderId, OrderNotFoundError, publishOrder } from '@/lib/orders';
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const { razorpay_payment_id: paymentId, razorpay_order_id: orderId, razorpay_signature: signature } = body ?? {};

  if (!paymentId || !orderId || !signature) {
    return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
  }

  try {
    const order = await getOrderByRazorpayOrderId(orderId);
    if (!verifyRazorpayPaymentSignature(orderId, paymentId, signature)) {
      return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 });
    }

    await publishOrder(order.slug, paymentId);
    return NextResponse.json({ ok: true, slug: order.slug });
  } catch (error) {
    if (error instanceof OrderNotFoundError) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    console.error('Failed to verify Razorpay payment', error);
    return NextResponse.json({ error: 'Could not verify payment' }, { status: 500 });
  }
}
