import type { ContactMessage } from '@/types';
import type { ManualRequest } from '@/types';

const tierLabels: Record<ManualRequest['tier'], string> = {
  tier1: 'Simple Wish', tier2: 'Memory Lane', tier3: 'Time Capsule', tier4: 'White Glove',
};

async function sendEmail(subject: string, text: string, replyTo: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.RESEND_TO_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) throw new Error('Email is not configured.');

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to, reply_to: replyTo, subject, text }),
  });
  if (!response.ok) throw new Error(`Resend request failed (${response.status}): ${await response.text().catch(() => '')}`);
}

function emailIsConfigured(): boolean {
  return Boolean(
    process.env.RESEND_API_KEY && process.env.RESEND_TO_EMAIL && process.env.RESEND_FROM_EMAIL
  );
}

export async function notifyManualRequest(request: ManualRequest): Promise<void> {
  const text = [
    `Tier: ${tierLabels[request.tier]}`, `Recipient: ${request.recipientName}`,
    `Reply-to: ${request.contactEmail}`, request.senderName && `From: ${request.senderName}`,
    request.occasion && `Occasion: ${request.occasion}`, request.message && `Message:\n${request.message}`,
    request.notes && `Notes:\n${request.notes}`,
  ].filter(Boolean).join('\n\n');
  await sendEmail(`New build request — ${tierLabels[request.tier]} for ${request.recipientName}`, text, request.contactEmail);
}

export async function sendContactMessage(message: ContactMessage): Promise<void> {
  if (!emailIsConfigured()) {
    console.warn(
      `[contact] Email not configured. Message from ${message.name} <${message.email}>:\n${message.message}`
    );
    return;
  }
  await sendEmail(`New contact message from ${message.name}`, `From: ${message.name} <${message.email}>\n\n${message.message}`, message.email);
}
