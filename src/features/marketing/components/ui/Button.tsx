import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import type { LinkItem } from '@/features/marketing/types';

export type ButtonVariant = 'red' | 'ghost' | 'cream';

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  /** Render a plain <a> (for in-page anchors) instead of a routed <Link>. */
  external?: boolean;
  className?: string;
  style?: CSSProperties;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  red: 'sp-btn sp-btn-red',
  ghost: 'sp-btn sp-btn-ghost',
  cream: 'sp-btn sp-btn-cream',
};

/**
 * The single pill-button used across the page. One prop contract, three visual
 * variants — sections pick a variant instead of re-declaring button markup
 * (DRY + Open/Closed: add a variant here, not in every caller).
 */
export function Button({
  href,
  children,
  variant = 'red',
  external = false,
  className,
  style,
}: ButtonProps) {
  const classes = [VARIANT_CLASS[variant], className].filter(Boolean).join(' ');

  if (external) {
    return (
      <a className={classes} href={href} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link className={classes} href={href} style={style}>
      {children}
    </Link>
  );
}

/** Convenience wrapper that renders a Button straight from a LinkItem. */
export function LinkButton({
  link,
  variant,
  className,
  style,
}: {
  link: LinkItem;
  variant?: ButtonVariant;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <Button
      href={link.href}
      external={link.external}
      variant={variant}
      className={className}
      style={style}
    >
      {link.label}
    </Button>
  );
}
