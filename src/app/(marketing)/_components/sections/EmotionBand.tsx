/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import type { EmotionBandContent } from '../../_types/landing.types';

export function EmotionBand({ content }: { content: EmotionBandContent }) {
  const { image } = content;

  return (
    <section className="sp-band sp-sec">
      <div className="sp-wrap">
        <Reveal>
          <img
            className="bigart"
            src={image.src}
            width={image.width}
            height={image.height}
            alt={image.alt}
          />
        </Reveal>
        <Reveal>
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2>
            {content.title.map((line, i) => (
              <Fragment key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </h2>
          <p>{content.body}</p>
        </Reveal>
      </div>
    </section>
  );
}
