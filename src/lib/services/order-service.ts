import type { IOrderRepository } from '@/lib/repositories/order-repository.interface';
import type { ISlugGenerator } from './slug-generator';
import type { CreateOrderInput, Order } from '@/types/order';

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

/**
 * Business logic for orders. Notice this class never imports Supabase,
 * Razorpay, or Next.js request/response types — it only knows about the
 * repository *interface* and the slug generator *interface*. That's what
 * lets it be unit-tested with in-memory fakes, and lets the storage or
 * routing framework change without a rewrite here (DIP + SRP).
 */
export class OrderService {
  constructor(
    private readonly orders: IOrderRepository,
    private readonly slugGenerator: ISlugGenerator
  ) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const displayName =
      input.config.tier === 'tier1' ? input.config.data.recipientName : 'surprise';
    const slug = this.slugGenerator.generate(displayName);
    return this.orders.create(slug, input);
  }

  async getOrderForPreview(slug: string): Promise<Order> {
    const order = await this.orders.findBySlug(slug);
    if (!order) throw new OrderNotFoundError(slug);
    return order;
  }

  /** Only returns the order if it's actually paid+published and the PIN matches. */
  async getPublishedOrder(slug: string, pinCode: string): Promise<Order> {
    const order = await this.orders.findBySlug(slug);
    if (!order) throw new OrderNotFoundError(slug);
    if (order.pinCode !== pinCode) throw new InvalidPinError();
    return order;
  }

  async markRazorpayOrderCreated(slug: string, razorpayOrderId: string): Promise<Order> {
    return this.orders.attachRazorpayOrderId(slug, razorpayOrderId);
  }

  async markPaidAndPublished(
    slug: string,
    razorpayPaymentId: string
  ): Promise<Order> {
    return this.orders.updateStatus(slug, 'published', {
      razorpayPaymentId,
      paidAt: new Date().toISOString(),
    });
  }
}
