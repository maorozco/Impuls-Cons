import type { Messages } from '@/messages/types';

export function WhatYouGetV2({ t }: { t: Messages['whatYouGet'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid gap-12 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="v2-eyebrow">03 — el entregable</p>
            <p className="v2-serif mt-6 text-2xl sm:text-3xl italic leading-snug v2-ink">
              {t.intro}
            </p>
            <p className="mt-6 text-lg v2-ink-soft">{t.subtitle}</p>
          </div>
          <ul className="md:col-span-3 space-y-0">
            {t.bullets.map((item, idx) => (
              <li
                key={idx}
                className="flex gap-5 py-5 border-b"
                style={{ borderColor: 'hsl(44 14% 84%)' }}
              >
                <span className="font-mono text-xs v2-accent shrink-0 pt-1 w-8 tabular-nums">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <span className="text-[15px] leading-relaxed v2-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
