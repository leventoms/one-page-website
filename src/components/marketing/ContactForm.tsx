'use client';

import { useState } from 'react';

type Stage = 'editing' | 'submitting' | 'done';

/**
 * Public contact form for the autumn-themed /contact page.
 *
 * Mirrors ManualRequestForm's edit → submit → done state machine, but styled
 * with the `.sp-form` autumn classes and posting to /api/contact. On success
 * the server emails the owner (or logs the message when Resend env isn't set);
 * either way the sender sees the same honest confirmation. The page also shows
 * a direct mailto, so there's always a working channel even before email is
 * configured.
 */
export function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [stage, setStage] = useState<Stage>('editing');
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setError(null);

    if (!name.trim()) {
      setError('Add your name so we know who we’re replying to.');
      return;
    }
    if (!email.trim()) {
      setError('Add your email so we can write back.');
      return;
    }
    if (!message.trim()) {
      setError('Add a message — even a line or two helps.');
      return;
    }

    setStage('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? 'Could not send message');
      }

      setStage('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStage('editing');
    }
  }

  if (stage === 'done') {
    return (
      <div className="sp-form">
        <div className="sp-form-done">
          <div className="mark" aria-hidden="true">
            ✓
          </div>
          <h3>Message sent</h3>
          <p>
            Thanks, {name.trim() || 'there'} — we’ll reply to{' '}
            <strong>{email}</strong> within a day or two.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="sp-form" onSubmit={(e) => e.preventDefault()}>
      <div className="sp-field">
        <label htmlFor="cf-name">Your name</label>
        <input
          id="cf-name"
          className="sp-input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          autoComplete="name"
        />
      </div>

      <div className="sp-field">
        <label htmlFor="cf-email">Your email</label>
        <input
          id="cf-email"
          type="email"
          className="sp-input"
          placeholder="so we can write back"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div className="sp-field">
        <label htmlFor="cf-message">Message</label>
        <textarea
          id="cf-message"
          className="sp-textarea"
          placeholder="How can we help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          maxLength={1000}
        />
      </div>

      {error && <p className="sp-field-error">{error}</p>}

      <button
        type="button"
        className="sp-btn sp-btn-red"
        onClick={handleSubmit}
        disabled={stage === 'submitting'}
      >
        {stage === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      <p className="sp-form-note">
        Prefer email? Reach us any time at the address on the left.
      </p>
    </form>
  );
}
