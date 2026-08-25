/* eslint-disable @next/next/no-img-element */
import { Reveal } from '@/features/marketing/components/ui/Reveal';
import { SectionHeading } from '@/features/marketing/components/ui/SectionHeading';
import type { HowItWorksContent, HowItWorksStep } from '@/features/marketing/types';

function Step({ step, index }: { step: HowItWorksStep; index: number }) {
  return (
    <Reveal className="sp-step">
      <div className="n">{index + 1}</div>
      <div className="art">
        <img
          src={step.image.src}
          width={step.image.width}
          height={step.image.height}
          alt={step.image.alt}
        />
      </div>
      <h3>{step.title}</h3>
      <p>{step.body}</p>
    </Reveal>
  );
}

export function HowItWorks({ content }: { content: HowItWorksContent }) {
  return (
    <section className="sp-sec" id="how">
      <div className="sp-wrap">
        <Reveal>
          <SectionHeading
            center
            eyebrow={content.eyebrow}
            title={content.title}
            subtitle={content.subtitle}
          />
        </Reveal>
        <div className="sp-steps">
          {content.steps.map((step, i) => (
            <Step key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
