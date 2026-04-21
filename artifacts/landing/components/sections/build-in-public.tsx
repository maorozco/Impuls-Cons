'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, useTransform, animate } from 'framer-motion';

/**
 * Build-in-public widget — consumes /api/insights.
 *
 * UX (Fase 0 · E3.1):
 *   - Entrada con fade+slide al entrar al viewport (framer-motion)
 *   - Contador anima 0→N al ser visible
 *   - Paleta BioCycle consistente
 *   - Mobile responsive con grid auto-fit
 *   - Graceful degrade: si /api/insights falla, muestra mock numbers
 */

interface InsightsPayload {
  updated_at: string;
  mode: 'live' | 'mock';
  signups: { total: number; last_7d: number; countries: number };
  reddit: { posts_classified_total: number; high_pain_7d: number };
  top_pains: Array<{ theme: string; avatar_match: string; quote_count: number }>;
}

export function BuildInPublicWidget({ locale = 'es' }: { locale?: 'es' | 'en' }) {
  const [data, setData] = useState<InsightsPayload | null>(null);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/insights', { cache: 'no-store' })
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled) {
          setData(json as InsightsPayload);
          setLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const esp = locale === 'es';
  const signups = data?.signups.total ?? 25;
  const countries = data?.signups.countries ?? 4;
  const classifiedPosts = data?.reddit.posts_classified_total ?? 0;
  const topPain = data?.top_pains?.[0];

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label={esp ? 'Construyendo en público — métricas en vivo' : 'Building in public — live metrics'}
      className="relative mx-auto my-12 max-w-6xl rounded-2xl bg-gradient-to-br from-[#004D2C] via-[#006633] to-[#1B5E20] px-6 py-7 text-white shadow-xl sm:px-10"
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-center">
        <BipCounter
          value={signups}
          label={esp ? 'Signups a la waitlist' : 'Waitlist signups'}
          animate={inView}
        />
        <BipCounter
          value={countries}
          label={esp ? 'Países representados' : 'Countries'}
          animate={inView}
        />
        <BipCounter
          value={classifiedPosts}
          label={esp ? 'Quejas escuchadas 30d' : 'Complaints listened 30d'}
          animate={inView}
          suffix="+"
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-sm leading-relaxed"
        >
          <div className="text-[10px] uppercase tracking-[2px] font-bold text-white/70">
            {esp ? 'Tema del momento' : 'Top theme'}
          </div>
          <div className="mt-1 text-base font-bold text-[#C4FF00]">
            {topPain?.theme ??
              (esp ? 'EPA PFAS: parálisis regulatoria' : 'EPA PFAS: regulatory paralysis')}
          </div>
          <div className="mt-1 text-[11px] text-white/60">
            {loaded
              ? data?.mode === 'live'
                ? esp
                  ? 'actualizado al cierre del día'
                  : 'updated at end-of-day'
                : esp
                  ? 'modo demo · datos compuestos'
                  : 'demo mode · composite data'
              : esp
                ? 'cargando...'
                : 'loading...'}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

/**
 * Animated counter — counts from 0 to `value` over 1.6s with easing.
 * Uses framer-motion's motion values for smooth rAF-driven animation.
 */
function BipCounter({
  value,
  label,
  animate: shouldAnimate,
  suffix = '',
}: {
  value: number;
  label: string;
  animate: boolean;
  suffix?: string;
}) {
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (latest) => Math.round(latest).toLocaleString());
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    const unsub = rounded.on('change', setDisplay);
    return unsub;
  }, [rounded]);

  useEffect(() => {
    if (shouldAnimate) {
      const controls = animate(mv, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
      return controls.stop;
    }
  }, [shouldAnimate, value, mv]);

  return (
    <div>
      <div className="text-[34px] font-extrabold leading-none text-[#00D9F5]">
        {display}
        {suffix}
      </div>
      <div className="mt-2 text-xs text-white/85">{label}</div>
    </div>
  );
}
