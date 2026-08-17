import Link from 'next/link';
import MarqueeStrip from '@/components/MarqueeStrip';
import Accordion from '@/components/Accordion';
import Reveal from '@/components/Reveal';
import Tier1Template from '@/components/templates/Tier1Template';
import Tier2Template from '@/components/templates/Tier2Template';
import Tier3Template from '@/components/templates/Tier3Template';
import type { Tier1Config, Tier2Config, Tier3Config } from '@/types/order';

const TIER1_SAMPLE: Tier1Config = {
  recipientName: 'Ananya',
  senderName: 'Rohan',
  message:
    "Happy birthday! Every year with you feels like the good part of a song on repeat. Here's to another one.",
  photoUrls: ['/placeholder-photo.svg'],
  accentColor: '#ff7a45',
};

const TIER2_SAMPLE: Tier2Config = {
  recipientName: 'Priya',
  senderName: 'Kabir',
  introMessage: 'A little walk through some of my favourite moments with you.',
  memories: [
    { photoUrl: '/placeholder-photo.svg', caption: 'This one, obviously.' },
    { photoUrl: '/placeholder-photo.svg', caption: 'And this.' },
  ],
  closingMessage: "Here's to many more of these.",
  accentColor: '#a855f7',
};

const TIER3_SAMPLE: Tier3Config = {
  recipientName: 'Zara',
  senderName: 'Aman',
  message: 'It finally opened. Happy birthday — this one was worth the wait.',
  photoUrls: ['/placeholder-photo.svg'],
  accentColor: '#ff4d8d',
  revealAt: new Date(Date.now() + 60_000).toISOString(),
};

const OCCASIONS = [
  'BIRTHDAYS',
  'ANNIVERSARIES',
  'FRIENDSHIP DAY',
  "VALENTINE'S DAY",
  'DIWALI',
  'JUST BECAUSE',
];

const STEPS = [
  {
    number: '01',
    title: 'Write it',
    body: 'Add their name, your message, a couple of photos, and pick an accent colour.',
  },
  {
    number: '02',
    title: 'Preview it',
    body: "See the exact page they'll open — nothing hidden, nothing to imagine.",
  },
  {
    number: '03',
    title: 'Share it',
    body: 'Set a 4-digit PIN, pay, and the link is yours to send in seconds.',
  },
];

const COMPARISON = {
  generic: [
    'The same message everyone else got',
    'A stock template with their name inserted',
    'A public link anyone can open',
    'No way to see it before it sends',
  ],
  ours: [
    'Written for them, by you, from scratch',
    'Your own photos and words, not a fill-in-the-blank',
    'PIN-protected — only the two of you have it',
    'Preview the finished page before you pay',
  ],
};

