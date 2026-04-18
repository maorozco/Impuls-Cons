'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signupForWaitlist } from '@/app/actions';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';

export function FinalCta({
  locale,
  t,
  initialCount,
  errors,
}: {
  locale: Locale;
  t: Messages['finalCta'];
  initialCount: number;
  errors: Messages['hero']['errors'];
}) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const baselineCount = Math.max(initialCount, 25);
  const remaining = Math.max(100 - baselineCount, 0);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    if (!email.includes('@') || email.length < 6) {
      setError(errors.invalidEmail);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    startTransition(async () => {
      const result = await signupForWaitlist({
        email,
        locale,
        utmSource: params.get('utm_source') ?? undefined,
        utmMedium: params.get('utm_medium') ?? undefined,
        utmCampaign: params.get('utm_campaign') ?? undefined,
        utmContent: params.get('utm_content') ?? undefined,
      });
      if (!result.ok) {
        setError(result.error === 'invalid_email' ? errors.invalidEmail : errors.generic);
        return;
      }
      setSuccess(true);
      setTimeout(
        () => router.push(`/${locale}/thank-you?email=${encodeURIComponent(email)}`),
        500,
      );
    });
  }

  return (
    <section className="relative isolate overflow-hidden py-32 sm:py-40">
      <div
        className="absolute inset-0 bg-gradient-to-b from-background via-emerald/[0.04] to-background pointer-events-none"
        aria-hidden
      />
      <div className="absolute inset-0 grid-bg pointer-events-none" aria-hidden />

      <div className="container-narrow relative text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
          <span className="text-foreground">{t.headline}</span>
          <br />
          <span className="gradient-text">{t.headlineAccent}</span>
        </h2>

        <p className="mt-8 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
          {t.sub}
        </p>

        <p className="mt-4 max-w-xl mx-auto text-sm text-muted-foreground/70 leading-relaxed">
          {t.fine}
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 mx-auto max-w-lg flex flex-col gap-3 sm:flex-row"
        >
          <Input
            type="email"
            required
            placeholder={t.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending || success}
            className="h-12 text-base"
            autoComplete="email"
          />
          <Button type="submit" size="lg" disabled={isPending || success} className="h-12 px-6 whitespace-nowrap">
            {success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <>
                {t.submit} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>

        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        <p className="mt-8 text-xs text-muted-foreground">
          <span className="font-mono tabular-nums text-foreground">{baselineCount}</span>{' '}
          {t.counter1}{' '}
          <span className="font-mono tabular-nums text-foreground">{remaining}</span>{' '}
          {t.counter2}
        </p>
      </div>
    </section>
  );
}
