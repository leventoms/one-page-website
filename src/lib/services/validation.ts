import { z } from 'zod';

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
  memories: z.array(tier2MemorySchema).min(2).max(6),
  closingMessage: z.string().trim().min(1).max(300),
  accentColor: z.enum(ALLOWED_ACCENT_COLORS),
  songUrl: z.string().url().optional(),
});

export const tier3ConfigSchema = z.object({
  recipientName: z.string().trim().min(1).max(40),
  senderName: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(600),
  photoUrls: z.array(z.string().url()).min(1).max(5),
  accentColor: z.enum(ALLOWED_ACCENT_COLORS),
  revealAt: z.string().datetime({ offset: true }),
  songUrl: z.string().url().optional(),
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
