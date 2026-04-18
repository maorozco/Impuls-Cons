import { CheckCircle2 } from 'lucide-react';
import type { Messages } from '@/messages/types';

export function What({ t }: { t: Messages['what'] }) {
  return (
    <section className="py-24 sm:py-32 section-divider">
      <div className="container-tight">
        <div className="max-w-3xl space-y-5">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
            {t.h2}
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {t.intro}
          </p>
          <p className="text-base text-foreground/90 leading-relaxed">
            {t.moat}
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {t.stack.map((item) => (
            <div
              key={item.name}
              className="card-elevated px-6 py-5 flex flex-col gap-3"
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-mono text-base font-semibold text-foreground">
                  {item.name}
                </span>
                <span className="text-[10px] tracking-wider uppercase text-muted-foreground/70 text-right">
                  {item.source}
                </span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.label}
              </p>
              <span className="inline-flex self-start items-center gap-1.5 text-xs font-medium text-emerald mt-1">
                <CheckCircle2 className="h-3.5 w-3.5" />
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
