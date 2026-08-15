import type { TemplateTier } from './order';

/**
 * The "build it for me" path. Deliberately loose compared to Order/
 * TemplateConfig — this is a brief for a human to work from, not a
 * config that gets rendered directly. Only recipientName and contactEmail
 * are required; everything else is optional context the sender can skip.
 */
export interface ManualRequestInput {
  tier: TemplateTier;
  recipientName: string;
  contactEmail: string;
  senderName?: string;
  occasion?: string;
  message?: string;
  notes?: string;
}

export interface ManualRequest extends ManualRequestInput {
  id: string;
  status: 'new' | 'in_progress' | 'delivered';
  createdAt: string;
}
