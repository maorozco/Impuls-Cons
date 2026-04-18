import type { Messages } from '@/messages/types';

export function Problem({ t }: { t: Messages['problem'] }) {
  return (
    <section className="py-24 sm:py-32 section-divider">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl">
          <span className="text-foreground">{t.h2Prefix}</span>
          <span className="text-emerald">{t.h2Accent}</span>
          <span className="text-foreground">{t.h2Suffix}</span>
        </h2>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.stats.map((stat, idx) => (
            <div
              key={idx}
              className="card-elevated p-7 flex flex-col gap-3 animate-fade-in-up"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              <div className="text-4xl sm:text-5xl font-mono font-semibold gradient-text tabular-nums">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
