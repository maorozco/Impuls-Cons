import { CheckCircle2 } from 'lucide-react';
import type { Messages } from '@/messages/types';

export function WhatYouGet({ t }: { t: Messages['whatYouGet'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="container-tight">
        <div className="max-w-3xl space-y-6">
          {t.intro && (
            <p className="text-lg sm:text-xl leading-relaxed text-foreground/90">
              {t.intro}
            </p>
          )}
          <p className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
            {t.subtitle}
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2">
          {t.bullets.map((bullet, idx) => (
            <li
              key={idx}
              className="card-elevated p-5 flex items-start gap-3 animate-fade-in-up"
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-emerald mt-0.5" />
              <span className="text-sm text-foreground/90 leading-relaxed">
                {bullet}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
