'use client';

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

const LEAF_COLORS = ['#e23b2e', '#e08a2c', '#d9552e', '#c22b22'];
const LEAF_CLIP =
  'polygon(50% 0,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)';
const LEAF_COUNT = 10;

interface Leaf {
  style: CSSProperties;
}

// Fixed values keep server HTML and the first client render identical.
// Random values here would trigger a React hydration warning.
const LEAVES: Leaf[] = Array.from({ length: LEAF_COUNT }, (_, i) => {
  const size = 10 + ((i * 7) % 14);
  return {
    style: {
      left: `${(i * 37 + 11) % 100}vw`,
      width: `${size}px`,
      height: `${size}px`,
      opacity: 0.45 + ((i * 13) % 30) / 100,
      background: LEAF_COLORS[i % LEAF_COLORS.length],
      clipPath: LEAF_CLIP,
      animationDuration: `${9 + ((i * 5) % 9)}s`,
      animationDelay: `${(i * 1.3) % 10}s`,
    },
  };
});

/**
 * Decorative autumn leaves drifting down the page.
 *
 * Declaratively renders a fixed set of leaves (positions/timings computed once)
 * instead of imperatively appending DOM nodes, and renders nothing at all when
 * the user prefers reduced motion. Single responsibility: this ambient effect.
 */
export function FallingLeaves() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  if (reduced) return null;

  return (
    <div className="sp-leaves" aria-hidden="true">
      {LEAVES.map((leaf, i) => (
        <div key={i} className="sp-leaf" style={leaf.style} />
      ))}
    </div>
  );
}
