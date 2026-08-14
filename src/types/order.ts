/**
 * Domain types for an order. These describe *data*, not behavior —
 * kept separate from services/repositories so any layer can import
 * them without pulling in implementation details (Interface Segregation).
 */

export type OrderStatus = 'draft' | 'previewing' | 'paid' | 'published' | 'expired';

export type TemplateTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';

/** The user-authored content that gets rendered onto the live page. */
export interface Tier1Config {
  recipientName: string;
  senderName: string;
  message: string;
  photoUrls: string[]; // 1-3 photos for tier 1
  accentColor: string; // hex, validated against a small palette
  songUrl?: string; // optional short audio clip URL, not a streaming embed
}

/** A single photo + caption moment in a Tier 2 "Memory Lane" sequence. */
export interface Tier2Memory {
  photoUrl: string;
  caption: string;
}

export interface Tier2Config {
  recipientName: string;
  senderName: string;
  introMessage: string; // opening line before the memories start
  memories: Tier2Memory[]; // 2-6 photo+caption moments, scrollable sequence
  closingMessage: string;
  accentColor: string;
  songUrl?: string;
}

/** Discriminated union so new tiers can be added without touching existing tier code (OCP). */
export type TemplateConfig =
  | { tier: 'tier1'; data: Tier1Config }
  | { tier: 'tier2'; data: Tier2Config };

export interface Order {
  id: string;
  slug: string;
  status: OrderStatus;
  config: TemplateConfig;
  priceInPaise: number;
  pinCode: string; // 4-digit access PIN, required before payment too
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  createdAt: string;
  paidAt: string | null;
}

/** Shape accepted from the builder form before an Order exists in storage. */
export interface CreateOrderInput {
  config: TemplateConfig;
  pinCode: string;
}
