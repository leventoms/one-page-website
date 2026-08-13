import type { SupabaseClient } from '@supabase/supabase-js';
import type { IOrderRepository } from './order-repository.interface';
import type { CreateOrderInput, Order, OrderStatus } from '@/types/order';

/** Raw row shape as stored in Postgres (see supabase/schema.sql). */
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

function rowToOrder(row: OrderRow): Order {
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

const TIER1_PRICE_IN_PAISE = 9900; // ₹99, kept here as the tier-1 default

export class SupabaseOrderRepository implements IOrderRepository {
  constructor(private readonly client: SupabaseClient) {}

  async create(slug: string, input: CreateOrderInput): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .insert({
        slug,
        status: 'draft' satisfies OrderStatus,
        config: input.config,
        price_in_paise: TIER1_PRICE_IN_PAISE,
        pin_code: input.pinCode,
      })
      .select()
      .single<OrderRow>();

    if (error || !data) {
      throw new Error(`Failed to create order: ${error?.message ?? 'unknown error'}`);
    }

    return rowToOrder(data);
  }

  async findBySlug(slug: string): Promise<Order | null> {
    const { data, error } = await this.client
      .from('orders')
      .select()
      .eq('slug', slug)
      .maybeSingle<OrderRow>();

    if (error) {
      throw new Error(`Failed to fetch order ${slug}: ${error.message}`);
    }

    return data ? rowToOrder(data) : null;
  }

  async updateStatus(
    slug: string,
    status: OrderStatus,
    extra?: Partial<Pick<Order, 'razorpayOrderId' | 'razorpayPaymentId' | 'paidAt'>>
  ): Promise<Order> {
    const { data, error } = await this.client
      .from('orders')
      .update({
        status,
        ...(extra?.razorpayOrderId !== undefined && {
          razorpay_order_id: extra.razorpayOrderId,
        }),
        ...(extra?.razorpayPaymentId !== undefined && {
          razorpay_payment_id: extra.razorpayPaymentId,
        }),
        ...(extra?.paidAt !== undefined && { paid_at: extra.paidAt }),
      })
      .eq('slug', slug)
      .select()
      .single<OrderRow>();

    if (error || !data) {
      throw new Error(`Failed to update order ${slug}: ${error?.message ?? 'unknown error'}`);
    }

    return rowToOrder(data);
  }

  async attachRazorpayOrderId(slug: string, razorpayOrderId: string): Promise<Order> {
    return this.updateStatus(slug, 'previewing', { razorpayOrderId });
  }
}
