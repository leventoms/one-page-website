import { getSupabaseServerClient } from '@/lib/supabase';
import { createSlug } from '@/lib/slug';
import { getTemplateDefinition } from '@/lib/templates';
import type { CreateOrderInput, Order, OrderStatus } from '@/types';

interface OrderRow {
  id: string;
  slug: string;
  status: OrderStatus;
  config: Order['config'];
  price_in_paise: number;
  pin_code: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
  paid_at: string | null;
}

export class OrderNotFoundError extends Error {
  constructor(slug: string) {
    super(`Order not found for slug "${slug}"`);
    this.name = 'OrderNotFoundError';
  }
}

export class InvalidPinError extends Error {
  constructor() {
    super('Incorrect PIN');
    this.name = 'InvalidPinError';
  }
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    slug: row.slug,
    status: row.status,
    config: row.config,
    priceInPaise: row.price_in_paise,
    pinCode: row.pin_code,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    createdAt: row.created_at,
    paidAt: row.paid_at,
  };
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const slug = createSlug(input.config.data.recipientName);
  const priceInPaise = getTemplateDefinition(input.config.tier).priceInPaise;
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .insert({ slug, status: 'draft', config: input.config, price_in_paise: priceInPaise, pin_code: input.pinCode })
    .select()
    .single<OrderRow>();

  if (error || !data) throw new Error(`Failed to create order: ${error?.message ?? 'unknown error'}`);
  return toOrder(data);
}

export async function getOrder(slug: string): Promise<Order> {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .select()
    .eq('slug', slug)
    .maybeSingle<OrderRow>();

  if (error) throw new Error(`Failed to fetch order ${slug}: ${error.message}`);
  if (!data) throw new OrderNotFoundError(slug);
  return toOrder(data);
}

export async function getOrderWithPin(slug: string, pinCode: string): Promise<Order> {
  const order = await getOrder(slug);
  if (order.pinCode !== pinCode) throw new InvalidPinError();
  return order;
}

export async function markPaymentStarted(slug: string, razorpayOrderId: string): Promise<Order> {
  return updateOrder(slug, 'previewing', { razorpay_order_id: razorpayOrderId });
}

export async function publishOrder(slug: string, razorpayPaymentId: string): Promise<Order> {
  return updateOrder(slug, 'published', {
    razorpay_payment_id: razorpayPaymentId,
    paid_at: new Date().toISOString(),
  });
}

async function updateOrder(
  slug: string,
  status: OrderStatus,
  fields: Record<string, string>
): Promise<Order> {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .update({ status, ...fields })
    .eq('slug', slug)
    .select()
    .single<OrderRow>();

  if (error || !data) throw new Error(`Failed to update order ${slug}: ${error?.message ?? 'unknown error'}`);
  return toOrder(data);
}
