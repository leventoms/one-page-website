import Link from 'next/link';
import type { ReactNode } from 'react';

export interface LegalSection {
  readonly heading: string;
  /** Each entry renders as its own paragraph. ReactNode so copy can inline links. */
  readonly paras?: ReadonlyArray<ReactNode>;
  readonly bullets?: ReadonlyArray<ReactNode>;
}

interface LegalPageProps {
  readonly title: string;
  readonly lastUpdated: string;
  readonly intro?: ReactNode;
  readonly sections: ReadonlyArray<LegalSection>;
}

/**
 * Shared shell for the paper-themed policy pages (Terms, Refunds, Privacy).
 *
 * Deliberately calm and monochrome for readability — the only brand touch is a
 * short accent rule under the title. Each policy supplies its own copy through
 * `sections`; this component owns the layout, type scale, and vertical rhythm
 * so the three pages stay consistent (change the look here, once, not in three
 * route files).
 */
export function LegalPage({ title, lastUpdated, intro, sections }: LegalPageProps) {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 sm:py-20">
      <Link href="/" className="text-sm text-ink-muted transition-colors hover:text-ink">
        ← Back to home
      </Link>

      <header className="mt-8">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-gradient-accent">
          Legal
        </p>
        <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        <div className="mt-4 h-1 w-12 rounded-full bg-gradient-accent" />
        <p className="mt-4 text-sm text-ink-muted">Last updated {lastUpdated}</p>
        {intro ? <p className="mt-6 leading-relaxed text-ink-muted">{intro}</p> : null}
      </header>

      {sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="font-display text-xl font-semibold text-ink">{section.heading}</h2>
          {section.paras?.map((para, i) => (
            <p key={i} className="mt-3 leading-relaxed text-ink-muted">
              {para}
            </p>
          ))}
          {section.bullets ? (
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-ink-muted marker:text-marigold">
              {section.bullets.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </main>
  );
}
