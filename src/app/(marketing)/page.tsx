import Link from 'next/link';
import MarqueeStrip from '@/components/MarqueeStrip';
import Accordion from '@/components/Accordion';
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
      <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ivory-muted mb-6">
          For birthdays &amp; everyday surprises
        </p>
        <h1 className="font-display font-black text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight text-ivory max-w-3xl mx-auto mb-6">
          One link.{' '}
          <span className="text-gradient-accent">Every surprise</span> they&apos;ll actually open.
        </h1>
        <p className="text-ivory-muted text-lg leading-relaxed max-w-lg mx-auto mb-9">
          Write it, preview it exactly as they&apos;ll see it, and get a link to send — in under
          two minutes. No back-and-forth with anyone.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/builder"
            className="inline-flex justify-center rounded-full bg-gradient-accent px-7 py-3 font-body font-semibold text-ivory hover:opacity-90 transition-opacity"
          >
            Start building — free to preview
          </Link>
          <Link
            href="#pricing"
            className="inline-flex justify-center rounded-full border border-plum-line px-7 py-3 font-body font-semibold text-ivory hover:bg-plum transition-colors"
          >
            See pricing
          </Link>
        </div>
      </section>

      <MarqueeStrip items={OCCASIONS} />

      {/* Trust row — replaces "award badges", since we have real mechanics, not awards */}
      <section className="px-6 py-10 border-b border-plum-line">
        <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            'PIN-protected links',
            'Preview before you pay',
            'Live in seconds after payment',
          ].map((point) => (
            <p key={point} className="text-sm text-ivory-muted">
              <span className="text-gradient-accent font-semibold">✓</span> {point}
            </p>
          ))}
        </div>
      </section>

      {/* Portfolio grid — real, live-rendered product, labelled like real deliverables */}
      <section className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted text-center mb-3">
            Real outputs
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ivory text-center max-w-xl mx-auto mb-14">
            Not a mockup. The actual page they&apos;ll open.
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: 'TIER 1 · SIMPLE WISH', el: <Tier1Template config={TIER1_SAMPLE} isPreview={false} /> },
              { label: 'TIER 2 · MEMORY LANE', el: <Tier2Template config={TIER2_SAMPLE} isPreview={false} /> },
              { label: 'TIER 3 · TIME CAPSULE', el: <Tier3Template config={TIER3_SAMPLE} isPreview /> },
            ].map((item) => (
              <div key={item.label} className="flex flex-col">
                <div className="rounded-2xl border border-plum-line bg-plum-deep overflow-hidden h-[420px]">
                  <div className="scale-[0.68] origin-top">{item.el}</div>
                </div>
                <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mt-4 text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 md:py-24 border-t border-plum-line">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted text-center mb-3">
            How it works
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ivory text-center mb-14">
            Three steps. No one else involved.
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.number}>
                <span className="text-gradient-accent font-mono text-sm">{step.number}</span>
                <h3 className="font-display font-bold text-xl text-ivory mt-2 mb-2">{step.title}</h3>
                <p className="text-ivory-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison — "the difference", kept generic, no named competitors */}
      <section className="px-6 py-20 md:py-24 border-t border-plum-line">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted text-center mb-3">
            The difference
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ivory text-center mb-14">
            A page made for them, not a template with their name on it.
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-plum-line bg-plum p-6">
              <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-4">
                A forwarded template
              </p>
              <ul className="space-y-3">
                {COMPARISON.generic.map((line) => (
                  <li key={line} className="text-sm text-ivory-muted flex gap-2">
                    <span>–</span> {line}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-plum-line bg-plum p-6 relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-accent" />
              <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-4">
                A Surprise Pages link
              </p>
              <ul className="space-y-3">
                {COMPARISON.ours.map((line) => (
                  <li key={line} className="text-sm text-ivory flex gap-2">
                    <span className="text-gradient-accent">✓</span> {line}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20 md:py-24 border-t border-plum-line">
        <div className="mx-auto max-w-5xl">
          <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted text-center mb-3">
            Pricing
          </p>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-ivory text-center mb-14">
            Pick a style.
          </h2>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl bg-plum p-6 ring-1 ring-plum-line text-center flex flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-2">
                Simple Wish
              </p>
              <p className="font-display font-extrabold text-3xl text-ivory mb-1">₹99</p>
              <p className="text-ivory-muted text-sm mb-4">One message, one recipient.</p>
              <ul className="text-left text-ivory-muted text-xs space-y-1.5 mb-6 flex-1">
                <li>· Name, message &amp; up to 3 photos</li>
                <li>· Choice of accent colour</li>
                <li>· PIN-protected link</li>
              </ul>
              <Link
                href="/builder"
                className="block w-full rounded-full border border-plum-line px-4 py-2.5 text-sm font-semibold text-ivory hover:bg-plum-soft transition-colors"
              >
                Build yours
              </Link>
            </div>

            <div className="relative rounded-3xl bg-plum p-6 ring-2 ring-transparent [background:linear-gradient(#151517,#151517)_padding-box,var(--gradient-accent)_border-box] text-center flex flex-col">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-accent px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-ivory">
                Popular
              </span>
              <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-2">
                Memory Lane
              </p>
              <p className="font-display font-extrabold text-3xl text-ivory mb-1">₹199</p>
              <p className="text-ivory-muted text-sm mb-4">A sequence of photo moments.</p>
              <ul className="text-left text-ivory-muted text-xs space-y-1.5 mb-6 flex-1">
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
            </div>

            <div className="rounded-3xl bg-plum p-6 ring-1 ring-plum-line text-center flex flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-2">
                Time Capsule
              </p>
              <p className="font-display font-extrabold text-3xl text-ivory mb-1">₹299</p>
              <p className="text-ivory-muted text-sm mb-4">Locked until the moment you pick.</p>
              <ul className="text-left text-ivory-muted text-xs space-y-1.5 mb-6 flex-1">
                <li>· Live countdown reveal</li>
                <li>· Up to 5 photos</li>
                <li>· PIN-protected link</li>
              </ul>
              <Link
                href="/builder/tier3"
                className="block w-full rounded-full border border-plum-line px-4 py-2.5 text-sm font-semibold text-ivory hover:bg-plum-soft transition-colors"
              >
                Build yours
              </Link>
            </div>

            <div className="rounded-3xl bg-plum-soft p-6 ring-1 ring-plum-line text-center flex flex-col">
              <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-2">
                White Glove
              </p>
              <p className="font-display font-extrabold text-3xl text-ivory mb-1">From ₹999</p>
              <p className="text-ivory-muted text-sm mb-4">Made by hand, just for this one.</p>
              <ul className="text-left text-ivory-muted text-xs space-y-1.5 mb-6 flex-1">
                <li>· Fully custom design</li>
                <li>· Unlimited photos &amp; video</li>
                <li>· We build it with you, 1:1</li>
              </ul>
              {/* TODO: point this at a real Instagram/WhatsApp contact once set up */}
              <a
                href="https://instagram.com/yourhandle"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-full border border-plum-line px-4 py-2.5 text-sm font-semibold text-ivory hover:bg-plum transition-colors"
              >
                Message us
              </a>
            </div>
          </div>
          <p className="text-xs text-ivory-muted text-center mt-8">
            Tiers 1–3 are preview-before-you-pay. White Glove is handled personally, no builder needed.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-20 md:py-24 border-t border-plum-line">
        <div className="mx-auto max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted text-center mb-3">
            Questions
          </p>
          <h2 className="font-display font-extrabold text-3xl text-ivory text-center mb-12">
            Before you build one
          </h2>
          <Accordion items={FAQ_ITEMS} />
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 py-24 border-t border-plum-line text-center">
        <h2 className="font-display font-black text-3xl sm:text-4xl text-ivory max-w-lg mx-auto mb-6">
          Don&apos;t take our word for it. <span className="text-gradient-accent">Preview it free.</span>
        </h2>
        <Link
          href="/builder"
          className="inline-flex justify-center rounded-full bg-gradient-accent px-8 py-3 font-semibold text-ivory hover:opacity-90 transition-opacity"
        >
          Start building
        </Link>
      </section>

      {/* Footer */}
      <footer className="px-6 py-14 border-t border-plum-line">
        <div className="mx-auto max-w-6xl grid gap-10 sm:grid-cols-3">
          <div>
            <p className="font-display font-extrabold text-ivory mb-2">Surprise Pages</p>
            <p className="text-sm text-ivory-muted">Personalised pages for birthdays and everyday surprises.</p>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-3">Product</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/builder" className="text-ivory-muted hover:text-ivory transition-colors">Simple Wish</Link></li>
              <li><Link href="/builder/tier2" className="text-ivory-muted hover:text-ivory transition-colors">Memory Lane</Link></li>
              <li><Link href="/builder/tier3" className="text-ivory-muted hover:text-ivory transition-colors">Time Capsule</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-ivory-muted mb-3">Company</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/terms" className="text-ivory-muted hover:text-ivory transition-colors">Terms</Link></li>
              <li><Link href="/refunds" className="text-ivory-muted hover:text-ivory transition-colors">Refunds</Link></li>
            </ul>
          </div>
        </div>
      </footer>
    </main>
  );
}
