/**
 * A thin strung-garland divider — small marigold-gold dots on a curved
 * thread, echoing the flower garlands used at Indian celebrations. This is
 * the page's one recurring signature element; everything else stays quiet.
 * The gentle glow is skipped entirely for prefers-reduced-motion via CSS.
 */
export default function MarigoldDivider() {
  const dots = Array.from({ length: 9 });

  return (
    <div className="flex items-center justify-center py-2" aria-hidden="true">
      <svg width="280" height="24" viewBox="0 0 280 24" className="overflow-visible">
        <path
          d="M 4 4 Q 140 28 276 4"
          fill="none"
          stroke="#4a2f52"
          strokeWidth="1"
        />
        {dots.map((_, i) => {
          const t = i / (dots.length - 1);
          const x = 4 + t * 272;
          // Approximate the quadratic curve's y at this t for dot placement.
          const y = (1 - t) * (1 - t) * 4 + 2 * (1 - t) * t * 28 + t * t * 4;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={i % 2 === 0 ? 3 : 2}
              fill={i % 2 === 0 ? '#f0a94e' : '#e2607a'}
              className="garland-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          );
        })}
      </svg>
    </div>
  );
}
