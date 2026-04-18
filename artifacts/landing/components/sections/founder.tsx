import type { Messages } from '@/messages/types';

export function Founder({ t }: { t: Messages['founder'] }) {
  return (
    <section className="py-24 sm:py-32 bg-card/20 border-y border-border">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          {t.h2}
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-3 sm:gap-12 items-start">
          <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald/20 via-card to-card border border-border flex items-center justify-center text-6xl font-semibold text-emerald/40 font-mono">
            {/* Placeholder — replace with real founder photo at /public/founder.jpg */}
            B
          </div>
          <div className="sm:col-span-2 space-y-5">
            <p className="text-base text-muted-foreground leading-relaxed">{t.bio}</p>
            <blockquote className="text-lg sm:text-xl font-medium text-foreground/90 leading-relaxed border-l-2 border-emerald pl-5 italic">
              {t.quote}
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
