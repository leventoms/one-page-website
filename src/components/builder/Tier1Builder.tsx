'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Tier1Template from '@/components/templates/Tier1Template';
import { ALLOWED_ACCENT_COLORS } from '@/lib/services/validation';
import { useOrderCheckout } from '@/lib/hooks/useOrderCheckout';
import type { Tier1Config } from '@/types/order';

const EMPTY_CONFIG: Tier1Config = {
  recipientName: '',
  senderName: '',
  message: '',
  photoUrls: [],
  accentColor: ALLOWED_ACCENT_COLORS[0],
};

export default function Tier1Builder() {
  const [config, setConfig] = useState<Tier1Config>(EMPTY_CONFIG);
  const [pinCode, setPinCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { stage, errorMessage, finalSlug, payAndPublish } = useOrderCheckout();

  function updateField<K extends keyof Tier1Config>(key: K, value: Tier1Config[K]) {
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
    payAndPublish({ tier: 'tier1', data: config }, pinCode);
  }

  if (stage === 'done' && finalSlug) {
    const liveUrl = `${window.location.origin}/p/${finalSlug}?pin=${pinCode}`;
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6">
        <h2 className="font-display text-xl text-ivory mb-3">Payment received 🎉</h2>
        <p className="text-ivory-muted mb-4">
          It may take a few seconds to go live. Share this link (with the PIN) once it does:
        </p>
        <code className="block break-all rounded-lg bg-plum p-3 text-sm text-ivory">{liveUrl}</code>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2 max-w-5xl mx-auto px-6 py-12">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <h1 className="font-display text-2xl text-ivory mb-1">Build your surprise page</h1>
        <p className="text-sm text-ivory-muted mb-2">
          Want more than one message?{' '}
          <Link href="/builder/tier2" className="text-marigold underline underline-offset-2">
            Try Memory Lane instead
          </Link>
          .
        </p>

        <label className="flex flex-col gap-1 text-sm text-ivory-muted">
          Recipient&apos;s name
          <input
            className="rounded-lg bg-plum px-3 py-2 text-ivory"
            value={config.recipientName}
            onChange={(e) => updateField('recipientName', e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ivory-muted">
          Your name
          <input
            className="rounded-lg bg-plum px-3 py-2 text-ivory"
            value={config.senderName}
            onChange={(e) => updateField('senderName', e.target.value)}
            maxLength={40}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ivory-muted">
          Message
          <textarea
            className="rounded-lg bg-plum px-3 py-2 min-h-[120px] text-ivory"
            value={config.message}
            onChange={(e) => updateField('message', e.target.value)}
            maxLength={600}
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-ivory-muted">
          Photo URL(s) — comma separated, up to 3
          <input
            className="rounded-lg bg-plum px-3 py-2 text-ivory"
            placeholder="https://..."
            onChange={(e) =>
              updateField(
                'photoUrls',
                e.target.value
                  .split(',')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .slice(0, 3)
              )
            }
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
                borderColor: config.accentColor === color ? '#f7ede1' : 'transparent',
              }}
              aria-label={`Choose ${color}`}
            />
          ))}
        </div>

        <label className="flex flex-col gap-1 text-sm text-ivory-muted">
          4-digit PIN for the recipient
          <input
            className="rounded-lg bg-plum px-3 py-2 w-24 tracking-widest text-ivory"
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
          className="mt-2 rounded-full bg-marigold px-6 py-3 font-semibold text-plum-deep disabled:opacity-50"
        >
          {stage === 'editing' && 'Pay ₹99 & get link'}
          {stage === 'creating' && 'Creating order…'}
          {stage === 'paying' && 'Opening payment…'}
        </button>
      </form>

      <div className="rounded-2xl overflow-hidden ring-1 ring-plum-line">
        <Tier1Template config={config} isPreview />
      </div>
    </div>
  );
}
