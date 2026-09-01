import type { Tier1Config } from '@/types';
import type { TemplateProps } from '@/types';

const PLACEHOLDER_PHOTO = '/placeholder-photo.svg';
const PLACEHOLDER_MESSAGE =
  'Your heartfelt message will appear right here, exactly the way you wrote it.';

/**
 * Pure presentational component: config in, JSX out. It doesn't know
 * about Supabase, payments, or routing — that separation is what makes
 * it trivial to unit test or reuse in the preview route.
 */
export default function Tier1Template({ config, isPreview }: TemplateProps<Tier1Config>) {
  const photos = isPreview && config.photoUrls.length === 0
    ? [PLACEHOLDER_PHOTO]
    : config.photoUrls;
  const message = isPreview ? config.message || PLACEHOLDER_MESSAGE : config.message;

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-6 py-16 text-center dark-surface"
      style={{
        background: `radial-gradient(circle at top, ${config.accentColor}22, #0a0a0c 60%)`,
      }}
    >
      {isPreview && (
        <div className="mb-6 rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
          Preview — pay to unlock the real link
        </div>
      )}

      <div className="w-full max-w-sm rounded-3xl bg-white/5 backdrop-blur-md p-6 shadow-xl ring-1 ring-white/10">
        <div className="flex justify-center gap-2 mb-6">
          {photos.slice(0, 3).map((url, i) => (
            <div
              key={url + i}
              className="relative h-28 w-24 overflow-hidden rounded-xl ring-2"
              style={{ borderColor: config.accentColor, ringColor: config.accentColor } as never}
            >
              {/* User-supplied image URLs can come from any HTTPS host. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-semibold text-white mb-2">
          For {config.recipientName || 'you'} 💌
        </h1>

        <p className="whitespace-pre-line text-white/85 leading-relaxed mb-6">{message}</p>

        <p className="text-sm text-white/50">— {config.senderName || 'someone who cares'}</p>

        {config.songUrl && !isPreview && (
          <audio controls className="mt-6 w-full">
            <source src={config.songUrl} />
          </audio>
        )}
      </div>
    </main>
  );
}
