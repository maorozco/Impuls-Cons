import type { Messages } from '@/messages/types';

export function Founder({ t }: { t: Messages['founder'] }) {
  return (
    <section className="py-24 sm:py-32 bg-card/20 border-y border-border">
      <div className="container-tight">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">
          {t.h2}
        </h2>

        <div className="mt-12 space-y-16 sm:space-y-20">
          {t.members.map((member) => (
            <div
              key={member.name}
              className="grid gap-10 sm:grid-cols-3 sm:gap-12 items-start"
            >
              <div className="aspect-square rounded-xl bg-gradient-to-br from-emerald/20 via-card to-card border border-border flex items-center justify-center text-6xl font-semibold text-emerald/40 font-mono">
                {member.initial}
              </div>
              <div className="sm:col-span-2 space-y-5">
                <p className="text-sm uppercase tracking-wider text-emerald font-mono">
                  {member.name}
                </p>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {member.bio}
                </p>
                <blockquote className="text-lg sm:text-xl font-medium text-foreground/90 leading-relaxed border-l-2 border-emerald pl-5 italic">
                  {member.quote}
                </blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
