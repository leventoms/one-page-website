import { Fraunces, Inter } from 'next/font/google';

/**
 * Font definitions for the landing page, isolated from layout/markup.
 * Exposes the CSS-variable class names consumed by landing.css
 * (--font-fraunces for display serif, --font-inter for body).
 */
export const fraunces = Fraunces({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
  display: 'swap',
});

export const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

/** Combined variable class names to place on the landing root element. */
export const fontVariables = `${fraunces.variable} ${inter.variable}`;
