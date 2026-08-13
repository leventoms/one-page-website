import { getSupabaseServerClient } from '@/lib/supabase/client';
import { SupabaseOrderRepository } from '@/lib/repositories/supabase-order-repository';
import { SlugGenerator } from '@/lib/services/slug-generator';
import { OrderService } from '@/lib/services/order-service';

/**
 * The ONE place in the app where concrete classes are instantiated and
 * wired together. Every API route and server component asks this file for
 * an OrderService instead of `new`-ing repositories directly — that keeps
 * the dependency graph in one auditable spot, and makes swapping Supabase
 * for something else a one-file change.
 */
export function createOrderService(): OrderService {
  const client = getSupabaseServerClient();
  const repository = new SupabaseOrderRepository(client);
  const slugGenerator = new SlugGenerator();
  return new OrderService(repository, slugGenerator);
}
