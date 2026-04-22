'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * BioCycle Onboarding
 *
 * Best-practice synthesis from Linear / Notion / Intercom / Stripe / Figma:
 *  1. Welcome modal (full-screen, dismissible) — compact value props, one primary + one secondary CTA.
 *  2. Spotlight tour — 5 steps max, each spotlights a real DOM element with darkened backdrop.
 *  3. Keyboard: Enter = next, Esc = skip, ← / → to navigate.
 *  4. Progress indicator (dots) + "Saltar tour" always visible.
 *  5. localStorage persistence (v1 key) — re-trigger via "?" button in topbar.
 *  6. Respects prefers-reduced-motion.
 *
 * Steps are element-agnostic: pass a CSS selector that resolves at runtime. The spotlight
 * measures the element's bounding rect and overlays a cutout + tooltip positioned intelligently.
 * If an element isn't on the current page, the step auto-skips.
 */

const STORAGE_KEY = 'biocycle_onboarded_v1';

export interface TourStep {
  id: string;
  /** CSS selector to spotlight. null = centered modal without spotlight (e.g. welcome, completion). */
  selector: string | null;
  title: string;
  /** Optional lede paragraph. Keep under 2 short sentences. */
  body?: string;
  /** Optional bullet list. Renders as <ul className="ob-bullets"> — easier to scan than prose. */
  bullets?: string[];
  /** Optional small caption below the bullets — use for the "why" or a caveat. */
  footnote?: string;
  /** Where to place tooltip relative to target. Defaults to 'bottom'. */
  side?: 'top' | 'bottom' | 'left' | 'right';
  /** Optional route to navigate to before showing this step. */
  route?: string;
  /** Optional CTA rendered in the step; when clicked, completes onboarding + navigates. */
  primary?: { label: string; href?: string };
}

const TOUR: TourStep[] = [
  {
    id: 'welcome',
    selector: null,
    title: 'Bienvenido a Impulso BioCycle',
    body:
      'Te ayudamos a elegir la mezcla óptima de bacterias y hongos para limpiar un contaminante específico — con fuentes científicas detrás de cada recomendación.',
    bullets: [
      '4,797 referencias peer-reviewed',
      '28 microorganismos seguros (BSL-1 / GRAS)',
      '33 contaminantes modelados',
    ],
    footnote: 'Tour de 90 segundos · te mostramos qué hace cada sección.',
  },
  {
    id: 'sidebar',
    selector: 'aside.sidebar nav.nav',
    title: '5 secciones · atajos 1–5',
    bullets: [
      'Inicio · la idea general',
      'Descubrimientos · papers científicos',
      'Construye · arma tu consorcio paso a paso',
      'Gestiona · cotiza proyectos y ve el mercado',
      'Asesoría · pregúntale al asistente con fuentes',
    ],
    footnote: 'Presiona 1, 2, 3… para saltar directo a cada sección.',
    side: 'right',
  },
  {
    id: 'paths',
    selector: '.paths',
    route: '/biocycle/inicio',
    title: 'Dos caminos, un mismo motor',
    bullets: [
      'Si eres laboratorio → Construye tu Consorcio: wizard técnico con probabilidad de éxito y protocolo de 90 días.',
      'Si eres empresa → Gestiona tus Residuos: cotiza proyectos, ve qué dice el mercado y revisa un caso ilustrativo.',
    ],
    footnote: 'Ambos caminos usan la misma base de datos validada científicamente.',
    side: 'top',
  },
  {
    id: 'metrics',
    selector: '.metrics',
    route: '/biocycle/inicio',
    title: 'Fuentes que puedes abrir y leer',
    body: 'Todo lo que recomendamos viene de papers reales. No inventamos.',
    bullets: [
      '10 papers peer-reviewed (Nature, Science, PNAS)',
      '33 consorcios ya probados en literatura',
      '18 bases internas por tipo de contaminante',
    ],
    footnote: 'Cada respuesta del asistente cita sus fuentes — las puedes abrir al instante.',
    side: 'top',
  },
  {
    id: 'asesoria',
    selector: null,
    title: '¿Tu próximo paso?',
    body:
      'Empieza con una pregunta concreta al asistente — o salta al diseñador si ya conoces las condiciones del sitio.',
    bullets: [
      'Ejemplo: "¿Qué consorcio recomiendas para TPH en suelo arcilloso?"',
      'Si algo no tiene evidencia suficiente, el asistente te lo dice con honestidad — no inventa resultados.',
    ],
    footnote: 'Pulsa Enter o clic en el botón para abrir la Asesoría IA.',
    primary: { label: 'Abrir Asesoría IA', href: '/biocycle/asesoria' },
  },
];

