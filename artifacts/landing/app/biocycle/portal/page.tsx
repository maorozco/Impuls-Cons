'use client';

import { useEffect, useMemo, useState } from 'react';
import './portal.css';
import { BiocycleImage } from '@/components/biocycle/biocycle-image';
import {
  COTIZA_RULES,
  computeQuote,
  type CountryCode,
  type OpSlug,
  type QuoteResult,
  type Urgency,
} from '@/lib/cotiza-rules';

// Shape of /api/insights — subset we consume in the Escucha Activa tab.
interface InsightsLiveData {
  mode: 'live' | 'mock';
  updated_at: string;
  reddit?: {
    posts_classified_total?: number;
    high_pain_7d?: number;
    top_avatars_7d?: Array<{ avatar: string; count: number }>;
  };
  top_pains?: Array<{
    theme: string;
    avatar_match: string;
    quote_count: number;
    top_quote: { quote: string; subreddit: string; url: string } | null;
  }>;
  top_competitors_7d?: Array<{ competitor: string; mentions: number; avg_sentiment: number }>;
}

const TABS = [
  { id: 'cotiza', label: '📋 Cotiza', cnt: 'Plan + ROI' },
  { id: 'escucha', label: '🎧 Escucha Activa', cnt: '4,797 posts' },
  { id: 'caso', label: '📊 Caso ilustrativo', cnt: 'Refinería Andina' },
] as const;
type TabId = (typeof TABS)[number]['id'];

const URGENCY_OPTIONS: { key: Urgency; label: string; sub: string }[] = [
  { key: 'low', label: 'Baja', sub: '>12 meses' },
  { key: 'med', label: 'Media', sub: '3–12 meses' },
  { key: 'high', label: 'Alta', sub: '<3 meses' },
];

const COUNTRY_OPTIONS: { code: CountryCode; label: string }[] = [
  { code: 'CO', label: '🇨🇴 Colombia · ANLA · Res. 631/2015' },
  { code: 'MX', label: '🇲🇽 México · SEMARNAT' },
  { code: 'US', label: '🇺🇸 USA · EPA RCRA' },
  { code: 'BR', label: '🇧🇷 Brasil · CONAMA' },
  { code: 'PE', label: '🇵🇪 Perú · MINAM' },
  { code: 'CL', label: '🇨🇱 Chile · MINSAL' },
  { code: 'EU', label: '🇪🇺 Unión Europea · Directiva 2010/75' },
];

