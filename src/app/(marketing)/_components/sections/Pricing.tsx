/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { PricingContent, PricingTier } from '../../_types/landing.types';

function Tier({ tier }: { tier: PricingTier }) {
  return (
    <Reveal className={tier.featured ? 'sp-tier feat' : 'sp-tier'}>
      {tier.badge ? <span className="loved">{tier.badge}</span> : null}
      <div className="swatch" style={{ background: tier.swatch }} />
      <h3>{tier.name}</h3>
      <p className="desc">{tier.description}</p>
      <div className="price">
        {tier.price}
        <small>{tier.priceNote}</small>
      </div>
      <Link className="pick" href={tier.cta.href}>
        {tier.cta.label}
      </Link>
    </Reveal>
  );
}

export function Pricing({ content }: { content: PricingContent }) {
  const { decoration } = content;

  return (
    <section className="sp-sec sp-pricing" id="pricing">
      <img
        src={decoration.src}
        width={decoration.width}
        height={decoration.height}
        alt={decoration.alt}
        style={{
          position: 'absolute',
          left: '2%',
          top: 40,
          width: 120,
          opacity: 0.9,
          pointerEvents: 'none',
        }}
      />
      <div className="sp-wrap">
        <Reveal>
          <SectionHeading
            center
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
          />
        </Reveal>
        <div className="sp-tiers">
          {content.tiers.map((tier) => (
            <Tier key={tier.name} tier={tier} />
          ))}
        </div>
      </div>
    </section>
  );
}
