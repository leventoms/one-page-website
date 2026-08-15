import type { IManualRequestRepository } from '@/lib/repositories/manual-request-repository.interface';
import type { INotifier } from '@/lib/notifications/notifier.interface';
import type { ManualRequest, ManualRequestInput } from '@/types/manual-request';

/**
 * Business logic for the "build it for me" lead form. Deliberately simpler
 * than OrderService — no payment, no publish state machine, no PIN. The
 * request always gets saved first; notification failure is swallowed (and
 * logged) rather than surfaced, so a broken email integration can never
 * cause a lead to be lost or the sender to see an error after they've
 * already been recorded.
 */
export class ManualRequestService {
  constructor(
    private readonly requests: IManualRequestRepository,
    private readonly notifier: INotifier
  ) {}

  async submit(input: ManualRequestInput): Promise<ManualRequest> {
    const request = await this.requests.create(input);

    try {
      await this.notifier.notifyNewManualRequest(request);
    } catch (err) {
      console.error('Failed to notify about new manual request', request.id, err);
    }

    return request;
  }
}
