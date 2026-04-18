import type { Messages } from '@/messages/types';

export function AlliancesV2({ t }: { t: Messages['alliances'] }) {
  return (
    <section className="py-24 sm:py-32 v2-bg-alt">
      <div className="mx-auto max-w-5xl px-6">
        <p className="v2-eyebrow">08 — alianzas</p>
        <h2 className="v2-serif mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05] v2-ink max-w-3xl">
          {t.h2}
        </h2>

        <div className="mt-14 grid gap-12 md:grid-cols-2">
          <div>
            <p className="v2-eyebrow">{t.nationalLabel}</p>
            <ul className="mt-5 space-y-3">
              {t.nationalItems.map((item) => (
                <li key={item} className="v2-serif text-lg italic v2-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="v2-eyebrow">{t.internationalLabel}</p>
            <ul className="mt-5 space-y-3">
              {t.internationalItems.map((item) => (
                <li key={item} className="v2-serif text-lg italic v2-ink">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 text-xs v2-ink-faint italic">{t.disclaimer}</p>
      </div>
    </section>
  );
}
