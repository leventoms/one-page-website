'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Tier2Template from '@/features/templates/Tier2Template';
import ManualRequestForm from '@/components/ManualRequestForm';
import VideoInput from '@/features/builder/VideoInput';
import { ALLOWED_ACCENT_COLORS } from '@/lib/services/validation';
import { useOrderCheckout } from '@/lib/hooks/useOrderCheckout';
import type { Tier2Config, Tier2Memory } from '@/types/order';

const MAX_MEMORIES = 10;
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
      <section className="sp-builder">
        <div className="sp-wrap">
          <div className="sp-builder-done">
            <div className="mark" aria-hidden="true">✓</div>
            <h2>Your Memory Lane is on its way</h2>
            <p>
              It takes a few seconds to go live. Once it does, share this link — and the
              4-digit PIN — with {config.recipientName || 'them'}.
            </p>
            <code className="sp-sharelink">{liveUrl}</code>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="sp-builder">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="sp-wrap">
        <div className="sp-builder-grid">
          <div>
            <div className="sp-builder-intro">
              <span className="sp-eyebrow">memory lane</span>
              <h1>Build your <span className="sp-script">Memory Lane</span></h1>
              <p className="lede">
                A handful of moments, laid out like a little story — add a song or a short
                video to set the mood.
              </p>
              <p className="sp-builder-switch">
                Just one message?{' '}
                <Link href="/builder" className="sp-alink">A Simple Wish</Link>{' '}
                might fit better, or add a{' '}
                <Link href="/builder/tier3" className="sp-alink">countdown reveal</Link>{' '}
                with a Time Capsule. Rather we made it for you?{' '}
                <button type="button" onClick={() => setMode('manual')} className="sp-textlink">
                  Let us build it by hand
                </button>.
              </p>
            </div>

            <form className="sp-form" onSubmit={(e) => e.preventDefault()}>
              <div className="sp-field">
                <label>Who&apos;s it for?</label>
                <input
                  className="sp-input"
                  value={config.recipientName}
                  onChange={(e) => updateField('recipientName', e.target.value)}
                  maxLength={40}
                />
              </div>

              <div className="sp-field">
                <label>And who&apos;s it from?</label>
                <input
                  className="sp-input"
                  value={config.senderName}
                  onChange={(e) => updateField('senderName', e.target.value)}
                  maxLength={40}
                />
              </div>

              <div className="sp-field">
                <label>Opening line</label>
                <textarea
                  className="sp-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="How the story starts…"
                  value={config.introMessage}
                  onChange={(e) => updateField('introMessage', e.target.value)}
                  maxLength={300}
                />
              </div>

              <div className="sp-memories">
                <div className="sp-memories-head">
                  <span className="lbl">Memories ({config.memories.length}/{MAX_MEMORIES})</span>
                  <button
                    type="button"
                    onClick={addMemory}
                    disabled={config.memories.length >= MAX_MEMORIES}
                    className="sp-textlink"
                    style={{ opacity: config.memories.length >= MAX_MEMORIES ? 0.4 : 1 }}
                  >
                    + Add another
                  </button>
                </div>

                {config.memories.map((memory, i) => (
                  <div key={i} className="sp-memory">
                    <div className="sp-memory-head">
                      <span>Memory {i + 1}</span>
                      {config.memories.length > MIN_MEMORIES && (
                        <button type="button" onClick={() => removeMemory(i)} className="sp-textlink">
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      className="sp-input"
                      placeholder="Photo link"
                      value={memory.photoUrl}
                      onChange={(e) => updateMemory(i, { photoUrl: e.target.value })}
                    />
                    <input
                      className="sp-input"
                      placeholder="Caption — e.g. “That trip to Goa”"
                      value={memory.caption}
                      onChange={(e) => updateMemory(i, { caption: e.target.value })}
                      maxLength={120}
                    />
                  </div>
                ))}
              </div>

              <div className="sp-field">
                <label>Closing message</label>
                <textarea
                  className="sp-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="How you want to leave them feeling."
                  value={config.closingMessage}
                  onChange={(e) => updateField('closingMessage', e.target.value)}
                  maxLength={300}
                />
              </div>

              <VideoInput onChange={(video) => updateField('video', video)} />

              <div className="sp-field">
                <label>Pick an accent colour</label>
                <div className="sp-swatches">
                  {ALLOWED_ACCENT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateField('accentColor', color)}
                      aria-pressed={config.accentColor === color}
                      className="sp-swatch"
                      style={{ backgroundColor: color }}
                      aria-label={`Choose ${color}`}
                    />
                  ))}
                </div>
              </div>

              <div className="sp-field">
                <label>Set a 4-digit PIN for them</label>
                <input
                  className="sp-input sp-pin"
                  inputMode="numeric"
                  maxLength={4}
                  value={pinCode}
                  onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              {(formError || errorMessage) && (
                <p className="sp-field-error">{formError ?? errorMessage}</p>
              )}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={stage === 'creating' || stage === 'paying'}
                className="sp-btn sp-btn-red"
              >
                {stage === 'editing' && 'Pay ₹199 & get your link'}
                {stage === 'creating' && 'Creating your page…'}
                {stage === 'paying' && 'Opening payment…'}
              </button>
            </form>
          </div>

          <div className="sp-preview scroll">
            <Tier2Template config={config} isPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
