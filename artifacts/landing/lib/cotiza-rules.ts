/**
 * Cotiza rules — hard-coded mapping of operation type → allowed contaminants
 * → baseline cost/benefit model per country.
 *
 * Numbers are referential only (±20% sensitivity) and derived from:
 *   - CONSORTIA_DATA + SUCCESS_PROBABILITIES (artifacts/impulso-biocycle/data.py)
 *   - ANLA Res. 631/2015 regulatory thresholds (Colombia)
 *   - Ecopetrol 2024 landfarming benchmark for TPH soil
 *   - Veolia / Aquatech industry reports for textile effluent treatment
 *   - SEMARNAT NOM-021 / NOM-138 for agro contaminants (Mexico)
 *
 * When we need a new operation or contaminant, extend this file. The Cotiza UI
 * is a pure function of these rules — no hardcoded numbers in the JSX.
 */

export type CountryCode = 'CO' | 'MX' | 'PE' | 'CL' | 'US' | 'EU' | 'BR';
export type OpSlug = 'refineria' | 'textil' | 'agro' | 'relleno' | 'mineria' | 'consultora';
export type Urgency = 'low' | 'med' | 'high';

export interface AllowedContaminant {
  key: string;
  label: string;
  /** Maps to a key in CONSORTIA_DATA for traceability. */
  consortiumKey: string;
}

export interface CotizaRule {
  opSlug: OpSlug;
  opLabel: string;
  subtitle: string;
  allowedContaminants: AllowedContaminant[];
  baseline: {
    /** Unit the client pays per. */
    volumeUnit: string;
    /** Range (min, default, max) for the volume input. */
    volumeRange: [number, number, number];
    /** Conventional (non-bio) alternative. */
    conventional: {
      method: string; // e.g. "Excavación + relleno"
      costPerUnit: number; // USD per volumeUnit
      co2PerUnit: number; // tons CO₂ per volumeUnit
    };
    /** BioCycle pilot pricing model: cost = baseCost + slopePerUnit * volume. */
    biocycle: {
      baseCost: number;
      slopePerUnit: number;
      co2PerUnit: number; // tons saved per volumeUnit (negative = evita emisión)
      weeksDuration: number;
    };
    /** Degradation expectation range from the literature. */
    expected: {
      metric: string; // e.g. "TPH degradation"
      range: [number, number]; // percent
      ci: number; // percent (confidence interval width)
      weeks: number;
      source: string; // short citation
    };
    /** Per-country regulatory reference. */
    regulationByCountry: Partial<Record<CountryCode, string>>;
  };
  /** Whether this op supports a computed quote. Consultora = no (it's a call booking). */
  supportsQuote: boolean;
}

