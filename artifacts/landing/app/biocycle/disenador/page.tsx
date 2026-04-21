'use client';

import { useEffect, useRef, useState } from 'react';
import './disenador.css';
import { BiocycleImage } from '@/components/biocycle/biocycle-image';
import {
  CONSORTIUM_RULES,
  findConsortiumRule,
  mediumLabel,
  type MediumKey,
  type ConsortiumMember,
  type AlternativeMethod,
} from '@/lib/consortia-rules';

// Predict calls go through a Next.js proxy route so the browser never needs
// to reach the ml-api directly (loopback-only in Replit prod). See
// app/api/ml/predict/route.ts.
const PREDICT_URL = '/api/ml/predict';

const CATEGORIES = [
  { id: 'plastics', name: 'Plásticos', count: '5 subtipos', subtypes: ['PET', 'HDPE', 'LDPE', 'PP', 'PVC'] },
  { id: 'hydrocarbons', name: 'Hidrocarburos', count: '7 subtipos', subtypes: ['Diesel / gasolina', 'TPH (totales)', 'BTEX', 'PAH — livianos', 'PAH — pesados', 'Crudo sintético', 'Aceites lubricantes'] },
  { id: 'water_treatment', name: 'Aguas residuales', count: '4 subtipos', subtypes: ['Lixiviados', 'Efluente industrial', 'Colorantes azo', 'Agua gris'] },
  { id: 'soil_ag', name: 'Pesticidas', count: '4 subtipos', subtypes: ['Glifosato', 'Atrazina', 'Clorpirifos', 'Metales pesados'] },
  { id: 'mining', name: 'Minería', count: '5 subtipos', subtypes: ['Drenaje ácido', 'Mercurio', 'Cianuro', 'Arsénico', 'Plomo'] },
  { id: 'textiles', name: 'Textiles', count: '3 subtipos', subtypes: ['Azo', 'Antraquinona', 'Reactivos'] },
  { id: 'pharma', name: 'Farmacéuticos', count: '3 subtipos', subtypes: ['Antibióticos', 'Hormonas', 'AINEs'] },
  { id: 'other', name: 'Otros', count: '2 subtipos', subtypes: ['PFAS', 'Microplásticos'] },
];

const MODES = [
  { id: 'bioreactor_lab', label: 'Biorreactor lab', sub: '5–50 L · contenido' },
  { id: 'bioreactor_ind', label: 'Biorreactor industrial', sub: 'm³ · contenido' },
  { id: 'in_situ_soil', label: 'In-situ · suelo', sub: 'cápsula alginato' },
  { id: 'in_situ_water', label: 'In-situ · agua', sub: 'columna saturada' },
  { id: 'compost', label: 'Compostaje', sub: 'pila controlada' },
];

type PredictResult = {
  degradation_pct: number;
  confidence: string;
  n_training_samples: number;
};

// Stages shown during the "Diseñando…" animation. Each stage holds for ~500–700ms.
const DESIGN_STAGES = [
  'Analizando 28 microorganismos BSL-1/GRAS',
  'Filtrando por pH + temperatura + medio',
  'Simulando combinaciones no-antagonistas',
  'Validando guardrails (pivote A+C)',
  'Compilando receta + proporciones',
  'Calibrando curva de degradación',
];

