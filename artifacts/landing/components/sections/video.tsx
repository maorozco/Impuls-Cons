import type { Messages } from '@/messages/types';

export function Video({ t }: { t: Messages['video'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-center max-w-3xl mx-auto">
          {t.h2}{' '}
          {t.h2Accent && (
            <span className="gradient-text">{t.h2Accent}</span>
          )}
        </h2>

        <div className="mt-12 mx-auto max-w-4xl">
          <div className="relative aspect-video rounded-xl overflow-hidden border border-border bg-black">
            <video
              className="w-full h-full object-cover"
              controls
              preload="metadata"
              playsInline
            >
              <source src="/api/video" type="video/mp4" />
              {t.placeholderLabel}
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}
