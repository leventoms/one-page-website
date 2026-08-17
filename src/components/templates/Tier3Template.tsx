'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import type { Tier3Config } from '@/types/order';
import type { TemplateProps } from '@/types/template';

const PLACEHOLDER_PHOTO = '/placeholder-photo.svg';
const PLACEHOLDER_MESSAGE = 'Your message will appear here once the capsule opens.';

function getRemaining(revealAt: string): number {
  return new Date(revealAt).getTime() - Date.now();
}

function formatRemaining(ms: number): { days: number; hours: number; minutes: number; seconds: number } {
  const clamped = Math.max(ms, 0);
  const totalSeconds = Math.floor(clamped / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/**
 * The only tier template that needs to be a client component — the
 * countdown has to tick in the browser. It still implements the same
 * TemplateProps<T> contract as Tier1/Tier2, so the registry and the
 * live-page route don't need to know or care that this one is different.
 */
export default function Tier3Template({ config, isPreview }: TemplateProps<Tier3Config>) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // In preview mode we always show the revealed content — the sender needs
  // to see exactly what gets delivered, the countdown is a delivery
  // mechanic for the recipient, not something to preview waiting through.
  const remaining = config.revealAt ? getRemaining(config.revealAt) - (Date.now() - now) : 0;
  const isRevealed = isPreview || remaining <= 0;

  const photos = isPreview && config.photoUrls.length === 0 ? [PLACEHOLDER_PHOTO] : config.photoUrls;
  const message = isPreview ? config.message || PLACEHOLDER_MESSAGE : config.message;

  if (!isRevealed) {
    const { days, hours, minutes, seconds } = formatRemaining(remaining);
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center dark-surface"
        style={{
          background: `radial-gradient(circle at top, ${config.accentColor}18, #0a0a0c 60%)`,
        }}
      >
        <p className="text-white/50 text-sm mb-3 uppercase tracking-widest">
          Something&apos;s waiting for {config.recipientName || 'you'}
        </p>
        <div className="flex gap-4 mb-6">
          {[
            { value: days, label: 'days' },
            { value: hours, label: 'hrs' },
            { value: minutes, label: 'min' },
            { value: seconds, label: 'sec' },
          ].map((unit) => (
            <div key={unit.label} className="flex flex-col items-center">
              <span className="text-3xl font-semibold text-white tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="text-xs text-white/50">{unit.label}</span>
            </div>
          ))}
        </div>
        <p className="text-white/40 text-xs">It&apos;ll open on its own — no need to refresh.</p>
      </main>
    );
  }

  return (
    <main
      className="relative min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center overflow-hidden dark-surface"
      style={{
        background: `radial-gradient(circle at top, ${config.accentColor}22, #0a0a0c 60%)`,
      }}
    >
      {isPreview && (
        <div className="mb-6 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
          Preview — shows the revealed state directly
        </div>
      )}

      {/* Petal-fall reveal animation, skipped for prefers-reduced-motion via CSS */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${(i * 97) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              backgroundColor: i % 2 === 0 ? config.accentColor : '#e2607a',
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-sm rounded-3xl bg-white/5 backdrop-blur-md p-6 shadow-xl ring-1 ring-white/10">
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {photos.slice(0, 5).map((url, i) => (
            <div
              key={url + i}
              className="relative h-24 w-20 overflow-hidden rounded-xl ring-2"
              style={{ borderColor: config.accentColor } as never}
            >
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-semibold text-white mb-2">
          For {config.recipientName || 'you'} ⏳
        </h1>
        <p className="whitespace-pre-line text-white/85 leading-relaxed mb-6">{message}</p>
        <p className="text-sm text-white/50">— {config.senderName || 'someone who cares'}</p>

        {config.songUrl && !isPreview && (
          <audio controls className="mt-6 w-full">
            <source src={config.songUrl} />
          </audio>
        )}
      </div>
    </main>
  );
}
