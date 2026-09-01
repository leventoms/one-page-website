import type { ComponentType } from 'react';

export type OrderStatus = 'draft' | 'previewing' | 'paid' | 'published' | 'expired';
export type TemplateTier = 'tier1' | 'tier2' | 'tier3' | 'tier4';
export type VideoConfig = { kind: 'file'; url: string } | { kind: 'embed'; provider: 'youtube' | 'instagram'; url: string };

export interface Tier1Config { recipientName: string; senderName: string; message: string; photoUrls: string[]; accentColor: string; songUrl?: string; }
export interface Tier2Memory { photoUrl: string; caption: string; }
export interface Tier2Config { recipientName: string; senderName: string; introMessage: string; memories: Tier2Memory[]; closingMessage: string; accentColor: string; songUrl?: string; video?: VideoConfig; }
export interface Tier3Config { recipientName: string; senderName: string; message: string; photoUrls: string[]; accentColor: string; revealAt: string; songUrl?: string; video?: VideoConfig; }
export type TemplateConfig = { tier: 'tier1'; data: Tier1Config } | { tier: 'tier2'; data: Tier2Config } | { tier: 'tier3'; data: Tier3Config };
export interface Order { id: string; slug: string; status: OrderStatus; config: TemplateConfig; priceInPaise: number; pinCode: string; razorpayOrderId: string | null; razorpayPaymentId: string | null; createdAt: string; paidAt: string | null; }
export interface CreateOrderInput { config: TemplateConfig; pinCode: string; }

export interface ManualRequestInput { tier: TemplateTier; recipientName: string; contactEmail: string; senderName?: string; occasion?: string; message?: string; notes?: string; }
export interface ManualRequest extends ManualRequestInput { id: string; status: 'new' | 'in_progress' | 'delivered'; createdAt: string; }
export interface ContactMessage { name: string; email: string; message: string; }

export interface TemplateProps<TConfig = unknown> { config: TConfig; isPreview?: boolean; }
export interface TemplateDefinition { tier: TemplateTier; label: string; priceInPaise: number; Component: ComponentType<TemplateProps<any>>; }
export function isTemplateConfigForTier(config: TemplateConfig, tier: TemplateTier): boolean { return config.tier === tier; }
