'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { signupForWaitlist } from '@/app/actions';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';

export function HeroV2({
  locale,
  t,
  initialCount,
  initialCountries,
}: {
  locale: Locale;
  t: Messages['hero'];
  initialCount: number;
  initialCountries: number;
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const baselineCount = Math.max(initialCount, 25);
  const baselineCountries = Math.max(initialCountries, 8);
  const hasLine2 = Boolean(t.headlineLine2 || t.headlineLine2Accent);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!email.includes('@') || email.length < 6) {
      setError(t.errors.invalidEmail);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    startTransition(async () => {
      const result = await signupForWaitlist({
        email,
        locale,
        variant: 'b',
        utmSource: params.get('utm_source') ?? undefined,
        utmMedium: params.get('utm_medium') ?? undefined,
        utmCampaign: params.get('utm_campaign') ?? undefined,
        utmContent: params.get('utm_content') ?? undefined,
        referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
      });
      if (!result.ok) {
        setError(result.error === 'invalid_email' ? t.errors.invalidEmail : t.errors.generic);
        return;
      }
      setSuccess(true);
      setTimeout(
        () => router.push(`/${locale}/v2/thank-you?email=${encodeURIComponent(email)}`),
        600,
      );
    });
  }

  return (
    <section id="waitlist" className="relative isolate overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32 v2-grain">
      <div className="relative mx-auto max-w-3xl px-6">
        <div className="v2-fade-in flex flex-col items-start">
          <span className="v2-eyebrow inline-flex items-center gap-2">
            <span className="v2-dot" aria-hidden />
            {t.kicker}
          </span>

          <h1 className="v2-serif mt-8 text-5xl sm:text-6xl md:text-7xl leading-[1.02] font-medium v2-ink">
            <span>{t.headlineLine1}</span>
            {t.headlineLine1Accent && (
              <>
                {' '}
                <span className="italic v2-accent">{t.headlineLine1Accent}</span>
              </>
            )}
            {hasLine2 && (
              <>
                <br />
                {t.headlineLine2 && <span>{t.headlineLine2}</span>}
                {t.headlineLine2 && t.headlineLine2Accent && ' '}
                {t.headlineLine2Accent && (
                  <span className="italic v2-accent">{t.headlineLine2Accent}</span>
                )}
              </>
            )}
          </h1>

          <div className="v2-rule-short mt-10" aria-hidden />

          <p className="mt-8 max-w-2xl text-lg leading-relaxed v2-ink-soft">{t.sub}</p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 w-full max-w-xl flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="v2-hero-email" className="sr-only">Email</label>
            <input
              id="v2-hero-email"
              type="email"
              required
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending || success}
              autoComplete="email"
              className="v2-input"
            />
            <button type="submit" disabled={isPending || success} className="v2-btn">
              {success ? (
                <>
                  <CheckCircle2 size={16} /> {t.successInline}
                </>
              ) : isPending ? (
                t.submitting
              ) : (
                <>
                  {t.submit} <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {error && (
            <p className="mt-3 text-sm" style={{ color: '#B3261E' }} role="alert">
              {error}
            </p>
          )}

          <p className="mt-5 max-w-xl text-xs leading-relaxed v2-ink-faint italic">
            {t.subCta}
          </p>

          <div className="mt-14 flex items-center gap-2 text-xs v2-ink-faint">
            <span className="v2-dot" aria-hidden />
            <span className="font-mono tabular-nums v2-ink">{baselineCount}</span>
            <span>{t.counter}</span>
            <span className="font-mono tabular-nums v2-ink">{baselineCountries}</span>
            <span>{t.countriesLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
