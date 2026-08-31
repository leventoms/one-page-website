import type { ManualRequest } from '@/types/manual-request';
import type { ContactMessage } from '@/types/contact';

/**
 * Abstraction over "however the owner gets notified" — same reasoning as
 * IPaymentGateway: callers shouldn't know or care whether it's email, Slack,
 * SMS, etc. Covers both the "build it for me" manual requests and public
 * contact-form messages.
 */
export interface INotifier {
  notifyNewManualRequest(request: ManualRequest): Promise<void>;
  notifyContactMessage(message: ContactMessage): Promise<void>;
}
