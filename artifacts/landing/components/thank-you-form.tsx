'use client';

import { useMemo, useState, useTransition } from 'react';
import { ArrowRight, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { submitWaitlistResponse } from '@/app/actions';
import { COUNTRIES } from '@/lib/countries';
import type { Locale } from '@/lib/i18n';
import type { Messages } from '@/messages/types';
import { cn } from '@/lib/utils';

type Q = Messages['thankYou']['questions'];

const PAST_METHOD_KEYS = [
  'traditional_bio',
  'incineration',
  'chemical',
  'excavation',
  'phyto',
  'natural',
  'nothing',
  'other',
] as const;

const TOTAL_QUESTIONS = 6;

export function ThankYouForm({
  locale,
  t,
  email,
}: {
  locale: Locale;
  t: Messages['thankYou'];
  email: string;
}) {
  const [role, setRole] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [sector, setSector] = useState<string>('');
  const [pain, setPain] = useState<string>('');
  const [pastMethods, setPastMethods] = useState<string[]>([]);
  const [timeline, setTimeline] = useState<string>('');
  const [callIntent, setCallIntent] = useState<string>('');
  const [submitted, setSubmitted] = useState<{ tier: string; score: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const completed = useMemo(() => {
    let n = 0;
    if (role) n++;
    if (country && sector) n++;
    if (pain.trim()) n++;
    if (pastMethods.length > 0) n++;
    if (timeline) n++;
    if (callIntent) n++;
    return n;
  }, [role, country, sector, pain, pastMethods, timeline, callIntent]);

  function togglePastMethod(key: string) {
    setPastMethods((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!role || !country || !pain.trim()) {
      setError(locale === 'es' ? 'Completa al menos rol, país y dolor.' : 'Fill at least role, country, and pain.');
      return;
    }

    startTransition(async () => {
      const result = await submitWaitlistResponse({
        email,
        role: (role as Parameters<typeof submitWaitlistResponse>[0]['role']),
        sector: (sector as Parameters<typeof submitWaitlistResponse>[0]['sector']),
        pain: pain.trim(),
        pastMethods,
        timeline: (timeline as Parameters<typeof submitWaitlistResponse>[0]['timeline']),
        callIntent: (callIntent as Parameters<typeof submitWaitlistResponse>[0]['callIntent']),
      });
      if (!result.ok) {
        setError(locale === 'es' ? 'Algo falló. Intenta de nuevo.' : 'Something went wrong. Try again.');
        return;
      }
      setSubmitted({ tier: result.tier, score: result.score });
    });
  }

  if (submitted) {
    return <SuccessPanel locale={locale} t={t} tier={submitted.tier} />;
  }

  const Q = t.questions;

  return (
    <div className="container-narrow py-16">
      <div className="mb-10 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">{t.title}</h1>
        <p className="text-lg text-muted-foreground leading-relaxed">{t.sub}</p>
      </div>

      <div className="card-elevated p-8 sm:p-10 space-y-8">
        <div className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">{t.formH2}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{t.formIntro}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>
              {t.progress
                .replace('{n}', String(completed))
                .replace('{total}', String(TOTAL_QUESTIONS))}
            </span>
            <span className="tabular-nums">{Math.round((completed / TOTAL_QUESTIONS) * 100)}%</span>
          </div>
          <Progress value={(completed / TOTAL_QUESTIONS) * 100} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* P1 — Role */}
          <Field number={1} label={Q.role.label}>
            <RadioGroup
              name="role"
              value={role}
              onChange={setRole}
              options={Object.entries(Q.role.options).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Field>

          {/* P2 — Country + Sector */}
          <Field number={2} label={Q.country.label}>
            <div className="grid gap-4 sm:grid-cols-2">
              <NativeSelect
                value={country}
                onChange={setCountry}
                placeholder={Q.country.placeholder}
                options={COUNTRIES.map((c) => ({
                  value: c.code,
                  label: locale === 'es' ? c.name_es : c.name_en,
                }))}
              />
              <NativeSelect
                value={sector}
                onChange={setSector}
                placeholder={Q.sector.label}
                options={Object.entries(Q.sector.options).map(([value, label]) => ({
                  value,
                  label,
                }))}
              />
            </div>
          </Field>

          {/* P3 — Pain (open text) */}
          <Field number={3} label={Q.pain.label}>
            <Textarea
              value={pain}
              onChange={(e) => setPain(e.target.value)}
              placeholder={Q.pain.placeholder}
              maxLength={500}
              rows={4}
            />
            <p className="mt-2 text-[11px] text-muted-foreground tabular-nums">{pain.length}/500</p>
          </Field>

          {/* P4 — Past methods */}
          <Field number={4} label={Q.pastMethods.label}>
            <div className="grid gap-2 sm:grid-cols-2">
              {PAST_METHOD_KEYS.map((key) => (
                <CheckboxRow
                  key={key}
                  checked={pastMethods.includes(key)}
                  onChange={() => togglePastMethod(key)}
                  label={Q.pastMethods.options[key]}
                />
              ))}
            </div>
          </Field>

          {/* P5 — Timeline */}
          <Field number={5} label={Q.timeline.label}>
            <RadioGroup
              name="timeline"
              value={timeline}
              onChange={setTimeline}
              options={Object.entries(Q.timeline.options).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Field>

          {/* P6 — Call intent */}
          <Field number={6} label={Q.callIntent.label}>
            <RadioGroup
              name="callIntent"
              value={callIntent}
              onChange={setCallIntent}
              options={Object.entries(Q.callIntent.options).map(([value, label]) => ({
                value,
                label,
              }))}
            />
          </Field>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
            {isPending ? (
              t.submitting
            ) : (
              <>
                {t.submit} <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}

// ───────────── Sub-components ─────────────

function Field({
  number,
  label,
  children,
}: {
  number: number;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3 pb-8 border-b border-border last:border-b-0 last:pb-0">
      <Label className="flex gap-2 text-base font-medium leading-relaxed">
        <span className="font-mono text-emerald shrink-0">0{number}.</span>
        <span>{label}</span>
      </Label>
      <div className="pl-6">{children}</div>
    </div>
  );
}

function RadioGroup({
  name,
  value,
  onChange,
  options,
}: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="space-y-2">
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <label
            key={opt.value}
            className={cn(
              'flex items-start gap-3 cursor-pointer rounded-md border px-4 py-3 transition-all',
              selected
                ? 'border-emerald bg-emerald/5'
                : 'border-border hover:border-muted-foreground/40 hover:bg-muted/40',
            )}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={selected}
              onChange={() => onChange(opt.value)}
              className="sr-only"
            />
            <span
              className={cn(
                'mt-0.5 h-4 w-4 rounded-full border-2 shrink-0 transition-all',
                selected
                  ? 'border-emerald bg-emerald'
                  : 'border-border',
              )}
              aria-hidden
            >
              {selected && (
                <span className="block h-full w-full rounded-full bg-background scale-[0.4]" />
              )}
            </span>
            <span className={cn('text-sm', selected ? 'text-foreground' : 'text-foreground/80')}>
              {opt.label}
            </span>
          </label>
        );
      })}
    </div>
  );
}

function CheckboxRow({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label
      className={cn(
        'flex items-start gap-3 cursor-pointer rounded-md border px-4 py-3 transition-all',
        checked ? 'border-emerald bg-emerald/5' : 'border-border hover:border-muted-foreground/40',
      )}
    >
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={cn(
          'mt-0.5 h-4 w-4 rounded shrink-0 border-2 flex items-center justify-center transition-all',
          checked ? 'border-emerald bg-emerald' : 'border-border',
        )}
        aria-hidden
      >
        {checked && <CheckCircle2 className="h-3 w-3 text-background" strokeWidth={3} />}
      </span>
      <span className={cn('text-sm', checked ? 'text-foreground' : 'text-foreground/80')}>
        {label}
      </span>
    </label>
  );
}

function NativeSelect({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald focus-visible:border-emerald transition-colors appearance-none cursor-pointer"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 0.75rem center',
        paddingRight: '2.5rem',
      }}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function SuccessPanel({
  locale,
  t,
  tier,
}: {
  locale: Locale;
  t: Messages['thankYou'];
  tier: string;
}) {
  const isGreen = tier === 'green';
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <div className="container-narrow py-32 text-center animate-fade-in-up">
      <div className="mx-auto mb-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald/10 border border-emerald/30">
        <CheckCircle2 className="h-8 w-8 text-emerald" />
      </div>

      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
        {isGreen ? t.successGreen.h2 : t.successOther.h2}
      </h1>

      <p className="mt-6 max-w-xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
        {isGreen ? t.successGreen.body : t.successOther.body}
      </p>

      {isGreen && (
        <div className="mt-10 space-y-3">
          <Button asChild size="lg">
            <a
              href={calendlyUrl ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-disabled={!calendlyUrl}
            >
              {t.successGreen.cta} <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
          <p className="text-xs text-muted-foreground">{t.successGreen.fallback}</p>
        </div>
      )}
    </div>
  );
}
