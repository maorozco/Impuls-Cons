import Image from 'next/image';
import type { Messages } from '@/messages/types';

export function Dream({ t }: { t: Messages['dream'] }) {
  return (
    <section className="py-24 sm:py-32 bg-card/20 border-y border-border">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl">
          {t.h2}
        </h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-5 lg:gap-14 items-center">
          <div className="lg:col-span-3 space-y-5">
            {t.body.map((line, idx) => (
              <p
                key={idx}
                className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
              >
                {line}
              </p>
            ))}
            {t.closer && (
              <p className="pt-4 text-lg text-foreground leading-relaxed">
                {t.closer}
              </p>
            )}
            {t.tagline && (
              <p className="text-2xl sm:text-3xl font-semibold tracking-tight gradient-text">
                {t.tagline}
              </p>
            )}
          </div>
          <div className="lg:col-span-2">
            <div className="relative aspect-square rounded-xl overflow-hidden border border-border bg-black">
              <Image
                src="/imagenes/consortium-abstract.png"
                alt="Visualización de un consorcio microbiano"
                width={1024}
                height={1024}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-emerald/10" aria-hidden />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
