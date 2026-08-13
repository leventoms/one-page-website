import { NextRequest, NextResponse } from 'next/server';
import { createOrderService } from '@/lib/composition-root';
import { InvalidPinError, OrderNotFoundError } from '@/lib/services/order-service';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const pinCode = request.nextUrl.searchParams.get('pin') ?? '';

  try {
    const orderService = createOrderService();
    const order = await orderService.getPublishedOrder(params.slug, pinCode);

    if (order.status !== 'published') {
      return NextResponse.json({ error: 'This link is not active yet' }, { status: 402 });
    }

    return NextResponse.json({ config: order.config });
  } catch (err) {
    if (err instanceof OrderNotFoundError) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    if (err instanceof InvalidPinError) {
      return NextResponse.json({ error: 'Incorrect PIN' }, { status: 401 });
    }
    console.error('Failed to fetch order', err);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
