import type { Messages } from '@/messages/types';

export function Problem({ t }: { t: Messages['problem'] }) {
  return (
    <section className="py-24 sm:py-32 section-divider">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl">
          {t.h2}
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-3">
          {t.stats.map((stat, idx) => (
            <div
              key={idx}
              className="card-elevated p-8 flex flex-col gap-3 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="text-4xl sm:text-5xl font-mono font-semibold gradient-text tabular-nums">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{stat.label}</p>
            </div>
          ))}
        </div>

        <figure className="mt-20 max-w-3xl">
          <blockquote className="text-xl sm:text-2xl font-medium text-foreground/90 leading-relaxed border-l-2 border-emerald pl-6 italic">
            {t.quote}
          </blockquote>
          <figcaption className="mt-4 pl-6 text-sm text-muted-foreground not-italic">
            {t.quoteAttribution}
          </figcaption>
        </figure>

        <p className="mt-12 text-xs text-muted-foreground/60">{t.sources}</p>
      </div>
    </section>
  );
}
