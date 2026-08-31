import Link from 'next/link';
import type { Metadata } from 'next';
import { LegalPage, type LegalSection } from '@/features/legal/LegalPage';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Privacy Policy · Surprise Pages',
  description:
    'What Surprise Pages collects when you create or receive a gift page, and how it is used.',
};

const LAST_UPDATED = '27 August 2026';

const link = 'text-marigold-deep underline underline-offset-2 hover:text-marigold';
const mailto = `mailto:${SITE.supportEmail}`;

const sections: LegalSection[] = [
  {
    heading: 'What we collect',
    paras: ['To create and deliver a page, we collect only what the page needs:'],
    bullets: [
      'The recipient’s name and your message.',
      'Your contact email, so we can send you the link and reach you about your order.',
      'Any photo or song links you choose to add.',
      <>
        Payment is handled entirely by Razorpay. <strong className="text-ink">We never
        see or store your card or UPI details.</strong>
      </>,
    ],
  },
  {
    heading: 'How we use it',
    bullets: [
      'To build, publish, and deliver your surprise page.',
      'To email you about your order — or, for a “build it for me” request, to email our team your brief.',
      'To process your payment through Razorpay.',
      'To keep the service secure and prevent abuse.',
    ],
  },
  {
    heading: 'Who processes your data',
    paras: ['We rely on a small number of trusted providers, each receiving only what it needs:'],
    bullets: [
      'Supabase — hosts the database where your order and page content are stored.',
      'Razorpay — processes payments.',
      'Resend — sends transactional email (such as order and request notifications).',
    ],
  },
  {
    heading: 'Cookies',
    paras: [
      'We do not use advertising or cross-site tracking cookies. We use only the essential storage needed to operate the site.',
    ],
  },
  {
    heading: 'How long we keep it',
    paras: [
      'We keep a page and its content while the page is live, so your recipient can open the link. You can ask us to remove a page and its data at any time.',
    ],
  },
  {
    heading: 'Your choices',
    paras: [
      <>
        To access or delete your data, or to take down a page you created, email{' '}
        <a href={mailto} className={link}>{SITE.supportEmail}</a> or use the{' '}
        <Link href="/contact" className={link}>contact page</Link>.
      </>,
    ],
  },
  {
    heading: 'Children',
    paras: [
      'The service is not directed at children under 13, and it should not be used to collect their personal information.',
    ],
  },
  {
    heading: 'Changes to this policy',
    paras: [
      'If we change how we handle your data, we will update this page and revise the “last updated” date above.',
    ],
  },
  {
    heading: 'Contact',
    paras: [
      <>
        Questions about your privacy? Email{' '}
        <a href={mailto} className={link}>{SITE.supportEmail}</a>.
      </>,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      lastUpdated={LAST_UPDATED}
      intro="This explains what we collect when you create or receive a surprise page, and what we do with it."
      sections={sections}
    />
  );
}
