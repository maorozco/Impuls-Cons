import type { Messages } from '@/messages/types';

export function FounderV2({ t }: { t: Messages['founder'] }) {
  return (
    <section className="py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-6">
        <p className="v2-eyebrow">07 — quién construye</p>
        <h2 className="v2-serif mt-4 text-4xl sm:text-5xl md:text-6xl leading-[1.05] v2-ink">
          {t.h2}
        </h2>

        <div className="mt-16 space-y-16">
          {t.members.map((member) => (
            <div key={member.name} className="grid gap-10 md:grid-cols-[auto_1fr] md:gap-16">
              <div
                className="flex items-center justify-center v2-card"
                style={{ width: '180px', height: '180px', borderRadius: '50%' }}
              >
                <span className="v2-serif text-7xl italic v2-accent">{member.initial}</span>
              </div>
              <div className="max-w-2xl">
                <p className="v2-eyebrow">{member.name}</p>
                <p className="mt-4 text-base leading-relaxed v2-ink-soft">{member.bio}</p>
                <blockquote
                  className="v2-serif mt-6 text-xl sm:text-2xl italic leading-snug v2-ink pl-5"
                  style={{ borderLeft: '1px solid hsl(148 38% 26%)' }}
                >
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
