/**
 * Copy + data for the brand sub-pages (About, Contact, Examples).
 *
 * Kept separate from the landing page's content.ts but follows the same
 * convention: the pages stay presentational and read their copy from here, so
 * wording changes never touch component markup (Open/Closed).
 */
import type { AboutContent, ContactContent, GalleryContent } from '@/features/marketing/types';
import { illustration } from '@/features/marketing/assets';

export const aboutContent: AboutContent = {
  eyebrow: 'our story',
  title: 'Gifts worth keeping',
  lede:
    'Surprise Pages began with a simple frustration: the gifts we cared about most were the hardest to send well. So we built a way to fold a whole feeling into one link.',
  story: {
    eyebrow: 'why we made it',
    title: 'A card gets recycled. A page gets reopened.',
    paras: [
      'A paper card says its piece once and ends up in a drawer. A text scrolls away by morning. We wanted the opposite — something small and personal you could open on your birthday, then open again on a hard day months later and feel exactly the way you did the first time.',
      'So we made surprise pages: one-time gift links you build in minutes. A message, a photo story, a countdown that unlocks at midnight, a song you both forgot you loved. No app to download, no account to make — just a private link you send to one person.',
      'We’re a small team building this by hand in India, for the way people here actually celebrate — over UPI, at odd hours, for the people who matter most.',
    ],
  },
  values: {
    eyebrow: 'what we care about',
    title: 'Small things, done with care',
    items: [
      {
        image: illustration('letter.webp', 'A handwritten letter', 757, 482),
        title: 'Made for the moment',
        body: 'Every tier is shaped around a real occasion — a quiet birthday wish, a whole photo story, or a countdown to the big reveal.',
      },
      {
        image: illustration('ribbonheart.webp', 'A heart tied with a ribbon', 750, 735),
        title: 'Built to be reopened',
        body: 'A page doesn’t expire. It waits at its link, ready to be opened again whenever they need to feel it.',
      },
      {
        image: illustration('hugheart.webp', 'Someone holding a big red heart', 720, 780),
        title: 'Personal, not corporate',
        body: 'No sign-ups, no data-mining, no noise. Just your words and your photos, delivered privately to one person.',
      },
    ],
  },
  cta: {
    title: 'Make someone’s day today',
    body: 'It takes less time than picking a card — and lasts a great deal longer.',
    link: { label: 'start your page →', href: '/builder' },
  },
};

export const contactContent: ContactContent = {
  eyebrow: 'say hello',
  title: 'Get in touch',
  lede:
    'A question about a page you’re building, a refund, or a custom idea? We’re a small team, and we read every message.',
  aside: {
    heading: 'Email us directly',
    body: 'Already know what you need? This is the fastest way to reach us.',
    responseTime: 'We usually reply within a day or two, Monday to Saturday.',
    faqLead: 'Quick question about how it works? ',
    faqLink: { label: 'Most answers are in the FAQ →', href: '/#faq' },
  },
};

export const galleryContent: GalleryContent = {
  eyebrow: 'the gallery',
  title: 'A page for every kind of moment',
  lede:
    'A few examples of what people send. Every one started as a blank builder — pick the closest and make it yours.',
  samples: [
    {
      occasion: 'Birthday',
      title: 'For Priya, turning 25',
      tierLabel: 'Time Capsule',
      swatch: 'var(--wine)',
      quote: 'A midnight countdown, then twelve photos from the last twelve years.',
      image: illustration('offer.webp', 'A wrapped birthday gift', 732, 780),
      builderHref: '/builder/tier3',
    },
    {
      occasion: 'Anniversary',
      title: 'Two years — Aarav & Meera',
      tierLabel: 'Memory Lane',
      swatch: 'var(--red)',
      quote: 'Their whole story, one photo at a time, closing on the song from the first dance.',
      image: illustration('ribbonheart.webp', 'A heart tied with a ribbon', 750, 735),
      builderHref: '/builder/tier2',
    },
    {
      occasion: 'Just because',
      title: 'For Mom, on a Tuesday',
      tierLabel: 'Simple Wish',
      swatch: 'var(--amber)',
      quote: 'One photo, a few honest lines, sent for no reason at all.',
      image: illustration('letter.webp', 'A handwritten letter', 757, 482),
      builderHref: '/builder',
    },
    {
      occasion: 'Long distance',
      title: 'For Ishaan, an ocean away',
      tierLabel: 'Memory Lane',
      swatch: 'var(--red)',
      quote: 'Snapshots from home, laid out in the order you’d walk through the house.',
      image: illustration('hugheart.webp', 'Someone holding a big red heart', 720, 780),
      builderHref: '/builder/tier2',
    },
    {
      occasion: 'The big question',
      title: 'Will you, Ananya?',
      tierLabel: 'Time Capsule',
      swatch: 'var(--wine)',
      quote: 'Locked until 8pm — then a countdown, a question, and a single photo.',
      image: illustration('joy.webp', 'A delighted person', 668, 780),
      builderHref: '/builder/tier3',
    },
    {
      occasion: 'Farewell',
      title: 'For the whole team',
      tierLabel: 'White Glove',
      swatch: 'var(--ink)',
      quote: 'Forty notes from forty colleagues, hand-arranged into one page.',
      image: illustration('crown1.webp', 'A small paper crown', 624, 780),
      builderHref: '/builder/white-glove',
    },
  ],
  cta: {
    title: 'Found one that fits?',
    body: 'Start from the closest example, or open a blank builder and make it yours.',
    link: { label: 'start your page →', href: '/builder' },
  },
};