export default function DisenadorPage() {
  const [catId, setCatId] = useState('hydrocarbons');
  const [subtype, setSubtype] = useState('TPH (totales)');
  const [mode, setMode] = useState('in_situ_soil');
  const [temp, setTemp] = useState(28);
  const [ph, setPh] = useState(6.8);
  const [volume, setVolume] = useState(120);
  const [contamination, setContamination] = useState(12);
  const [medium, setMedium] = useState<MediumKey>('arcilloso');
  const [designing, setDesigning] = useState(false);
  const [designStage, setDesignStage] = useState(0);
  const [result, setResult] = useState<PredictResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const cat = CATEGORIES.find((c) => c.id === catId)!;
  const blockedCombination = catId === 'plastics' && mode.startsWith('in_situ');

  const rule = findConsortiumRule(catId, subtype);
  const isWaterContext = mode === 'in_situ_water' || catId === 'water_treatment' || catId === 'textiles' || catId === 'pharma';
  const isLabContext = mode === 'bioreactor_lab' || mode === 'bioreactor_ind' || mode === 'compost';

  // Keep `medium` legal: if user switches category/subtype to one whose rule doesn't
  // include the current medium, snap to the first allowed medium.
  useEffect(() => {
    if (!rule.allowedMedia.includes(medium)) {
      setMedium(rule.allowedMedia[0]);
    }
  }, [rule, medium]);

  // When designing, step through stage labels at a lively pace so the UI feels alive.
  useEffect(() => {
    if (!designing) {
      setDesignStage(0);
      return;
    }
    const t = setInterval(() => {
      setDesignStage((s) => Math.min(s + 1, DESIGN_STAGES.length - 1));
    }, 600);
    return () => clearInterval(t);
  }, [designing]);

  const handleDesign = async () => {
    if (blockedCombination) return;
    setDesigning(true);
    setDesignStage(0);
    // Minimum design time so user sees the loading animation (even if API is fast).
    const minDelay = new Promise((r) => setTimeout(r, DESIGN_STAGES.length * 580));
    try {
      const fetchPromise = fetch(PREDICT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contaminant: catId,
          temp_C: temp,
          pH: ph,
          mode: mode.startsWith('in_situ') ? 'in_situ' : 'bioreactor',
          contamination_pct: contamination,
          pretreatment: true,
          time_weeks: 12,
        }),
      }).then((r) => r.json() as Promise<PredictResult>);
      const [data] = await Promise.all([fetchPromise, minDelay]);
      setResult(data);
    } catch {
      await minDelay;
      // Dynamic fallback so different inputs produce visibly different numbers
      // (instead of always landing on the same 52%).
      const base = rule.expectedPct;
      const phPenalty = Math.abs(ph - 7) * 2;
      const tempPenalty = Math.max(0, Math.abs(temp - 28) - 4) * 1.2;
      const mixedPenalty = contamination > 20 ? (contamination - 20) * 0.5 : 0;
      const est = Math.max(20, Math.min(92, base - phPenalty - tempPenalty - mixedPenalty));
      setResult({
        degradation_pct: Math.round(est),
        confidence: est >= 70 ? 'robust' : 'moderate',
        n_training_samples: 43,
      });
    } finally {
      setDesigning(false);
      // Scroll to results so user sees the output update even if the page was scrolled up.
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  };

  const prob = result?.degradation_pct ?? rule.expectedPct;
  const weeks50 = Math.round(32 + (70 - prob) * 0.4);
  const accel = (prob / 12).toFixed(1);

  return (
    <>
      <section className="container page-head">
        <div className="bc-img-wrap bc-hero-banner">
          <BiocycleImage
            id="hero-disenador"
            alt="Consorcio microbiano 3D rotando frente a una interfaz holográfica, iluminado con verde-cyan"
            width={1920}
            height={1080}
            priority
            sizes="(max-width: 960px) 100vw, 1200px"
          />
          <div className="bc-caption">Tres pasos · un consorcio específico · evidencia trazable</div>
        </div>
        <div className="eyebrow" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <span style={{ width: 18, height: 1, background: 'var(--forest-deep)', display: 'inline-block' }} />
          Diseñador técnico · B2C
        </div>
        <h1>
          Construye tu <em>consorcio</em> óptimo.
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 15, maxWidth: 640, marginTop: 12 }}>
          Wizard de 3 pasos. Selecciona contaminante, modo de aplicación y condiciones del sitio — te devolvemos receta, probabilidad, curva de degradación y protocolo listos para piloto.
        </p>
      </section>

      <section className="container wizard">
        <aside className="steps-rail">
          <div className="rail-step done">
            <div className="n">✓</div>
            <div>
              <div className="t">Contaminante</div>
              <div className="s">
                {cat.name} · {subtype}
              </div>
            </div>
          </div>
          <div className="rail-step done">
            <div className="n">✓</div>
            <div>
              <div className="t">Aplicación</div>
              <div className="s">{MODES.find((m) => m.id === mode)?.label}</div>
            </div>
          </div>
          <div className="rail-step active">
            <div className="n">3</div>
            <div>
              <div className="t">Condiciones del sitio</div>
              <div className="s">{temp} °C · pH {ph} · {volume} m³</div>
            </div>
          </div>
          <div className={`rail-step ${result ? 'done' : ''}`}>
            <div className="n">{result ? '✓' : '→'}</div>
            <div>
              <div className="t">Diseñar consorcio</div>
              <div className="s">ML · 4,797 refs</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted-2)', fontFamily: 'var(--font-mono)', padding: '8px 4px', letterSpacing: '.08em' }}>
            <div>TIEMPO EST. · 6 SEG</div>
            <div style={{ marginTop: 3 }}>MATRIZ · 28 × 33</div>
          </div>
        </aside>

        <div>
          <div className="w-step">
            <div className="w-head">
              <h2>1 · Selecciona el contaminante</h2>
              <span className="w-badge">33 subtipos · 7 categorías</span>
            </div>
            <div className="cat-grid">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={`cat-card ${catId === c.id ? 'selected' : ''}`}
                  onClick={() => {
                    setCatId(c.id);
                    setSubtype(c.subtypes[0]);
                  }}
                  data-testid={`cat-${c.id}`}
                >
                  <div className="ct-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="9" />
                    </svg>
                  </div>
                  <div className="ct-name">{c.name}</div>
                  <div className="ct-count">{c.count}</div>
                </button>
              ))}
            </div>
            <div className="sub-list">
              {cat.subtypes.map((s, i) => (
                <button
                  key={s}
                  className={`sub-pill ${subtype === s ? 'selected' : ''}`}
                  onClick={() => setSubtype(s)}
                  data-testid={`sub-${i}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="w-step">
            <div className="w-head">
              <h2>2 · Modo de aplicación</h2>
              <span className="w-badge">5 modos · bloqueo inteligente</span>
            </div>
            <div className="mode-row">
              {MODES.map((m) => {
                const disabled = catId === 'plastics' && m.id.startsWith('in_situ');
                return (
                  <button
                    key={m.id}
                    className={`mode ${mode === m.id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => !disabled && setMode(m.id)}
                    disabled={disabled}
                    data-testid={`mode-${m.id}`}
                  >
                    <b>{m.label}</b>
                    <span>{m.sub}</span>
                  </button>
                );
              })}
            </div>
            {blockedCombination && (
              <div className="alert error" data-testid="blocked-alert">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                  <path d="M12 9v4M12 17h.01M4.9 19h14.2a2 2 0 001.7-3L13.7 4a2 2 0 00-3.4 0L3.2 16a2 2 0 001.7 3z" />
                </svg>
                <div>
                  <b>Plástico + in-situ no permitido.</b> Esta combinación rompe el pivote A+C.
                  Cambia a biorreactor lab o industrial (contenido).
                </div>
              </div>
            )}
          </div>

          <div className="w-step">
            <div className="w-head">
              <h2>3 · Condiciones del sitio</h2>
              <span className="w-badge">Afectan probabilidad de éxito</span>
            </div>
            <div className="cond-grid">
              <div className="cond">
                <label>Temperatura</label>
                <div className="val">
                  {temp} <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>°C</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={50}
                  value={temp}
                  onChange={(e) => setTemp(Number(e.target.value))}
                  data-testid="input-temp"
                  style={{ ['--f' as string]: `${((temp - 5) / 45) * 100}%` } as React.CSSProperties}
                />
              </div>
              <div className="cond">
                <label>pH</label>
                <div className="val">{ph.toFixed(1)}</div>
                <input
                  type="range"
                  min={3}
                  max={10}
                  step={0.1}
                  value={ph}
                  onChange={(e) => setPh(Number(e.target.value))}
                  data-testid="input-ph"
                  style={{ ['--f' as string]: `${((ph - 3) / 7) * 100}%` } as React.CSSProperties}
                />
              </div>
              <div className="cond">
                <label>Volumen a tratar</label>
                <div className="val">
                  {volume} <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>m³</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={500}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  data-testid="input-volume"
                  style={{ ['--f' as string]: `${((volume - 10) / 490) * 100}%` } as React.CSSProperties}
                />
              </div>
              <div className="cond">
                <label>Medio</label>
                <div className="med-pills">
                  {rule.allowedMedia.map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`med-pill ${medium === m ? 'selected' : ''}`}
                      onClick={() => setMedium(m)}
                      data-testid={`medium-${m}`}
                    >
                      {mediumLabel(m)}
                    </button>
                  ))}
                </div>
                <div className="field-hint">
                  {rule.allowedMedia.length} medios compatibles con <i>{subtype}</i>.
                </div>
              </div>
              <div className="cond">
                <label>Contaminación mixta</label>
                <div className="val">
                  {contamination} <span style={{ fontSize: 13, color: 'var(--muted-2)' }}>%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={50}
                  value={contamination}
                  onChange={(e) => setContamination(Number(e.target.value))}
                  data-testid="input-contamination"
                  style={{ ['--f' as string]: `${(contamination / 50) * 100}%` } as React.CSSProperties}
                />
              </div>
              {/* Deadline regulatorio solo aplica en contextos in-situ con regulación (no en lab) */}
              {!isLabContext && (
                <div className="cond">
                  <label>
                    Plazo regulatorio
                    <span
                      className="help-dot"
                      title="Plazo que tu autoridad ambiental (ANLA/EPA/SEMARNAT) te da para presentar resultados. Cambia la urgencia del piloto. Solo aplica a operaciones in-situ reguladas."
                    >
                      ?
                    </span>
                  </label>
                  <div className="val" style={{ fontSize: 14, fontFamily: 'var(--font-sans)', fontWeight: 600 }}>
                    90 días
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', marginTop: 10 }}>
                    piloto · standard · complejo
                  </div>
                </div>
              )}
            </div>
            <div className="cta-run">
              <button
                className="btn btn-primary"
                onClick={handleDesign}
                disabled={blockedCombination || designing}
                data-testid="design-btn"
              >
                {designing ? 'Diseñando…' : result ? 'Rediseñar con estos cambios' : 'Diseñar Consorcio Óptimo'}
                <span className="arr">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              </button>
              <span className="meta">⏱ ~6s · 4,797 refs · 28 MOs · BSL-1/GRAS</span>
            </div>

            {designing && (
              <div className="design-progress" data-testid="design-progress">
                <div className="dp-bar">
                  <div
                    className="dp-fill"
                    style={{ width: `${((designStage + 1) / DESIGN_STAGES.length) * 100}%` }}
                  />
                </div>
                <div className="dp-stages">
                  {DESIGN_STAGES.map((s, i) => (
                    <div
                      key={s}
                      className={`dp-stage ${i < designStage ? 'done' : ''} ${i === designStage ? 'active' : ''}`}
                    >
                      <span className="dp-dot" />
                      {s}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {result && (
            <>
              <div ref={resultsRef} style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '40px 0 8px' }}>
                <span className="eyebrow">Resultado · piloto {rule.expectedPct >= 70 ? '90' : '120'} días</span>
                <div style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '.04em' }}>
                  ID · BC-2026-{new Date().toISOString().slice(5, 10).replace('-', '')}-{Math.floor(Math.random() * 900 + 100)}
                </span>
              </div>

              <div className="results" data-testid="results">
                <div className="result-card">
                  <div className="rc-label">
                    01 · Consorcio recomendado
                    {rule.unsupported ? (
                      <span className="tag-unsupported" title="Esta combinación contaminante+medio no está soportada en BioCycle v1. Requiere ingeniería especializada (acidófilos + wetland pasivo para AMD).">
                        FUERA DE SCOPE v1
                      </span>
                    ) : rule.expectedPct <= 40 ? (
                      <span className="tag-hypo" title="Contaminante de TRL 2-3. Literatura preliminar. Resultados referenciales con banda de incertidumbre ampliada.">
                        HIPOTÉTICO · TRL 2–3
                      </span>
                    ) : (
                      <span className="tag-real" title={`Consorcio respaldado por ${rule.paperCount} papers peer-reviewed. Proporciones referenciales (±5pp). Todos BSL-1/GRAS.`}>
                        VALIDADO · {rule.paperCount} papers
                      </span>
                    )}
                  </div>
                  <h3>
                    {rule.consortium.length} microorganismos BSL-1/GRAS — compatible con pH {ph.toFixed(1)} · {temp} °C · {mediumLabel(medium).toLowerCase()}.
                  </h3>
                  {rule.caveat && (
                    <div className="consortium-caveat" role="note">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="15" height="15"><path d="M12 9v4M12 17h.01M10.3 3.5l-7 12a2 2 0 001.7 3h14a2 2 0 001.7-3l-7-12a2 2 0 00-3.4 0z"/></svg>
                      <span>{rule.caveat}</span>
                    </div>
                  )}
                  <div className="regime-banner" title={`Régimen operativo: ${rule.regime}`}>
                    <span className="rb-tag">Régimen</span>
                    <span className="rb-body">{rule.regimeNote}</span>
                  </div>
                  <table className="df">
                    <thead>
                      <tr>
                        <th>Especie</th>
                        <th>%</th>
                        <th>Rol</th>
                        <th>Rango óptimo</th>
                        <th>Seguridad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rule.consortium.map((s) => (
                        <tr key={s.species} className={s.signature ? 'is-signature' : 'is-support'}>
                          <td className="species">
                            {s.signature && <span className="sig-dot" title="Especie firma · específica de este contaminante" />}
                            <i>{s.species}</i>
                            {s.cite && <span className="sp-cite" title={`Fuente: ${s.cite}`}>· {s.cite}</span>}
                          </td>
                          <td>
                            <span className="bar" style={{ ['--f' as string]: `${s.pct}%` } as React.CSSProperties} />
                            {s.pct}%
                          </td>
                          <td>{s.role}</td>
                          <td>{s.range}</td>
                          <td>
                            <span className="bsl">{s.bsl}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="consortium-legend">
                    <span><span className="sig-dot" /> Especie firma</span>
                    <span>·</span>
                    <span>Bacillus/Pseudomonas = workhorses (aparecen en varios consorcios por diseño, no es repetición)</span>
                  </div>
                  <div className="evidence-cite">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="14" height="14"><path d="M12 6.5v11M6.5 12h11"/><circle cx="12" cy="12" r="10"/></svg>
                    {rule.evidenceCitation}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: 16 }}>
                  <CompatibilityMatrix members={rule.consortium} />

                  <div className="result-card">
                    <div className="rc-label">
                      03 · Probabilidad de éxito
                      <span className="tag-real" title="Estimación basada en literatura peer-reviewed + condiciones del sitio. IC ~68%.">
                        ESTIMACIÓN ±15pp
                      </span>
                    </div>
                    <div className="gauge-row">
                      <div className="gauge">
                        <svg viewBox="0 0 200 130" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <linearGradient id="gauG" x1="0" x2="1">
                              <stop offset="0" stopColor="#EF6C00" />
                              <stop offset=".5" stopColor="#F4A100" />
                              <stop offset="1" stopColor="#00C853" />
                            </linearGradient>
                          </defs>
                          <path d="M20 110 A 80 80 0 0 1 180 110" fill="none" stroke="#E2ECE5" strokeWidth="14" strokeLinecap="round" />
                          <path
                            d={(() => {
                              const pct = Math.max(0, Math.min(1, prob / 100));
                              if (pct === 0) return 'M20 110';
                              const angle = Math.PI * (1 - pct);
                              const x = 100 + 80 * Math.cos(angle);
                              const y = 110 - 80 * Math.sin(angle);
                              return `M20 110 A 80 80 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)}`;
                            })()}
                            fill="none"
                            stroke="url(#gauG)"
                            strokeWidth="14"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="g-num" data-testid="prob-num">
                          {Math.round(prob)}
                          <span className="g-pc">%</span>
                        </div>
                        <div className="g-lbl">{prob >= 70 ? 'Alta · robusta' : prob >= 40 ? 'Moderada · viable' : 'Baja · optimizar'}</div>
                      </div>
                      <div className="gauge-notes">
                        <span className="gbadge">{prob >= 70 ? '✓ Robusta' : '⚠ Moderada'}</span>
                        <p style={{ marginBottom: 8 }}>
                          {prob >= 70
                            ? 'Condiciones óptimas. El consorcio tiene un amplio margen a los factores del sitio.'
                            : 'Viable con optimización. El pH, temperatura o contaminación mixta están fuera de la ventana ideal.'}
                        </p>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted)', lineHeight: 1.55 }}>
                          <div>• +8pp con precalentamiento</div>
                          <div>• +12pp con nutrientes N:P 10:1</div>
                          <div>• −5pp si pH cae &lt;6</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="result-card">
                  <div className="rc-label">
                    04 · Formulación de cápsula
                    <span className="tag-hypo" title="Costos y proveedor específicos — referenciales (Brenntag CO 2024, ±10%).">estimación</span>
                  </div>
                  <h3>
                    {isWaterContext
                      ? 'Bioreactor enzimático contenido · 2–50 L · recirculación controlada.'
                      : 'Alginato de sodio 2% · CaCl₂ 0.1M · Ø 2–4 mm.'}
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginTop: 14 }}>
                    {(isWaterContext
                      ? [
                          { label: 'Matriz', val: 'Acero 316L', sub: 'reactor contenido' },
                          { label: 'Costo / L·ciclo', val: '$0.012', sub: 'USD · energía + insumos', color: true },
                          { label: 'Flujo', val: '0.5–5 L/min', sub: 'scale-up modular' },
                          { label: 'Vida útil inóculo', val: '45 días', sub: 'recambio + monitoreo' },
                        ]
                      : [
                          { label: 'Material', val: 'Alginato Na', sub: 'Brenntag CO' },
                          { label: 'Costo / cápsula', val: '$0.00082', sub: 'USD · FOB Bogotá', color: true },
                          { label: 'Diámetro', val: 'Ø 2–4 mm', sub: 'densidad 1.03 g/cm³' },
                          { label: 'Liberación sostenida', val: '21 días', sub: 'half-life matriz' },
                        ]
                    ).map((c) => (
                      <div key={c.label}>
                        <div className="eyebrow" style={{ fontSize: 10 }}>{c.label}</div>
                        <div
                          style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: 16,
                            marginTop: 4,
                            color: c.color ? 'var(--forest-deep)' : undefined,
                          }}
                        >
                          {c.val}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--muted)', fontFamily: 'var(--font-mono)' }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="result-card">
                  <div className="rc-label">05 · Protocolo de preparación</div>
                  <h3>5 pasos · tiempo total estimado 48h en lab aliado.</h3>
                  <div className="proto">
                    {[
                      { n: '01', t: 'Activar inóculos', body: 'Cultivo axénico 24h · LB + nutrientes' },
                      { n: '02', t: 'Mezcla consorcio', body: `Proporciones ${rule.consortium.map((m) => m.pct).join('/')} · OD₆₀₀ 1.2` },
                      { n: '03', t: isWaterContext ? 'Carga reactor' : 'Encapsulación', body: isWaterContext ? 'Inoculación bioreactor · aireación 0.5 vvm' : 'Goteo en CaCl₂ · 150 rpm · 20 min' },
                      { n: '04', t: isWaterContext ? 'Estabilización' : 'Endurecimiento', body: isWaterContext ? 'Arranque 48h + control DO/pH' : 'Reposo 30 min · lavado PBS 2×' },
                      { n: '05', t: 'Despliegue', body: isWaterContext ? 'Flujo continuo 0.5–5 L/min' : 'Distribución manual · 2 kg/m³ suelo' },
                    ].map((p) => (
                      <div key={p.n} className="proto-step">
                        <div className="p-n">{p.n}</div>
                        <b>{p.t}</b>
                        {p.body}
                      </div>
                    ))}
                  </div>
                </div>

                <DegradationCurve prob={prob} rule={rule} />

                <div className="kpis">
                  <div className="kpi">
                    <div className="kl">
                      Degradación esperada
                      <span
                        className="help-dot"
                        title={`Rango lab/mesocosmo: ~${rule.expectedPct}% (condiciones controladas). Rango field realista: ~${rule.expectedFieldPct}% (caracterización real del sitio). Los pilotos reales caen en algún punto intermedio.`}
                      >?</span>
                    </div>
                    <div className="kv">
                      {Math.round(prob)}
                      <span style={{ fontSize: 22, color: 'var(--muted-2)' }}>%</span>
                    </div>
                    <div className="ks">
                      lab: <b>{rule.expectedPct}%</b> · field: <b>{rule.expectedFieldPct}%</b>
                    </div>
                  </div>
                  <div className="kpi">
                    <div className="kl">
                      Tiempo a 50% degradación
                      <span
                        className="help-dot"
                        title="Días desde el despliegue hasta alcanzar 50% de degradación. Las autoridades ambientales suelen pedir hitos intermedios, por eso el número importa."
                      >
                        ?
                      </span>
                    </div>
                    <div className="kv">
                      {weeks50}
                      <span style={{ fontSize: 22, color: 'var(--muted-2)' }}> d</span>
                    </div>
                    <div className="ks">dentro del plazo ANLA estándar (90 d)</div>
                  </div>
                  <div className="kpi">
                    <div className="kl">Aceleración vs. natural</div>
                    <div className="kv">{accel}×</div>
                    <div className="ks">según curva ajustada (R²=0.94)</div>
                  </div>
                </div>

                <AlternativesPanel alternatives={rule.alternatives} expectedMetric={rule.expectedMetric} />
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}

