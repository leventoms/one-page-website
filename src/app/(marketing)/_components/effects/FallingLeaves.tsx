'use client';

import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { usePrefersReducedMotion } from '../../_hooks/usePrefersReducedMotion';

const LEAF_COLORS = ['#e23b2e', '#e08a2c', '#d9552e', '#c22b22'];
const LEAF_CLIP =
  'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)';
const LEAF_COUNT = 10;

interface Leaf {
  style: CSSProperties;
}

/**
 * Decorative autumn leaves drifting down the page.
 *
 * Declaratively renders a fixed set of leaves (positions/timings computed once)
 * instead of imperatively appending DOM nodes, and renders nothing at all when
 * the user prefers reduced motion. Single responsibility: this ambient effect.
 */
export function FallingLeaves() {
  const reduced = usePrefersReducedMotion();

  const leaves = useMemo<Leaf[]>(
    () =>
      Array.from({ length: LEAF_COUNT }, (_, i) => {
        const size = 10 + Math.random() * 14;
        return {
          style: {
            left: `${Math.random() * 100}vw`,
            width: `${size}px`,
            height: `${size}px`,
            opacity: 0.4 + Math.random() * 0.4,
            background: LEAF_COLORS[i % LEAF_COLORS.length],
            clipPath: LEAF_CLIP,
            animationDuration: `${9 + Math.random() * 9}s`,
            animationDelay: `${Math.random() * 10}s`,
          } satisfies CSSProperties,
        };
      }),
    [],
  );

  if (reduced) return null;

  return (
    <div className="sp-leaves" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <div key={i} className="sp-leaf" style={leaf.style} />
      ))}
    </div>
  );
}
