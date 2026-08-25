import Image from 'next/image';
import type { Tier2Config } from '@/types/order';
import type { TemplateProps } from '@/types/template';

const PLACEHOLDER_PHOTO = '/placeholder-photo.svg';
const PLACEHOLDER_INTRO = 'A little walk through some of my favourite moments with you.';
const PLACEHOLDER_CLOSING = 'Here\'s to many more of these. Happy birthday.';
const PLACEHOLDER_MEMORIES = [
  { photoUrl: PLACEHOLDER_PHOTO, caption: 'This one, obviously.' },
  { photoUrl: PLACEHOLDER_PHOTO, caption: 'And this.' },
];

/**
 * Pure presentational component, same contract as Tier1Template — config
 * in, JSX out, no knowledge of storage/payments/routing. That's what let
 * this get built and registered without touching the live-page route,
 * the API routes, or OrderService.
 */
export default function Tier2Template({ config, isPreview }: TemplateProps<Tier2Config>) {
  const memories = isPreview && config.memories.length === 0 ? PLACEHOLDER_MEMORIES : config.memories;
  const intro = isPreview ? config.introMessage || PLACEHOLDER_INTRO : config.introMessage;
  const closing = isPreview ? config.closingMessage || PLACEHOLDER_CLOSING : config.closingMessage;

  return (
    <main
      className="min-h-screen px-6 py-16 dark-surface"
      style={{
        background: `linear-gradient(180deg, ${config.accentColor}22, #0a0a0c 15%, #0a0a0c 85%, ${config.accentColor}22)`,
      }}
    >
      {isPreview && (
        <div className="mx-auto mb-8 w-fit rounded-full bg-white/10 px-4 py-1 text-xs uppercase tracking-widest text-white/70">
          Preview — pay to unlock the real link
        </div>
      )}

      <header className="max-w-md mx-auto text-center mb-12">
        <h1 className="text-2xl font-semibold text-white mb-3">
          For {config.recipientName || 'you'} 💫
        </h1>
        <p className="whitespace-pre-line text-white/80 leading-relaxed">{intro}</p>
      </header>

      <div className="max-w-md mx-auto flex flex-col gap-10">
        {memories.slice(0, 6).map((memory, i) => (
          <div key={memory.photoUrl + i} className="flex flex-col items-center text-center">
            <div
              className="relative h-56 w-full max-w-xs overflow-hidden rounded-2xl ring-2 mb-3"
              style={{ borderColor: config.accentColor } as never}
            >
              <Image
                src={memory.photoUrl}
                alt=""
                fill
                sizes="320px"
                className="object-cover"
              />
            </div>
            <p className="text-white/75 text-sm max-w-xs">{memory.caption}</p>
          </div>
        ))}
      </div>

      <footer className="max-w-md mx-auto text-center mt-14">
        <p className="whitespace-pre-line text-white/85 leading-relaxed mb-3">{closing}</p>
        <p className="text-sm text-white/50">— {config.senderName || 'someone who cares'}</p>

        {config.songUrl && !isPreview && (
          <audio controls className="mt-6 w-full">
            <source src={config.songUrl} />
          </audio>
        )}
      </footer>
    </main>
  );
}
