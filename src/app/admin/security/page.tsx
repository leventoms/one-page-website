'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/platform/supabase';

export default function MfaSecurityPage() {
  const [factors, setFactors] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.mfa.listFactors().then(({ data }) => {
      setFactors(data?.totp ?? []);
    });
  }, []);

  async function startEnroll() {
    setError(null);
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
    if (enrollError || !data) { setError(enrollError?.message ?? 'Enroll failed'); return; }
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setManualKey(data.totp.secret);
    setEnrolling(true);
  }

  async function verifyEnroll() {
    if (!factorId) return;
    setError(null);
    const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({ factorId });
    if (challengeError || !challengeData) { setError(challengeError?.message ?? 'Challenge failed'); return; }
    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: verifyCode,
    });
    if (verifyError) { setError(verifyError.message); return; }
    setMessage('MFA enrolled successfully.');
    setEnrolling(false);
    setQrCode(null);
    setManualKey(null);
    const { data } = await supabase.auth.mfa.listFactors();
    setFactors(data?.totp ?? []);
  }

  async function copyManualKey() {
    if (!manualKey) return;
    try {
      await navigator.clipboard.writeText(manualKey);
      setMessage('Setup key copied.');
    } catch {
      setError('Could not copy the setup key. Select and copy it manually.');
    }
  }

  async function unenroll(id: string) {
    setError(null);
    const { error: unenrollError } = await supabase.auth.mfa.unenroll({ factorId: id });
    if (unenrollError) { setError(unenrollError.message); return; }
    setMessage('MFA removed.');
    setFactors((prev) => prev.filter((f) => f.id !== id));
  }

  return (
    <div style={{ maxWidth: 480, padding: '2rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>MFA / Two-Factor Authentication</h1>

      {message && <p style={{ color: 'green', marginBottom: '1rem' }}>{message}</p>}
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}

      {factors.length > 0 ? (
        <div>
          <p style={{ marginBottom: '1rem' }}>✓ TOTP authenticator enrolled.</p>
          {factors.map((f) => (
            <button key={f.id} onClick={() => unenroll(f.id)}
              style={{ background: '#ef4444', color: '#fff', padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
              Remove authenticator
            </button>
          ))}
        </div>
      ) : !enrolling ? (
        <div>
          <p style={{ marginBottom: '1rem' }}>No authenticator enrolled. Enroll one to access admin routes.</p>
          <button onClick={startEnroll}
            style={{ background: '#22c55e', color: '#fff', padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Enroll authenticator
          </button>
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '1rem' }}>Scan this QR code with your authenticator app, then enter the code below.</p>
          {qrCode && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCode}
              alt="TOTP QR code"
              width={280}
              height={280}
              style={{ marginBottom: '1rem', display: 'block', background: '#fff', imageRendering: 'pixelated' }}
            />
          )}
          {manualKey && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ marginBottom: '0.5rem' }}>
                Can&apos;t scan it? In your authenticator app choose <strong>Enter a setup key</strong>, then use this key.
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <code style={{ flex: 1, overflowWrap: 'anywhere', padding: '0.75rem', background: '#f3f4f6', borderRadius: 8 }}>
                  {manualKey}
                </code>
                <button type="button" onClick={copyManualKey} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid #ccc', cursor: 'pointer' }}>
                  Copy
                </button>
              </div>
              <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#555' }}>Select time-based / TOTP when the app asks for the key type.</p>
            </div>
          )}
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit code"
            style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc', marginBottom: '0.75rem', width: '100%' }}
          />
          <button onClick={verifyEnroll}
            style={{ background: '#3b82f6', color: '#fff', padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
            Verify and save
          </button>
        </div>
      )}
    </div>
  );
}
