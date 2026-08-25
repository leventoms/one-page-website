/* eslint-disable @next/next/no-img-element */
import { Reveal } from '@/features/marketing/components/ui/Reveal';
import { LinkButton } from '@/features/marketing/components/ui/Button';
import type { FinalCtaContent } from '@/features/marketing/types';

export function FinalCta({ content }: { content: FinalCtaContent }) {
  const { image } = content;

  return (
    <section className="sp-sec sp-cta">
      <div className="sp-wrap">
        <Reveal>
          <h2>{content.title}</h2>
          <p>{content.body}</p>
          <LinkButton link={content.cta} variant="cream" />
        </Reveal>
        <Reveal>
          <img
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
          />
        </Reveal>
      </div>
    </section>
  );
}
