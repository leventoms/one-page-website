import Link from 'next/link';
import MarigoldDivider from '@/components/MarigoldDivider';
import Tier1Template from '@/components/templates/Tier1Template';
import type { Tier1Config } from '@/types/order';

const HERO_SAMPLE: Tier1Config = {
  recipientName: 'Ananya',
  senderName: 'Rohan',
  message:
    "Happy birthday! Every year with you feels like the good part of a song on repeat. Here's to another one — this time with cake first, plans later.",
  photoUrls: ['/placeholder-photo.svg'],
  accentColor: '#f0a94e',
};

const ROSE_SAMPLE: Tier1Config = {
  ...HERO_SAMPLE,
  recipientName: 'Priya',
  senderName: 'Kabir',
  accentColor: '#e2607a',
};

const STEPS = [
  {
    number: '01',
    title: 'Write the message',
    body: 'Add their name, your note, a couple of photos, and pick a colour that feels like them.',
  },
  {
    number: '02',
    title: 'Preview it live',
    body: "See the exact page they'll open — nothing hidden, nothing to imagine.",
  },
  {
    number: '03',
    title: 'Pay ₹99 & share the link',
    body: 'Set a 4-digit PIN, pay, and the link is yours to send in seconds.',
  },
];

const TRUST_POINTS = [
  {
    title: 'PIN-protected',
    body: 'Every page is locked behind a 4-digit PIN only the two of you know.',
  },
  {
    title: 'Preview before you pay',
    body: "You see the finished page first. Nothing publishes until you're happy with it.",
  },
  {
    title: 'Straightforward refunds',
    body: "If something's genuinely wrong on our end, we sort it — no runaround.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-marigold mb-5">
              For birthdays &amp; everyday surprises
            </p>
            <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-6 text-ivory">
              Turn a birthday message into something they&apos;ll actually keep open.
            </h1>
            <p className="text-ivory-muted text-lg leading-relaxed mb-8 max-w-md">
              Write it, preview it exactly as they&apos;ll see it, and get a link to send —
              in under two minutes. No back-and-forth with anyone, no waiting on a reply.
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Link
                href="/builder"
                className="inline-flex justify-center rounded-full bg-marigold px-7 py-3 font-body font-semibold text-plum-deep hover:bg-marigold-light transition-colors"
              >
                Start building — it&apos;s free to preview
              </Link>
              <p className="text-sm text-ivory-muted">
                Pay only once you like how it looks.
              </p>
            </div>
          </div>

          {/* Signature: a real, live-rendered miniature of the actual product */}
          <div className="mx-auto w-full max-w-[280px]">
            <div className="rounded-[2.5rem] border-8 border-plum-soft bg-plum-soft shadow-2xl overflow-hidden">
              <div className="scale-[0.62] origin-top -mb-[190px] h-[620px]">
                <Tier1Template config={HERO_SAMPLE} isPreview={false} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarigoldDivider />

      {/* How it works — a genuine 3-step sequence, so numbering earns its place */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="font-display text-2xl md:text-3xl text-ivory mb-10 text-center">
            How it works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="font-mono text-sm text-marigold">{step.number}</span>
                <h3 className="font-display text-xl text-ivory mt-2 mb-2">{step.title}</h3>
                <p className="text-ivory-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarigoldDivider />

      {/* Live preview showcase — the product customises, shown honestly */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-2xl md:text-3xl text-ivory mb-3">
            See exactly what they&apos;ll open
          </h2>
          <p className="text-ivory-muted max-w-md mx-auto mb-12">
            Pick from a small palette of colours — what you preview is pixel-for-pixel
            what gets sent.
          </p>
          <div className="grid gap-10 sm:grid-cols-2 max-w-2xl mx-auto">
            {[HERO_SAMPLE, ROSE_SAMPLE].map((sample, i) => (
              <div
                key={i}
                className="rounded-[2rem] border-8 border-plum-soft bg-plum-soft shadow-xl overflow-hidden mx-auto w-full max-w-[240px]"
              >
                <div className="scale-[0.53] origin-top -mb-[260px] h-[620px]">
                  <Tier1Template config={sample} isPreview={false} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarigoldDivider />

      {/* Trust — directly answers the #1 objection: is this safe / does the link work */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-display text-2xl md:text-3xl text-ivory mb-10 text-center">
            Built so you can trust it
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {TRUST_POINTS.map((point) => (
              <div key={point.title} className="rounded-2xl bg-plum/60 p-6 ring-1 ring-plum-line">
                <h3 className="font-display text-lg text-ivory mb-2">{point.title}</h3>
                <p className="text-ivory-muted text-sm leading-relaxed">{point.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MarigoldDivider />

      {/* Pricing */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-md">
          <div className="rounded-3xl bg-plum p-8 ring-1 ring-plum-line text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-marigold mb-2">
              Simple Wish
            </p>
            <p className="font-display text-4xl text-ivory mb-1">₹99</p>
            <p className="text-ivory-muted text-sm mb-6">One page, one recipient, yours to send.</p>
            <ul className="text-left text-ivory-muted text-sm space-y-2 mb-8">
              <li>· Custom name, message &amp; up to 3 photos</li>
              <li>· Choice of accent colour</li>
              <li>· PIN-protected link</li>
              <li>· Preview before you pay</li>
            </ul>
            <Link
              href="/builder"
              className="block w-full rounded-full bg-marigold px-6 py-3 font-semibold text-plum-deep hover:bg-marigold-light transition-colors"
            >
              Build yours
            </Link>
            <p className="text-xs text-ivory-muted mt-4">
              More styles are on the way — this is the first of a few.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-plum-line">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-ivory-muted">
          <p>Surprise Pages</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-ivory transition-colors">
              Terms
            </Link>
            <Link href="/refunds" className="hover:text-ivory transition-colors">
              Refunds
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
