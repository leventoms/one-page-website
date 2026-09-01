/**
 * Provider allowlist + URL normalisation for embedded videos.
 *
 * This is the single source of truth for which external video hosts are
 * permitted and how their share URLs map to a safe, canonical embed URL.
 * It is imported by both the Zod schema (to reject non-allowlisted links on
 * the server) and the render component (to build the iframe src) so the
 * allowlist is defined exactly once.
 *
 * A pasted URL is untrusted input: anything that doesn't match a known
 * provider pattern returns null and is rejected — we never inject a raw
 * user-supplied URL into markup.
 */

export type VideoEmbedProvider = 'youtube' | 'instagram';

export interface ParsedVideoEmbed {
  provider: VideoEmbedProvider;
  /** Canonical, safe-to-iframe URL for the recognised video. */
  embedUrl: string;
}

function parseYouTube(u: URL): string | null {
  const host = u.hostname.replace(/^www\./, '');
  let id: string | null = null;

  if (host === 'youtu.be') {
    id = u.pathname.slice(1).split('/')[0] || null;
  } else if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (u.pathname === '/watch') {
      id = u.searchParams.get('v');
    } else if (u.pathname.startsWith('/shorts/')) {
      id = u.pathname.split('/')[2] || null;
    } else if (u.pathname.startsWith('/embed/')) {
      id = u.pathname.split('/')[2] || null;
    }
  }

  if (!id || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null;
  return `https://www.youtube.com/embed/${id}`;
}

function parseInstagram(u: URL): string | null {
  const host = u.hostname.replace(/^www\./, '');
  if (host !== 'instagram.com') return null;

  const parts = u.pathname.split('/').filter(Boolean); // e.g. ['reel', '{id}']
  const kind = parts[0];
  const id = parts[1];
  if ((kind !== 'reel' && kind !== 'p') || !id || !/^[A-Za-z0-9_-]{5,20}$/.test(id)) {
    return null;
  }
  return `https://www.instagram.com/${kind}/${id}/embed`;
}

/**
 * Normalise a pasted video URL to a canonical embed URL, or return null if
 * the host/shape isn't on the allowlist (YouTube, Instagram).
 */
export function parseVideoEmbed(rawUrl: string): ParsedVideoEmbed | null {
  let u: URL;
  try {
    u = new URL(rawUrl.trim());
  } catch {
    return null;
  }
  if (u.protocol !== 'https:' && u.protocol !== 'http:') return null;

  const yt = parseYouTube(u);
  if (yt) return { provider: 'youtube', embedUrl: yt };

  const ig = parseInstagram(u);
  if (ig) return { provider: 'instagram', embedUrl: ig };

  return null;
}
