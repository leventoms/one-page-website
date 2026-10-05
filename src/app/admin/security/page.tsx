'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/platform/supabase';

export default function MfaSecurityPage() {
  const [factors, setFactors] = useState<any[]>([]);
  const [pendingFactors, setPendingFactors] = useState<any[]>([]);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualKey, setManualKey] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const supabase = getSupabaseBrowserClient();

  async function loadFactors() {
    const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
    if (factorsError) { setError(factorsError.message); return; }
    setFactors(data?.totp ?? []);
    setPendingFactors((data?.all ?? []).filter((factor) => factor.factor_type === 'totp' && factor.status === 'unverified'));
  }

  useEffect(() => { void loadFactors(); }, []);

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
    await loadFactors();
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
    await loadFactors();
  }

  return (
    <div>
      <header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Account protection</span><h1>Security</h1><p className="sp-admin-subtitle">Use an authenticator app to keep the admin workspace private.</p></div></header>
      <section className="sp-admin-card sp-admin-security">

      {message && <p className="sp-admin-notice success">{message}</p>}
      {error && <p className="sp-admin-notice error">{error}</p>}

      {factors.length > 0 ? (
        <div>
          <p>✓ Your authenticator app is connected.</p>
          {factors.map((f) => (
            <button key={f.id} onClick={() => unenroll(f.id)} className="sp-admin-button danger" style={{ marginTop: '1rem' }}>
              Remove authenticator
            </button>
          ))}
        </div>
      ) : pendingFactors.length > 0 ? (
        <div>
          <p>
            An earlier authenticator setup was not completed. Remove it before starting again.
          </p>
          {pendingFactors.map((factor) => (
            <button key={factor.id} onClick={() => unenroll(factor.id)} className="sp-admin-button danger" style={{ marginTop: '1rem' }}>
              Remove incomplete setup
            </button>
          ))}
        </div>
      ) : !enrolling ? (
        <div>
          <p>No authenticator is connected yet. Add one to access the rest of the admin workspace.</p>
          <button onClick={startEnroll} className="sp-admin-button" style={{ marginTop: '1rem' }}>
            Enroll authenticator
          </button>
        </div>
      ) : (
        <div>
          <p>Scan this code with your authenticator app, then enter the six-digit code it gives you.</p>
          {qrCode && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrCode}
              alt="TOTP QR code"
              width={280}
              height={280}
              style={{ imageRendering: 'pixelated' }}
            />
          )}
          {manualKey && (
            <div>
              <p>
                Can&apos;t scan it? In your authenticator app choose <strong>Enter a setup key</strong>, then use this key.
              </p>
              <div className="sp-admin-key">
                <code>
                  {manualKey}
                </code>
                <button type="button" onClick={copyManualKey} className="sp-admin-button secondary">
                  Copy
                </button>
              </div>
              <p>Select time-based / TOTP when the app asks for the key type.</p>
            </div>
          )}
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, ''))}
            placeholder="6-digit code"
            className="sp-admin-code"
          />
          <button onClick={verifyEnroll} className="sp-admin-button">
            Verify and save
          </button>
        </div>
      )}
      </section>
    </div>
  );
}
