import { NextRequest, NextResponse } from 'next/server';
import { createOrderService } from '@/lib/composition-root';
import { createOrderInputSchema } from '@/lib/services/validation';

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  if (!json) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = createOrderInputSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 422 }
    );
  }

  try {
    const orderService = createOrderService();
    const order = await orderService.createOrder(parsed.data);
    return NextResponse.json(
      { slug: order.slug, status: order.status },
      { status: 201 }
    );
  } catch (err) {
    console.error('Failed to create order', err);
    return NextResponse.json({ error: 'Could not create order' }, { status: 500 });
  }
}
