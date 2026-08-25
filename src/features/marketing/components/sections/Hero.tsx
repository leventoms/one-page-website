/* eslint-disable @next/next/no-img-element */
import { Reveal } from '@/features/marketing/components/ui/Reveal';
import { Button } from '@/features/marketing/components/ui/Button';
import { Eyebrow } from '@/features/marketing/components/ui/Eyebrow';
import { CountdownBadge } from '@/features/marketing/components/effects/CountdownBadge';
import type { HeroContent } from '@/features/marketing/types';

export function Hero({ content }: { content: HeroContent }) {
  const { image } = content;

  return (
    <header className="sp-hero" id="top">
      <div className="sp-wrap sp-hero-grid">
        <Reveal className="in">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h1 style={{ marginTop: '.35em' }}>
            {content.titleLead}
            <span className="sp-script">{content.titleScript}</span>
          </h1>
          <p className="lede">{content.lede}</p>
          <div className="sp-hero-cta">
            <Button href={content.primaryCta.href} variant="red">
              {content.primaryCta.label}
            </Button>
            <Button href={content.secondaryCta.href} variant="ghost" external>
              {content.secondaryCta.label}
            </Button>
          </div>
        </Reveal>

        <Reveal className="sp-hero-art in">
          <div className="sp-blob" />
          <img
            className="person"
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
          />
          <CountdownBadge giftCard={content.giftCard} />
        </Reveal>
      </div>
    </header>
  );
}
