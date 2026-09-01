/* eslint-disable @next/next/no-img-element */
import { Fragment, type CSSProperties } from 'react';
import Link from 'next/link';
import { Button, LinkButton } from '@/components/marketing/ui/Button';
import { Eyebrow } from '@/components/marketing/ui/Eyebrow';
import { Reveal } from '@/components/marketing/ui/Reveal';
import { SectionHeading } from '@/components/marketing/ui/SectionHeading';
import { CountdownBadge } from '@/components/marketing/effects/CountdownBadge';
import type {
  BeforeAfterContent, BeforeAfterPanel, EmotionBandContent, FaqContent, FaqItem,
  FinalCtaContent, HeroContent, HowItWorksContent, HowItWorksStep, PricingContent,
  PricingTier, Testimonial, TestimonialsContent, TrustContent,
} from '@/components/marketing/types';

export function Hero({ content }: { content: HeroContent }) {
  const { image } = content;
  return <header className="sp-hero" id="top"><div className="sp-wrap sp-hero-grid">
    <Reveal className="in"><Eyebrow>{content.eyebrow}</Eyebrow><h1 style={{ marginTop: '.35em' }}>{content.titleLead}<span className="sp-script">{content.titleScript}</span></h1><p className="lede">{content.lede}</p><div className="sp-hero-cta"><Button href={content.primaryCta.href} variant="red">{content.primaryCta.label}</Button><Button href={content.secondaryCta.href} variant="ghost" external>{content.secondaryCta.label}</Button></div></Reveal>
    <Reveal className="sp-hero-art in"><div className="sp-blob" /><img className="person" src={image.src} width={image.width} height={image.height} alt={image.alt} /><CountdownBadge giftCard={content.giftCard} /></Reveal>
  </div></header>;
}

export function TrustStrip({ content }: { content: TrustContent }) {
  return <div className="sp-trust"><div className="sp-wrap">{content.items.map((item, i) => <Fragment key={item}><span className="it"><span className="tick">✓</span> {item}</span>{i < content.items.length - 1 ? <span className="sep">·</span> : null}</Fragment>)}</div></div>;
}

export function EmotionBand({ content }: { content: EmotionBandContent }) {
  const { image } = content;
  return <section className="sp-band sp-sec"><div className="sp-wrap"><Reveal><img className="bigart" src={image.src} width={image.width} height={image.height} alt={image.alt} /></Reveal><Reveal><Eyebrow>{content.eyebrow}</Eyebrow><h2>{content.title.map((line, i) => <Fragment key={line}>{i > 0 ? <br /> : null}{line}</Fragment>)}</h2><p>{content.body}</p></Reveal></div></section>;
}

function Step({ step, index }: { step: HowItWorksStep; index: number }) {
  return <Reveal className="sp-step"><div className="n">{index + 1}</div><div className="art"><img src={step.image.src} width={step.image.width} height={step.image.height} alt={step.image.alt} /></div><h3>{step.title}</h3><p>{step.body}</p></Reveal>;
}

export function HowItWorks({ content }: { content: HowItWorksContent }) {
  return <section className="sp-sec" id="how"><div className="sp-wrap"><Reveal><SectionHeading center eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} /></Reveal><div className="sp-steps">{content.steps.map((step, i) => <Step key={step.title} step={step} index={i} />)}</div></div></section>;
}

function Panel({ panel, variant }: { panel: BeforeAfterPanel; variant: 'before' | 'after' }) {
  return <Reveal className={`sp-panel ${variant}`}><span className="tag">{panel.tag}</span><img src={panel.image.src} width={panel.image.width} height={panel.image.height} alt={panel.image.alt} /><p className="quote">{panel.quote}</p><p className="cap">{panel.caption}</p></Reveal>;
}

