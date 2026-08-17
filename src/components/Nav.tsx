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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-paper/80 border-b border-paper-line">
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-lg tracking-tight text-ink">
          Surprise Pages
        </Link>

        <nav className="hidden sm:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="text-sm text-ink-muted hover:text-ink transition-colors">
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
          className="sm:hidden relative h-5 w-5 text-ink"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`absolute left-0 top-1 block h-[1.5px] w-5 bg-current transition-transform duration-300 ease-out ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`absolute left-0 top-[10px] block h-[1.5px] w-5 bg-current transition-opacity duration-200 ease-out ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0 top-[19px] block h-[1.5px] w-5 bg-current transition-transform duration-300 ease-out ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      <div
        className={`sm:hidden grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden border-t border-paper-line">
          <div className="px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="text-sm text-ink-muted" onClick={() => setOpen(false)}>
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
        </div>
      </div>
    </header>
  );
}
