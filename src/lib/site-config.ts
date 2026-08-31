/**
 * Site-wide constants the owner must confirm before a real launch.
 *
 * Centralised here so the legal pages, the contact page, and (later) email
 * plumbing all read the same values instead of duplicating placeholders.
 * These are the "owner fill-ins" called out in the README's known-gaps: swap
 * them for the real registered entity, jurisdiction, and support inbox (the
 * support address should match `RESEND_TO_EMAIL`).
 */
export const SITE = {
  name: 'Surprise Pages',
  /** Support inbox. Set this to the same address as RESEND_TO_EMAIL. */
  supportEmail: 'hello@surprisepages.in',
  /** Registered entity that operates the service (for the legal pages). */
  legalEntity: 'Surprise Pages',
  /** Governing-law jurisdiction (refine to a specific city before launch). */
  jurisdiction: 'India',
} as const;