const FAQ_ITEMS = [
  {
    question: 'Can I see the page before I pay for it?',
    answer:
      "Yes. Every builder shows a live preview as you type — what you see is what gets published. Nothing goes live until you complete payment.",
  },
  {
    question: "What if the recipient doesn't have the PIN?",
    answer:
      'You choose the PIN when you build the page, so only whoever you share it with can open it. Make sure to send the PIN along with the link.',
  },
  {
    question: 'How is this different from just sending photos in a chat?',
    answer:
      "It's a single page built around the moment — their name, your message, and photos laid out the way you designed them, at a link you control rather than scattered across a chat thread.",
  },
  {
    question: 'Can I edit the page after paying?',
    answer:
      "Not yet through the builder — each page is generated once payment confirms. If something needs fixing, reach out and we'll help directly.",
  },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center overflow-hidden">
        {/* Ambient background — slow-drifting gradient blobs + faint petals,
            echoing the Tier 3 reveal motif. Purely decorative, so it's
            hidden from assistive tech and ignores pointer events. Opacity
            tuned up from the dark-theme version since these sit on white now. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="animate-blob absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-marigold/30 blur-[90px]" />
          <div className="animate-blob-delayed absolute top-10 right-[15%] h-64 w-64 rounded-full bg-rose/25 blur-[90px]" />
          <div className="animate-blob absolute top-40 left-[10%] h-56 w-56 rounded-full bg-purple-500/20 blur-[80px]" />
          {[
            { left: '18%', bg: '#ff7a45', delay: '0s', size: 6 },
            { left: '38%', bg: '#ff4d8d', delay: '1.5s', size: 5 },
            { left: '58%', bg: '#a855f7', delay: '3s', size: 7 },
            { left: '76%', bg: '#ff7a45', delay: '4.5s', size: 5 },
            { left: '88%', bg: '#ff4d8d', delay: '2s', size: 6 },
          ].map((p, i) => (
            <span
              key={i}
              className="hero-petal"
              style={{
                left: p.left,
                bottom: '10%',
                width: p.size,
                height: p.size,
                background: p.bg,
                animationDelay: p.delay,
              }}
            />
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center max-w-6xl mx-auto text-left lg:text-left">
          <div className="text-center lg:text-left">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted mb-6">
              For birthdays &amp; everyday surprises
            </p>
            <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-ink max-w-xl mx-auto lg:mx-0 mb-6">
              One link.{' '}
              <span className="text-gradient-accent">Every surprise</span> they&apos;ll actually open.
            </h1>
            <p className="text-ink-muted text-lg leading-relaxed max-w-lg mx-auto lg:mx-0 mb-9">
              Write it, preview it exactly as they&apos;ll see it, and get a link to send — in under
              two minutes. No back-and-forth with anyone.
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4">
              <Link
                href="/builder"
                className="sheen relative overflow-hidden inline-flex justify-center rounded-full bg-gradient-accent px-7 py-3 font-body font-semibold text-ivory hover:opacity-90 transition-opacity"
              >
                Start building — free to preview
              </Link>
              <Link
                href="#pricing"
                className="inline-flex justify-center rounded-full border border-paper-line px-7 py-3 font-body font-semibold text-ink hover:bg-paper-soft transition-colors"
              >
                See pricing
              </Link>
            </div>
          </div>

          {/* Phone mockup showing the actual live-rendered product, not a stock photo —
              a truer "fresh" visual for this product than generic stock imagery.
              Deliberately stays a dark "product panel" island (Subframe's own pattern
              of dark screenshot cards floating on a light page) — the delivered
              product's near-black palette is a separate, intentional decision. */}
          <div className="hidden lg:flex justify-center">
            <div className="animate-float relative w-[260px] rounded-[2.5rem] border-4 border-plum-line bg-plum-deep shadow-2xl shadow-black/20 overflow-hidden">
              <div className="absolute left-1/2 top-2.5 -translate-x-1/2 h-1.5 w-16 rounded-full bg-plum-line z-10" />
              <div className="h-[540px] overflow-hidden">
                <div className="scale-[0.42] origin-top">
                  <Tier1Template config={TIER1_SAMPLE} isPreview={false} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip items={OCCASIONS} />

      {/* Trust row — replaces "award badges", since we have real mechanics, not awards */}
      <section className="px-6 py-10 border-b border-paper-line">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            'PIN-protected links',
            'Preview before you pay',
            'Live in seconds after payment',
          ].map((point) => (
            <p key={point} className="text-sm text-ink-muted">
              <span className="text-gradient-accent font-semibold">✓</span> {point}
            </p>
          ))}
        </div>
      </section>

      {/* Portfolio grid — real, live-rendered product, labelled like real deliverables.
          Each card stays a dark product-panel island, same reasoning as the hero mockup. */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
              Real outputs
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink max-w-xl mx-auto mb-14">
              Not a mockup. The actual page they&apos;ll open.
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: 'TIER 1 · SIMPLE WISH', el: <Tier1Template config={TIER1_SAMPLE} isPreview={false} /> },
              { label: 'TIER 2 · MEMORY LANE', el: <Tier2Template config={TIER2_SAMPLE} isPreview={false} /> },
              { label: 'TIER 3 · TIME CAPSULE', el: <Tier3Template config={TIER3_SAMPLE} isPreview /> },
            ].map((item, i) => (
              <Reveal key={item.label} delayMs={i * 100} className="flex flex-col">
                <div className="hover-lift rounded-2xl border border-plum-line bg-plum-deep overflow-hidden h-[420px] shadow-lg shadow-black/5">
                  <div className="scale-[0.68] origin-top">{item.el}</div>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mt-4 text-center">
                  {item.label}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 md:py-24 border-t border-paper-line">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
              How it works
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mb-14">
              Three steps. No one else involved.
            </h2>
          </Reveal>
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.number} delayMs={i * 100}>
                <span className="text-gradient-accent font-mono text-sm">{step.number}</span>
                <h3 className="font-display font-bold text-xl text-ink mt-2 mb-2">{step.title}</h3>
                <p className="text-ink-muted leading-relaxed">{step.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison — "the difference", kept generic, no named competitors */}
      <section className="px-6 py-20 md:py-24 border-t border-paper-line">
        <div className="mx-auto max-w-4xl">
          <Reveal className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
              The difference
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mb-14">
              A page made for them, not a template with their name on it.
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            <Reveal className="rounded-2xl border border-paper-line bg-paper-soft p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">
                A forwarded template
              </p>
              <ul className="space-y-3">
                {COMPARISON.generic.map((line) => (
                  <li key={line} className="text-sm text-ink-muted flex gap-2">
                    <span>–</span> {line}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delayMs={100} className="rounded-2xl border border-paper-line bg-paper-soft p-6 relative overflow-hidden shadow-lg shadow-black/5">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-4">
                A Surprise Pages link
              </p>
              <ul className="space-y-3">
                {COMPARISON.ours.map((line) => (
                  <li key={line} className="text-sm text-ink flex gap-2">
                    <span className="text-gradient-accent">✓</span> {line}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 md:py-24 border-t border-paper-line">
        <div className="mx-auto max-w-5xl">
          <Reveal className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
              Pricing
            </p>
            <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ink mb-14">
              Pick a style.
            </h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Reveal className="hover-lift rounded-3xl bg-paper-soft p-6 ring-1 ring-paper-line text-center flex flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">
                Simple Wish
              </p>
              <p className="font-display font-extrabold text-3xl text-ink mb-1">₹99</p>
              <p className="text-ink-muted text-sm mb-4">One message, one recipient.</p>
              <ul className="text-left text-ink-muted text-xs space-y-1.5 mb-6 flex-1">
                <li>· Name, message &amp; up to 3 photos</li>
                <li>· Choice of accent colour</li>
                <li>· PIN-protected link</li>
              </ul>
              <Link
                href="/builder"
                className="block w-full rounded-full border border-paper-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-paper transition-colors"
              >
                Build yours
              </Link>
            </Reveal>

            <Reveal delayMs={100} className="hover-lift relative rounded-3xl bg-paper-soft p-6 border-2 border-transparent [background:linear-gradient(#f7f6f4,#f7f6f4)_padding-box,var(--gradient-accent)_border-box] text-center flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ivory">
                Popular
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">
                Memory Lane
              </p>
              <p className="font-display font-extrabold text-3xl text-ink mb-1">₹199</p>
              <p className="text-ink-muted text-sm mb-4">A sequence of photo moments.</p>
              <ul className="text-left text-ink-muted text-xs space-y-1.5 mb-6 flex-1">
                <li>· 2–6 photo + caption memories</li>
                <li>· Opening &amp; closing message</li>
                <li>· PIN-protected link</li>
              </ul>
              <Link
                href="/builder/tier2"
                className="block w-full rounded-full bg-gradient-accent px-4 py-2.5 text-sm font-semibold text-ivory hover:opacity-90 transition-opacity"
              >
                Build yours
              </Link>
            </Reveal>

            <Reveal delayMs={200} className="hover-lift rounded-3xl bg-paper-soft p-6 ring-1 ring-paper-line text-center flex flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">
                Time Capsule
              </p>
              <p className="font-display font-extrabold text-3xl text-ink mb-1">₹299</p>
              <p className="text-ink-muted text-sm mb-4">Locked until the moment you pick.</p>
              <ul className="text-left text-ink-muted text-xs space-y-1.5 mb-6 flex-1">
                <li>· Live countdown reveal</li>
                <li>· Up to 5 photos</li>
                <li>· PIN-protected link</li>
              </ul>
              <Link
                href="/builder/tier3"
                className="block w-full rounded-full border border-paper-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-paper transition-colors"
              >
                Build yours
              </Link>
            </Reveal>

            <Reveal delayMs={300} className="hover-lift rounded-3xl bg-paper p-6 ring-1 ring-paper-line text-center flex flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-2">
                White Glove
              </p>
              <p className="font-display font-extrabold text-3xl text-ink mb-1">From ₹999</p>
              <p className="text-ink-muted text-sm mb-4">Made by hand, just for this one.</p>
              <ul className="text-left text-ink-muted text-xs space-y-1.5 mb-6 flex-1">
                <li>· Fully custom design</li>
                <li>· Unlimited photos &amp; video</li>
                <li>· We build it with you, 1:1</li>
              </ul>
              <Link
                href="/builder/white-glove"
                className="block w-full rounded-full border border-paper-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-paper-soft transition-colors"
              >
                Message us
              </Link>
            </Reveal>
          </div>
          <p className="text-xs text-ink-muted text-center mt-8">
            Tiers 1–3 are preview-before-you-pay. White Glove is handled personally, no builder needed.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 md:py-24 border-t border-paper-line">
        <div className="mx-auto max-w-2xl">
          <Reveal className="text-center">
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">
              Questions
            </p>
            <h2 className="font-display font-extrabold text-3xl text-ink mb-14">
              Before you build one
            </h2>
          </Reveal>
          <Reveal delayMs={100}>
            <Accordion items={FAQ_ITEMS} />
          </Reveal>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-24 border-t border-paper-line text-center">
        <Reveal>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-ink max-w-lg mx-auto mb-6">
            Don&apos;t take our word for it. <span className="text-gradient-accent">Preview it free.</span>
          </h2>
          <Link
            href="/builder"
            className="sheen relative overflow-hidden inline-flex justify-center rounded-full bg-gradient-accent px-8 py-3 font-semibold text-ivory hover:opacity-90 transition-opacity"
          >
            Start building
          </Link>
        </Reveal>
      </section>

      {/* Footer */}
      <footer className="px-6 py-14 border-t border-paper-line">
        <div className="mx-auto max-w-6xl grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display font-extrabold text-ink mb-2">Surprise Pages</p>
            <p className="text-sm text-ink-muted">Personalised pages for birthdays and everyday surprises.</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">Product</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/builder" className="text-ink-muted hover:text-ink transition-colors">Simple Wish</Link></li>
              <li><Link href="/builder/tier2" className="text-ink-muted hover:text-ink transition-colors">Memory Lane</Link></li>
              <li><Link href="/builder/tier3" className="text-ink-muted hover:text-ink transition-colors">Time Capsule</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ink-muted mb-3">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-ink-muted hover:text-ink transition-colors">Terms</Link></li>
              <li><Link href="/refunds" className="text-ink-muted hover:text-ink transition-colors">Refunds</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
