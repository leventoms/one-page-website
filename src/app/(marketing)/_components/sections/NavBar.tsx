'use client';

import { LinkButton } from '../ui/Button';
import { useScrolledPast } from '../../_hooks/useScrolledPast';
import type { BrandContent, NavContent } from '../../_types/landing.types';

interface NavBarProps {
  brand: BrandContent;
  nav: NavContent;
}

/**
 * Sticky top navigation. Solidifies once the page scrolls (state from
 * useScrolledPast). Delete this component from the page if the (marketing)
 * layout already renders a site nav.
 */
export function NavBar({ brand, nav }: NavBarProps) {
  const solid = useScrolledPast(20);

  return (
    <nav className={solid ? 'sp-nav solid' : 'sp-nav'}>
      <div className="sp-wrap">
        <a className="sp-brand" href="#top">
          <span className="dot" />
          {brand.name}
        </a>
        <div className="sp-navlinks">
          {nav.links.map((link) => (
            <a className="lk" key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
          <LinkButton link={nav.cta} variant="red" style={{ padding: '.6em 1.2em' }} />
        </div>
      </div>
    </nav>
  );
}
