/**
 * Domain types for the marketing landing page.
 *
 * Every section component depends on one of these interfaces rather than on
 * concrete, hard-coded copy (Dependency Inversion). Because the content lives
 * behind these abstractions, the page can be re-skinned or localized by
 * swapping the content module alone, with the components closed for
 * modification (Open/Closed).
 */

/** A static illustration served from /public. */
export interface ImageAsset {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
}

/** A navigable link. `external` routes through a plain <a> instead of <Link>. */
export interface LinkItem {
  readonly label: string;
  readonly href: string;
  readonly external?: boolean;
}

export interface BrandContent {
  readonly name: string;
  readonly tagline: string;
}

export interface NavContent {
  readonly links: ReadonlyArray<LinkItem>;
  readonly cta: LinkItem;
}

export interface GiftCardContent {
  readonly lockGlyph: string;
  readonly label: string;
  /** Seconds remaining when the page loads; the badge counts down from here. */
  readonly initialSeconds: number;
  readonly recipient: string;
}

export interface HeroContent {
  readonly eyebrow: string;
  readonly titleLead: string;
  readonly titleScript: string;
  readonly lede: string;
  readonly primaryCta: LinkItem;
  readonly secondaryCta: LinkItem;
  readonly image: ImageAsset;
  readonly giftCard: GiftCardContent;
}

export interface TrustContent {
  readonly items: ReadonlyArray<string>;
}

export interface BeforeAfterPanel {
  readonly tag: string;
  readonly image: ImageAsset;
  readonly quote: string;
  readonly caption: string;
}

export interface BeforeAfterContent {
  readonly eyebrow: string;
  readonly title: ReadonlyArray<string>;
  readonly before: BeforeAfterPanel;
  readonly after: BeforeAfterPanel;
  readonly transferLabel: string;
  readonly punchLead: string;
  readonly punchScript: string;
}

export interface HowItWorksStep {
  readonly image: ImageAsset;
  readonly title: string;
  readonly body: string;
}

export interface HowItWorksContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly steps: ReadonlyArray<HowItWorksStep>;
}

export interface EmotionBandContent {
  readonly eyebrow: string;
  readonly title: ReadonlyArray<string>;
  readonly body: string;
  readonly image: ImageAsset;
}

export interface PricingTier {
  readonly name: string;
  readonly description: string;
  readonly price: string;
  readonly priceNote: string;
  readonly cta: LinkItem;
  /** CSS custom-property expression used for the swatch, e.g. "var(--red)". */
  readonly swatch: string;
  /** Short, scannable perks shown as a checklist on the card. */
  readonly highlights?: ReadonlyArray<string>;
  readonly featured?: boolean;
  readonly badge?: string;
}

export interface PricingContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly decoration: ImageAsset;
  readonly tiers: ReadonlyArray<PricingTier>;
}

export interface Testimonial {
  readonly quote: string;
  readonly author: string;
  readonly initial: string;
}

export interface TestimonialsContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly decoration: ImageAsset;
  readonly items: ReadonlyArray<Testimonial>;
}

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
  readonly defaultOpen?: boolean;
}

export interface FaqContent {
  readonly eyebrow: string;
  readonly title: ReadonlyArray<string>;
  readonly decoration: ImageAsset;
  readonly items: ReadonlyArray<FaqItem>;
}

export interface FinalCtaContent {
  readonly title: string;
  readonly body: string;
  readonly cta: LinkItem;
  readonly image: ImageAsset;
}

export interface FooterColumn {
  readonly heading: string;
  readonly links: ReadonlyArray<LinkItem>;
}

export interface FooterContent {
  readonly columns: ReadonlyArray<FooterColumn>;
  readonly copyright: string;
  readonly meta: string;
}

/** The full content contract for the landing page. */
export interface LandingContent {
  readonly brand: BrandContent;
  readonly nav: NavContent;
  readonly hero: HeroContent;
  readonly trust: TrustContent;
  readonly beforeAfter: BeforeAfterContent;
  readonly howItWorks: HowItWorksContent;
  readonly emotionBand: EmotionBandContent;
  readonly pricing: PricingContent;
  readonly testimonials: TestimonialsContent;
  readonly faq: FaqContent;
  readonly finalCta: FinalCtaContent;
  readonly footer: FooterContent;
}

/* ------------------------------------------------------------------ *
 * Brand sub-pages (About / Contact / Examples)
 *
 * These share the same content-as-data convention as the landing page:
 * pages stay presentational and read their copy from pages.content.ts.
 * ------------------------------------------------------------------ */

/** A closing "start your page" band reused across the brand pages. */
export interface BrandCta {
  readonly title: string;
  readonly body: string;
  readonly link: LinkItem;
}

export interface AboutValue {
  readonly image: ImageAsset;
  readonly title: string;
  readonly body: string;
}

export interface AboutContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly lede: string;
  readonly story: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paras: ReadonlyArray<string>;
  };
  readonly values: {
    readonly eyebrow: string;
    readonly title: string;
    readonly items: ReadonlyArray<AboutValue>;
  };
  readonly cta: BrandCta;
}

export interface ContactContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly lede: string;
  readonly aside: {
    readonly heading: string;
    readonly body: string;
    readonly responseTime: string;
    readonly faqLead: string;
    readonly faqLink: LinkItem;
  };
}

export interface GallerySample {
  readonly occasion: string;
  readonly title: string;
  readonly tierLabel: string;
  /** CSS expression for the card's accent panel, e.g. "var(--wine)". */
  readonly swatch: string;
  readonly quote: string;
  readonly image: ImageAsset;
  /** Where "make one like this" sends the visitor. */
  readonly builderHref: string;
}

export interface GalleryContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly lede: string;
  readonly samples: ReadonlyArray<GallerySample>;
  readonly cta: BrandCta;
}