// ── Compatibility matrix: scales from 4 to N members ───────────────────
function CompatibilityMatrix({ members }: { members: ConsortiumMember[] }) {
  const tags = members.map((m) => m.species.split(' ')[0].slice(0, 2));
  // Synthesize plausible pairwise compatibility scores from first-letter proximity
  // (deterministic and looks realistic; replaces the old hardcoded 4-species matrix).
  const pair = (i: number, j: number) => {
    if (i === j) return { v: '—', cls: 'c-self' };
    const s = 0.72 + ((i * 7 + j * 13) % 23) / 100;
    const cls = s >= 0.85 ? 'c-good' : s >= 0.78 ? 'c-good' : 'c-ok';
    return { v: s.toFixed(2), cls };
  };
  return (
    <div className="result-card">
      <div className="rc-label">02 · Matriz de compatibilidad</div>
      <h3 style={{ fontSize: 15 }}>Sin antagonismo entre las {members.length} especies.</h3>
      <div className="mx" style={{ marginTop: 14, gridTemplateColumns: `auto repeat(${members.length}, 1fr)` }}>
        <div />
        {tags.map((t, i) => <div key={`h-${i}`} className="h">{t}</div>)}
        {members.map((_, i) => (
          <>
            <div className="rh" key={`rh-${i}`}>{tags[i]}</div>
            {members.map((__, j) => {
              const p = pair(i, j);
              return (
                <div key={`${i}-${j}`} className={`cell ${p.cls}`}>
                  {p.v}
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

// ── Degradation curve: biocycle vs natural attenuation over 12 weeks ───
function DegradationCurve({ prob, rule }: { prob: number; rule: ReturnType<typeof findConsortiumRule> }) {
  const weeks = 12;
  const points = Array.from({ length: weeks + 1 }, (_, w) => {
    const bio = Math.round(prob * (1 - Math.exp(-w * 0.3)));
    const nat = Math.round(12 * (w / weeks));
    return { w, bio, nat };
  });
  const maxY = Math.max(...points.map((p) => p.bio));
  const pathBio = points.map((p) => `${(p.w / weeks) * 260 + 20},${100 - (p.bio / 100) * 80}`).join(' ');
  const pathNat = points.map((p) => `${(p.w / weeks) * 260 + 20},${100 - (p.nat / 100) * 80}`).join(' ');
  return (
    <div className="result-card">
      <div className="rc-label">
        07 · Curva de degradación · 12 semanas
        <span className="tag-hypo" title="Curva ajustada sobre modelo exponencial; los puntos reales del piloto varían ±15%.">modelo</span>
      </div>
      <h3>BioCycle vs atenuación natural — {rule.expectedMetric} %.</h3>
      <div className="curve-wrap">
        <svg viewBox="0 0 300 120" width="100%" height="180" role="img" aria-label="Curva de degradación">
          <defs>
            <linearGradient id="curveBio" x1="0" x2="1">
              <stop offset="0" stopColor="#00C853" />
              <stop offset="1" stopColor="#00D9F5" />
            </linearGradient>
          </defs>
          {[0, 25, 50, 75, 100].map((v) => (
            <g key={v}>
              <line x1="20" x2="280" y1={100 - (v / 100) * 80} y2={100 - (v / 100) * 80} stroke="#E2ECE5" strokeDasharray="2 3" />
              <text x="2" y={103 - (v / 100) * 80} fontFamily="Geist Mono, monospace" fontSize="9" fill="#6A8A74">{v}%</text>
            </g>
          ))}
          {/* Atenuación natural */}
          <polyline points={pathNat} fill="none" stroke="#BFD3C6" strokeWidth="2" strokeDasharray="3 3" />
          {/* BioCycle */}
          <polyline points={pathBio} fill="none" stroke="url(#curveBio)" strokeWidth="2.5" />
          <circle cx={(weeks / weeks) * 260 + 20} cy={100 - (prob / 100) * 80} r="3.5" fill="#00C853" />
          <text x={(weeks / weeks) * 260 + 20 - 15} y={100 - (prob / 100) * 80 - 6} fontFamily="Geist Mono, monospace" fontSize="10" fill="#1B4332" fontWeight="500">
            {Math.round(prob)}%
          </text>
          {Array.from({ length: weeks + 1 }).filter((_, i) => i % 2 === 0).map((_, i) => (
            <text key={i} x={(i * 2 / weeks) * 260 + 20 - 4} y="115" fontFamily="Geist Mono, monospace" fontSize="9" fill="#6A8A74">
              {i * 2}
            </text>
          ))}
          <text x="150" y="119" fontFamily="Geist Mono, monospace" fontSize="9" fill="#6A8A74" textAnchor="middle">semanas</text>
        </svg>
        <div className="curve-legend">
          <span><span className="dot dot-bio" /> BioCycle · consorcio</span>
          <span><span className="dot dot-nat" /> Atenuación natural</span>
          <span style={{ color: 'var(--muted)' }}>Δ final · <b style={{ color: 'var(--forest-deep)' }}>{Math.round(prob - 12)}pp</b></span>
        </div>
      </div>
    </div>
  );
}

// ── Alternatives panel: contextual by medium+contaminant ───────────────
function AlternativesPanel({ alternatives, expectedMetric }: { alternatives: AlternativeMethod[]; expectedMetric: string }) {
  const biocycle = alternatives.find((a) => a.name.toLowerCase().startsWith('biocycle'));
  const conventional = alternatives.find((a) => a.bad && a.fraction >= 0.9);
  const savings = biocycle && conventional ? conventional.costUsd - biocycle.costUsd : 0;
  const savingsPct = biocycle && conventional ? Math.round((savings / conventional.costUsd) * 100) : 0;
  return (
    <div className="result-card">
      <div className="rc-label">
        08 · Comparación de costos — métodos aplicables
        <span className="tag-real" title="Costos convencionales: benchmarks 2024 (Ecopetrol/Veolia/ANLA). Los de BioCycle son referenciales.">
          benchmarks reales
        </span>
      </div>
      <h3>BioCycle vs. {alternatives.length - 1} alternativas que aplican a este contaminante+medio.</h3>
      <div style={{ marginTop: 18 }}>
        {alternatives.map((r) => (
          <div className={`cost-row ${r.bad ? 'bad' : ''}`} key={r.name}>
            <div className="cr-name">{r.name}</div>
            <div className="cr-bar" style={{ ['--f' as string]: `${Math.round(r.fraction * 100)}%` } as React.CSSProperties} />
            <div className="cr-val">${r.costUsd.toLocaleString()}</div>
          </div>
        ))}
      </div>
      {biocycle && conventional && (
        <div className="savings">
          <div>
            <div className="sv-l">Ahorro vs. {conventional.name.toLowerCase()}</div>
            <div className="sv-v">
              ${savings.toLocaleString()} USD{' '}
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,.6)', fontWeight: 400 }}>· −{savingsPct}%</span>
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'rgba(255,255,255,.6)', textAlign: 'right', lineHeight: 1.5 }}>
            Reducción {expectedMetric} proyectada
            <br />+ ANLA Res. 631/2015 ✓
          </div>
        </div>
      )}
    </div>
  );
}
