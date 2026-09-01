import type { ReactNode } from 'react';

/**
 * The uppercase, letter-spaced label that tops most sections
 * (the `.sp-eyebrow` treatment). Trivial, but naming it keeps callers
 * declarative and the class name in one place.
 */
export function Eyebrow({ children }: { children: ReactNode }) {
  return <span className="sp-eyebrow">{children}</span>;
}
