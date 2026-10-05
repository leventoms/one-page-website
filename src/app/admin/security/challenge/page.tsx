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
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c' }}>
      <div style={{ background: '#1a1a1e', padding: '2rem', borderRadius: 16, maxWidth: 360, width: '100%' }}>
        <h1 style={{ color: '#fff', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Two-factor verification</h1>
        <p style={{ color: '#aaa', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
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
            style={{
              width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #333',
              background: '#0a0a0c', color: '#fff', fontSize: '1.5rem', textAlign: 'center',
              letterSpacing: '0.5em', marginBottom: '1rem',
            }}
          />
          {error && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</p>}
          <button
            type="submit"
            disabled={code.length !== 6 || loading || !factorId}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: 8, background: '#ff7a45',
              color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600,
              opacity: (code.length !== 6 || loading || !factorId) ? 0.5 : 1,
            }}
          >
            {loading ? 'Verifying…' : 'Verify'}
          </button>
        </form>
      </div>
    </main>
  );
}
