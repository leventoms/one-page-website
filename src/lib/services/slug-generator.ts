import { customAlphabet } from 'nanoid';

// Lowercase + digits, no ambiguous chars (0/O, 1/l/I removed) for clean URLs.
const nanoid = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 6);

export interface ISlugGenerator {
  generate(displayName: string): string;
}

/**
 * Produces slugs like "priya-x7k2h9". Kept as its own small class so the
 * slug scheme can change (e.g. shorter, or collision-checked against the
 * DB) without touching OrderService.
 */
export class SlugGenerator implements ISlugGenerator {
  generate(displayName: string): string {
    const base = displayName
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '') // strip accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
      .slice(0, 20);

    const safeBase = base.length > 0 ? base : 'surprise';
    return `${safeBase}-${nanoid()}`;
  }
}
