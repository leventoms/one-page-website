import Link from 'next/link';
import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/features/legal/LegalPage';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Refund Policy · Surprise Pages',
  description:
    'How refunds work for Surprise Pages — one-time digital gift pages delivered instantly.',
};

const LAST_UPDATED = '27 August 2026';

const link = 'text-marigold-deep underline underline-offset-2 hover:text-marigold';
const mailto = `mailto:${SITE.supportEmail}`;

const sections: LegalSection[] = [
  {
    heading: 'Digital, delivered instantly',
    paras: [
      'A surprise page is a digital product. It publishes automatically the moment your payment succeeds, so — as with most instantly-delivered digital goods — we generally cannot refund a purchase simply because you changed your mind after the page was created.',
    ],
  },
  {
    heading: 'When we will refund you',
    paras: ['We will issue a full refund if any of the following happen:'],
    bullets: [
      'Your payment succeeded but the page failed to publish or deliver because of a technical fault on our side.',
      'You were charged more than once for the same page.',
      'You were charged in clear error (for example, a billing mistake).',
    ],
  },
  {
    heading: 'Please request within 7 days',
    paras: [
      'Tell us within 7 days of the payment so we can look into it while the details are fresh. Include your payment reference from Razorpay.',
    ],
  },
  {
    heading: 'When we can’t refund',
    bullets: [
      'A change of mind after the page has been delivered.',
      'A mistake in your own content — a wrong photo, name, or message — since you review the page in the live preview before paying and pages can’t be edited once published.',
      'The recipient not opening the link, or opening it later than you hoped.',
    ],
  },
  {
    heading: 'White Glove',
    paras: [
      'White Glove is a custom, hand-built service. Any deposit and its refund terms are agreed with you in writing before work starts, and are handled case by case.',
    ],
  },
  {
    heading: 'How to request a refund',
    paras: [
      <>
        Email <a href={mailto} className={link}>{SITE.supportEmail}</a> or use the{' '}
        <Link href="/contact" className={link}>contact page</Link>, with your payment
        reference and a short note about what went wrong. We reply within 2 business days.
      </>,
    ],
  },
  {
    heading: 'How refunds are issued',
    paras: [
      'Approved refunds are returned to your original payment method through Razorpay. Depending on your bank, the amount typically appears within 5–7 business days.',
    ],
  },
];

export default function RefundsPage() {
  return (
    <LegalPage
      title="Refund Policy"
      lastUpdated={LAST_UPDATED}
      intro="Surprise Pages are one-time digital products delivered instantly, which shapes how refunds work. Here is our policy in plain terms."
      sections={sections}
    />
  );
}
