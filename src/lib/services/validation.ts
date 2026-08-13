import { z } from 'zod';

// Small, curated accent palette rather than a free-text color field —
// keeps every generated page visually on-brand and avoids garish input.
export const ALLOWED_ACCENT_COLORS = [
  '#f5457f', // rose
  '#f59e0b', // amber
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // violet
] as const;

export const tier1ConfigSchema = z.object({
  recipientName: z.string().trim().min(1).max(40),
  senderName: z.string().trim().min(1).max(40),
  message: z.string().trim().min(1).max(600),
  photoUrls: z.array(z.string().url()).min(1).max(3),
  accentColor: z.enum(ALLOWED_ACCENT_COLORS),
  songUrl: z.string().url().optional(),
});

export const createOrderInputSchema = z.object({
  config: z.object({
    tier: z.literal('tier1'),
    data: tier1ConfigSchema,
  }),
  pinCode: z
    .string()
    .regex(/^\d{4}$/, 'PIN must be exactly 4 digits'),
});

export type Tier1ConfigInput = z.infer<typeof tier1ConfigSchema>;
export type CreateOrderInputParsed = z.infer<typeof createOrderInputSchema>;
