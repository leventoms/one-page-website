import type { INotifier } from './notifier.interface';
import type { ManualRequest } from '@/types/manual-request';
import type { ContactMessage } from '@/types/contact';

const TIER_LABELS: Record<ManualRequest['tier'], string> = {
  tier1: 'Simple Wish',
  tier2: 'Memory Lane',
  tier3: 'Time Capsule',
  tier4: 'White Glove',
};

export class ResendEmailNotifier implements INotifier {
  constructor(
    private readonly apiKey: string,
    private readonly toEmail: string,
    private readonly fromEmail: string
  ) {}

  async notifyNewManualRequest(request: ManualRequest): Promise<void> {
    const subject = `New build request — ${TIER_LABELS[request.tier]} for ${request.recipientName}`;
    const lines = [
      `Tier: ${TIER_LABELS[request.tier]}`,
      `Recipient: ${request.recipientName}`,
      `Reply-to: ${request.contactEmail}`,
      request.senderName ? `From: ${request.senderName}` : null,
      request.occasion ? `Occasion: ${request.occasion}` : null,
      request.message ? `Message:\n${request.message}` : null,
      request.notes ? `Notes:\n${request.notes}` : null,
    ].filter(Boolean);

    await this.send(subject, lines.join('\n\n'), request.contactEmail);
  }

  async notifyContactMessage(message: ContactMessage): Promise<void> {
    const subject = `New contact message from ${message.name}`;
    const text = [`From: ${message.name} <${message.email}>`, '', message.message].join('\n');
    await this.send(subject, text, message.email);
  }

  /** Shared Resend transport. `replyTo` lets the owner reply straight to the
   *  sender from their inbox. */
  private async send(subject: string, text: string, replyTo: string): Promise<void> {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: this.fromEmail,
        to: this.toEmail,
        reply_to: replyTo,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`Resend request failed (${res.status}): ${body}`);
    }
  }
}

/**
 * A notifier that just logs, used when email isn't configured yet. Unlike
 * createRazorpayGatewayFromEnv (which throws — a missing payment gateway
 * must never silently "succeed"), a missing notifier should NOT stop a
 * manual request from being saved or a contact message from succeeding:
 * losing a lead because an env var isn't set yet is worse than the owner
 * just having to check Supabase / the logs directly until RESEND_API_KEY /
 * RESEND_TO_EMAIL / RESEND_FROM_EMAIL are set.
 */
export class ConsoleFallbackNotifier implements INotifier {
  async notifyNewManualRequest(request: ManualRequest): Promise<void> {
    console.warn(
      '[manual-request] Email not configured (RESEND_API_KEY/RESEND_TO_EMAIL/RESEND_FROM_EMAIL missing). ' +
        `New request logged only: ${request.id} (${request.tier}, recipient: ${request.recipientName}).`
    );
  }

  async notifyContactMessage(message: ContactMessage): Promise<void> {
    console.warn(
      '[contact] Email not configured (RESEND_API_KEY/RESEND_TO_EMAIL/RESEND_FROM_EMAIL missing). ' +
        `Contact message logged only — from ${message.name} <${message.email}>:\n${message.message}`
    );
  }
}

export function createNotifierFromEnv(): INotifier {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.RESEND_TO_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    return new ConsoleFallbackNotifier();
  }

  return new ResendEmailNotifier(apiKey, toEmail, fromEmail);
}
