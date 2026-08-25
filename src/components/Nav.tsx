'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Marketing-site top navigation. Scoped to the (site) route group only —
 * it never renders on /p/[slug], where a recipient is opening a personal gift
 * page, not browsing a site.
 *
 * The bar adapts to the route it sits on:
 *  - "/" (the autumn-themed landing page) gets the cream/red/serif treatment
 *    that matches landing.css: a translucent bar that turns to frosted cream on
 *    scroll, a serif wordmark with the signature red dot, red-underline links,
 *    and a solid red pill CTA.
 *  - every other marketing route (builders, terms, refunds) keeps the light
 *    "paper" chrome those pages are designed around.
 *
 * Mobile-first: the links live in a hamburger-triggered sheet by default and
 * only expand into an inline row from the `sm` breakpoint up.
 */

const LANDING_LINKS = [
  { href: '#how', label: 'how it works' },
  { href: '#pricing', label: 'pricing' },
  { href: '#faq', label: 'faq' },
];

const PAPER_LINKS = [
  { href: '/#pricing', label: 'Pricing' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Nav() {
  const pathname = usePathname();
  const isLanding = pathname === '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Solidify the landing bar once the page scrolls under it.
  useEffect(() => {
    if (!isLanding) return;
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isLanding]);

  // While the sheet is open, lock body scroll and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const links = isLanding ? LANDING_LINKS : PAPER_LINKS;
  const ctaLabel = isLanding ? 'create a page' : 'Build yours';

  // On the landing route the bar is transparent over the hero and frosts to
  // cream once scrolled — or while the sheet is open, so it reads as solid.
  const landingSolid = scrolled || open;
  const headerCls = isLanding
    ? `sticky top-0 z-50 transition-[background-color,box-shadow] duration-300 ${
        landingSolid
          ? 'bg-[#fbf3e9]/90 backdrop-blur-md shadow-[0_1px_0_#e9ddcd]'
          : 'bg-transparent'
      }`
    : 'sticky top-0 z-50 backdrop-blur-md bg-paper/80 border-b border-paper-line';

  return (
    <header className={headerCls}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-6">
        {/* Wordmark */}
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          {isLanding ? (
            <>
              <span
                className="h-3 w-3 rounded-full bg-[#e23b2e]"
                style={{ boxShadow: '0 0 0 4px rgba(226,59,46,.18)' }}
                aria-hidden="true"
              />
              <span
                className="text-[1.3rem] font-black tracking-tight text-[#261d1a]"
                style={{ fontFamily: 'var(--font-fraunces), Georgia, serif' }}
              >
                surprise pages
              </span>
            </>
          ) : (
            <span className="font-display text-lg font-extrabold tracking-tight text-ink">
              Surprise Pages
            </span>
          )}
        </Link>

        {/* Inline links (sm and up) */}
        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) =>
            isLanding ? (
              <a
                key={link.href}
                href={link.href}
                className="relative text-[0.95rem] font-medium text-[#3a2c27] transition-colors hover:text-[#e23b2e] after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-[#e23b2e] after:transition-all after:duration-200 hover:after:w-full"
              >
                {link.label}
              </a>
            ) : (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </a>
            ),
          )}
        </nav>

        {/* CTA (sm and up) */}
        <div className="hidden sm:block">
          {isLanding ? (
            <Link
              href="/builder"
              className="inline-flex items-center rounded-full bg-[#e23b2e] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_7px_0_#c22b22] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_9px_0_#c22b22] motion-reduce:transform-none motion-reduce:transition-none"
            >
              {ctaLabel}
            </Link>
          ) : (
            <Link
              href="/builder"
              className="inline-flex items-center rounded-full bg-gradient-accent px-5 py-2 text-sm font-semibold text-ivory transition-opacity hover:opacity-90"
            >
              {ctaLabel}
            </Link>
          )}
        </div>

        {/* Hamburger (mobile only) */}
        <button
          type="button"
          className={`relative h-6 w-6 sm:hidden ${isLanding ? 'text-[#261d1a]' : 'text-ink'}`}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span
            className={`absolute left-0.5 top-1.5 block h-[2px] w-5 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
              open ? 'translate-y-[7px] rotate-45' : ''
            }`}
          />
          <span
            className={`absolute left-0.5 top-[11px] block h-[2px] w-5 bg-current transition-opacity duration-200 ease-out motion-reduce:transition-none ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`absolute left-0.5 top-[20px] block h-[2px] w-5 bg-current transition-transform duration-300 ease-out motion-reduce:transition-none ${
              open ? '-translate-y-[7px] -rotate-45' : ''
            }`}
          />
        </button>
      </div>

      {/* Mobile sheet: a grid-rows height animation keeps it accessible and
          reduced-motion friendly (no absolute overlay to trap focus behind). */}
      <div
        id="mobile-menu"
        className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none sm:hidden ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div
          className={`overflow-hidden border-t ${
            isLanding ? 'border-[#e9ddcd] bg-[#fbf3e9]/95' : 'border-paper-line'
          }`}
        >
          <div className="flex flex-col gap-1 px-5 py-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`py-3 text-base ${
                  isLanding ? 'font-medium text-[#3a2c27]' : 'text-ink-muted'
                }`}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/builder"
              onClick={() => setOpen(false)}
              className={`mt-2 inline-flex justify-center rounded-full px-5 py-3 text-base font-semibold ${
                isLanding
                  ? 'bg-[#e23b2e] text-white shadow-[0_6px_0_#c22b22]'
                  : 'bg-gradient-accent text-ivory'
              }`}
            >
              {ctaLabel}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
