import type { Messages } from '@/messages/types';

export function SocialProof({ t }: { t: Messages['socialProof'] }) {
  const journals = ['Nature', 'Science', 'ACS Catalysis', 'PNAS', 'Nobel Química 2024'];
  const partners = ['Universidad Javeriana', 'UNAL', 'UTB Bolívar'];

  return (
    <section className="py-16 sm:py-20 border-y border-border bg-card/30">
      <div className="container-tight space-y-10">
        <Group label={t.publishedIn} items={journals} />
        <Group label={t.partnerships} items={partners} />
      </div>
    </section>
  );
}

function Group({ label, items }: { label: string; items: string[] }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/70 mb-5 text-center">
        {label}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
        {items.map((item) => (
          <span
            key={item}
            className="text-sm sm:text-base font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
