import type { Metadata } from 'next';
import { Fraunces, Public_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
});

const body = Public_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  title: 'Surprise Pages',
  description: 'Personalised surprise pages for birthdays and celebrations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-plum-deep text-ivory antialiased font-body">{children}</body>
    </html>
  );
}
