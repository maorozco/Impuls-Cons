import Image from 'next/image';
import type { Messages } from '@/messages/types';

export function DreamV2({ t }: { t: Messages['dream'] }) {
  return (
    <section className="py-24 sm:py-36 v2-bg-alt">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20 items-center">
          <figure className="order-2 lg:order-1">
            <div
              className="relative overflow-hidden"
              style={{
                borderRadius: '4px',
                border: '1px solid hsl(44 14% 84%)',
                background: 'hsl(0 0% 100%)',
              }}
            >
              <Image
                src="/imagenes/petri-culture.png"
                alt="Cultivo microbiano en placa Petri, fotografía editorial"
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
            </div>
            <figcaption className="v2-serif mt-5 text-sm italic v2-ink-faint">
              Colonia fractal en laboratorio — imagen de referencia
            </figcaption>
          </figure>

          <div className="order-1 lg:order-2">
            <p className="v2-eyebrow">02 — la visión</p>
            <h2 className="v2-serif mt-5 text-4xl sm:text-5xl md:text-6xl leading-[1.05] v2-ink italic">
              {t.h2}
            </h2>

            <div className="mt-10 space-y-6">
              {t.body.map((line, idx) => (
                <p
                  key={idx}
                  className="v2-serif text-xl sm:text-2xl leading-[1.4] v2-ink italic"
                >
                  {line}
                </p>
              ))}
            </div>

            <div className="v2-rule-short my-10" aria-hidden />

            <p className="text-base sm:text-lg leading-relaxed v2-ink-soft max-w-xl">
              {t.closer}
            </p>

            <p className="v2-serif mt-8 text-2xl sm:text-3xl italic v2-accent">
              {t.tagline}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
