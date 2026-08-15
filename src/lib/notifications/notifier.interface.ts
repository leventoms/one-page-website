import type { ManualRequest } from '@/types/manual-request';

/**
 * Abstraction over "however the owner gets notified of a new manual
 * request" — same reasoning as IPaymentGateway: the service that uses
 * this shouldn't know or care whether it's email, Slack, SMS, etc.
 */
export interface INotifier {
  notifyNewManualRequest(request: ManualRequest): Promise<void>;
}
