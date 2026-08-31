'use client';

import { useState } from 'react';
import { parseVideoEmbed } from '@/lib/services/video-embed';
import type { VideoConfig } from '@/types/order';

type Mode = 'none' | 'file' | 'embed';

/**
 * Optional single-clip video input, shared by the Tier 2 & Tier 3 builders.
 * URL-based to match how photos work (no upload): either a direct file URL
 * or an allowlisted YouTube/Instagram link. Emits a VideoConfig up to the
 * parent, or undefined when there's no valid clip.
 */
export default function VideoInput({
  onChange,
}: {
  onChange: (video: VideoConfig | undefined) => void;
}) {
  const [mode, setMode] = useState<Mode>('none');
  const [url, setUrl] = useState('');

  const embedParsed = mode === 'embed' && url.trim() ? parseVideoEmbed(url) : null;
  const embedInvalid = mode === 'embed' && url.trim().length > 0 && !embedParsed;

  function emit(nextMode: Mode, nextUrl: string) {
    const trimmed = nextUrl.trim();
    if (nextMode === 'none' || !trimmed) {
      onChange(undefined);
      return;
    }
    if (nextMode === 'file') {
      onChange({ kind: 'file', url: trimmed });
      return;
    }
    const parsed = parseVideoEmbed(trimmed);
    onChange(parsed ? { kind: 'embed', provider: parsed.provider, url: trimmed } : undefined);
  }

  function changeMode(next: Mode) {
    setMode(next);
    emit(next, url);
  }

  function changeUrl(next: string) {
    setUrl(next);
    emit(mode, next);
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-ink-muted">Add a video (optional)</span>
      <div className="flex gap-2">
        {(['none', 'file', 'embed'] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => changeMode(m)}
            className={`rounded-full px-3 py-1 text-xs ${
              mode === m ? 'bg-marigold text-ivory' : 'bg-paper-soft text-ink-muted'
            }`}
          >
            {m === 'none' ? 'No video' : m === 'file' ? 'Video URL' : 'YouTube / Instagram'}
          </button>
        ))}
      </div>

      {mode !== 'none' && (
        <input
          className="rounded-lg bg-paper-soft border border-paper-line px-3 py-2 text-sm text-ink"
          placeholder={mode === 'file' ? 'https://…/clip.mp4' : 'Paste a YouTube or Instagram link'}
          value={url}
          onChange={(e) => changeUrl(e.target.value)}
        />
      )}

      {embedInvalid && (
        <p className="text-xs text-rose">
          That link isn&apos;t a supported YouTube or Instagram video.
        </p>
      )}
    </div>
  );
}
