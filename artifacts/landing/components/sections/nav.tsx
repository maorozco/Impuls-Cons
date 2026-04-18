'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';

export function Nav({ locale, t }: { locale: Locale; t: Messages['nav'] }) {
  const [scrolled, setScrolled] = useState(false);
  const otherLocale: Locale = locale === 'es' ? 'en' : 'es';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border bg-background/85 backdrop-blur-lg'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <nav className="container-tight flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-2 group">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-md bg-emerald/10 text-emerald font-mono font-bold text-sm border border-emerald/30 transition-all group-hover:bg-emerald/20">
            B
            <span className="absolute -inset-px rounded-md bg-emerald/0 group-hover:bg-emerald/10 transition-colors" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Impulso<span className="text-emerald">BioCycle</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href={`/${otherLocale}`}
            className="hidden sm:inline-flex h-9 px-3 items-center justify-center rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label={`Switch to ${otherLocale.toUpperCase()}`}
          >
            {t.languageToggle}
          </Link>
          <Button asChild size="sm">
            <a href="#waitlist">{t.cta}</a>
          </Button>
        </div>
      </nav>
    </header>
  );
}
