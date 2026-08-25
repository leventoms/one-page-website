/* eslint-disable @next/next/no-img-element */
import { Fragment } from 'react';
import { Reveal } from '@/features/marketing/components/ui/Reveal';
import { SectionHeading } from '@/features/marketing/components/ui/SectionHeading';
import type {
  BeforeAfterContent,
  BeforeAfterPanel,
} from '@/features/marketing/types';

function Panel({ panel, variant }: { panel: BeforeAfterPanel; variant: 'before' | 'after' }) {
  return (
    <Reveal className={`sp-panel ${variant}`}>
      <span className="tag">{panel.tag}</span>
      <img
        src={panel.image.src}
        width={panel.image.width}
        height={panel.image.height}
        alt={panel.image.alt}
      />
      <p className="quote">{panel.quote}</p>
      <p className="cap">{panel.caption}</p>
    </Reveal>
  );
}

export function BeforeAfter({ content }: { content: BeforeAfterContent }) {
  return (
    <section className="sp-ba sp-sec">
      <div className="sp-wrap">
        <Reveal>
          <SectionHeading
            center
            eyebrow={content.eyebrow}
            title={content.title.map((line, i) => (
              <Fragment key={line}>
                {i > 0 ? <br /> : null}
                {line}
              </Fragment>
            ))}
          />
        </Reveal>

        <div className="sp-ba-grid">
          <Panel panel={content.before} variant="before" />
          <Reveal className="sp-ba-mid">
            <span className="sp-ba-send">{content.transferLabel}</span>
            <span className="sp-ba-arrow">➜</span>
          </Reveal>
          <Panel panel={content.after} variant="after" />
        </div>

        <Reveal as="p" className="sp-ba-punch">
          {content.punchLead}
          <span className="sp-script">{content.punchScript}</span>
        </Reveal>
      </div>
    </section>
  );
}
