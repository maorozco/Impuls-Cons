import type { Messages } from '@/messages/types';

export function SolutionsV2({ t }: { t: Messages['solutions'] }) {
  return (
    <section className="py-24 sm:py-32 v2-bg-alt">
      <div className="mx-auto max-w-5xl px-6">
        <p className="v2-eyebrow">04 — formas de unirte</p>
        <h2 className="v2-serif mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05] v2-ink max-w-2xl">
          {t.h2}
        </h2>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {t.cards.map((card) => (
            <article key={card.title} className="v2-card p-8 flex flex-col">
              <div className="text-3xl">{card.icon}</div>
              <h3 className="v2-serif mt-5 text-2xl font-medium v2-ink leading-snug">
                {card.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed v2-ink-soft flex-1">{card.body}</p>
              <p className="mt-6 v2-eyebrow">{card.badge}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
