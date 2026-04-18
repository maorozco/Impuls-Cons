import { ArrowUpRight } from 'lucide-react';
import type { Messages } from '@/messages/types';

export function What({ t }: { t: Messages['what'] }) {
  return (
    <section className="py-24 sm:py-32 section-divider">
      <div className="container-tight">
        <div className="grid gap-12 lg:grid-cols-5 lg:gap-20">
          <div className="lg:col-span-3 space-y-6">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
              {t.h2}
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              {t.intro}
            </p>
            <p className="text-base text-foreground/90 leading-relaxed">{t.moat}</p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald hover:opacity-80 transition-opacity"
            >
              {t.techBriefLink} <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>

          <div className="lg:col-span-2">
            <ul className="space-y-3">
              {t.stack.map((item) => (
                <li
                  key={item.name}
                  className="card-elevated px-5 py-4 flex flex-col gap-1"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {item.name}
                    </span>
                    <span className="text-[10px] tracking-wider uppercase text-muted-foreground/70">
                      {item.source}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
