import type { ReactNode } from 'react';
import { Eyebrow } from './Eyebrow';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  /** Center the block and constrain its width (the `.sp-head.center` layout). */
  center?: boolean;
}

/**
 * Standard eyebrow + heading + optional subtitle block used by most sections.
 * Consolidates the `.sp-head` markup so each section supplies content only.
 */
export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
}: SectionHeadingProps) {
  return (
    <div className={center ? 'sp-head center' : 'sp-head'}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2>{title}</h2>
      {subtitle ? <p>{subtitle}</p> : null}
    </div>
  );
}
