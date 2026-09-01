import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/marketing/ui/Reveal';
import { Eyebrow } from '@/components/marketing/ui/Eyebrow';
import { SiteFooter } from '@/components/marketing/sections/SiteFooter';
import { ContactForm } from '@/components/marketing/ContactForm';
import { landingContent } from '@/components/marketing/content';
import { contactContent } from '@/components/marketing/pages.content';
import { SITE } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'Contact · Surprise Pages',
  description: contactContent.lede,
};

export default function ContactPage() {
  const c = contactContent;
  const mailto = `mailto:${SITE.supportEmail}`;

  return (
    <>
      <header className="sp-phero">
        <div className="sp-wrap">
          <Reveal className="in">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1>{c.title}</h1>
            <p className="lede">{c.lede}</p>
          </Reveal>
        </div>
      </header>

      <section className="sp-sec">
        <div className="sp-wrap">
          <div className="sp-contact">
            <Reveal as="div" className="sp-contact-aside">
              <h2>{c.aside.heading}</h2>
              <p>{c.aside.body}</p>
              <p>
                <a className="big" href={mailto}>
                  {SITE.supportEmail}
                </a>
              </p>
              <p>{c.aside.responseTime}</p>
              <p>
                {c.aside.faqLead}
                <Link className="sp-alink" href={c.aside.faqLink.href}>
                  {c.aside.faqLink.label}
                </Link>
              </p>
            </Reveal>

            <ContactForm />
          </div>
        </div>
      </section>

      <SiteFooter brand={landingContent.brand} footer={landingContent.footer} />
    </>
  );
}
