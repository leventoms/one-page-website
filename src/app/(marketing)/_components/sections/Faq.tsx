/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react';
import { Reveal } from '../ui/Reveal';
import { Eyebrow } from '../ui/Eyebrow';
import type { FaqContent, FaqItem } from '../../_types/landing.types';

function Item({ item }: { item: FaqItem }) {
  return (
    <details open={item.defaultOpen}>
      <summary>
        {item.question}
        <span className="pm">+</span>
      </summary>
      <p className="ans">{item.answer}</p>
    </details>
  );
}

export function Faq({ content }: { content: FaqContent }) {
  const { decoration } = content;

  return (
    <section className="sp-sec sp-faq" id="faq">
      <div className="sp-wrap sp-faq-wrap">
        <Reveal className="sp-faq-art">
          <Eyebrow>{content.eyebrow}</Eyebrow>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', margin: '.4em 0 1em' }}>
            {content.title.map((line, i) => (
              <Fragment key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          </h2>
          <img
            src={decoration.src}
            width={decoration.width}
            height={decoration.height}
            alt={decoration.alt}
          />
        </Reveal>
        <Reveal>
          {content.items.map((item) => (
            <Item key={item.question} item={item} />
          ))}
        </Reveal>
      </div>
    </section>
  );
}
