'use client';

import { useEffect, useState } from 'react';

/** Formats a non-negative second count as HH:MM:SS. */
export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const h = String(Math.floor(clamped / 3600)).padStart(2, '0');
  const m = String(Math.floor((clamped % 3600) / 60)).padStart(2, '0');
  const s = String(clamped % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

/**
 * Counts down from `initialSeconds`, once per second, stopping at zero.
 * Single responsibility: own the remaining-seconds state and its formatted view.
 */
export function useCountdown(initialSeconds: number): {
  seconds: number;
  formatted: string;
} {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    if (seconds <= 0) return;
    const id = setInterval(() => {
      setSeconds((prev) => (prev <= 0 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [seconds]);

  return { seconds, formatted: formatCountdown(seconds) };
}
