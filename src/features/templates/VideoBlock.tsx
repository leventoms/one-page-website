import { parseVideoEmbed } from '@/lib/services/video-embed';
import type { VideoConfig } from '@/types/order';

/**
 * Renders a single optional video clip attached to a page.
 *  - file  → a native <video> element (sender-hosted .mp4/.webm URL)
 *  - embed → a sandboxed <iframe> whose src is the canonical embed URL from
 *            the shared allowlist (never the raw pasted URL).
 *
 * Pure presentational, no hooks — safe to use inside both server-rendered
 * (Tier2) and client (Tier3) templates.
 */
export default function VideoBlock({
  video,
  accentColor,
}: {
  video: VideoConfig;
  accentColor?: string;
}) {
  const frame = (
    children: React.ReactNode,
  ) => (
    <div
      className="relative mx-auto mt-6 w-full max-w-xs overflow-hidden rounded-2xl ring-2"
      style={{ aspectRatio: '9 / 16', borderColor: accentColor ?? 'transparent' } as never}
    >
      {children}
    </div>
  );

  if (video.kind === 'file') {
    return frame(
      <video
        controls
        playsInline
        preload="metadata"
        className="absolute inset-0 h-full w-full bg-black object-contain"
      >
        <source src={video.url} />
      </video>,
    );
  }

  // embed: resolve to a safe canonical URL; bail out silently if it no longer
  // parses (defensive — the schema already validated it on submit).
  const parsed = parseVideoEmbed(video.url);
  if (!parsed) return null;

  return frame(
    <iframe
      src={parsed.embedUrl}
      title="Attached video"
      className="absolute inset-0 h-full w-full"
      loading="lazy"
      allow="encrypted-media; picture-in-picture; fullscreen"
      sandbox="allow-scripts allow-same-origin allow-presentation allow-popups"
      referrerPolicy="strict-origin-when-cross-origin"
    />,
  );
}
