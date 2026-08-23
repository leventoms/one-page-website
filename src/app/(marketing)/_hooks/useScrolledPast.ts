'use client';

import { useEffect, useState } from 'react';

/**
 * Reports whether the window has scrolled past `threshold` pixels.
 * Single responsibility: expose one boolean for scroll-driven UI (e.g. a nav
 * that solidifies once the page moves).
 */
export function useScrolledPast(threshold = 20): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}
