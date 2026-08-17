interface MarqueeStripProps {
  items: string[];
}

/**
 * The reference design uses this pattern for client-logo social proof.
 * We don't have client logos to show honestly, so this fills the same
 * visual rhythm with real product facts (occasions supported) instead —
 * same motion pattern, no fabricated credibility.
 */
export default function MarqueeStrip({ items }: MarqueeStripProps) {
  // Duplicate the list so the 50%-translate loop is seamless.
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden border-y border-paper-line py-5">
      <div className="marquee-track flex w-max gap-10">
        {doubled.map((item, i) => (
          <span
            key={i}
            className="font-mono text-sm uppercase tracking-widest text-ink-muted whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
