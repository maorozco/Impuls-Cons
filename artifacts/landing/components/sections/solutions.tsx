import type { Messages } from '@/messages/types';

export function Solutions({ t }: { t: Messages['solutions'] }) {
  return (
    <section className="py-24 sm:py-32 bg-card/20 border-y border-border">
      <div className="container-tight">
        {t.tagline && (
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight gradient-text mb-6">
            {t.tagline}
          </p>
        )}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
          {t.h2}
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {t.cards.map((card, idx) => (
            <div
              key={idx}
              className="card-elevated p-7 flex flex-col gap-4 animate-fade-in-up"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {card.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                {card.body}
              </p>
              <span className="inline-flex self-start mt-2 text-[10px] font-mono font-semibold tracking-wider uppercase text-emerald px-2.5 py-1 rounded-full border border-emerald/30 bg-emerald/5">
                {card.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
