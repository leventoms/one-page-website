import type { CreateOrderInput, Order, OrderStatus } from '@/types/order';

/**
 * Abstraction over "wherever orders are stored". Services depend on this
 * interface, not on Supabase directly — swapping storage later (e.g. to
 * Postgres via Prisma) means writing one new class, not touching services,
 * API routes, or pages.
 */
export interface IOrderRepository {
  create(slug: string, input: CreateOrderInput): Promise<Order>;
  findBySlug(slug: string): Promise<Order | null>;
  updateStatus(
    slug: string,
    status: OrderStatus,
    extra?: Partial<Pick<Order, 'razorpayOrderId' | 'razorpayPaymentId' | 'paidAt'>>
  ): Promise<Order>;
  attachRazorpayOrderId(slug: string, razorpayOrderId: string): Promise<Order>;
}
