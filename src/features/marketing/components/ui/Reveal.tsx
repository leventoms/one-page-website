'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
import { useScrollReveal } from '@/features/marketing/hooks/useScrollReveal';

interface RevealProps {
  children: ReactNode;
  /** Element to render as. Defaults to a div. */
  as?: ElementType;
  className?: string;
  /** Inline styles forwarded to the element (e.g. CSS custom properties). */
  style?: CSSProperties;
  /** IntersectionObserver threshold, forwarded to the hook. */
  threshold?: number;
}

/**
 * Wraps content so it fades/slides in when scrolled into view.
 * Encapsulates the reveal mechanics (the `.sp-reveal` / `.in` class pair from
 * landing.css) so no section component has to know how the animation works.
 */
export function Reveal({ children, as, className, style, threshold }: RevealProps) {
  const Tag = as ?? 'div';
  const { ref, revealed } = useScrollReveal<HTMLElement>(threshold);
  const classes = ['sp-reveal', revealed ? 'in' : '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag ref={ref} className={classes} style={style}>
      {children}
    </Tag>
  );
}
