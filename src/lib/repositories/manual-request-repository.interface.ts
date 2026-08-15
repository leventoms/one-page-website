import type { ManualRequest, ManualRequestInput } from '@/types/manual-request';

/** Same abstraction pattern as IOrderRepository — services depend on this, not Supabase directly. */
export interface IManualRequestRepository {
  create(input: ManualRequestInput): Promise<ManualRequest>;
}
