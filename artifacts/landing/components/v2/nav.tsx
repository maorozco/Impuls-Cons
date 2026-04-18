'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';

export function NavV2({ locale, t }: { locale: Locale; t: Messages['nav'] }) {
  const [scrolled, setScrolled] = useState(false);
  const otherLocale: Locale = locale === 'es' ? 'en' : 'es';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'hsl(44 36% 96% / 0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: scrolled ? '1px solid hsl(44 14% 84%)' : '1px solid transparent',
      }}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href={`/${locale}/v2`} className="flex items-baseline gap-2 group">
          <span className="v2-serif text-xl font-medium tracking-tight v2-ink">
            Impulso <span className="v2-accent italic">BioCycle</span>
          </span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href={`/${otherLocale}/v2`}
            className="hidden sm:inline-flex text-[11px] font-mono tracking-widest v2-ink-faint hover:v2-ink transition-colors"
            aria-label={`Switch to ${otherLocale.toUpperCase()}`}
          >
            {t.languageToggle}
          </Link>
          <a href="#waitlist" className="v2-btn-ghost v2-btn" style={{ height: '38px', fontSize: '13px' }}>
            {t.cta}
          </a>
        </div>
      </nav>
    </header>
  );
}
