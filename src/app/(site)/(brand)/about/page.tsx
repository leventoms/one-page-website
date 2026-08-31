/* eslint-disable @next/next/no-img-element */
import type { Metadata } from 'next';
import { Reveal } from '@/features/marketing/components/ui/Reveal';
import { Button } from '@/features/marketing/components/ui/Button';
import { Eyebrow } from '@/features/marketing/components/ui/Eyebrow';
import { SectionHeading } from '@/features/marketing/components/ui/SectionHeading';
import { SiteFooter } from '@/features/marketing/components/sections';
import { landingContent } from '@/features/marketing/content';
import { aboutContent } from '@/features/marketing/pages.content';

export const metadata: Metadata = {
  title: 'About · Surprise Pages',
  description: aboutContent.lede,
};

export default function AboutPage() {
  const c = aboutContent;

  return (
    <>
      <header className="sp-phero">
        <div className="sp-wrap">
          <Reveal className="in">
            <Eyebrow>{c.eyebrow}</Eyebrow>
            <h1>{c.title}</h1>
            <p className="lede">{c.lede}</p>
            <div className="sp-phero-cta">
              <Button href={c.cta.link.href} variant="red">
                {c.cta.link.label}
              </Button>
              <Button href="/examples" variant="ghost">
                see examples
              </Button>
            </div>
          </Reveal>
        </div>
      </header>

      <section className="sp-sec">
        <div className="sp-wrap">
          <SectionHeading center eyebrow={c.story.eyebrow} title={c.story.title} />
          <Reveal className="sp-prose">
            {c.story.paras.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="sp-sec sp-soft">
        <div className="sp-wrap">
          <SectionHeading center eyebrow={c.values.eyebrow} title={c.values.title} />
          <div className="sp-steps">
            {c.values.items.map((value) => (
              <Reveal as="div" className="sp-step" key={value.title}>
                <div className="art">
                  <img
                    src={value.image.src}
                    width={value.image.width}
                    height={value.image.height}
                    alt={value.image.alt}
                  />
                </div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="sp-sec sp-cta-band">
        <div className="sp-wrap">
          <Reveal className="in">
            <h2>{c.cta.title}</h2>
            <p>{c.cta.body}</p>
            <Button href={c.cta.link.href} variant="cream">
              {c.cta.link.label}
            </Button>
          </Reveal>
        </div>
      </section>

      <SiteFooter brand={landingContent.brand} footer={landingContent.footer} />
    </>
  );
}