export const COTIZA_RULES: Record<OpSlug, CotizaRule> = {
  refineria: {
    opSlug: 'refineria',
    opLabel: 'Refinería',
    subtitle: 'oil & gas · suelos con hidrocarburos',
    allowedContaminants: [
      { key: 'tph', label: 'TPH — hidrocarburos totales', consortiumKey: 'Petróleo crudo / derrames' },
      { key: 'diesel_gasolina', label: 'Diésel + gasolina — combustibles livianos', consortiumKey: 'Diesel y gasolina' },
      { key: 'btex', label: 'BTEX — benceno/tolueno/etilbenceno/xileno', consortiumKey: 'BTEX' },
      { key: 'pah_light', label: 'PAH livianos (naftaleno, fenantreno)', consortiumKey: 'Petróleo crudo / derrames' },
    ],
    baseline: {
      volumeUnit: 'm³ suelo',
      volumeRange: [20, 120, 2000],
      conventional: { method: 'Excavación + disposición en relleno autorizado', costPerUnit: 2390, co2PerUnit: 0.31 },
      biocycle: { baseCost: 5000, slopePerUnit: 95, co2PerUnit: 0.06, weeksDuration: 12 },
      expected: {
        metric: 'TPH',
        range: [65, 85],
        ci: 68,
        weeks: 12,
        source: 'Pseudomonas putida + Rhodococcus (12 papers CONSORTIA_DATA)',
      },
      regulationByCountry: {
        CO: 'ANLA Res. 631/2015 · Cap. 5 (hidrocarburos en suelo)',
        MX: 'SEMARNAT NOM-138-SEMARNAT/SSA1-2012',
        US: 'EPA RCRA Subpart C · 40 CFR 261',
        EU: 'Directiva 2004/35/CE · responsabilidad ambiental',
        BR: 'CONAMA 420/2009',
        CL: 'DS 148/2003 MINSAL',
        PE: 'DS 002-2013-MINAM',
      },
    },
    supportsQuote: true,
  },
  textil: {
    opSlug: 'textil',
    opLabel: 'Textil',
    subtitle: 'efluentes · aguas residuales industriales',
    allowedContaminants: [
      { key: 'colorantes_azo', label: 'Colorantes azo — efluentes textiles', consortiumKey: 'Colorantes azoicos' },
      { key: 'colorantes_antraquinona', label: 'Colorantes antraquinona', consortiumKey: 'Colorantes azoicos' },
      { key: 'carga_organica_dqo', label: 'Alta carga orgánica (DQO > 1500 mg/L)', consortiumKey: 'Efluentes industriales orgánicos' },
    ],
    baseline: {
      volumeUnit: 'm³ efluente/día',
      volumeRange: [50, 500, 10000],
      conventional: { method: 'Fisicoquímico + precipitación + lodos', costPerUnit: 18, co2PerUnit: 0.004 },
      biocycle: { baseCost: 8000, slopePerUnit: 7, co2PerUnit: 0.0008, weeksDuration: 6 },
      expected: {
        metric: 'decolorización',
        range: [80, 92],
        ci: 70,
        weeks: 6,
        source: 'Trametes versicolor + Bacillus subtilis (8 papers peer-reviewed)',
      },
      regulationByCountry: {
        CO: 'ANLA Res. 631/2015 · Cap. 6 (industria textil)',
        MX: 'NOM-002-SEMARNAT-1996',
        US: 'EPA Clean Water Act § 307 (textile effluent)',
        EU: 'Directiva 2010/75/UE (BAT for textile)',
        BR: 'CONAMA 430/2011',
        CL: 'DS 90/2000',
        PE: 'DS 021-2009-VIVIENDA',
      },
    },
    supportsQuote: true,
  },
  agro: {
    opSlug: 'agro',
    opLabel: 'Agro',
    subtitle: 'suelos + aguas con pesticidas',
    allowedContaminants: [
      { key: 'glifosato', label: 'Glifosato + AMPA', consortiumKey: 'Glifosato' },
      { key: 'organoclorados', label: 'Organoclorados (DDT, lindano residual)', consortiumKey: 'Plaguicidas organoclorados' },
      { key: 'atrazina', label: 'Atrazina + metabolitos', consortiumKey: 'Atrazina' },
    ],
    baseline: {
      volumeUnit: 'ha cultivo',
      volumeRange: [1, 20, 500],
      conventional: { method: 'Lavado con carbón activado + remoción mecánica', costPerUnit: 450, co2PerUnit: 0.12 },
      biocycle: { baseCost: 3500, slopePerUnit: 180, co2PerUnit: 0.02, weeksDuration: 16 },
      expected: {
        metric: 'Gli+AMPA',
        range: [70, 85],
        ci: 65,
        weeks: 16,
        source: 'B. subtilis Bs-15 + L. sphaericus (6 papers + campo Meta, CO)',
      },
      regulationByCountry: {
        CO: 'ICA Res. 2906/2007 · ANLA Res. 0631/2015',
        MX: 'NOM-021-SEMARNAT-2000 · NOM-037-FITO-1995',
        US: 'EPA FIFRA · 40 CFR 180',
        EU: 'Reg. (CE) 396/2005 (LMR plaguicidas)',
        BR: 'CONAMA 396/2008',
        CL: 'DS 148/2003',
        PE: 'DS 010-2009-MINAM',
      },
    },
    supportsQuote: true,
  },
  relleno: {
    opSlug: 'relleno',
    opLabel: 'Relleno sanitario',
    subtitle: 'lixiviados · tratamiento anaeróbico',
    allowedContaminants: [
      { key: 'lixiviados', label: 'Lixiviados mixtos (DQO + metales trazas)', consortiumKey: 'Lixiviados de rellenos' },
      { key: 'metales_pesados', label: 'Lixiviados con metales pesados (Pb, Cr)', consortiumKey: 'Lixiviados de rellenos' },
    ],
    baseline: {
      volumeUnit: 'm³ lixiviado/día',
      volumeRange: [20, 200, 3000],
      conventional: { method: 'Evaporación + transporte a planta externa', costPerUnit: 28, co2PerUnit: 0.009 },
      biocycle: { baseCost: 7500, slopePerUnit: 11, co2PerUnit: 0.002, weeksDuration: 10 },
      expected: {
        metric: 'DQO',
        range: [75, 90],
        ci: 60,
        weeks: 10,
        source: 'Consorcio anaeróbico mixto (4 papers + 2 pilotos Argentina)',
      },
      regulationByCountry: {
        CO: 'Res. 0222/2011 · Decreto 1076/2015',
        MX: 'NOM-083-SEMARNAT-2003',
        US: 'EPA RCRA Subtitle D · 40 CFR 258',
        EU: 'Directiva 1999/31/CE (vertederos)',
        BR: 'CONAMA 358/2005',
        CL: 'DS 189/2005',
        PE: 'DS 014-2017-MINAM',
      },
    },
    supportsQuote: true,
  },
  mineria: {
    opSlug: 'mineria',
    opLabel: 'Minería',
    subtitle: 'relaves · metales pesados',
    allowedContaminants: [
      { key: 'mercurio', label: 'Mercurio (Hg) — minería artesanal oro', consortiumKey: 'Mercurio' },
      { key: 'arsenico', label: 'Arsénico (As) — drenaje ácido', consortiumKey: 'Arsénico' },
      { key: 'cianuro', label: 'Cianuro residual', consortiumKey: 'Cianuro' },
    ],
    baseline: {
      volumeUnit: 'ton relave',
      volumeRange: [50, 500, 50000],
      conventional: { method: 'Encapsulamiento + liner HDPE + monitoreo 30 años', costPerUnit: 180, co2PerUnit: 0.05 },
      biocycle: { baseCost: 12000, slopePerUnit: 70, co2PerUnit: 0.01, weeksDuration: 20 },
      expected: {
        metric: 'biodisponibilidad Hg',
        range: [50, 75],
        ci: 55,
        weeks: 20,
        source: 'Bacillus + Aspergillus tubingensis (5 papers + lab Perú)',
      },
      regulationByCountry: {
        CO: 'Decreto 1076/2015 · Convenio Minamata ratificado',
        MX: 'NOM-141-SEMARNAT-2003 (relaves)',
        US: 'EPA Clean Water Act § 402 · NPDES',
        EU: 'Directiva 2006/21/CE (residuos extractivos)',
        BR: 'CONAMA 357/2005',
        CL: 'DS 248/2006',
        PE: 'DS 040-2014-EM (actividades mineras)',
      },
    },
    supportsQuote: true,
  },
  consultora: {
    opSlug: 'consultora',
    opLabel: 'Consultora ambiental',
    subtitle: 'partner técnico · white-label',
    allowedContaminants: [],
    baseline: {
      volumeUnit: 'proyecto',
      volumeRange: [1, 1, 50],
      conventional: { method: 'n/a', costPerUnit: 0, co2PerUnit: 0 },
      biocycle: { baseCost: 0, slopePerUnit: 0, co2PerUnit: 0, weeksDuration: 0 },
      expected: { metric: 'n/a', range: [0, 0], ci: 0, weeks: 0, source: '' },
      regulationByCountry: {},
    },
    supportsQuote: false, // Show "agenda call técnico" CTA instead of calc
  },
};