export function BiocycleOnboarding() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const currentStep = TOUR[stepIdx];

  // Decide whether to auto-open on first load
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const seen = window.localStorage.getItem(STORAGE_KEY);
    const autostart = new URLSearchParams(window.location.search).get('tour') === '1';
    if (!seen || autostart) {
      // Small delay so the page has a chance to paint first
      const t = setTimeout(() => setOpen(true), 350);
      return () => clearTimeout(t);
    }
  }, []);

  // Listen for manual trigger events from topbar help button
  useEffect(() => {
    const handler = () => {
      setStepIdx(0);
      setOpen(true);
    };
    window.addEventListener('biocycle:open-onboarding', handler);
    return () => window.removeEventListener('biocycle:open-onboarding', handler);
  }, []);

  // Keyboard nav
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        dismiss('skip');
      } else if (e.key === 'Enter' || e.key === 'ArrowRight') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        back();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepIdx]);

  // Measure spotlight target — re-run on resize/scroll
  useEffect(() => {
    if (!open) return;
    if (!currentStep.selector) {
      setRect(null);
      return;
    }

    let cancelled = false;
    let tries = 0;

    async function measure() {
      // If a route is configured and we're not there, navigate first
      if (currentStep.route && !window.location.pathname.startsWith(currentStep.route)) {
        router.push(currentStep.route);
        await new Promise((r) => setTimeout(r, 500));
      }

      while (!cancelled && tries < 20) {
        if (currentStep.selector) {
          const el = document.querySelector(currentStep.selector);
          if (el) {
            // Bring target into view if outside
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise((r) => setTimeout(r, 350));
            const r = el.getBoundingClientRect();
            if (r.width > 0 && r.height > 0) {
              setRect(r);
              return;
            }
          }
        }
        tries += 1;
        await new Promise((r) => setTimeout(r, 150));
      }
      // Couldn't find — skip gracefully to next step
      if (!cancelled) next();
    }

    measure();
    const onResize = () => {
      if (currentStep.selector) {
        const el = document.querySelector(currentStep.selector);
        if (el) setRect(el.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    return () => {
      cancelled = true;
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onResize, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepIdx]);

  const dismiss = (reason: 'skip' | 'complete') => {
    window.localStorage.setItem(STORAGE_KEY, `${reason}:${Date.now()}`);
    setOpen(false);
  };

  const next = () => {
    if (stepIdx >= TOUR.length - 1) {
      dismiss('complete');
      if (currentStep.primary?.href) {
        router.push(currentStep.primary.href);
      }
      return;
    }
    setStepIdx((i) => i + 1);
  };

  const back = () => setStepIdx((i) => Math.max(0, i - 1));

  if (!open) return null;

  return (
    <div className="ob-root" role="dialog" aria-modal="true" aria-label="Tour de onboarding">
      {/* Backdrop — full-screen dim unless spotlighting */}
      {!rect && <div className="ob-backdrop" data-testid="onboarding-backdrop" />}

      {/* Spotlight cutout (SVG mask trick) */}
      {rect && (
        <svg className="ob-mask" aria-hidden="true">
          <defs>
            <mask id="ob-cutout-mask" maskUnits="userSpaceOnUse">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              <rect
                x={rect.left - 8}
                y={rect.top - 8}
                width={rect.width + 16}
                height={rect.height + 16}
                rx="14"
                ry="14"
                fill="black"
              />
            </mask>
          </defs>
          <rect x="0" y="0" width="100%" height="100%" fill="rgba(8, 18, 12, 0.62)" mask="url(#ob-cutout-mask)" />
          <rect
            x={rect.left - 8}
            y={rect.top - 8}
            width={rect.width + 16}
            height={rect.height + 16}
            rx="14"
            ry="14"
            fill="none"
            stroke="#C4FF00"
            strokeWidth="2"
            style={{ filter: 'drop-shadow(0 0 12px rgba(196,255,0,.35))' }}
          />
        </svg>
      )}

      {/* Tooltip / modal card */}
      <OnboardingCard
        step={currentStep}
        stepIdx={stepIdx}
        total={TOUR.length}
        rect={rect}
        tooltipRef={tooltipRef}
        onSkip={() => dismiss('skip')}
        onNext={next}
        onBack={back}
      />

      <style>{css}</style>
    </div>
  );
}

/** Tooltip-style card when spotlighting; full-screen modal when `rect` is null. */
function OnboardingCard({
  step,
  stepIdx,
  total,
  rect,
  tooltipRef,
  onSkip,
  onNext,
  onBack,
}: {
  step: TourStep;
  stepIdx: number;
  total: number;
  rect: DOMRect | null;
  tooltipRef: React.RefObject<HTMLDivElement | null>;
  onSkip: () => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const pos = useMemo(() => tooltipPosition(rect, step.side), [rect, step.side]);
  const isFirst = stepIdx === 0;
  const isLast = stepIdx === total - 1;

  return (
    <div
      ref={tooltipRef as React.RefObject<HTMLDivElement>}
      className={`ob-card ${rect ? 'ob-tooltip' : 'ob-modal'}`}
      style={rect ? pos : undefined}
      data-testid={`onboarding-step-${step.id}`}
      role="document"
    >
      {/* Header: progress + skip */}
      <div className="ob-head">
        <div className="ob-progress" aria-label={`Paso ${stepIdx + 1} de ${total}`}>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={`ob-dot ${i === stepIdx ? 'active' : i < stepIdx ? 'done' : ''}`} />
          ))}
        </div>
        <button className="ob-skip" onClick={onSkip} data-testid="onboarding-skip" aria-label="Saltar tour">
          Saltar
        </button>
      </div>

      {/* Eyebrow */}
      <div className="ob-eyebrow">
        Paso {stepIdx + 1} / {total} · Tour ~90 s
      </div>

      {/* Welcome + final steps get a small editorial visual */}
      {!rect && (step.id === 'welcome' || step.id === 'asesoria') && (
        <div className="ob-visual">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/biocycle/img/onboarding-welcome@2x.webp"
            alt=""
            loading="lazy"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Title + body + bullets + footnote */}
      <h2 className="ob-title">{step.title}</h2>
      {step.body && <p className="ob-body">{step.body}</p>}
      {step.bullets && step.bullets.length > 0 && (
        <ul className="ob-bullets">
          {step.bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
      {step.footnote && <p className="ob-footnote">{step.footnote}</p>}

      {/* Footer: back + next */}
      <div className="ob-foot">
        <div>
          {!isFirst && (
            <button className="ob-btn ob-btn-ghost" onClick={onBack} data-testid="onboarding-back">
              ← Atrás
            </button>
          )}
        </div>
        <div className="ob-foot-right">
          <span className="ob-kbd" aria-hidden="true">Enter</span>
          <button
            className="ob-btn ob-btn-primary"
            onClick={onNext}
            data-testid="onboarding-next"
            autoFocus
          >
            {isLast ? (step.primary?.label ?? '¡Listo!') : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}

function tooltipPosition(rect: DOMRect | null, side: TourStep['side'] = 'bottom') {
  if (!rect) return {};
  const GAP = 16;
  const W = 380;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  // Compute intended position
  let top = 0;
  let left = 0;

  if (side === 'right') {
    top = Math.max(16, rect.top + rect.height / 2 - 120);
    left = rect.right + GAP;
  } else if (side === 'left') {
    top = Math.max(16, rect.top + rect.height / 2 - 120);
    left = rect.left - GAP - W;
  } else if (side === 'top') {
    top = rect.top - GAP - 260;
    left = rect.left + rect.width / 2 - W / 2;
  } else {
    top = rect.bottom + GAP;
    left = rect.left + rect.width / 2 - W / 2;
  }

  // Clamp to viewport
  left = Math.max(16, Math.min(left, vw - W - 16));
  top = Math.max(16, Math.min(top, vh - 280));

  return { top, left, width: W } satisfies React.CSSProperties;
}

/** Global toggle used by the topbar "?" button to re-trigger the tour. */
export function launchOnboarding() {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('biocycle:open-onboarding'));
  }
}

const css = `
.ob-root{
  position:fixed; inset:0; z-index:9999;
  font-family:var(--font-sans);
  color:var(--ink);
}
.ob-backdrop{
  position:absolute; inset:0;
  background:rgba(8,18,12,0.62);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  animation: ob-fade .25s ease both;
}
.ob-mask{
  position:absolute; inset:0; width:100%; height:100%;
  pointer-events:none;
  animation: ob-fade .25s ease both;
}
@keyframes ob-fade{ from{opacity:0} to{opacity:1} }
@keyframes ob-pop{
  from{ opacity:0; transform:translateY(6px) scale(.98); }
  to{ opacity:1; transform:translateY(0) scale(1); }
}
.ob-card{
  background:#fff;
  border:1px solid var(--line);
  border-radius:16px;
  box-shadow: 0 24px 56px -16px rgba(8,18,12,0.35), 0 4px 12px -4px rgba(8,18,12,0.18);
  padding:24px 26px calc(20px + env(safe-area-inset-bottom));
  animation: ob-pop .28s cubic-bezier(.2,.9,.3,1) both;
  display:flex;
  flex-direction:column;
}
.ob-modal{
  position:fixed; top:50%; left:50%;
  transform:translate(-50%,-50%);
  width:min(460px, 92vw);
  max-width:92vw;
  max-height:min(88vh, 680px);
  overflow-y:auto;
}
.ob-tooltip{
  position:fixed;
  max-height:calc(100vh - 32px);
  overflow-y:auto;
}
.ob-head{
  display:flex; align-items:center; justify-content:space-between;
  margin-bottom:14px;
}
.ob-progress{ display:flex; gap:6px; }
.ob-dot{
  width:22px; height:4px; border-radius:99px;
  background:var(--line);
  transition: background .25s ease, transform .25s ease;
}
.ob-dot.active{ background:var(--forest-deep); transform:scaleY(1.4); }
.ob-dot.done{ background:var(--green-bright); }
.ob-skip{
  font-family:var(--font-mono); font-size:11px; letter-spacing:.1em;
  color:var(--muted); text-transform:uppercase;
  background:transparent; border:0; cursor:pointer;
  padding:4px 8px; border-radius:6px;
}
.ob-skip:hover{ color:var(--ink); background:rgba(0,77,44,.06); }
.ob-eyebrow{
  font-family:var(--font-mono); font-size:10.5px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--muted);
  margin-bottom:8px;
}
.ob-visual{
  margin:4px 0 14px; border-radius:12px; overflow:hidden;
  background:linear-gradient(135deg, rgba(0,217,245,.06), rgba(196,255,0,.05));
  aspect-ratio:16/9; display:flex; align-items:center; justify-content:center;
}
.ob-visual img{width:100%; height:100%; object-fit:cover; display:block;}
.ob-title{
  font-family:var(--font-sans);
  font-size:22px; font-weight:700; letter-spacing:-.02em;
  color:var(--ink);
  margin:0 0 8px;
  line-height:1.2;
}
.ob-body{
  font-size:14px; color:var(--ink-2); line-height:1.55;
  margin:0 0 12px;
}
.ob-bullets{
  list-style:none; padding:0; margin:0 0 14px;
  display:flex; flex-direction:column; gap:8px;
}
.ob-bullets li{
  position:relative; padding-left:18px;
  font-size:13.5px; color:var(--ink-2); line-height:1.5;
}
.ob-bullets li::before{
  content:""; position:absolute; left:2px; top:9px;
  width:8px; height:2px; background:var(--lime, #C4FF00); border-radius:2px;
}
.ob-footnote{
  font-size:12px; color:var(--muted);
  margin:0 0 20px; line-height:1.45;
  padding:8px 10px; border-left:2px solid rgba(0,77,44,.15);
  background:rgba(0,77,44,.03); border-radius:0 6px 6px 0;
}
.ob-foot{
  display:flex; justify-content:space-between; align-items:center;
  gap:12px;
  position:sticky; bottom:0;
  padding-top:14px;
  margin-top:auto;
  background:linear-gradient(180deg, rgba(255,255,255,0) 0%, #fff 25%);
}
.ob-foot-right{ display:flex; align-items:center; gap:10px; }
.ob-btn{
  display:inline-flex; align-items:center; justify-content:center; gap:8px;
  min-height:44px; padding:0 16px; border-radius:9px;
  font-family:inherit; font-size:13px; font-weight:600;
  border:1px solid transparent; cursor:pointer;
  transition: transform .12s ease, background .2s ease;
}
.ob-btn:hover{ transform: translateY(-1px); }
.ob-btn-primary{
  background:var(--forest-deep); color:#fff;
  box-shadow: 0 8px 16px -8px rgba(0,77,44,.55);
}
.ob-btn-primary:hover{ background:#003820; }
.ob-btn-ghost{
  background:#fff; color:var(--ink-2);
  border-color:var(--line-strong);
}
.ob-btn-ghost:hover{ border-color:var(--ink-2); color:var(--ink); }
.ob-kbd{
  display:inline-flex; align-items:center;
  font-family:var(--font-mono); font-size:10.5px; letter-spacing:.06em;
  color:var(--muted-2);
  border:1px solid var(--line);
  padding:3px 7px; border-radius:6px; background:#fff;
}
@media (max-width:640px){
  .ob-modal{
    top:50% !important; left:50% !important;
    transform:translate(-50%, -50%) !important;
    width:min(92vw, 420px);
    max-width:min(92vw, 420px);
    max-height:min(82vh, 620px);
    padding:20px 18px calc(20px + env(safe-area-inset-bottom));
  }
  .ob-tooltip{
    position:fixed !important;
    left:16px !important; right:16px !important;
    top:auto !important;
    bottom:calc(16px + env(safe-area-inset-bottom)) !important;
    width:calc(100vw - 32px) !important;
    max-width:calc(100vw - 32px);
    max-height:min(78vh, 560px);
    padding:18px 16px calc(16px + env(safe-area-inset-bottom));
  }
  .ob-title{ font-size:19px; }
  .ob-body{ font-size:13.5px; }
  .ob-bullets li{ font-size:13px; }
  .ob-foot{ gap:8px; }
  .ob-btn{ font-size:13.5px; padding:0 14px; }
  .ob-kbd{ display:none; }
}
@media (prefers-reduced-motion: reduce){
  .ob-backdrop, .ob-mask, .ob-card { animation: none !important; }
}
`;
