'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { signupForWaitlist } from '@/app/actions';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';

export function FinalCtaV2({
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
        variant: 'b',
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
        () => router.push(`/${locale}/v2/thank-you?email=${encodeURIComponent(email)}`),
        500,
      );
    });
  }

  return (
    <section className="py-28 sm:py-40 border-t" style={{ borderColor: 'hsl(44 14% 84%)' }}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="v2-serif text-5xl sm:text-6xl md:text-7xl leading-[1.02] v2-ink">
          <span>{t.headline}</span>
          <br />
          <span className="italic v2-accent">{t.headlineAccent}</span>
        </h2>

        <p className="v2-serif mt-10 max-w-xl mx-auto text-xl sm:text-2xl italic leading-snug v2-ink-soft">
          {t.sub}
        </p>

        <p className="mt-5 max-w-xl mx-auto text-sm v2-ink-faint leading-relaxed">{t.fine}</p>

        <form
          onSubmit={handleSubmit}
          className="mt-12 mx-auto max-w-xl flex flex-col gap-3 sm:flex-row"
        >
          <input
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
            {success ? <CheckCircle2 size={16} /> : <>{t.submit} <ArrowRight size={16} /></>}
          </button>
        </form>

        {error && (
          <p className="mt-3 text-sm" style={{ color: '#B3261E' }}>
            {error}
          </p>
        )}

        <p className="mt-10 text-xs v2-ink-faint">
          <span className="font-mono tabular-nums v2-ink">{baselineCount}</span>{' '}
          {t.counter1}{' '}
          <span className="font-mono tabular-nums v2-ink">{remaining}</span>{' '}
          {t.counter2}
        </p>
      </div>
    </section>
  );
}
