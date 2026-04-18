import type { Messages } from '@/messages/types';

export function ProblemV2({ t }: { t: Messages['problem'] }) {
  return (
    <section className="py-24 sm:py-32 border-t" style={{ borderColor: 'hsl(44 14% 84%)' }}>
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-10 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="v2-eyebrow">01 — el problema</p>
            <h2 className="v2-serif mt-4 text-4xl sm:text-5xl leading-[1.05] v2-ink">
              <span>{t.h2Prefix}</span>
              <span className="italic v2-accent">{t.h2Accent}</span>
              <span>{t.h2Suffix}</span>
            </h2>
          </div>
          <div className="md:col-span-3 space-y-0">
            {t.stats.map((stat, idx) => (
              <div
                key={idx}
                className="flex items-baseline gap-6 py-6 border-b"
                style={{ borderColor: 'hsl(44 14% 84%)' }}
              >
                <div className="v2-serif text-4xl sm:text-5xl font-normal tabular-nums v2-ink shrink-0 w-32">
                  {stat.value}
                </div>
                <p className="text-[15px] leading-relaxed v2-ink-soft">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
