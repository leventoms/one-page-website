'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  slug: string;
  error?: string;
}

export default function PinGate({ slug, error }: Props) {
  const router = useRouter();
  const [pin, setPin] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pin.length !== 4) return;
    router.push(`/p/${slug}?pin=${pin}`);
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center bg-plum-deep dark-surface">
      <h1 className="font-display text-xl text-ivory mb-2">Enter the 4-digit PIN</h1>
      <p className="text-ivory-muted text-sm mb-6">Ask whoever sent you this link.</p>

      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <input
          type="text"
          inputMode="numeric"
          pattern="\d{4}"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
          className="w-32 text-center text-2xl tracking-[0.5em] rounded-xl bg-plum text-ivory py-3 outline-none ring-1 ring-plum-line focus:ring-marigold"
          autoFocus
        />
        {error && <p className="text-sm text-rose">{error}</p>}
        <button
          type="submit"
          disabled={pin.length !== 4}
          className="rounded-full bg-marigold px-6 py-2 text-plum-deep font-semibold disabled:opacity-40"
        >
          Unlock
        </button>
      </form>
    </main>
  );
}