export default function PortalPage() {
  // Honor ?tab=<id> from the URL so the hero NUEVO link (/biocycle/portal?tab=escucha)
  // lands directly in the Escucha Activa tab.
  const initialTab: TabId = (() => {
    if (typeof window === 'undefined') return 'cotiza';
    const q = new URLSearchParams(window.location.search).get('tab');
    if (q === 'escucha' || q === 'caso' || q === 'cotiza') return q;
    return 'cotiza';
  })();
  const [tab, setTab] = useState<TabId>(initialTab);
  // Operation is now the slug so it maps 1:1 to COTIZA_RULES.
  const [opSlug, setOpSlug] = useState<OpSlug>('refineria');
  const activeRule = COTIZA_RULES[opSlug];
  const [contaminantKey, setContaminantKey] = useState<string>(
    activeRule.allowedContaminants[0]?.key ?? '',
  );
  const [volume, setVolume] = useState<number>(activeRule.baseline.volumeRange[1]);
  const [country, setCountry] = useState<CountryCode>('CO');
  const [urgency, setUrgency] = useState<Urgency>('med');
  const [quoteResult, setQuoteResult] = useState<QuoteResult | null>(null);
  const [quoteRecomputing, setQuoteRecomputing] = useState(false);
  const [insights, setInsights] = useState<InsightsLiveData | null>(null);
  const [insightsErr, setInsightsErr] = useState(false);

  // When a quote already exists and the user tweaks the inputs, re-compute automatically
  // so they see the panel update instead of thinking the button is broken.
  useEffect(() => {
    if (!quoteResult) return;
    setQuoteRecomputing(true);
    const h = setTimeout(() => {
      const r = computeQuote({ op: opSlug, contaminantKey, volume, country, urgency });
      if (r) setQuoteResult(r);
      setQuoteRecomputing(false);
    }, 250);
    return () => clearTimeout(h);
    // `quoteResult` intentionally omitted from deps to avoid feedback loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opSlug, contaminantKey, volume, country, urgency]);

  // Fetch live insights the first time the user opens Escucha Activa.
  useEffect(() => {
    if (tab !== 'escucha' || insights || insightsErr) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch('/api/insights', { signal: AbortSignal.timeout(8000) });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data = (await r.json()) as InsightsLiveData;
        if (!cancelled) setInsights(data);
      } catch {
        if (!cancelled) setInsightsErr(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [tab, insights, insightsErr]);

  // Reset contaminant + volume when switching operation so we never carry an
  // invalid contaminant across ops.
  const switchOp = (next: OpSlug) => {
    setOpSlug(next);
    const rule = COTIZA_RULES[next];
    setContaminantKey(rule.allowedContaminants[0]?.key ?? '');
    setVolume(rule.baseline.volumeRange[1]);
    setQuoteResult(null);
  };

  const onGenerate = () => {
    if (!activeRule.supportsQuote) return;
    const result = computeQuote({ op: opSlug, contaminantKey, volume, country, urgency });
    setQuoteResult(result);
  };

  const timeline = useMemo(() => buildTimeline(activeRule.baseline.biocycle.weeksDuration), [
    activeRule.baseline.biocycle.weeksDuration,
  ]);

  return (
    <>
      <section className="container page-head">
        <div
          className="eyebrow"
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}
        >
          <span style={{ width: 18, height: 1, background: 'var(--forest-deep)', display: 'inline-block' }} />
          Portal B2B · HSEQ · Remediation PM
        </div>
        <h1>
          Cotiza tu operación en <em>4 minutos</em>.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 620, marginTop: 12 }}>
          Del tipo de operación al plan con cronograma, inversión, ROI, CO₂ evitado y mapeo a ANLA · EPA · Res. 631/2015.
        </p>
        <div className="tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={`tab ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
              data-testid={`tab-${t.id}`}
            >
              {t.label} <span className="cnt">· {t.cnt}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="container section-body">
        {tab === 'cotiza' && (
          <div className="quote-grid" data-testid="tab-content-cotiza">
            <div>
              <div className="form-card">
                <h3>Describe tu operación</h3>
                <div className="field">
                  <label>Tipo de operación</label>
                  <div className="opt-row">
                    {(Object.values(COTIZA_RULES) as typeof COTIZA_RULES[OpSlug][]).map((o) => (
                      <button
                        key={o.opSlug}
                        className={`opt ${opSlug === o.opSlug ? 'selected' : ''}`}
                        onClick={() => switchOp(o.opSlug)}
                        data-testid={`op-${o.opSlug}`}
                      >
                        <b>{o.opLabel}</b>
                        <span>{o.subtitle.split('·')[0].trim()}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="field">
                  <label>País</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value as CountryCode)}
                    data-testid="country-select"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div className="field">
                    <label>
                      Volumen a tratar
                      <span className="field-unit">{activeRule.baseline.volumeUnit}</span>
                    </label>
                    <input
                      type="number"
                      min={activeRule.baseline.volumeRange[0]}
                      max={activeRule.baseline.volumeRange[2]}
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value) || 0)}
                      data-testid="volume-input"
                    />
                  </div>
                  <div className="field">
                    <label>Contaminante principal</label>
                    {activeRule.supportsQuote ? (
                      <select
                        value={contaminantKey}
                        onChange={(e) => setContaminantKey(e.target.value)}
                        data-testid="contaminant-select"
                      >
                        {activeRule.allowedContaminants.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input value="—" disabled />
                    )}
                  </div>
                </div>
                <div className="field">
                  <label>Urgencia regulatoria</label>
                  <div className="opt-row">
                    {URGENCY_OPTIONS.map((u) => (
                      <button
                        key={u.key}
                        className={`opt ${urgency === u.key ? 'selected' : ''}`}
                        onClick={() => setUrgency(u.key)}
                        data-testid={`urg-${u.key}`}
                      >
                        <b>{u.label}</b>
                        <span>{u.sub}</span>
                      </button>
                    ))}
                  </div>
                </div>
                {activeRule.supportsQuote ? (
                  <button
                    className="btn btn-primary"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                    onClick={onGenerate}
                    data-testid="generate-quote"
                  >
                    Generar cotización
                  </button>
                ) : (
                  <a
                    className="btn btn-primary"
                    href="mailto:hola@biocycle.ai?subject=Partnership%20consultora%20ambiental"
                    style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                    data-testid="generate-quote"
                  >
                    Agenda call técnico →
                  </a>
                )}
                <p className="field-note" style={{ marginTop: 10 }}>
                  Estimación referencial basada en <code>CONSORTIA_DATA</code> + literatura peer-reviewed.
                  Caracterización real del sitio puede modificar resultados ±20%.
                </p>
              </div>
            </div>

            <div className="quote-out" data-testid="quote-output">
              {!quoteResult ? (
                <div className="quote-empty" data-testid="quote-empty">
                  <div className="qe-dot" />
                  <h4>Completa el formulario</h4>
                  <p>
                    Elige tipo de operación, contaminante, país y volumen; pulsa{' '}
                    <b>Generar cotización</b> para ver el plan piloto con cronograma, ROI y ahorro
                    proyectado.
                  </p>
                  <div className="qe-sell">
                    <b>¿Qué estamos vendiendo?</b>
                    <p style={{ marginTop: 6 }}>
                      <b>Un piloto de 90 días</b> que incluye: (1) diseño del consorcio microbiano específico para tu contaminante,
                      (2) despliegue con lab aliado + monitoreo semanal, (3) reporte regulatorio listo para tu autoridad ambiental.
                      <br />
                      <span style={{ color: 'var(--muted)' }}>No vendemos bacterias a granel · vendemos la <b>receta + el acompañamiento técnico</b>.</span>
                    </p>
                  </div>
                  <p className="qe-foot">
                    Los números provienen de <code>CONSORTIA_DATA</code> + literatura peer-reviewed.
                  </p>
                </div>
              ) : (
                <>
                  <div className="qout-top">
                    <div className="ql">
                      Inversión mensual · plan piloto
                      {quoteRecomputing && <span className="q-live">· actualizando…</span>}
                    </div>
                    <div className="qv" data-testid="quote-monthly">
                      ${quoteResult.pilotCostMonthly.toLocaleString()}{' '}
                      <span style={{ fontSize: 16, color: 'rgba(255,255,255,.6)', fontWeight: 400 }}>
                        USD/mes
                      </span>
                    </div>
                    <div className="qs">
                      {Math.max(1, Math.round(quoteResult.weeksDuration / 4))} meses · incluye
                      monitoreo + reporte {quoteResult.regulation.split('·')[0].trim()}
                    </div>
                    <div className="qmeta">
                      <span>
                        ROI año 1 · <b>+{quoteResult.roiYear1Pct}%</b>
                      </span>
                      <span>
                        Ahorro · <b>${Math.round(quoteResult.savingsAbsolute / 1000)}K USD</b>
                      </span>
                      <span>
                        CO₂ evitado · <b>{quoteResult.co2SavedTons} t</b>
                      </span>
                    </div>
                    <div className="q-sell">
                      Cotización para <b>un piloto de 90 días</b>: diseño del consorcio · despliegue con lab aliado · reporte regulatorio entregable.
                    </div>
                  </div>
                  <div className="metric-grid">
                    <div className="mx-card">
                      <div className="ml">
                        Costo total piloto
                        <span className="help-dot" title="Lo que pagas en total al cerrar el piloto de 90 días: diseño + despliegue + monitoreo + reporte final. NO incluye obra civil ni caracterización de laboratorio fuera del alcance.">?</span>
                      </div>
                      <div className="mv" data-testid="quote-total">
                        ${quoteResult.pilotCostTotal.toLocaleString()}
                      </div>
                      <div className="ms" data-testid="quote-vs-label">
                        vs. ${Math.round(quoteResult.conventionalTotal / 1000)}K{' '}
                        {quoteResult.conventionalMethod.split('+')[0].trim().toLowerCase()}
                      </div>
                    </div>
                    <div className="mx-card">
                      <div className="ml">
                        ROI proyectado
                        <span className="help-dot" title="Retorno sobre inversión a 12 meses: (ahorro vs método convencional ÷ costo piloto) × 100. Conservador — no incluye co-beneficios (CO₂, reputación, continuidad operativa).">?</span>
                      </div>
                      <div className="mv">+{quoteResult.roiYear1Pct}%</div>
                      <div className="ms">year-1 conservador · {quoteResult.urgencyNote}</div>
                    </div>
                    <div className="mx-card">
                      <div className="ml">
                        Degradación esperada
                        <span className="help-dot" title="Reducción del contaminante (%) al final del piloto. Intervalo de confianza basado en literatura peer-reviewed. Resultado real puede variar ±15% según caracterización del sitio.">?</span>
                      </div>
                      <div className="mv" data-testid="quote-degradation">
                        −{quoteResult.expectedReductionPct}%
                      </div>
                      <div className="ms">
                        {quoteResult.expectedMetric} en {quoteResult.weeksDuration * 7} días · IC{' '}
                        {quoteResult.expectedCiPct}%
                      </div>
                    </div>
                    <div className="mx-card">
                      <div className="ml">
                        CO₂ evitado
                        <span className="help-dot" title="Toneladas de CO₂ equivalentes que NO se emiten al elegir BioCycle vs la alternativa convencional. Calculado sobre transporte, disposición y energía del método convencional (datasets GHG Protocol 2024).">?</span>
                      </div>
                      <div className="mv">{quoteResult.co2SavedTons} t</div>
                      <div className="ms">vs. {quoteResult.conventionalMethod.toLowerCase()}</div>
                    </div>
                  </div>
                  <div className="timeline">
                    <h4>Cronograma {quoteResult.weeksDuration * 7} días</h4>
                    {timeline.map((r) => (
                      <div className="tl-row" key={r.w}>
                        <span className="tl-w">{r.w}</span>
                        <b>{r.label}</b>
                        <div
                          className="tl-bar"
                          style={{ ['--a' as string]: r.a, ['--r' as string]: r.r } as React.CSSProperties}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="compliance">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="22" height="22">
                      <path d="M9 12l2 2 4-4M12 3l8 3v6c0 5-3 8-8 9-5-1-8-4-8-9V6l8-3z" />
                    </svg>
                    <div>
                      <b>Marco regulatorio mapeado</b>
                      <span data-testid="quote-regulation">{quoteResult.regulation}</span>
                    </div>
                  </div>
                  <p
                    className="field-note"
                    style={{ margin: '14px 4px 0', fontSize: 11.5 }}
                    data-testid="quote-source"
                  >
                    Fuente técnica: {quoteResult.expectedSource}. Estimación referencial — varía ±20% con caracterización real.
                  </p>
                </>
              )}
            </div>
          </div>
        )}

        {tab === 'escucha' && (
          <div data-testid="tab-content-escucha">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
              <div>
                <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 18, height: 1, background: 'var(--forest-deep)', display: 'inline-block' }} />
                  Tab 2 · Escucha Activa
                </div>
                <h2 style={{ fontSize: 32 }}>Dolor del mercado · verbatim.</h2>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11.5, color: 'var(--muted)', textAlign: 'right', lineHeight: 1.6 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 99,
                      background: insights?.mode === 'live' ? '#00C853' : '#F4A100',
                      boxShadow: `0 0 0 3px ${insights?.mode === 'live' ? 'rgba(0,200,83,.18)' : 'rgba(244,161,0,.18)'}`,
                      animation: 'pulse 1.5s infinite',
                    }}
                  />
                  {insights?.mode === 'live' ? 'LIVE · Reddit + LinkedIn' : 'DEMO · datos de muestra'}
                </div>
                <div data-testid="ea-count">
                  {insights?.reddit?.posts_classified_total?.toLocaleString() ?? '4,797'} posts clasificados
                </div>
                <div>
                  Última sync ·{' '}
                  {insights?.updated_at
                    ? new Date(insights.updated_at).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
                    : '04:12 AM'}
                </div>
              </div>
            </div>
            <div className="ea-grid">
              <div>
                <div className="ea-card">
                  <div className="ea-head">
                    <h3>🔥 Top 3 dolores · esta semana</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>
                      semana 16 · 2026
                    </span>
                  </div>
                  {(buildDolores(insights) ?? []).map((d, i) => (
                    <div className="dolor-card" key={i}>
                      <div className="d-rank">
                        <span className="r">{d.rank}</span>
                        <span className="m">{d.trend}</span>
                      </div>
                      <h4>{d.title}</h4>
                      <p>{d.body}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="ea-card">
                  <div className="ea-head">
                    <h3>Quotes verbatim</h3>
                    <span className="live">Live</span>
                  </div>
                  {(buildQuotes(insights) ?? []).map((q, i) => (
                    <div className="quote" key={i} data-testid={`ea-quote-${i}`}>
                      <span className="q-av">{q.av}</span>
                      <p>{q.quote}</p>
                      <div className="q-meta">
                        {q.url ? (
                          <a href={q.url} target="_blank" rel="noopener noreferrer" className="q-link">
                            {q.src} ↗
                          </a>
                        ) : (
                          <span>{q.src}</span>
                        )}
                        {q.city && (
                          <>
                            {' · '}
                            <b>{q.city}</b>
                          </>
                        )}
                        {q.time && <> · {q.time}</>}
                        {q.votes && (
                          <>
                            {' · '}
                            <b>{q.votes}</b>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="ea-card">
                  <div className="ea-head">
                    <h3>Competidores · sentimiento agregado</h3>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)' }}>n=2,394 posts</span>
                  </div>
                  <p className="ea-explainer">
                    Qué dice el mercado de cada competidor en Reddit + LinkedIn últimos 7 días. Score{' '}
                    <b style={{ color: '#C62828' }}>−1</b> (quejas fuertes) → <b style={{ color: '#00733A' }}>+1</b> (menciones positivas).
                    Útil para ver <b>dónde hay frustración real</b> y cómo posicionarte.
                  </p>
                  {buildCompetitors(insights).map((c) => (
                    <div className="competitor" key={c.name}>
                      <div>
                        <b>{c.name}</b>
                        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{c.tag}</div>
                      </div>
                      <div className="sent-bar" style={{ ['--p' as string]: c.pos } as React.CSSProperties} />
                      <div className={`sent-val ${c.val >= 0 ? 'pos' : 'neg'}`}>
                        {c.val >= 0 ? '+' : ''}
                        {c.val.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'caso' && (
          <div data-testid="tab-content-caso" className="caso-wrap">
            <div className="caso-banner" role="note" data-testid="caso-disclaimer">
              <div className="cb-icon" aria-hidden="true">⚠</div>
              <div>
                <b>Caso ILUSTRATIVO · datos HIPOTÉTICOS</b>
                <span>
                  Escenario compuesto de 3 clientes anonimizados (Santander + Casanare · 2023–2024). No usar
                  para decisiones financieras sin caracterización real del sitio. Todos los números tienen
                  sensibilidad ±20%.
                </span>
              </div>
            </div>
            <div className="bc-img-wrap case-visual">
              <BiocycleImage
                id="portal-refineria"
                alt="Refinería en los Andes colombianos al atardecer con biorreactor modular"
                width={1920}
                height={1080}
                sizes="(max-width: 960px) 100vw, 960px"
              />
              <div className="bc-caption">Refinería Andina · caso compuesto · 3 clientes anonimizados</div>
            </div>
            <div className="case-hero">
              <div>
                <div className="illus-tag illus-tag-warn">
                  <span className="dot-amber" />
                  HIPOTÉTICO · datos compuestos
                </div>
                <h3>Refinería Andina S.A. · 120 m³ suelo con TPH</h3>
                <p>
                  Caso compuesto a partir de 3 clientes reales anonimizados en Santander y Casanare. Todos los números
                  escalan al piloto de 90 días del lab aliado · <b>estos valores no representan un cliente específico</b>.
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10.5,
                    color: 'var(--muted)',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                  }}
                >
                  Decisión final
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 28,
                    fontWeight: 500,
                    letterSpacing: '-.03em',
                    color: 'var(--forest-deep)',
                  }}
                >
                  −88% costo
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>con BioCycle vs. convencional</div>
              </div>
            </div>

            <div className="case-flow">
              {[
                {
                  n: '01 · Caracterización',
                  title: 'Línea base',
                  body: 'TPH 4,800 mg/kg · pH 6.9 · humedad 18% · temp. 27°C · 120 m³ arcilloso.',
                  stat: 'Por encima norma · factor 3.2×',
                },
                {
                  n: '02 · Consorcio',
                  title: 'Diseñado en 6s',
                  body: 'Pseudomonas putida · Rhodococcus jostii · Bacillus subtilis · Trichoderma harzianum.',
                  stat: 'Compatibilidad 0.82 · BSL-1',
                },
                {
                  n: '03 · Cronograma',
                  title: '90 días · 4 fases',
                  body: 'Base · diseño · despliegue + monitoreo semanal · reporte regulatorio final.',
                  stat: 'Entrega ANLA · semana 13',
                },
                {
                  n: '04 · Resultado',
                  title: '−78% TPH real',
                  body: 'Cierre regulatorio aprobado · sitio disponible para siembra post-remediación.',
                  stat: 'Ahorro · $252K USD',
                },
              ].map((s) => (
                <div className="case-step" key={s.n}>
                  <div className="cs-n">{s.n}</div>
                  <h4>{s.title}</h4>
                  <p>{s.body}</p>
                  <div className="cs-stat">{s.stat}</div>
                </div>
              ))}
            </div>

            <div className="case-compare">
              <div className="cmp bad">
                <div className="ctag">Convencional</div>
                <h4>Excavación + relleno</h4>
                <div className="cv">$287K</div>
                <ul>
                  <li>→ Excavación 120 m³ (excavadora + camiones)</li>
                  <li>→ Transporte 320 km a relleno autorizado</li>
                  <li>→ Disposición final + tasa ambiental</li>
                  <li>→ 18 meses · afectación del sitio total</li>
                </ul>
              </div>
              <div className="cmp good">
                <div className="ctag">BioCycle</div>
                <h4>Piloto 90 días · in-situ</h4>
                <div className="cv">$34K</div>
                <ul>
                  <li>→ Cápsulas alginato BSL-1/GRAS (4 microorganismos)</li>
                  <li>→ 0 km transporte · aplicación directa</li>
                  <li>→ Monitoreo semanal · reporte ANLA</li>
                  <li>→ Sitio disponible post-remediación</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}

// ── Escucha Activa data builders ──────────────────────────────────────
// These collapse the live `/api/insights` shape into the compact shape the
// existing JSX expects. When the API fails or returns mock, we fall back to
// curated demo data (clearly marked in the UI via the DEMO badge).

interface Dolor {
  rank: string;
  trend: string;
  title: string;
  body: string;
}

const DEMO_DOLORES: Dolor[] = [
  {
    rank: '#1 · 342 menciones',
    trend: '+42% vs. sem anterior',
    title: 'ANLA rechazó el plan de cierre; necesito alternativa biológica YA',
    body: 'Dominante en r/EnvironmentalCareers · avatar: hseq_latam · afecta refinerías medianas post-2025.',
  },
  {
    rank: '#2 · 287 menciones',
    trend: 'estable',
    title: 'Costo de landfarming subió 3× · ya no cuadra para proyectos <$500K',
    body: 'Inflación insumos + transporte · oportunidad clara para vía biológica in-situ.',
  },
  {
    rank: '#3 · 201 menciones',
    trend: 'nuevo',
    title: 'Vendors prometen bacterias mágicas que degradan plástico en playa — regulador les cerró',
    body: 'Refuerza el pivote A+C · aquí nuestro mensaje de honestidad científica pega.',
  },
];

function buildDolores(ins: InsightsLiveData | null): Dolor[] {
  if (!ins || ins.mode !== 'live' || !ins.top_pains?.length) return DEMO_DOLORES;
  return ins.top_pains.slice(0, 3).map((p, i) => ({
    rank: `#${i + 1} · ${p.quote_count} menciones`,
    trend: `avatar: ${p.avatar_match ?? 'mixto'}`,
    title: p.theme,
    body: p.top_quote
      ? `Ejemplo verbatim en r/${p.top_quote.subreddit} — ver tarjeta a la derecha.`
      : 'Tema emergente de la última semana.',
  }));
}

interface Quote {
  av: string;
  quote: string;
  src: string;
  city?: string;
  time?: string;
  votes?: string;
  url?: string;
}

const DEMO_QUOTES: Quote[] = [
  {
    av: 'hseq_latam',
    quote:
      '"Me dieron deadline a 90 días para presentar plan alternativo al relleno. El proveedor clásico me cotizó $340K. Si alguien conoce vía biológica con respaldo técnico real — no marketing — mándenme DM."',
    src: 'r/EnvironmentalProfessionals',
    city: 'Bogotá, CO',
    time: 'hace 3h',
    votes: '142 upvotes',
  },
  {
    av: 'remediation_pm_usa',
    quote:
      '"Trece años en remediación de Superfund sites. La mitad del presupuesto se va en transporte. Cualquier tecnología in-situ creíble con papers ≥Tier 2 me la venden mañana."',
    src: 'r/civilengineering',
    city: 'Houston, TX',
    time: 'hace 9h',
    votes: '89 upvotes',
  },
  {
    av: 'compliance_eu',
    quote:
      '"La Directiva (EU) 2024/1626 entra en vigor en enero. Mis clientes textiles no están ni cerca. ¿Bioreactores enzimáticos con monómeros recuperables son viable pricing para un cluster de 5 plantas?"',
    src: 'LinkedIn',
    city: 'Porto, PT',
    time: 'ayer',
    votes: '234 reacciones',
  },
];

function buildQuotes(ins: InsightsLiveData | null): Quote[] {
  if (!ins || ins.mode !== 'live' || !ins.top_pains?.length) return DEMO_QUOTES;
  const withQuote = ins.top_pains.filter((p) => p.top_quote?.quote);
  if (!withQuote.length) return DEMO_QUOTES;
  return withQuote.slice(0, 3).map((p) => ({
    av: p.avatar_match ?? 'mixto',
    quote: `"${p.top_quote!.quote}"`,
    src: `r/${p.top_quote!.subreddit}`,
    url: p.top_quote!.url,
  }));
}

interface Competitor {
  name: string;
  tag: string;
  pos: string;
  val: number;
}

const DEMO_COMPETITORS: Competitor[] = [
  { name: 'Veolia', tag: 'remediation · global', pos: '42%', val: -0.15 },
  { name: 'AECOM', tag: 'consultora · USA', pos: '28%', val: -0.42 },
  { name: 'Carbios', tag: 'PET enzimático · FR', pos: '53%', val: 0.05 },
  { name: 'Bioteknica', tag: 'landfarming · LATAM', pos: '38%', val: -0.22 },
];

function buildCompetitors(ins: InsightsLiveData | null): Competitor[] {
  if (!ins || ins.mode !== 'live' || !ins.top_competitors_7d?.length) return DEMO_COMPETITORS;
  return ins.top_competitors_7d.slice(0, 4).map((c) => ({
    name: c.competitor,
    tag: `${c.mentions} menciones · 7d`,
    pos: `${Math.round(Math.max(0, Math.min(1, (c.avg_sentiment + 1) / 2)) * 100)}%`,
    val: c.avg_sentiment,
  }));
}

/** Generate a 4-phase cronograma scaled to the pilot duration in weeks. */
function buildTimeline(weeks: number): Array<{ w: string; label: string; a: string; r: string }> {
  const labels = [
    'Caracterización + línea base',
    'Diseño consorcio + preparación',
    'Despliegue + monitoreo semanal',
    'Reporte final + entrega regulatoria',
  ];
  const q = Math.max(1, Math.round(weeks / 6));
  const ranges: Array<[number, number]> = [
    [1, Math.max(1, q)],
    [Math.max(1, q) + 1, Math.min(weeks - 1, q * 2 + 1)],
    [Math.min(weeks - 1, q * 2 + 2), Math.max(weeks - 2, q * 2 + 3)],
    [Math.max(weeks - 1, q * 2 + 4), weeks],
  ];
  return labels.map((label, i) => {
    const [start, end] = ranges[i];
    return {
      w: start === end ? `S ${start}` : `S ${start}–${end}`,
      label,
      a: `${Math.min(95, Math.round(((start - 1) / weeks) * 100))}%`,
      r: `${Math.max(0, Math.round(((weeks - end) / weeks) * 100))}%`,
    };
  });
}
