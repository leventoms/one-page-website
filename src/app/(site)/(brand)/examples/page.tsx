/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/marketing/ui/Reveal';
import { Button } from '@/components/marketing/ui/Button';
import { Eyebrow } from '@/components/marketing/ui/Eyebrow';
import { SiteFooter } from '@/components/marketing/sections/SiteFooter';
import { landingContent } from '@/components/marketing/content';
import { galleryContent } from '@/components/marketing/pages.content';

export const metadata: Metadata = {
  title: 'Examples · Surprise Pages',
  description: galleryContent.lede,
};

export default function ExamplesPage() {
  const c = galleryContent;

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
          <div className="sp-gallery">
            {c.samples.map((sample) => (
              <Reveal
                as="article"
                key={sample.title}
                className="sp-gcard"
                style={{ '--tier': sample.swatch } as CSSProperties}
              >
                <div className="sp-gpreview">
                  <span className="sp-gchip">{sample.tierLabel}</span>
                  <img
                    src={sample.image.src}
                    width={sample.image.width}
                    height={sample.image.height}
                    alt={sample.image.alt}
                  />
                </div>
                <div className="sp-gbody">
                  <span className="occ">{sample.occasion}</span>
                  <h3>{sample.title}</h3>
                  <p className="quote">{sample.quote}</p>
                  <Link className="make" href={sample.builderHref}>
                    make one like this →
                  </Link>
                </div>
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
