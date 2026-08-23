/* eslint-disable @next/next/no-img-element */
import { Reveal } from '../ui/Reveal';
import { SectionHeading } from '../ui/SectionHeading';
import type { Testimonial, TestimonialsContent } from '../../_types/landing.types';

function Card({ item }: { item: Testimonial }) {
  return (
    <Reveal className="sp-tcard">
      <div className="qm">“</div>
      <p>{item.quote}</p>
      <div className="who">
        <span className="av">{item.initial}</span> {item.author}
      </div>
    </Reveal>
  );
}

export function Testimonials({ content }: { content: TestimonialsContent }) {
  const { decoration } = content;

  return (
    <section className="sp-sec sp-testi">
      <div className="sp-wrap">
        {/* Decorative, absolutely-positioned accent — no scroll animation needed. */}
        <img
          className="sp-testi-art"
          src={decoration.src}
          width={decoration.width}
          height={decoration.height}
          alt={decoration.alt}
        />
        <Reveal>
          <SectionHeading center eyebrow={content.eyebrow} title={content.title} />
        </Reveal>
        <div className="sp-tgrid">
          {content.items.map((item) => (
            <Card key={item.author} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
