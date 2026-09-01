'use client';

import { useEffect, useState } from 'react';
import type { GiftCardContent } from '@/components/marketing/types';

/**
 * The floating "unlocks in HH:MM:SS" gift card in the hero.
 * It owns its own small countdown state because nothing else uses it.
 */
export function CountdownBadge({ giftCard }: { giftCard: GiftCardContent }) {
  const [seconds, setSeconds] = useState(giftCard.initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const value = Math.max(0, seconds);
  const formatted = [
    String(Math.floor(value / 3600)).padStart(2, '0'),
    String(Math.floor((value % 3600) / 60)).padStart(2, '0'),
    String(value % 60).padStart(2, '0'),
  ].join(':');

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
