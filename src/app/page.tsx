import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-3xl font-semibold mb-4">Surprise Pages 🎁</h1>
      <p className="text-white/60 mb-8 max-w-sm">
        Build a personalised page for someone&apos;s birthday in under 2 minutes.
      </p>
      <Link
        href="/builder"
        className="rounded-full bg-brand-500 px-6 py-3 font-medium"
      >
        Create one now
      </Link>
    </main>
  );
}
