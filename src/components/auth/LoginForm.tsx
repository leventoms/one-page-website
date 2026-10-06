'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/platform/supabase';

interface Props {
  next: string;
  initialError?: string;
}

const COOLDOWN_SECONDS = 60;

const CALLBACK_ERRORS: Record<string, string> = {
  link: 'That sign-in link has expired or was already used. Request a new one below.',
};

function friendlyAuthError(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes('rate limit') || normalized.includes('too many requests')) return 'Too many sign-in emails were requested. Please wait a little while before trying again.';
  if (normalized.includes('not authorized')) return 'This email address is not allowed to receive a sign-in email yet.';
  return 'We could not send your sign-in link. Please try again.';
}

export default function LoginForm({ next, initialError }: Props) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(initialError ? CALLBACK_ERRORS[initialError] ?? 'We could not complete that sign-in. Please request a new link.' : null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || loading || cooldown > 0) return;

    setError(null);
    setLoading(true);

    const supabase = getSupabaseBrowserClient();
    const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });

    setLoading(false);

    if (otpError) {
      setError(friendlyAuthError(otpError.message));
      return;
    }

    setSubmitted(true);
    setCooldown(COOLDOWN_SECONDS);
  }

  if (submitted) {
    return (
      <div className="sp-form">
        <div className="sp-field" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📬</p>
          <h2 style={{ marginBottom: '0.5rem' }}>Check your inbox</h2>
          <p className="lede" style={{ marginBottom: '1.5rem' }}>
            We sent a magic link to <strong>{email}</strong>. Click it to sign in.
          </p>
          {cooldown > 0 ? (
            <p className="sp-form-note">
              Resend available in {cooldown}s
            </p>
          ) : (
            <button
              type="button"
              className="sp-btn"
              onClick={() => {
                setSubmitted(false);
                setError(null);
              }}
            >
              Resend link
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <form className="sp-form" onSubmit={handleSubmit}>
      <div className="sp-field">
        <label htmlFor="email">Your email</label>
        <input
          id="email"
          type="email"
          className="sp-input"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoFocus
        />
      </div>

      {error && <p className="sp-field-error">{error}</p>}

      <button
        type="submit"
        disabled={loading || cooldown > 0 || !email}
        className="sp-btn sp-btn-red"
      >
        {loading ? 'Sending…' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Send magic link'}
      </button>
    </form>
  );
}
