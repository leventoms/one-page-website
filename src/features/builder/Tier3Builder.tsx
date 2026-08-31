'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Tier3Template from '@/features/templates/Tier3Template';
import ManualRequestForm from '@/components/ManualRequestForm';
import VideoInput from '@/features/builder/VideoInput';
import { EXPANDED_ACCENT_COLORS } from '@/lib/services/validation';
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
  accentColor: EXPANDED_ACCENT_COLORS[0],
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
      <section className="sp-builder">
        <div className="sp-wrap">
          <div className="sp-builder-done">
            <div className="mark" aria-hidden="true">✓</div>
            <h2>Your Time Capsule is sealed</h2>
            <p>
              It takes a few seconds to go live. Share this link — and the 4-digit PIN — with{' '}
              {config.recipientName || 'them'}; it stays locked behind the countdown until your
              chosen moment.
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
              <span className="sp-eyebrow">time capsule</span>
              <h1>Seal your <span className="sp-script">Time Capsule</span></h1>
              <p className="lede">
                Lock it behind a countdown so it opens at exactly the right moment — the
                reveal is the gift.
              </p>
              <p className="sp-builder-switch">
                Don&apos;t need a countdown?{' '}
                <Link href="/builder" className="sp-alink">Simple Wish</Link>{' '}
                and{' '}
                <Link href="/builder/tier2" className="sp-alink">Memory Lane</Link>{' '}
                publish instantly. Rather we made it for you?{' '}
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
                <label>Your message</label>
                <textarea
                  className="sp-textarea"
                  placeholder="What they'll read the moment it unlocks."
                  value={config.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  maxLength={600}
                />
              </div>

              <div className="sp-field">
                <label>Photos <span className="sp-form-note" style={{ textTransform: 'none' }}>— paste up to 15 image links, comma separated</span></label>
                <input
                  className="sp-input"
                  placeholder="https://…"
                  onChange={(e) =>
                    updateField(
                      'photoUrls',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 15)
                    )
                  }
                />
              </div>

              <div className="sp-field">
                <label>Opens on</label>
                <input
                  type="datetime-local"
                  className="sp-input"
                  value={revealAtLocal}
                  min={defaultRevealAt()}
                  onChange={(e) => setRevealAtLocal(e.target.value)}
                />
              </div>

              <VideoInput onChange={(video) => updateField('video', video)} />

              <div className="sp-field">
                <label>Pick an accent colour</label>
                <div className="sp-swatches">
                  {EXPANDED_ACCENT_COLORS.map((color) => (
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
                {stage === 'editing' && 'Pay ₹299 & get your link'}
                {stage === 'creating' && 'Creating your page…'}
                {stage === 'paying' && 'Opening payment…'}
              </button>
            </form>
          </div>

          <div className="sp-preview">
            <Tier3Template config={previewConfig} isPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
