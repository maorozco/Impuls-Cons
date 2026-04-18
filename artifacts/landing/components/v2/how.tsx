import type { Messages } from '@/messages/types';

export function HowV2({ t }: { t: Messages['how'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="v2-eyebrow">05 — cómo funciona</p>
        <h2 className="v2-serif mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05] v2-ink">
          {t.h2}
        </h2>

        <ol className="mt-16 space-y-0">
          {t.steps.map((step, idx) => (
            <li
              key={step.number}
              className="grid gap-6 md:grid-cols-[auto_1fr] py-12 border-b"
              style={{ borderColor: 'hsl(44 14% 84%)', borderTop: idx === 0 ? '1px solid hsl(44 14% 84%)' : 'none' }}
            >
              <div className="md:w-48">
                <span className="v2-serif text-6xl sm:text-7xl italic v2-accent tabular-nums">
                  {step.number}
                </span>
              </div>
              <div>
                <h3 className="v2-serif text-2xl sm:text-3xl font-medium v2-ink">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed v2-ink-soft max-w-2xl">
                  {step.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
