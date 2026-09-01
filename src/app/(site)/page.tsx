import './landing.css';

import { fontVariables } from '@/components/marketing/typography';
import { landingContent } from '@/components/marketing/content';
import { FallingLeaves } from '@/components/marketing/effects/FallingLeaves';
import {
  Hero,
  TrustStrip,
  BeforeAfter,
  HowItWorks,
  EmotionBand,
  Pricing,
  Testimonials,
  Faq,
  FinalCta,
} from '@/components/marketing/LandingSections';
import { SiteFooter } from '@/components/marketing/sections/SiteFooter';

/**
 * Composition root for the marketing landing page.
 *
 * This component does one thing: assemble the sections in order and hand each
 * its slice of content. It holds no copy, no layout details, and no effect
 * logic — those live in content.ts, landing.css, and the section/effect
 * components respectively. To reorder, add, or remove a section, edit only
 * this file; to change wording, edit only content.ts.
 *
 * NOTE: the shared site nav is rendered by app/(site)/layout.tsx; this
 * page composes only the sections and the footer.
 */
export default function Page() {
  const c = landingContent;

  return (
    <div className={`sp-landing ${fontVariables}`}>
      <FallingLeaves />

      <Hero content={c.hero} />
      <TrustStrip content={c.trust} />
      <BeforeAfter content={c.beforeAfter} />
      <HowItWorks content={c.howItWorks} />
      <EmotionBand content={c.emotionBand} />
      <Pricing content={c.pricing} />
      <Testimonials content={c.testimonials} />
      <Faq content={c.faq} />
      <FinalCta content={c.finalCta} />

      <SiteFooter brand={c.brand} footer={c.footer} />
    </div>
  );
}
