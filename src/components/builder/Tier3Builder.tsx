'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Tier3Template from '@/components/templates/Tier3Template';
import ManualRequestForm from '@/components/ManualRequestForm';
import { ALLOWED_ACCENT_COLORS } from '@/lib/services/validation';
import { useOrderCheckout } from '@/lib/hooks/useOrderCheckout';
import type { Tier3Config } from '@/types/order';

function defaultRevealAt(): string {
  const d = new Date(Date.now() + 24 * 60 * 60 * 1000); // default: 24h from now
  d.setSeconds(0, 0);
  // datetime-local input wants "YYYY-MM-DDTHH:mm" in local time
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const EMPTY_CONFIG: Tier3Config = {
  recipientName: '',
  senderName: '',
  message: '',
  photoUrls: [],
  accentColor: ALLOWED_ACCENT_COLORS[0],
  revealAt: '',
};

export default function Tier3Builder() {
  const [mode, setMode] = useState<'diy' | 'manual'>('diy');
  const [config, setConfig] = useState<Tier3Config>(EMPTY_CONFIG);
  const [revealAtLocal, setRevealAtLocal] = useState(defaultRevealAt());
  const [pinCode, setPinCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { stage, errorMessage, finalSlug, payAndPublish } = useOrderCheckout();

  if (mode === 'manual') {
    return (
      <ManualRequestForm tier="tier3" tierLabel="Time Capsule" onBackToBuilder={() => setMode('diy')} />
    );
  }

  function updateField<K extends keyof Tier3Config>(key: K, value: Tier3Config[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    setFormError(null);
    if (pinCode.length !== 4) {
      setFormError('Choose a 4-digit PIN for the recipient first.');
      return;
    }
    if (config.photoUrls.length === 0) {
      setFormError('Add at least one photo URL.');
      return;
    }
    if (!revealAtLocal) {
      setFormError('Pick when the capsule should open.');
      return;
    }

    const revealAtIso = new Date(revealAtLocal).toISOString();
    if (new Date(revealAtIso).getTime() <= Date.now()) {
      setFormError('Pick a reveal time in the future.');
      return;
    }

    payAndPublish({ tier: 'tier3', data: { ...config, revealAt: revealAtIso } }, pinCode);
  }

  // Preview always shows the revealed state (see Tier3Template), so the
  // builder doesn't need to fake a countdown here — just pass the config.
  const previewConfig: Tier3Config = { ...config, revealAt: revealAtLocal || new Date().toISOString() };

  if (stage === 'done' && finalSlug) {
    const liveUrl = `${window.location.origin}/p/${finalSlug}?pin=${pinCode}`;
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6">
        <h2 className="font-display text-xl text-ink mb-3">Payment received 🎉</h2>
        <p className="text-ink-muted mb-4">
          It may take a few seconds to go live. Share this link (with the PIN) once it does —
          it&apos;ll stay locked behind the countdown until your chosen time.
        </p>
        <code className="block break-all rounded-lg bg-paper-soft p-3 text-sm text-ink">{liveUrl}</code>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto px-6 py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <h1 className="font-display text-2xl text-ink mb-1">Build your Time Capsule</h1>
        <p className="text-sm text-ink-muted mb-2">
          Don&apos;t need a countdown?{' '}
          <Link href="/builder" className="text-marigold-deep underline underline-offset-2">
            Tier 1
          </Link>{' '}
          or{' '}
          <Link href="/builder/tier2" className="text-marigold-deep underline underline-offset-2">
            Tier 2
          </Link>{' '}
          publish instantly instead. Rather not fill this in yourself?{' '}
          <button
            type="button"
            onClick={() => setMode('manual')}
            className="text-marigold-deep underline underline-offset-2"
          >
            Let us build it for you
          </button>
          .
        </p>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Recipient&apos;s name
          <input
            className="rounded-lg bg-paper-soft border border-paper-line px-3 py-2 text-ink"
            value={config.recipientName}
            onChange={(e) => updateField('recipientName', e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Your name
          <input
            className="rounded-lg bg-paper-soft border border-paper-line px-3 py-2 text-ink"
            value={config.senderName}
            onChange={(e) => updateField('senderName', e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Message
          <textarea
            className="rounded-lg bg-paper-soft border border-paper-line px-3 py-2 min-h-[120px] text-ink"
            value={config.message}
            onChange={(e) => updateField('message', e.target.value)}
            maxLength={600}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Photo URL(s) — comma separated, up to 5
          <input
            className="rounded-lg bg-paper-soft border border-paper-line px-3 py-2 text-ink"
            placeholder="https://..."
            onChange={(e) =>
              updateField(
                'photoUrls',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 5)
              )
            }
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          Opens on
          <input
            type="datetime-local"
            className="rounded-lg bg-paper-soft border border-paper-line px-3 py-2 text-ink"
            value={revealAtLocal}
            min={defaultRevealAt()}
            onChange={(e) => setRevealAtLocal(e.target.value)}
          />
        </label>

        <div className="flex gap-2">
          {ALLOWED_ACCENT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => updateField('accentColor', color)}
              className="h-8 w-8 rounded-full ring-2"
              style={{
                backgroundColor: color,
                borderColor: config.accentColor === color ? '#0a0a0c' : 'transparent',
              }}
              aria-label={`Choose ${color}`}
            />
          ))}
        </div>

        <label className="flex flex-col gap-1 text-sm text-ink-muted">
          4-digit PIN for the recipient
          <input
            className="rounded-lg bg-paper-soft border border-paper-line px-3 py-2 w-24 tracking-widest text-ink"
            inputMode="numeric"
            maxLength={4}
            value={pinCode}
            onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
          />
        </label>

        {(formError || errorMessage) && (
          <p className="text-sm text-rose">{formError ?? errorMessage}</p>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={stage === 'creating' || stage === 'paying'}
          className="mt-2 rounded-full bg-marigold px-6 py-3 font-semibold text-ivory disabled:opacity-50"
        >
          {stage === 'editing' && 'Pay ₹299 & get link'}
          {stage === 'creating' && 'Creating order…'}
          {stage === 'paying' && 'Opening payment…'}
        </button>
      </form>

      <div className="rounded-2xl overflow-hidden ring-1 ring-plum-line shadow-lg shadow-black/5">
        <Tier3Template config={previewConfig} isPreview />
      </div>
    </div>
  );
}
