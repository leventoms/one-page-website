'use client';

import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';

/**
 * Reveals an element the first time it scrolls into view.
 * Returns a ref to attach and a boolean that flips to true once (and stays true).
 * Single responsibility: one element's in-view state, self-cleaning observer.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.12,
): { ref: RefObject<T | null>; revealed: boolean } {
  const ref = useRef<T>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || revealed) return;

    // Fallback for environments without IntersectionObserver: reveal immediately.
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setRevealed(true);
            observer.disconnect();
          }
        });
      },
      { threshold },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, revealed]);

  return { ref, revealed };
}
