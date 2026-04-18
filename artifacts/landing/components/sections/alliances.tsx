import type { Messages } from '@/messages/types';

export function Alliances({ t }: { t: Messages['alliances'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          {t.h2}
        </h2>

        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <Group label={t.nationalLabel} items={t.nationalItems} />
          <Group label={t.internationalLabel} items={t.internationalItems} />
        </div>

        <p className="mt-10 text-xs italic text-muted-foreground/70 leading-relaxed max-w-2xl">
          {t.disclaimer}
        </p>
      </div>
    </section>
  );
}

function Group({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.2em] text-emerald mb-5 uppercase">
        {label}
      </p>
      <ul className="flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="tag text-xs sm:text-sm hover:text-foreground transition-colors"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
