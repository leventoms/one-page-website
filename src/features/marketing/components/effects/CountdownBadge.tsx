'use client';

import { useCountdown } from '@/features/marketing/hooks/useCountdown';
import type { GiftCardContent } from '@/features/marketing/types';

/**
 * The floating "unlocks in HH:MM:SS" gift card in the hero.
 * The ticking value is owned by useCountdown; this component only renders it,
 * keeping presentation and timing logic cleanly separated.
 */
export function CountdownBadge({ giftCard }: { giftCard: GiftCardContent }) {
  const { formatted } = useCountdown(giftCard.initialSeconds);

  return (
    <div className="sp-giftcard">
      <div className="lock">{giftCard.lockGlyph}</div>
      <div className="lbl">{giftCard.label}</div>
      <div className="cd" role="timer" aria-live="off">
        {formatted}
      </div>
      <div className="for">{giftCard.recipient}</div>
    </div>
  );
}
