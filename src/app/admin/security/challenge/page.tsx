'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowserClient } from '@/platform/supabase';

export default function MfaChallengePage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [factorId, setFactorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data }) => {
      const totp = data?.totp?.[0];
      if (totp) setFactorId(totp.id);
    });
  }, []);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!factorId || !code) return;
    setError(null);
    setLoading(true);

    try {
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
      if (challengeError || !challengeData) throw new Error(challengeError?.message ?? 'Challenge failed');

      const { error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code,
      });
      if (verifyError) throw verifyError;

      router.replace('/admin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="sp-admin">
      <div className="sp-admin-main" style={{ maxWidth: 560, paddingTop: '12vh' }}>
      <div className="sp-admin-card sp-admin-security">
        <span className="sp-admin-eyebrow">One more step</span><h1>Two-factor verification</h1>
        <p style={{ marginTop: '12px' }}>
          Enter the 6-digit code from your authenticator app.
        </p>

        <form onSubmit={handleVerify}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="000000"
            autoFocus
            className="sp-admin-code"
            style={{ textAlign: 'center' }}
          />
          {error && <p className="sp-admin-notice error">{error}</p>}
          <button
            type="submit"
            disabled={code.length !== 6 || loading || !factorId}
            className="sp-admin-button"
            style={{ width: '100%', opacity: (code.length !== 6 || loading || !factorId) ? 0.5 : 1 }}
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      </div></div>
    </main>
  );
}
