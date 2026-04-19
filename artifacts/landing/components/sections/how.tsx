import Image from 'next/image';
import type { Messages } from '@/messages/types';

export function How({ t }: { t: Messages['how'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          {t.h2}
        </h2>

        <div className="mt-16 grid gap-px bg-border sm:grid-cols-3 rounded-lg overflow-hidden border border-border">
          {t.steps.map((step) => (
            <div
              key={step.number}
              className="bg-background p-8 flex flex-col gap-4 group hover:bg-card transition-colors"
            >
              <span className="font-mono text-xs text-emerald tracking-wider">{step.number}</span>
              <h3 className="text-xl font-semibold tracking-tight">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 mx-auto max-w-5xl rounded-xl border border-border bg-card/40 p-2 sm:p-3 shadow-[0_0_0_1px_hsl(var(--emerald)/0.08),0_24px_60px_-20px_hsl(var(--emerald)/0.18)] relative">
          <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-br from-emerald/8 via-transparent to-transparent blur-2xl" aria-hidden />
          <Image
            src="/imagenes/consortium-designer.png"
            alt="Impulso BioCycle — Consortium Designer dashboard preview"
            width={1024}
            height={1024}
            className="w-full h-auto rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}