export interface QuoteInput {
  op: OpSlug;
  contaminantKey: string;
  volume: number;
  country: CountryCode;
  urgency: Urgency;
}

export interface QuoteResult {
  op: OpSlug;
  opLabel: string;
  contaminantLabel: string;
  /** Pilot pricing. */
  pilotCostTotal: number;
  pilotCostMonthly: number;
  weeksDuration: number;
  /** Conventional baseline cost for comparison. */
  conventionalTotal: number;
  conventionalMethod: string;
  savingsAbsolute: number;
  savingsPct: number;
  /** ROI estimate (annualized savings / pilot cost - 1, capped to 999). */
  roiYear1Pct: number;
  /** Degradation metric name + value. */
  expectedMetric: string;
  expectedReductionPct: number;
  expectedCiPct: number;
  expectedSource: string;
  /** CO₂ saved. */
  co2SavedTons: number;
  /** Regulatory reference for the selected country. */
  regulation: string;
  /** Urgency multipliers applied. */
  urgencyNote: string;
  /** Volume + unit, for display. */
  volumeLabel: string;
}

/** Deterministic quote computation — pure function of rules + inputs. */
export function computeQuote(input: QuoteInput): QuoteResult | null {
  const rule = COTIZA_RULES[input.op];
  if (!rule || !rule.supportsQuote) return null;
  const contam = rule.allowedContaminants.find((c) => c.key === input.contaminantKey);
  if (!contam) return null;

  const v = Math.max(
    rule.baseline.volumeRange[0],
    Math.min(rule.baseline.volumeRange[2], input.volume),
  );

  const urgencyMult: Record<Urgency, number> = { low: 0.95, med: 1, high: 1.18 };
  const urgencyNote: Record<Urgency, string> = {
    low: 'descuento −5% por ventana amplia',
    med: 'sin recargo',
    high: 'recargo +18% por ventana crítica',
  };

  const pilotCostTotal = Math.round(
    (rule.baseline.biocycle.baseCost + rule.baseline.biocycle.slopePerUnit * v) *
      urgencyMult[input.urgency],
  );
  const conventionalTotal = Math.round(rule.baseline.conventional.costPerUnit * v);
  const savingsAbsolute = Math.max(0, conventionalTotal - pilotCostTotal);
  const savingsPct = conventionalTotal > 0 ? Math.round((savingsAbsolute / conventionalTotal) * 100) : 0;

  const months = Math.max(1, Math.round(rule.baseline.biocycle.weeksDuration / 4));
  const pilotCostMonthly = Math.round(pilotCostTotal / months);

  const roiRaw = pilotCostTotal > 0 ? (savingsAbsolute / pilotCostTotal) * 100 : 0;
  const roiYear1Pct = Math.min(999, Math.round(roiRaw));

  const co2Saved =
    (rule.baseline.conventional.co2PerUnit - rule.baseline.biocycle.co2PerUnit) * v;
  const co2SavedTons = Math.round(co2Saved * 10) / 10;

  const expectedReductionPct = Math.round(
    (rule.baseline.expected.range[0] + rule.baseline.expected.range[1]) / 2,
  );

  return {
    op: input.op,
    opLabel: rule.opLabel,
    contaminantLabel: contam.label,
    pilotCostTotal,
    pilotCostMonthly,
    weeksDuration: rule.baseline.biocycle.weeksDuration,
    conventionalTotal,
    conventionalMethod: rule.baseline.conventional.method,
    savingsAbsolute,
    savingsPct,
    roiYear1Pct,
    expectedMetric: rule.baseline.expected.metric,
    expectedReductionPct,
    expectedCiPct: rule.baseline.expected.ci,
    expectedSource: rule.baseline.expected.source,
    co2SavedTons,
    regulation:
      rule.baseline.regulationByCountry[input.country] ??
      'Consulta local — normativa no mapeada aún',
    urgencyNote: urgencyNote[input.urgency],
    volumeLabel: `${v.toLocaleString()} ${rule.baseline.volumeUnit}`,
  };
}
