import Image from 'next/image';
import type { Messages } from '@/messages/types';

export function WhatV2({ t }: { t: Messages['what'] }) {
  return (
    <section className="py-24 sm:py-32 v2-bg-alt">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 items-start">
          <div>
            <p className="v2-eyebrow">06 — la ciencia</p>
            <h2 className="v2-serif mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05] v2-ink">
              {t.h2}
            </h2>
            <p className="v2-serif mt-6 text-xl sm:text-2xl italic v2-ink-soft leading-snug">
              {t.intro}
            </p>
            <p className="mt-8 text-base sm:text-lg leading-relaxed v2-ink-soft">
              {t.moat}
            </p>
          </div>
          <figure className="lg:sticky lg:top-24">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '4px',
                border: '1px solid hsl(44 14% 84%)',
                background: 'hsl(150 20% 8%)',
              }}
            >
              <Image
                src="/imagenes/molecule-enzyme.png"
                alt="Enzima PETasa degradando un sustrato de PET — visualización científica"
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
            </div>
            <figcaption className="v2-serif mt-5 text-sm italic v2-ink-faint">
              Enzima PETasa en su sitio activo — renderizado científico
            </figcaption>
          </figure>
        </div>

        <div className="mt-20 grid gap-5 sm:grid-cols-2">
          {t.stack.map((item) => (
            <div key={item.name} className="v2-card p-6">
              <p className="v2-serif text-xl font-medium v2-ink">{item.name}</p>
              <p className="mt-2 text-sm leading-relaxed v2-ink-soft">{item.label}</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="v2-ink-faint italic">{item.source}</span>
                <span className="font-mono v2-accent">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
