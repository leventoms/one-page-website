'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Tier2Template from '@/components/templates/Tier2Template';
import ManualRequestForm from '@/components/ManualRequestForm';
import { ALLOWED_ACCENT_COLORS } from '@/lib/services/validation';
import { useOrderCheckout } from '@/lib/hooks/useOrderCheckout';
import type { Tier2Config, Tier2Memory } from '@/types/order';

const MAX_MEMORIES = 6;
const MIN_MEMORIES = 2;

const EMPTY_MEMORY: Tier2Memory = { photoUrl: '', caption: '' };

const EMPTY_CONFIG: Tier2Config = {
  recipientName: '',
  senderName: '',
  introMessage: '',
  memories: [{ ...EMPTY_MEMORY }, { ...EMPTY_MEMORY }],
  closingMessage: '',
  accentColor: ALLOWED_ACCENT_COLORS[0],
};

export default function Tier2Builder() {
  const [mode, setMode] = useState<'diy' | 'manual'>('diy');
  const [config, setConfig] = useState<Tier2Config>(EMPTY_CONFIG);
  const [pinCode, setPinCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { stage, errorMessage, finalSlug, payAndPublish } = useOrderCheckout();

  if (mode === 'manual') {
    return (
      <ManualRequestForm tier="tier2" tierLabel="Memory Lane" onBackToBuilder={() => setMode('diy')} />
    );
  }

  function updateField<K extends keyof Tier2Config>(key: K, value: Tier2Config[K]) {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }

  function updateMemory(index: number, patch: Partial<Tier2Memory>) {
    setConfig((prev) => ({
      ...prev,
      memories: prev.memories.map((m, i) => (i === index ? { ...m, ...patch } : m)),
    }));
  }

  function addMemory() {
    if (config.memories.length >= MAX_MEMORIES) return;
    setConfig((prev) => ({ ...prev, memories: [...prev.memories, { ...EMPTY_MEMORY }] }));
  }

  function removeMemory(index: number) {
    if (config.memories.length <= MIN_MEMORIES) return;
    setConfig((prev) => ({
      ...prev,
      memories: prev.memories.filter((_, i) => i !== index),
    }));
  }

  function handleSubmit() {
    setFormError(null);
    if (pinCode.length !== 4) {
      setFormError('Choose a 4-digit PIN for the recipient first.');
      return;
    }
    const incomplete = config.memories.some((m) => !m.photoUrl.trim() || !m.caption.trim());
    if (incomplete) {
      setFormError('Every memory needs both a photo URL and a caption.');
      return;
    }
    payAndPublish({ tier: 'tier2', data: config }, pinCode);
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
        <h1 className="font-display text-2xl text-ivory mb-1">Build your Memory Lane</h1>
        <p className="text-sm text-ivory-muted mb-2">
          Just one message?{' '}
          <Link href="/builder" className="text-marigold underline underline-offset-2">
            The simpler Tier 1 page
          </Link>{' '}
          might be a better fit, or add a{' '}
          <Link href="/builder/tier3" className="text-marigold underline underline-offset-2">
            countdown reveal
          </Link>{' '}
          with Tier 3. Rather not fill this in yourself?{' '}
          <button
            type="button"
            onClick={() => setMode('manual')}
            className="text-marigold underline underline-offset-2"
          >
            Let us build it for you
          </button>
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
          Opening line
          <textarea
            className="rounded-lg bg-plum px-3 py-2 min-h-[70px] text-ivory"
            value={config.introMessage}
            onChange={(e) => updateField('introMessage', e.target.value)}
            maxLength={300}
          />
        </label>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-ivory-muted">
              Memories ({config.memories.length}/{MAX_MEMORIES})
            </span>
            <button
              type="button"
              onClick={addMemory}
              disabled={config.memories.length >= MAX_MEMORIES}
              className="text-sm text-marigold disabled:opacity-40"
            >
              + Add another
            </button>
          </div>

          {config.memories.map((memory, i) => (
            <div key={i} className="rounded-lg bg-plum p-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ivory-muted">Memory {i + 1}</span>
                {config.memories.length > MIN_MEMORIES && (
                  <button
                    type="button"
                    onClick={() => removeMemory(i)}
                    className="text-xs text-rose"
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                className="rounded-lg bg-plum-soft px-3 py-2 text-sm text-ivory"
                placeholder="Photo URL"
                value={memory.photoUrl}
                onChange={(e) => updateMemory(i, { photoUrl: e.target.value })}
              />
              <input
                className="rounded-lg bg-plum-soft px-3 py-2 text-sm text-ivory"
                placeholder="Caption — e.g. 'That trip to Goa'"
                value={memory.caption}
                onChange={(e) => updateMemory(i, { caption: e.target.value })}
                maxLength={120}
              />
            </div>
          ))}
        </div>

        <label className="flex flex-col gap-1 text-sm text-ivory-muted">
          Closing message
          <textarea
            className="rounded-lg bg-plum px-3 py-2 min-h-[70px] text-ivory"
            value={config.closingMessage}
            onChange={(e) => updateField('closingMessage', e.target.value)}
            maxLength={300}
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
          {stage === 'editing' && 'Pay ₹199 & get link'}
          {stage === 'creating' && 'Creating order…'}
          {stage === 'paying' && 'Opening payment…'}
        </button>
      </form>

      <div className="rounded-2xl overflow-hidden ring-1 ring-plum-line max-h-[80vh] overflow-y-auto">
        <Tier2Template config={config} isPreview />
      </div>
    </div>
  );
}
