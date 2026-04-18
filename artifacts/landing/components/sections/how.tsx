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
      </div>
    </section>
  );
}
