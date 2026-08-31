'use client';

import { useState } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import Tier1Template from '@/features/templates/Tier1Template';
import ManualRequestForm from '@/components/ManualRequestForm';
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
  const [mode, setMode] = useState<'diy' | 'manual'>('diy');
  const [config, setConfig] = useState<Tier1Config>(EMPTY_CONFIG);
  const [pinCode, setPinCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const { stage, errorMessage, finalSlug, payAndPublish } = useOrderCheckout();

  if (mode === 'manual') {
    return (
      <ManualRequestForm tier="tier1" tierLabel="Simple Wish" onBackToBuilder={() => setMode('diy')} />
    );
  }

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
      <section className="sp-builder">
        <div className="sp-wrap">
          <div className="sp-builder-done">
            <div className="mark" aria-hidden="true">✓</div>
            <h2>Your Simple Wish is on its way</h2>
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
              <span className="sp-eyebrow">simple wish</span>
              <h1>Write your <span className="sp-script">Simple Wish</span></h1>
              <p className="lede">
                A photo or three and a message that means it — ready to send in minutes.
              </p>
              <p className="sp-builder-switch">
                Want a whole photo story?{' '}
                <Link href="/builder/tier2" className="sp-alink">Build a Memory Lane</Link>{' '}
                instead. Rather we made it for you?{' '}
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
                  placeholder="Say the thing you'd say if they were right in front of you."
                  value={config.message}
                  onChange={(e) => updateField('message', e.target.value)}
                  maxLength={600}
                />
              </div>

              <div className="sp-field">
                <label>Photos <span className="sp-form-note" style={{ textTransform: 'none' }}>— paste up to 3 image links, comma separated</span></label>
                <input
                  className="sp-input"
                  placeholder="https://…"
                  onChange={(e) =>
                    updateField(
                      'photoUrls',
                      e.target.value.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3)
                    )
                  }
                />
              </div>

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
                {stage === 'editing' && 'Pay ₹99 & get your link'}
                {stage === 'creating' && 'Creating your page…'}
                {stage === 'paying' && 'Opening payment…'}
              </button>
            </form>
          </div>

          <div className="sp-preview">
            <Tier1Template config={config} isPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
