import './landing.css';

import { fontVariables } from './_lib/typography';
import { landingContent } from './_content/landing.content';
import { FallingLeaves } from './_components/effects/FallingLeaves';
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
  SiteFooter,
} from './_components/sections';

/**
 * Composition root for the marketing landing page.
 *
 * This component does one thing: assemble the sections in order and hand each
 * its slice of content. It holds no copy, no layout details, and no effect
 * logic — those live in _content, landing.css, and the section/effect
 * components respectively. To reorder, add, or remove a section, edit only
 * this file; to change wording, edit only _content/landing.content.ts.
 *
 * NOTE: NavBar and SiteFooter are included here for a standalone page. If
 * app/(marketing)/layout.tsx already renders a site nav and/or footer, remove
 * the corresponding lines below to avoid duplicates.
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
