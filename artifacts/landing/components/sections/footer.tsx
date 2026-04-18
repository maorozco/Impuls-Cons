import Link from 'next/link';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';

export function Footer({ locale, t }: { locale: Locale; t: Messages['footer'] }) {
  const otherLocale: Locale = locale === 'es' ? 'en' : 'es';
  return (
    <footer className="border-t border-border bg-card/30">
      <div className="container-tight py-16">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <Column
            label={t.legal}
            items={[
              { href: '#', label: t.privacy },
              { href: '#', label: t.terms },
              { href: '#', label: t.cookies },
            ]}
          />
          <Column
            label={t.contact}
            items={[
              { href: 'mailto:hello@biocycle.ai', label: 'hello@biocycle.ai' },
              { href: '#', label: t.forPartners },
            ]}
          />
          <Column
            label={t.follow}
            items={[
              { href: '#', label: 'LinkedIn' },
              { href: '#', label: 'X' },
            ]}
          />
          <Column
            label={t.latest}
            items={[
              { href: '#', label: t.blog },
              { href: '#', label: t.newsletter },
              { href: '#', label: t.rss },
            ]}
          />
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/80 max-w-xl leading-relaxed">{t.copyright}</p>
          <Link
            href={`/${otherLocale}`}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {otherLocale.toUpperCase()}
          </Link>
        </div>
      </div>
    </footer>
  );
}

function Column({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-[0.2em] text-muted-foreground/70 mb-4">
        {label}
      </p>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <a
              href={item.href}
              className="text-sm text-foreground/70 hover:text-foreground transition-colors"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
