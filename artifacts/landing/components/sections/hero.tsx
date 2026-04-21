'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { animate, useInView, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signupForWaitlist } from '@/app/actions';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';

export function Hero({
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
    const payload = {
      email,
      locale,
      utmSource: params.get('utm_source') ?? undefined,
      utmMedium: params.get('utm_medium') ?? undefined,
      utmCampaign: params.get('utm_campaign') ?? undefined,
      utmContent: params.get('utm_content') ?? undefined,
      referrer: typeof document !== 'undefined' ? document.referrer || undefined : undefined,
    };

    // Optimistic UI — flash success state immediately while server processes.
    setSuccess(true);

    startTransition(async () => {
      const result = await signupForWaitlist(payload);
      if (!result.ok) {
        setSuccess(false);
        setError(result.error === 'invalid_email' ? t.errors.invalidEmail : t.errors.generic);
        return;
      }
      // Confetti burst on success — celebra el momento (Fase 0 · E3.6)
      try {
        const confetti = (await import('canvas-confetti')).default;
        const palette = ['#00C853', '#00D9F5', '#C4FF00', '#1B5E20'];
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: palette,
          ticks: 200,
        });
      } catch {
        /* confetti is decorative — ignore failures */
      }
      const target = `/${locale}/thank-you?email=${encodeURIComponent(email)}`;
      setTimeout(() => router.push(target), 800);
    });
  }

  return (
    <section
      id="waitlist"
      className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32"
    >
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />
      <div className="absolute inset-0 hero-glow pointer-events-none" aria-hidden />

      <div className="container-narrow relative">
        <div className="flex flex-col items-center text-center animate-fade-in-up">
          <span className="tag mb-6 uppercase tracking-wider">
            <span className="live-dot" aria-hidden />
            {t.kicker}
          </span>

          <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight max-w-4xl">
            <span className="text-foreground">{t.headlineLine1}</span>
            {t.headlineLine1Accent && (
              <>
                {' '}
                <span className="gradient-text">{t.headlineLine1Accent}</span>
              </>
            )}
            {hasLine2 && (
              <>
                <br />
                {t.headlineLine2 && <span className="text-foreground">{t.headlineLine2}</span>}
                {t.headlineLine2 && t.headlineLine2Accent && ' '}
                {t.headlineLine2Accent && (
                  <span className="gradient-text">{t.headlineLine2Accent}</span>
                )}
              </>
            )}
          </h1>

          <p className="mt-8 max-w-3xl text-base sm:text-lg leading-relaxed text-muted-foreground">
            {t.sub}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 w-full max-w-md flex flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="hero-email" className="sr-only">
              Email
            </label>
            <Input
              id="hero-email"
              type="email"
              required
              placeholder={t.emailPlaceholder}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending || success}
              className="h-12 text-base"
              autoComplete="email"
            />
            <Button
              type="submit"
              size="lg"
              disabled={isPending || success}
              className="h-12 px-6"
            >
              {success ? (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t.successInline}
                </>
              ) : isPending ? (
                t.submitting
              ) : (
                <>
                  {t.submit} <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {error && (
            <p className="mt-3 text-sm text-red-400 animate-fade-in-up" role="alert">
              {error}
            </p>
          )}

          <p className="mt-4 max-w-xl text-xs text-muted-foreground/80 leading-relaxed">
            {t.subCta}
          </p>

          <div className="mt-12 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="live-dot" aria-hidden />
            <AnimatedCount value={baselineCount} />
            <span>{t.counter}</span>
            <AnimatedCount value={baselineCountries} />
            <span>{t.countriesLabel}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Animated tabular counter — counts 0→value with rAF easing when in view.
 * Used for the "live" social proof under the hero CTA. (Fase 0 · E3.7)
 */
function AnimatedCount({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const unsub = rounded.on('change', setDisplay);
    return unsub;
  }, [rounded]);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [inView, value, mv]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {display}
    </span>
  );
}