export function BeforeAfter({ content }: { content: BeforeAfterContent }) {
  return <section className="sp-ba sp-sec"><div className="sp-wrap"><Reveal><SectionHeading center eyebrow={content.eyebrow} title={content.title.map((line, i) => <Fragment key={line}>{i > 0 ? <br /> : null}{line}</Fragment>)} /></Reveal><div className="sp-ba-grid"><Panel panel={content.before} variant="before" /><Reveal className="sp-ba-mid"><span className="sp-ba-send">{content.transferLabel}</span><span className="sp-ba-arrow">➜</span></Reveal><Panel panel={content.after} variant="after" /></div><Reveal as="p" className="sp-ba-punch">{content.punchLead}<span className="sp-script">{content.punchScript}</span></Reveal></div></section>;
}

function Tier({ tier }: { tier: PricingTier }) {
  return <Reveal className={tier.featured ? 'sp-tier feat' : 'sp-tier'} style={{ ['--tier']: tier.swatch } as CSSProperties}>{tier.badge ? <span className="loved">{tier.badge}</span> : null}<div className="sp-tier-cap"><h3>{tier.name}</h3><div className="sp-tier-tag"><span className="amt">{tier.price}</span><span className="note">{tier.priceNote}</span></div></div><div className="sp-tier-body"><p className="desc">{tier.description}</p>{tier.highlights?.length ? <ul className="feats">{tier.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul> : null}<Link className="pick" href={tier.cta.href}>{tier.cta.label}</Link></div></Reveal>;
}

export function Pricing({ content }: { content: PricingContent }) {
  const { decoration } = content;
  return <section className="sp-sec sp-pricing" id="pricing"><div className="sp-wrap"><img className="sp-pricing-deco" src={decoration.src} width={decoration.width} height={decoration.height} alt={decoration.alt} /><Reveal><SectionHeading center eyebrow={content.eyebrow} title={content.title} subtitle={content.subtitle} /></Reveal><div className="sp-tiers">{content.tiers.map((tier) => <Tier key={tier.name} tier={tier} />)}</div></div></section>;
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return <Reveal className="sp-tcard"><div className="qm">“</div><p>{item.quote}</p><div className="who"><span className="av">{item.initial}</span> {item.author}</div></Reveal>;
}

export function Testimonials({ content }: { content: TestimonialsContent }) {
  const { decoration } = content;
  return <section className="sp-sec sp-testi"><div className="sp-wrap"><img className="sp-testi-art" src={decoration.src} width={decoration.width} height={decoration.height} alt={decoration.alt} /><Reveal><SectionHeading center eyebrow={content.eyebrow} title={content.title} /></Reveal><div className="sp-tgrid">{content.items.map((item) => <TestimonialCard key={item.author} item={item} />)}</div></div></section>;
}

function FaqItemRow({ item }: { item: FaqItem }) {
  return <details open={item.defaultOpen}><summary>{item.question}<span className="pm">+</span></summary><p className="ans">{item.answer}</p></details>;
}

export function Faq({ content }: { content: FaqContent }) {
  const { decoration } = content;
  return <section className="sp-sec sp-faq" id="faq"><div className="sp-wrap sp-faq-wrap"><Reveal className="sp-faq-art"><Eyebrow>{content.eyebrow}</Eyebrow><h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', margin: '.4em 0 1em' }}>{content.title.map((line, i) => <Fragment key={line}>{i > 0 ? <br /> : null}{line}</Fragment>)}</h2><img src={decoration.src} width={decoration.width} height={decoration.height} alt={decoration.alt} /></Reveal><Reveal>{content.items.map((item) => <FaqItemRow key={item.question} item={item} />)}</Reveal></div></section>;
}

export function FinalCta({ content }: { content: FinalCtaContent }) {
  const { image } = content;
  return <section className="sp-sec sp-cta"><div className="sp-wrap"><Reveal><h2>{content.title}</h2><p>{content.body}</p><LinkButton link={content.cta} variant="cream" /></Reveal><Reveal><img src={image.src} width={image.width} height={image.height} alt={image.alt} /></Reveal></div></section>;
}
