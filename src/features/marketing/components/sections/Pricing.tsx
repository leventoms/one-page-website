/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Reveal } from '@/features/marketing/components/ui/Reveal';
import { SectionHeading } from '@/features/marketing/components/ui/SectionHeading';
import type { PricingContent, PricingTier } from '@/features/marketing/types';

function Tier({ tier }: { tier: PricingTier }) {
  return (
    <Reveal
      className={tier.featured ? 'sp-tier feat' : 'sp-tier'}
      style={{ ['--tier']: tier.swatch } as CSSProperties}
    >
      {tier.badge ? <span className="loved">{tier.badge}</span> : null}

      <div className="sp-tier-cap">
        <h3>{tier.name}</h3>
        <div className="sp-tier-tag">
          <span className="amt">{tier.price}</span>
          <span className="note">{tier.priceNote}</span>
        </div>
      </div>

      <div className="sp-tier-body">
        <p className="desc">{tier.description}</p>
        {tier.highlights && tier.highlights.length > 0 ? (
          <ul className="feats">
            {tier.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        ) : null}
        <Link className="pick" href={tier.cta.href}>
          {tier.cta.label}
        </Link>
      </div>
    </Reveal>
  );
}

export function Pricing({ content }: { content: PricingContent }) {
  const { decoration } = content;

  return (
    <section className="sp-sec sp-pricing" id="pricing">
      <div className="sp-wrap">
        {/* Decorative "presenter" illustration — desktop only, sits in the
            heading's right gutter and peeks from behind the cards. */}
        <img
          className="sp-pricing-deco"
          src={decoration.src}
          width={decoration.width}
          height={decoration.height}
          alt={decoration.alt}
        />
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
