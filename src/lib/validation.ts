import { z } from 'zod';
import { parseVideoEmbed } from '@/lib/video-embed';

// Curated to sit alongside the near-black brand canvas and its warm
// orange->pink->purple gradient accent — every generated page stays
// visually on-brand.
export const ALLOWED_ACCENT_COLORS = [
  '#ff7a45', // warm orange
  '#ff4d8d', // pink
  '#a855f7', // purple
  '#22d3ee', // cyan (deliberate cool contrast note)
  '#facc15', // gold
] as const;

// A larger brand-safe palette offered on the higher self-serve tier
// (Time Capsule) as its "custom theme colours" perk. Superset of
// ALLOWED_ACCENT_COLORS; still curated so a page can never look broken.
export const EXPANDED_ACCENT_COLORS = [
  ...ALLOWED_ACCENT_COLORS,
  '#f43f5e', // rose
  '#fb923c', // amber-orange
  '#34d399', // emerald
  '#60a5fa', // sky
  '#c084fc', // violet
  '#f472b6', // soft pink
  '#2dd4bf', // teal
] as const;

// A single optional video clip: either a self-hosted file URL or an
// allowlisted embed (YouTube/Instagram). The embed URL is validated against
// the shared provider allowlist so non-allowlisted hosts are rejected here,
// not just in the UI. The allowlist check lives on the union (not the member)
// because z.discriminatedUnion options must be plain objects, not refinements.
export const videoConfigSchema = z
  .discriminatedUnion('kind', [
    z.object({ kind: z.literal('file'), url: z.string().url() }),
    z.object({
      kind: z.literal('embed'),
      provider: z.enum(['youtube', 'instagram']),
      url: z.string().url(),
    }),
  ])
  .refine((v) => v.kind !== 'embed' || parseVideoEmbed(v.url)?.provider === v.provider, {
    message: 'Video link must be a supported YouTube or Instagram URL.',
    path: ['url'],
  });

export const tier1ConfigSchema = z.object({
  recipientName: z.string().trim().min(1).max(40),
  senderName: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(600),
  photoUrls: z.array(z.string().url()).min(1).max(3),
  accentColor: z.enum(ALLOWED_ACCENT_COLORS),
  songUrl: z.string().url().optional(),
});

export const tier2MemorySchema = z.object({
  photoUrl: z.string().url(),
  caption: z.string().trim().min(1).max(120),
});

export const tier2ConfigSchema = z.object({
  recipientName: z.string().trim().min(1).max(40),
  senderName: z.string().trim().min(1).max(40),
  introMessage: z.string().trim().min(1).max(300),
  memories: z.array(tier2MemorySchema).min(2).max(10),
  closingMessage: z.string().trim().min(1).max(300),
  accentColor: z.enum(ALLOWED_ACCENT_COLORS),
  songUrl: z.string().url().optional(),
  video: videoConfigSchema.optional(),
});

export const tier3ConfigSchema = z.object({
  recipientName: z.string().trim().min(1).max(40),
  senderName: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(600),
  photoUrls: z.array(z.string().url()).min(1).max(15),
  accentColor: z.enum(EXPANDED_ACCENT_COLORS),
  revealAt: z.string().datetime({ offset: true }),
  songUrl: z.string().url().optional(),
  video: videoConfigSchema.optional(),
});

// Discriminated on `tier` so each new template only needs one new branch
// here — nothing else in this file changes shape (OCP).
export const templateConfigSchema = z.discriminatedUnion('tier', [
  z.object({ tier: z.literal('tier1'), data: tier1ConfigSchema }),
  z.object({ tier: z.literal('tier2'), data: tier2ConfigSchema }),
  z.object({ tier: z.literal('tier3'), data: tier3ConfigSchema }),
]);

export const createOrderInputSchema = z.object({
  config: templateConfigSchema,
  pinCode: z
    .string()
    .regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
});

export type Tier1ConfigInput = z.infer<typeof tier1ConfigSchema>;
export type Tier2ConfigInput = z.infer<typeof tier2ConfigSchema>;
export type Tier3ConfigInput = z.infer<typeof tier3ConfigSchema>;
export type CreateOrderInputParsed = z.infer<typeof createOrderInputSchema>;

// "Build it for me" path — deliberately loose. Only enough to identify who
// to build for and how to reach them back; everything else is optional
// free-text context, not structured page content like templateConfigSchema.
export const manualRequestInputSchema = z.object({
  tier: z.enum(['tier1', 'tier2', 'tier3', 'tier4']),
  recipientName: z.string().trim().min(1).max(60),
  contactEmail: z.string().trim().email(),
  senderName: z.string().trim().max(60).optional(),
  occasion: z.string().trim().max(60).optional(),
  message: z.string().trim().max(1000).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export type ManualRequestInputParsed = z.infer<typeof manualRequestInputSchema>;

// Public contact form — a free-text message plus who sent it and how to reach
// them back. No tier/PIN/structured page content; this is just a note that
// gets emailed to the owner (or logged when email isn't configured yet).
export const contactMessageInputSchema = z.object({
  name: z.string().trim().min(1).max(60),
  email: z.string().trim().email(),
  message: z.string().trim().min(1).max(1000),
});

export type ContactMessageInputParsed = z.infer<typeof contactMessageInputSchema>;
