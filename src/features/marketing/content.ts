/**
 * Single source of truth for all landing-page copy and data.
 *
 * This is the concrete implementation that satisfies the LandingContent
 * contract. Components never see these literals directly — they receive typed
 * slices as props — so translating, A/B testing, or CMS-backing the page means
 * replacing this module alone.
 */
import type { LandingContent } from '@/features/marketing/types';
import { illustration } from '@/features/marketing/assets';

// 02h 14m 07s, matching the hero mockup.
const HERO_COUNTDOWN_SECONDS = 2 * 3600 + 14 * 60 + 7;

export const landingContent: LandingContent = {
  brand: {
    name: 'surprise pages',
    tagline: 'One-time gift pages, made in minutes. Built with care in India.',
  },

  nav: {
    links: [
      { label: 'how it works', href: '#how' },
      { label: 'pricing', href: '#pricing' },
      { label: 'faq', href: '#faq' },
    ],
    cta: { label: 'create a page', href: '/builder' },
  },

  hero: {
    eyebrow: 'one-time gift links · made in India',
    titleLead: 'Turn a gift into',
    titleScript: 'a moment they keep.',
    lede:
      'Build a one-time surprise page with photos, a countdown, or a song — ready to send in minutes. No account, no app, just a link.',
    primaryCta: { label: 'start your page →', href: '/builder' },
    secondaryCta: { label: 'see how it works', href: '#how' },
    image: illustration('envelope.webp', 'A girl in a red scarf holding a sealed heart letter', 576, 780),
    giftCard: {
      lockGlyph: '🔒',
      label: 'unlocks in',
      initialSeconds: HERO_COUNTDOWN_SECONDS,
      recipient: 'for Priya, from Rohan',
    },
  },

  trust: {
    items: [
      'no signup needed',
      'UPI, cards & netbanking',
      'delivered as a private link',
      'made in India',
    ],
  },

  beforeAfter: {
    eyebrow: 'the whole point',
    title: ['You send it nervous.', 'They open it stunned.'],
    before: {
      tag: '10:58pm · the night before',
      image: illustration('nervous.webp', 'Nervous sender the night before', 689, 780),
      quote: '“Did I pick the right photo? Is the song too much?”',
      caption: 'Every sender second-guesses. That’s how you know it matters.',
    },
    after: {
      tag: 'the moment it unlocks',
      image: illustration('joy.webp', 'The recipient, delighted', 668, 780),
      quote: 'Then the link opens — and the room goes quiet.',
      caption: 'Countdown, photos, the song they forgot you both loved.',
    },
    transferLabel: 'link sent',
    punchLead: 'That reaction — ',
    punchScript: 'that’s the whole product.',
  },

  howItWorks: {
    eyebrow: 'how it works',
    title: 'Three steps, no design skill needed',
    subtitle: 'From blank page to sent link, faster than wrapping a real gift.',
    steps: [
      {
        image: illustration('letter.webp', '', 757, 482),
        title: 'Write your heart out',
        body: 'Pick a tier that fits the moment, then add your message — we handle the pretty part.',
      },
      {
        image: illustration('offer.webp', '', 732, 780),
        title: 'Add photos, a song, a memory',
        body: 'Drop in the moments that matter. Set a countdown so it unlocks at the perfect time.',
      },
      {
        image: illustration('ribbonheart.webp', '', 750, 735),
        title: 'Send one private link',
        body: 'Pay once, get a link, send it. No accounts on either end — it opens whenever they click.',
      },
    ],
  },

  emotionBand: {
    eyebrow: 'why people love it',
    title: ['A whole feeling,', 'folded into one link.'],
    body: 'Not a card that gets recycled. Not a text that scrolls away. A little page they can open again on the hard days — and feel exactly the way they did the first time.',
    image: illustration('hugheart.webp', 'A girl holding a big red heart', 720, 780),
  },

  pricing: {
    eyebrow: 'pricing',
    title: 'Four ways to make it theirs',
    subtitle: 'Every tier is a one-time link — no accounts, no subscriptions.',
    decoration: illustration('crown1.webp', '', 624, 780),
    tiers: [
      {
        name: 'Simple Wish',
        description: 'A message and a photo, sent fast.',
        price: '₹99',
        priceNote: 'one-time',
        cta: { label: 'choose this', href: '/builder' },
        swatch: 'var(--amber)',
        highlights: [
          'One photo + your message',
          'Ready to send in minutes',
          'Link never expires',
        ],
      },
      {
        name: 'Memory Lane',
        description: 'A whole photo story, laid out.',
        price: '₹199',
        priceNote: 'one-time',
        cta: { label: 'choose this', href: '/builder/tier2' },
        swatch: 'var(--red)',
        highlights: [
          'Up to 10 photos, arranged',
          'Add a song or a voice note',
          'Everything in Simple Wish',
        ],
      },
      {
        name: 'Time Capsule',
        description: 'Locked until the moment it opens.',
        price: '₹299',
        priceNote: 'one-time',
        cta: { label: 'choose this', href: '/builder/tier3' },
        swatch: 'var(--wine)',
        highlights: [
          'Locks until the big moment',
          'A live countdown reveal',
          'Everything in Memory Lane',
        ],
        featured: true,
        badge: 'most loved',
      },
      {
        name: 'White Glove',
        description: 'We build it with you, by hand.',
        price: 'from ₹999',
        priceNote: 'custom quote',
        cta: { label: 'get in touch', href: '/builder/white-glove' },
        swatch: 'var(--ink)',
        highlights: [
          'A designer builds it with you',
          'Unlimited photos & sections',
          'Priority support',
        ],
      },
    ],
  },

  testimonials: {
    eyebrow: 'from real senders',
    title: 'Real reactions, real people',
    decoration: illustration('leaf.webp', '', 686, 780),
    items: [
      {
        quote: 'Sent this to my mom on her birthday — she watched the countdown all week.',
        author: 'Rohan, Mumbai',
        initial: 'R',
      },
      {
        quote: 'Took me five minutes to build and my best friend cried happy tears.',
        author: 'Ananya, Pune',
        initial: 'A',
      },
      {
        quote: 'The White Glove tier felt like getting a gift wrapped by a friend, not a form.',
        author: 'Kabir, Delhi',
        initial: 'K',
      },
    ],
  },

  faq: {
    eyebrow: 'a few things people ask',
    title: ['Still', 'wondering?'],
    decoration: illustration('profile.webp', '', 524, 780),
    items: [
      {
        question: 'Do I need to make an account?',
        answer: 'No. Pick a tier, fill it in, pay, and you get a link. Nothing to sign up for on either end.',
        defaultOpen: true,
      },
      {
        question: 'What if they don’t open it right away?',
        answer: 'The link doesn’t expire on its own — it’s ready whenever they click it.',
      },
      {
        question: 'Can I edit it after I’ve sent the link?',
        answer: 'Not once it’s published — so it’s worth a once-over in the live preview before you pay.',
      },
      {
        question: 'What payment methods work?',
        answer: 'Cards, UPI, and netbanking, all through Razorpay.',
      },
    ],
  },

  finalCta: {
    title: 'Make someone’s day today',
    body: 'It takes less time than picking a card — and lasts a great deal longer.',
    cta: { label: 'start your page →', href: '/builder' },
    image: illustration('lying.webp', 'A girl resting under falling autumn leaves', 520, 780),
  },

  footer: {
    columns: [
      {
        heading: 'Product',
        links: [
          { label: 'Simple Wish', href: '/builder' },
          { label: 'Memory Lane', href: '/builder/tier2' },
          { label: 'Time Capsule', href: '/builder/tier3' },
          { label: 'White Glove', href: '/builder/white-glove' },
        ],
      },
      {
        heading: 'Company',
        links: [
          { label: 'About', href: '#top', external: true },
          { label: 'Examples', href: '#pricing', external: true },
          { label: 'Contact', href: '#faq', external: true },
        ],
      },
      {
        heading: 'Support',
        links: [
          { label: 'Terms', href: '/terms' },
          { label: 'Refunds', href: '/refunds' },
          { label: 'Help', href: '#faq', external: true },
        ],
      },
    ],
    copyright: '© surprise pages',
    meta: 'made in India · ₹ pricing · Razorpay',
  },
};

