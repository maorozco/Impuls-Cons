import type { Messages } from '@/messages/types';

export function Dream({ t }: { t: Messages['dream'] }) {
  return (
    <section className="py-24 sm:py-32 bg-card/20 border-y border-border">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl">
          {t.h2}
        </h2>

        <div className="mt-10 max-w-3xl space-y-5">
          {t.body.map((line, idx) => (
            <p
              key={idx}
              className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
            >
              {line}
            </p>
          ))}
          <p className="pt-4 text-lg text-foreground leading-relaxed">
            {t.closer}
          </p>
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight gradient-text">
            {t.tagline}
          </p>
        </div>
      </div>
    </section>
  );
}
