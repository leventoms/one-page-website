'use client';

import { useState } from 'react';
import type { TemplateTier } from '@/types/order';

interface ManualRequestFormProps {
  tier: TemplateTier;
  tierLabel: string;
  /** Omit for tiers with no self-serve builder to fall back to (e.g. Tier 4). */
  onBackToBuilder?: () => void;
}

type Stage = 'editing' | 'submitting' | 'done';

/**
 * The "build it for me" counterpart to the self-serve builders. Only
 * recipientName and contactEmail are required — everything else is
 * optional context, since a human (not the template renderer) is going
 * to build the actual page from this. No PIN, no payment, no preview
 * pane: what gets submitted is a brief, not the final artifact.
 */
export default function ManualRequestForm({ tier, tierLabel, onBackToBuilder }: ManualRequestFormProps) {
  const [recipientName, setRecipientName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [senderName, setSenderName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [message, setMessage] = useState('');
  const [notes, setNotes] = useState('');
  const [stage, setStage] = useState<Stage>('editing');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!recipientName.trim()) {
      setError("Add who this is for — that's all we strictly need.");
      return;
    }
    if (!contactEmail.trim()) {
      setError("Add your email so we know where to send it back.");
      return;
    }

    setStage('submitting');

    try {
      const res = await fetch('/api/manual-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier,
          recipientName,
          contactEmail,
          senderName: senderName || undefined,
          occasion: occasion || undefined,
          message: message || undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Could not submit request');
      }

      setStage('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStage('editing');
    }
  }

  if (stage === 'done') {
    return (
      <div className="max-w-md mx-auto text-center py-16 px-6">
        <h2 className="font-display text-xl text-ivory mb-3">Got it 🎉</h2>
        <p className="text-ivory-muted">
          We&apos;ll build your {tierLabel} page by hand and send it to{' '}
          <span className="text-ivory">{contactEmail}</span> once it&apos;s ready.
        </p>
      </div>
    );
  }

  return (
    <form className="flex flex-col gap-4 max-w-md mx-auto px-6 py-12" onSubmit={(e) => e.preventDefault()}>
      <h1 className="font-display text-2xl text-ivory mb-1">Let us build your {tierLabel}</h1>
      <p className="text-sm text-ivory-muted mb-2">
        Just the basics — we&apos;ll follow up if we need more.
        {onBackToBuilder && (
          <>
            {' '}
            <button type="button" onClick={onBackToBuilder} className="text-marigold underline underline-offset-2">
              Build it myself instead
            </button>
            .
          </>
        )}
      </p>

      <label className="flex flex-col gap-1 text-sm text-ivory-muted">
        Recipient&apos;s name
        <input
          className="rounded-lg bg-plum px-3 py-2 text-ivory"
          value={recipientName}
          onChange={(e) => setRecipientName(e.target.value)}
          maxLength={60}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ivory-muted">
        Your email
        <input
          type="email"
          className="rounded-lg bg-plum px-3 py-2 text-ivory"
          placeholder="we'll send the finished page here"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ivory-muted">
        Your name <span className="text-ivory-muted/60">(optional)</span>
        <input
          className="rounded-lg bg-plum px-3 py-2 text-ivory"
          value={senderName}
          onChange={(e) => setSenderName(e.target.value)}
          maxLength={60}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ivory-muted">
        Occasion <span className="text-ivory-muted/60">(optional)</span>
        <input
          className="rounded-lg bg-plum px-3 py-2 text-ivory"
          placeholder="Birthday, anniversary, just because…"
          value={occasion}
          onChange={(e) => setOccasion(e.target.value)}
          maxLength={60}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ivory-muted">
        Message or vibe <span className="text-ivory-muted/60">(optional)</span>
        <textarea
          className="rounded-lg bg-plum px-3 py-2 min-h-[80px] text-ivory"
          placeholder="What do you want it to say? Doesn't need to be final wording."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
        />
      </label>

      <label className="flex flex-col gap-1 text-sm text-ivory-muted">
        Anything else <span className="text-ivory-muted/60">(optional)</span>
        <textarea
          className="rounded-lg bg-plum px-3 py-2 min-h-[60px] text-ivory"
          placeholder="Photos to include, colors, deadline — whatever's useful."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          maxLength={1000}
        />
      </label>

      {error && <p className="text-sm text-rose">{error}</p>}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={stage === 'submitting'}
        className="mt-2 rounded-full bg-marigold px-6 py-3 font-semibold text-plum-deep disabled:opacity-50"
      >
        {stage === 'editing' ? 'Build now' : 'Sending…'}
      </button>
    </form>
  );
}
