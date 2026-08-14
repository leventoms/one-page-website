'use client';

import Link from 'next/link';
import { useState } from 'react';

const NAV_LINKS = [
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

/**
 * Scoped to the (marketing) route group only — it never renders on /p/[slug],
 * where a recipient is opening a personal gift page, not browsing a site.
 */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-plum-deep/80 border-b border-plum-line">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-lg tracking-tight text-ivory">
          Surprise Pages
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-ivory-muted hover:text-ivory transition-colors">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden sm:block">
          <Link
            href="/builder"
            className="inline-flex items-center rounded-full bg-gradient-accent px-5 py-2 text-sm font-semibold text-ivory hover:opacity-90 transition-opacity"
          >
            Build yours
          </Link>
        </div>

        <button
          className="sm:hidden text-ivory"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="sm:hidden border-t border-plum-line px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-ivory-muted" onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
          <Link
            href="/builder"
            className="inline-flex justify-center rounded-full bg-gradient-accent px-5 py-2 text-sm font-semibold text-ivory"
            onClick={() => setOpen(false)}
          >
            Build yours
          </Link>
        </div>
      )}
    </header>
  );
}
