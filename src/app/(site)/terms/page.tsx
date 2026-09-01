import Link from 'next/link';
import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/components/LegalPage';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Terms of Service · Surprise Pages',
  description:
    'The terms that govern creating and sending a one-time surprise page with Surprise Pages.',
};

const LAST_UPDATED = '27 August 2026';

const link = 'text-marigold-deep underline underline-offset-2 hover:text-marigold';
const mailto = `mailto:${SITE.supportEmail}`;

const sections: LegalSection[] = [
  {
    heading: 'What Surprise Pages is',
    paras: [
      `${SITE.name} is a self-serve tool for creating one-time, personalised gift pages — a message, a photo story, a countdown, or a song — delivered to someone you care about as a private link.`,
      'There are four tiers, each a single one-time purchase. There is no subscription and no recurring charge.',
    ],
  },
  {
    heading: 'No account needed',
    paras: [
      'You do not register an account to create or receive a page. Because there is no login, the private link (and the PIN, if you set one) is what protects a page — anyone who has them can open it, so share them only with the person you intend to.',
    ],
  },
  {
    heading: 'Your content and your responsibilities',
    paras: [
      'You keep ownership of everything you add — your words, photos, and links. You grant us only the limited permission needed to host and display that content so we can deliver the page to your recipient.',
      'You confirm you have the right to use every photo, clip, or song you include. Music and media links point to third-party services and remain governed by those services’ own terms; using them is your responsibility.',
    ],
    bullets: [
      'Do not upload unlawful, infringing, hateful, or harassing content.',
      'Do not use a page to impersonate someone or to deceive the recipient.',
      'We may remove a page that breaks these rules.',
    ],
  },
  {
    heading: 'Payments and pricing',
    paras: [
      'Prices are shown in Indian Rupees (₹) and charged once, through our payment processor Razorpay. White Glove is quoted separately before any work begins.',
      'We may change our prices, but a change never affects a page you have already paid for.',
    ],
  },
  {
    heading: 'Delivery',
    paras: [
      'After a successful payment your page publishes automatically at a private link. Links do not expire on their own.',
      'Once a page is published it cannot be edited, so please review it in the live preview before you pay.',
    ],
  },
  {
    heading: 'Refunds',
    paras: [
      <>
        Because pages are digital and delivered instantly, refunds are limited.
        Full details are in our <Link href="/refunds" className={link}>Refund Policy</Link>.
      </>,
    ],
  },
  {
    heading: 'Availability and liability',
    paras: [
      'The service is provided “as is.” We work to keep it reliable but do not guarantee uninterrupted or error-free operation.',
      'To the fullest extent permitted by law, our total liability for any claim relating to a page is limited to the amount you paid for that page.',
    ],
  },
  {
    heading: 'Changes to these terms',
    paras: [
      'We may update these terms from time to time. When we make a material change we will revise the “last updated” date at the top of this page.',
    ],
  },
  {
    heading: 'Governing law',
    paras: [
      `These terms are governed by the laws of ${SITE.jurisdiction}, and any disputes relating to them are subject to the courts of that jurisdiction.`,
    ],
  },
  {
    heading: 'Contact',
    paras: [
      <>
        Questions about these terms? Email us at{' '}
        <a href={mailto} className={link}>{SITE.supportEmail}</a> or use the{' '}
        <Link href="/contact" className={link}>contact page</Link>.
      </>,
    ],
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={LAST_UPDATED}
      intro={`These terms govern your use of ${SITE.name}, operated by ${SITE.legalEntity}. By creating or sending a surprise page, you agree to them.`}
      sections={sections}
    />
  );
}
