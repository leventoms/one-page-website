import { Fragment } from 'react';
import type { TrustContent } from '@/features/marketing/types';

export function TrustStrip({ content }: { content: TrustContent }) {
  return (
    <div className="sp-trust">
      <div className="sp-wrap">
        {content.items.map((item, i) => (
          <Fragment key={item}>
            <span className="it">
              <span className="tick">✓</span> {item}
            </span>
            {i < content.items.length - 1 ? <span className="sep">·</span> : null}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
