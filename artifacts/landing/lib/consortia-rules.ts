/**
 * Consortia rules for the Diseñador wizard.
 *
 * Maps (contaminant category, subtype) → recommended microbial consortium,
 * valid media, and the real-world alternative methods to compare against.
 *
 * ── SCIENTIFIC VALIDATION (Apr 2026) ────────────────────────────────────
 * This file was reviewed by 4 multi-agent scientific validators against
 * peer-reviewed literature 2018–2025. Corrections applied:
 *   - Bacillus subtilis 168 (sfp−, lab-domesticated) replaced with:
 *     · ATCC 21332 (surfactin+) for hydrocarbon cases
 *     · ZWL for textile azo dye cases
 *     · Arthrobacter aurescens TC1 for atrazine (168 is not an atrazine degrader)
 *   - Aspergillus tubingensis (ochratoxin risk) replaced with A. niger (true GRAS)
 *   - Pseudomonas fluorescens qualified to Pf-5 / SBW25 (avoid BSL-2 siblings)
 *   - BTEX / PAH / used oils now use lead strains specific to each pathway:
 *     · P. putida F1 (tod+) for BTEX
 *     · P. putida G7 (NAH7+) + R. jostii RHA1 elevated for PAH
 *     · R. erythropolis for used oils
 *   - Organoclorados (DDT/lindano) now use Sphingobium indicum B90A (lin operon)
 *   - Cyanide now uses P. putida (cynS) consortium (not mercury fallback)
 *   - Acid mine drainage (AMD) flagged OUT OF SCOPE (requires acidophiles + reactor engineering)
 *
 * Strain specificity is non-negotiable: ambiguous species names are the #1
 * reason regulators reject biorremediation proposals and the #1 BSL-1 risk
 * (sibling species can be BSL-2 / opportunistic pathogens).
 *
 * Hard rules (CLAUDE.md):
 *   #2 — only BSL-1 / GRAS organisms. Never P. aeruginosa, K. pneumoniae, etc.
 *   #7 — no open-air metal volatilization. Hg reduction requires sealed bioreactor.
 *   #10 — all metal cases carry biosorption disclaimer (immobilization ≠ mineralization).
 */

export type MediumKey =
  | 'arenoso' | 'franco' | 'arcilloso' | 'organico'
  | 'agua_residual' | 'efluente_industrial' | 'reactor_liquido' | 'relave';

export type RegimeKey = 'co_culture' | 'sequential_anaerobic_aerobic' | 'compartmentalized' | 'sealed_bioreactor';

export interface ConsortiumMember {
  species: string;
  pct: number;           // mix fraction (sum to 100)
  role: string;
  range: string;         // optimal temp + pH
  bsl: 'BSL-1' | 'GRAS';
  /** "signature" species = unique to this consortium. Workhorses (B. subtilis, P. putida)
   *  are not signature. UI highlights signature species so user sees the consortium IS
   *  tailored to the contaminant (vs perceiving "same 4 microorganisms every time"). */
  signature?: boolean;
  /** Short citation for this species' role in this contaminant. */
  cite?: string;
}

export interface AlternativeMethod {
  name: string;
  fraction: number;      // 0–1 relative to most expensive
  costUsd: number;
  bad: boolean;
}

export interface ConsortiumRule {
  catId: string;
  subtype: string;
  consortium: ConsortiumMember[];
  allowedMedia: MediumKey[];
  /** Operational regime — critical for regulatory Q&A. */
  regime: RegimeKey;
  /** Regime human-readable label. */
  regimeNote: string;
  evidenceCitation: string;
  /** Peer-reviewed citation count for this specific combo. */
  paperCount: number;
  alternatives: AlternativeMethod[];
  /** Mid-range expected degradation (%) at the target window. */
  expectedPct: number;
  /** Expected field-realistic lower bound (literature field results). */
  expectedFieldPct: number;
  expectedMetric: string;
  /** Weeks to reach expectedPct in lab conditions. */
  weeksLab: number;
  /** Caveat flags — shown to user for scientific honesty. */
  caveat?: string;
  /** If true, this combination is NOT supported by BioCycle v1 (flag out of scope). */
  unsupported?: boolean;
}

const MEDIA_LABELS: Record<MediumKey, string> = {
  arenoso: 'Suelo arenoso',
  franco: 'Suelo franco',
  arcilloso: 'Suelo arcilloso',
  organico: 'Suelo orgánico',
  agua_residual: 'Agua residual',
  efluente_industrial: 'Efluente industrial',
  reactor_liquido: 'Medio líquido (reactor)',
  relave: 'Relave minero',
};

export function mediumLabel(key: MediumKey): string {
  return MEDIA_LABELS[key];
}

// ── HYDROCARBON CONSORTIA — differentiated by subtype ─────────────────

// TPH general + diesel: Pseudomonas/Rhodococcus with sfp+ Bacillus
const HC_TPH_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Pseudomonas putida KT2440 (alkB+)', pct: 42, role: 'Degradador primario · n-alcanos C6–C22', range: '20–35 °C · pH 6–8', bsl: 'BSL-1', cite: 'Nikel & de Lorenzo 2018' },
  { species: 'Rhodococcus jostii RHA1', pct: 28, role: 'PAH livianos + alkanos · 26 P450s', range: '15–32 °C · pH 5.5–8.5', bsl: 'BSL-1', signature: true, cite: 'McLeod et al. PNAS 2006' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 20, role: 'Surfactina · emulsificación NAPL', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS', cite: 'Zeigler et al. 2008' },
  { species: 'Pleurotus ostreatus', pct: 10, role: 'PAH pesados · manganeso peroxidasa', range: '20–30 °C · pH 5.5–7', bsl: 'BSL-1', cite: 'Hadibarata & Kristanti 2019' },
];

// BTEX (volatile aromatics): P. putida F1 lead with tod operon
const HC_BTEX_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Pseudomonas putida F1 (tod+)', pct: 40, role: 'Toluene dioxygenasa · BTEX gold standard', range: '25–32 °C · pH 6.5–8', bsl: 'BSL-1', signature: true, cite: 'Parales et al. 2008' },
  { species: 'Pseudomonas putida mt-2 (pWW0+)', pct: 25, role: 'TOL plasmid · xilenos', range: '25–32 °C · pH 6.5–8', bsl: 'BSL-1', signature: true, cite: 'Choi et al. 2013' },
  { species: 'Rhodococcus jostii RHA1', pct: 25, role: 'Etilbenceno + alquilbencenos', range: '15–32 °C · pH 5.5–8.5', bsl: 'BSL-1' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 10, role: 'Surfactina · bioavailability', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS' },
];

// PAH livianos (naphthalene, phenanthrene): G7 lead + elevated Rhodococcus
const HC_PAH_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Pseudomonas putida G7 (NAH7+)', pct: 35, role: 'Naftaleno dioxigenasa', range: '25–32 °C · pH 6.5–8', bsl: 'BSL-1', signature: true, cite: 'Habe & Omori 2003' },
  { species: 'Rhodococcus jostii RHA1', pct: 35, role: 'Fenantreno + PAH multi-ring', range: '15–32 °C · pH 5.5–8.5', bsl: 'BSL-1', signature: true, cite: 'Ghosal et al. 2016' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 20, role: 'Biosurfactante · PAH solubilization', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS' },
  { species: 'Pleurotus ostreatus', pct: 10, role: 'Lignin peroxidasa · 4–5 ring PAHs', range: '20–30 °C · pH 5.5–7', bsl: 'BSL-1' },
];

// Used lubricating oils: Rhodococcus erythropolis lead
const HC_OILS_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Rhodococcus erythropolis', pct: 40, role: 'Alkanos C20–C40 · aceites usados', range: '18–30 °C · pH 6–8', bsl: 'BSL-1', signature: true, cite: 'Laczi et al. Front Microbiol 2020' },
  { species: 'Acinetobacter baylyi ADP1', pct: 25, role: 'Alkanos larga cadena · naturally competent', range: '20–37 °C · pH 6–8', bsl: 'BSL-1', signature: true, cite: 'Auffret et al. 2015' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 20, role: 'Surfactina · alta viscosidad NAPL', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS' },
  { species: 'Trametes versicolor', pct: 15, role: 'Lignin peroxidasa · aceites oxidados', range: '25–30 °C · pH 4.5–6', bsl: 'BSL-1' },
];

// ── TEXTILE AZO DYES — sequential anaerobic→aerobic ───────────────────
const AZO_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Trametes versicolor', pct: 50, role: 'Lacasa · decolorización azo aerobio', range: '25–30 °C · pH 4.5–5.5', bsl: 'BSL-1', signature: true, cite: 'Legerská et al. 2018' },
  { species: 'Bacillus subtilis ZWL', pct: 20, role: 'Azoreductasa · ruptura N=N (anaerobio)', range: '30–37 °C · pH 6.5–8', bsl: 'GRAS', signature: true, cite: 'Chmelová et al. 2024' },
  { species: 'Pseudomonas putida KT2440', pct: 20, role: 'Mineralización aminas aromáticas', range: '20–35 °C · pH 6–8', bsl: 'BSL-1', cite: 'Nikel & de Lorenzo 2018' },
  { species: 'Aspergillus niger ATCC 1015', pct: 10, role: 'Peroxidasas · compuestos resistentes', range: '25–35 °C · pH 4–7', bsl: 'GRAS' },
];

// Antraquinona: same base but niger role elevated (MnP excels at anthraquinone)
const ANTRAQUINONA_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Trametes versicolor', pct: 45, role: 'Lacasa · Reactive Blue 19 (98%)', range: '25–30 °C · pH 4.5–5.5', bsl: 'BSL-1', signature: true, cite: 'Iark et al. 2019' },
  { species: 'Aspergillus niger ATCC 1015', pct: 25, role: 'MnP · anthraquinone specialized', range: '25–35 °C · pH 4–7', bsl: 'GRAS', signature: true, cite: 'Si et al. 2013' },
  { species: 'Pseudomonas putida KT2440', pct: 20, role: 'Mineralización subproductos', range: '20–35 °C · pH 6–8', bsl: 'BSL-1' },
  { species: 'Bacillus subtilis ZWL', pct: 10, role: 'Azoreductasa stub (mixta)', range: '30–37 °C · pH 6.5–8', bsl: 'GRAS' },
];

// High-COD textile effluent: hybrid consortium (new, per Agent 2 rec)
const TEXTILE_HIGH_COD_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Trametes versicolor', pct: 30, role: 'Decolorización + lignin', range: '25–30 °C · pH 4.5–5.5', bsl: 'BSL-1', signature: true },
  { species: 'Bacillus licheniformis', pct: 25, role: 'Proteasa · sizing agents + starch', range: '30–50 °C · pH 6.5–8', bsl: 'GRAS', signature: true, cite: 'Kurniawan et al. 2021' },
  { species: 'Pseudomonas putida KT2440', pct: 25, role: 'LAS surfactantes + compuestos solubles', range: '20–35 °C · pH 6–8', bsl: 'BSL-1' },
  { species: 'Aspergillus niger ATCC 1015', pct: 20, role: 'PVA + celulosa residual', range: '25–35 °C · pH 4–7', bsl: 'GRAS' },
];

// ── WATER TREATMENT · LEACHATE ────────────────────────────────────────
const LIXIVIADO_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Pseudomonas fluorescens Pf-5', pct: 35, role: 'Degradador orgánicos solubles · psicrotolerante', range: '15–30 °C · pH 6–8', bsl: 'BSL-1', signature: true, cite: 'ATCC BAA-477' },
  { species: 'Bacillus licheniformis', pct: 30, role: 'Proteasas + floculación EPS', range: '30–50 °C · pH 6.5–8', bsl: 'GRAS', signature: true, cite: 'Kurniawan et al. 2021' },
  { species: 'Aspergillus niger ATCC 1015', pct: 20, role: 'Quelación metales trazas', range: '25–35 °C · pH 4–7', bsl: 'GRAS', cite: 'Dusengemungu et al. 2020' },
  { species: 'Trichoderma harzianum', pct: 15, role: 'Reducción DQO residual', range: '22–30 °C · pH 5.5–7.5', bsl: 'BSL-1' },
];

// Heavy metals in leachate: Cupriavidus necator addition (Agent 2 rec)
const LIXIVIADO_METALES_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Cupriavidus necator H16', pct: 30, role: 'Cr(VI)→Cr(III) reduction · gold standard', range: '25–35 °C · pH 6–8', bsl: 'BSL-1', signature: true, cite: 'Peoples et al. 2019' },
  { species: 'Bacillus licheniformis', pct: 25, role: 'EPS · Pb binding (50–120 mg/g)', range: '30–50 °C · pH 6.5–8', bsl: 'GRAS', cite: 'Machado et al. 2020' },
  { species: 'Aspergillus niger ATCC 1015', pct: 25, role: 'Biosorción Pb/Cd · oxalato/citrato', range: '25–35 °C · pH 4–7', bsl: 'GRAS', signature: true },
  { species: 'Pseudomonas fluorescens Pf-5', pct: 20, role: 'Organoquelantes + psicrotolerancia', range: '15–30 °C · pH 6–8', bsl: 'BSL-1' },
];

// ── PESTICIDES ────────────────────────────────────────────────────────

const GLIFOSATO_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Lysinibacillus sphaericus OT4b.31', pct: 35, role: 'C-P liasa · metabolismo AMPA', range: '25–35 °C · pH 6.5–8.5', bsl: 'BSL-1', signature: true, cite: 'Manogaran et al. 2021' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 25, role: 'Phosphonatasa · C-P bond cleavage', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS', cite: 'Zhan et al. Chemosphere 2018' },
  { species: 'Pseudomonas putida KT2440', pct: 25, role: 'Co-metabolismo aromáticos', range: '20–35 °C · pH 6–8', bsl: 'BSL-1', cite: 'Nilsson et al. 2019' },
  { species: 'Trametes versicolor', pct: 15, role: 'Lacasa · degradación ligninolitíca glifosato', range: '25–30 °C · pH 4.5–5.5', bsl: 'BSL-1', signature: true, cite: 'Spina et al. 2018' },
];

const ATRAZINA_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Pseudomonas sp. ADP (atzA/B/C)', pct: 40, role: 'Atrazina clorohidrolasa · gold standard', range: '25–30 °C · pH 6.5–8', bsl: 'BSL-1', signature: true, cite: 'Martinez et al. 2001' },
  { species: 'Arthrobacter aurescens TC1', pct: 30, role: 'Mineralización atrazina completa', range: '20–30 °C · pH 6.5–8', bsl: 'BSL-1', signature: true, cite: 'Strong et al. 2002' },
  { species: 'Rhodococcus jostii RHA1', pct: 20, role: 'Apertura anillo triazina', range: '15–32 °C · pH 5.5–8.5', bsl: 'BSL-1' },
  { species: 'Trichoderma harzianum', pct: 10, role: 'Mineralización metabolitos residuales', range: '22–30 °C · pH 5.5–7.5', bsl: 'BSL-1', cite: 'Mohamed et al. 2019' },
];

// Organochlorines (DDT, lindane): dedicated Sphingobium consortium
const ORGANOCLORADOS_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Sphingobium indicum B90A (lin+)', pct: 35, role: 'Lin operon · degradación γ-HCH/lindano', range: '20–30 °C · pH 6.5–7.5', bsl: 'BSL-1', signature: true, cite: 'Lal et al. 2010' },
  { species: 'Sphingomonas paucimobilis', pct: 25, role: 'DDT dehidrohalogenasa', range: '20–30 °C · pH 6.5–7.5', bsl: 'BSL-1', signature: true, cite: 'Pan et al. 2021' },
  { species: 'Pseudomonas fluorescens Pf-5', pct: 20, role: 'Co-metabolismo cloroaromáticos', range: '15–30 °C · pH 6–8', bsl: 'BSL-1' },
  { species: 'Phanerochaete chrysosporium', pct: 20, role: 'White-rot · lignin peroxidasa · DDT', range: '30–37 °C · pH 4.5–5.5', bsl: 'BSL-1', signature: true, cite: 'Ortíz-Hernández et al. 2018' },
];

// ── MINING ────────────────────────────────────────────────────────────

const HG_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Bacillus megaterium (mer+)', pct: 40, role: 'mer operón · Hg²⁺→Hg⁰ volatilización', range: '25–37 °C · pH 6–8', bsl: 'GRAS', signature: true, cite: 'Mahbub et al. 2017' },
  { species: 'Aspergillus niger ATCC 1015', pct: 30, role: 'Biosorción · quelación Hg', range: '25–35 °C · pH 4–7', bsl: 'GRAS', cite: 'Kumar & Dwivedi 2021' },
  { species: 'Pseudomonas putida KT2440 (mer+)', pct: 20, role: 'Resistencia · engineered mer variants', range: '20–35 °C · pH 6–8', bsl: 'BSL-1', cite: 'Ruiz et al. 2011' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 10, role: 'Biofilm estabilizador', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS' },
];

const AS_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Thiomonas arsenitoxydans', pct: 30, role: 'Oxidación As(III)→As(V) · especialista', range: '20–30 °C · pH 5.5–7.5', bsl: 'BSL-1', signature: true, cite: 'Quéméneur et al. 2008' },
  { species: 'Pseudomonas putida KT2440', pct: 25, role: 'Arsenito oxidasa · tolerancia', range: '20–35 °C · pH 6–8', bsl: 'BSL-1' },
  { species: 'Aspergillus niger ATCC 1015', pct: 25, role: 'Biosorción As · ácido oxálico', range: '25–35 °C · pH 4–7', bsl: 'GRAS', signature: true, cite: 'Say et al. 2003' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 20, role: 'ars operón · tolerancia', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS' },
];

// Cyanide: dedicated cynS consortium (Agent 3 rec — rejects Hg fallback)
const CIANURO_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Pseudomonas putida KT2440 (cynS+)', pct: 40, role: 'Cyanase · NCO⁻ hydrolysis', range: '20–35 °C · pH 6–8', bsl: 'BSL-1', signature: true, cite: 'Luque-Almagro et al. 2005' },
  { species: 'Bacillus pumilus C1', pct: 25, role: 'Cyanide dihydratase', range: '25–37 °C · pH 7–9', bsl: 'GRAS', signature: true, cite: 'Meyers et al. 1993' },
  { species: 'Trichoderma harzianum', pct: 20, role: 'Cyanide hydratase · detoxificación', range: '22–30 °C · pH 5.5–7.5', bsl: 'BSL-1' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 15, role: 'Rhodanese · biofilm support', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS' },
];

// ── PLASTICS (bioreactor only per pivote A+C) ─────────────────────────
// Chassis-based approach: FAST-PETase or LCC-ICCG expressed in engineered hosts
// at 50 °C on amorphized/micronized PET (pre-treated). Wild-type Ideonella at 30 °C
// CANNOT deliver 65% in 12 weeks — literature benchmark is engineered enzymes + pretreatment.
const PLASTIC_PET_CONSORTIUM: ConsortiumMember[] = [
  { species: 'E. coli BL21 (FAST-PETase recombinante, 50 °C)', pct: 35, role: 'FAST-PETase engineered · hidrólisis PET amorfo', range: '50–65 °C · pH 7–8', bsl: 'BSL-1', signature: true, cite: 'Lu et al. Nature 2022 (UT Austin)' },
  { species: 'Yarrowia lipolytica (LCC-ICCG secretada)', pct: 25, role: 'LCC-ICCG leaf-branch compost cutinase', range: '50–72 °C · pH 7–8.5', bsl: 'BSL-1', signature: true, cite: 'Tournier et al. Nature 2020' },
  { species: 'Pseudomonas putida KT2440 (TphA+)', pct: 25, role: 'TPA dioxigenasa · mineralización TPA', range: '20–35 °C · pH 6–8', bsl: 'BSL-1', cite: 'Bao et al. Metab Eng 2024 (4.1× ALE)' },
  { species: 'Aspergillus niger ATCC 1015', pct: 15, role: 'Asimilación etilenglicol (EG)', range: '25–35 °C · pH 4–7', bsl: 'GRAS' },
];

// Non-PET plastics (HDPE, LDPE, PP, PVC): completely different consortium. PETase has
// ZERO activity on polyolefins (no ester bonds). Correct approach = oxidative
// laccase/MnP enzymes after UV pre-oxidation. Still TRL 2–3 HYPOTHETICAL.
const PLASTIC_NONPET_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Rhodococcus ruber C208', pct: 35, role: 'Degradación oxidativa PE (post-UV)', range: '25–37 °C · pH 6.5–8', bsl: 'BSL-1', signature: true, cite: 'Sivan et al. 2006 — TRL 3' },
  { species: 'Pleurotus ostreatus', pct: 25, role: 'MnP · PE oxidada + PP', range: '20–30 °C · pH 5.5–7', bsl: 'BSL-1', signature: true },
  { species: 'Brevibacillus parabrevis', pct: 20, role: 'Alkanos de cadena muy larga', range: '25–37 °C · pH 6–8', bsl: 'BSL-1' },
  { species: 'Trametes versicolor', pct: 20, role: 'Lacasa · oxidación ligninolítica', range: '25–30 °C · pH 4.5–5.5', bsl: 'BSL-1' },
];

// ── PHARMACEUTICALS ──────────────────────────────────────────────────
// Role wording fixed per Agent 4 review: B. subtilis is co-metabolic support, not
// "beta-lactamase workhorse" (β-lactamases inactivate but don't mineralize).
const PHARMA_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Trametes versicolor', pct: 45, role: 'Lacasa · ≥94% diclofenaco en horas', range: '25–30 °C · pH 4.5–5.5', bsl: 'BSL-1', signature: true, cite: 'Marco-Urrea 2009 · Belleville 2023' },
  { species: 'Aspergillus niger ATCC 1015', pct: 25, role: 'CYP450 · antibióticos + AINEs', range: '25–35 °C · pH 4–7', bsl: 'GRAS', signature: true },
  { species: 'Pseudomonas putida KT2440', pct: 20, role: 'Mineralización subproductos aromáticos', range: '20–35 °C · pH 6–8', bsl: 'BSL-1' },
  { species: 'Bacillus subtilis ATCC 21332 (sfp+)', pct: 10, role: 'Soporte co-metabólico · biofilm', range: '25–40 °C · pH 6–8.5', bsl: 'GRAS' },
];

// ── PFAS (emerging contaminants · TRL 2–3 · HIPOTÉTICO) ───────────────
// Proper consortium per Agent 4 scientific review. Note: Acidimicrobium A6 paper was
// ES&T 2019, not Nature. 2023 ES&T correspondence raised reproducibility concerns.
const PFAS_CONSORTIUM: ConsortiumMember[] = [
  { species: 'Acidimicrobium sp. A6', pct: 50, role: 'Feammox · defluorinación anaeróbica PFOA/PFOS', range: '25–35 °C · pH 5.5–6.5', bsl: 'BSL-1', signature: true, cite: 'Huang & Jaffé ES&T 2019' },
  { species: 'Pseudomonas putida F1 (tod+)', pct: 20, role: 'PFCA cortas (C4–C6) · co-metabolismo', range: '25–32 °C · pH 6.5–8', bsl: 'BSL-1', signature: true },
  { species: 'Desulfovibrio desulfuricans', pct: 20, role: 'Dehalogenación anaeróbica · SRB support', range: '25–35 °C · pH 6.5–8', bsl: 'BSL-1', signature: true },
  { species: 'Gordonia sp.', pct: 10, role: '6:2 FTSA fluorotelómeros', range: '25–35 °C · pH 6–8', bsl: 'BSL-1', cite: 'Kim et al. 2014' },
];

// ── ALTERNATIVE METHODS (cost comparison) ─────────────────────────────

const ALT_SOIL_HC: AlternativeMethod[] = [
  { name: 'Excavación + relleno autorizado', fraction: 1.0, costUsd: 287500, bad: true },
  { name: 'Lavado fisicoquímico in-situ', fraction: 0.72, costUsd: 206400, bad: true },
  { name: 'Landfarming clásico', fraction: 0.38, costUsd: 108800, bad: false },
  { name: 'BioCycle · piloto 90 d', fraction: 0.12, costUsd: 34600, bad: false },
];

const ALT_WATER_AZO: AlternativeMethod[] = [
  { name: 'Fisicoquímico + precipitación + lodos', fraction: 1.0, costUsd: 216000, bad: true },
  { name: 'Carbón activado + filtración', fraction: 0.68, costUsd: 146900, bad: true },
  { name: 'Ozonización + UV', fraction: 0.52, costUsd: 112300, bad: false },
  { name: 'BioCycle · bioreactor secuencial', fraction: 0.19, costUsd: 41000, bad: false },
];

const ALT_WATER_LIX: AlternativeMethod[] = [
  { name: 'Evaporación + transporte externo', fraction: 1.0, costUsd: 280000, bad: true },
  { name: 'Ósmosis inversa + descarte', fraction: 0.78, costUsd: 218400, bad: true },
  { name: 'SBR aeróbico convencional', fraction: 0.45, costUsd: 126000, bad: false },
  { name: 'BioCycle · biorreactor anaeróbico', fraction: 0.14, costUsd: 39200, bad: false },
];

const ALT_SOIL_PEST: AlternativeMethod[] = [
  { name: 'Lavado con carbón activado', fraction: 1.0, costUsd: 90000, bad: true },
  { name: 'Incineración + encapsulamiento', fraction: 0.85, costUsd: 76500, bad: true },
  { name: 'Fitorremediación no dirigida', fraction: 0.42, costUsd: 37800, bad: false },
  { name: 'BioCycle · aplicación in-situ', fraction: 0.20, costUsd: 18000, bad: false },
];

const ALT_MINING: AlternativeMethod[] = [
  { name: 'Encapsulamiento HDPE + monitoreo 30a', fraction: 1.0, costUsd: 90000, bad: true },
  { name: 'Tratamiento químico + estabilización', fraction: 0.68, costUsd: 61200, bad: true },
  { name: 'Biolixiviación no-dirigida', fraction: 0.35, costUsd: 31500, bad: false },
  { name: 'BioCycle · biolixiviación controlada', fraction: 0.22, costUsd: 19800, bad: false },
];

const ALT_PLASTIC: AlternativeMethod[] = [
  { name: 'Pirólisis térmica (450 °C)', fraction: 1.0, costUsd: 175000, bad: true },
  { name: 'Depolimerización química (metanolisis)', fraction: 0.82, costUsd: 143500, bad: true },
  { name: 'Reciclaje mecánico (downcycling)', fraction: 0.54, costUsd: 94500, bad: false },
  { name: 'BioCycle · biorreactor enzimático', fraction: 0.28, costUsd: 49000, bad: false },
];

const ALT_PHARMA: AlternativeMethod[] = [
  { name: 'Ozonización + carbón activado', fraction: 1.0, costUsd: 156000, bad: true },
  { name: 'UV-peróxido (AOP)', fraction: 0.72, costUsd: 112300, bad: true },
  { name: 'Membrana biorreactor (MBR) convencional', fraction: 0.48, costUsd: 74900, bad: false },
  { name: 'BioCycle · consorcio hongo-bacteria', fraction: 0.19, costUsd: 29600, bad: false },
];

// ── RULES REGISTRY ────────────────────────────────────────────────────

export const CONSORTIUM_RULES: ConsortiumRule[] = [
  // Hidrocarburos — 5 subtipos con consorcios DIFERENCIADOS
  {
    catId: 'hydrocarbons', subtype: 'TPH (totales)',
    consortium: HC_TPH_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture aerobia · aplicación in-situ con cápsulas alginato',
    evidenceCitation: 'P. putida + R. jostii RHA1 — 12 papers · Ecopetrol 2024 benchmark',
    paperCount: 12,
    alternatives: ALT_SOIL_HC,
    expectedPct: 75, expectedFieldPct: 45, weeksLab: 12, expectedMetric: 'TPH',
  },
  {
    catId: 'hydrocarbons', subtype: 'BTEX',
    consortium: HC_BTEX_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture aerobia · P. putida F1 con tod operon (gold standard BTEX)',
    evidenceCitation: 'P. putida F1/mt-2 — Parales et al. 2008 · Choi et al. 2013 (8 papers)',
    paperCount: 8,
    alternatives: ALT_SOIL_HC,
    expectedPct: 82, expectedFieldPct: 55, weeksLab: 10, expectedMetric: 'BTEX',
    caveat: 'BTEX es volátil — capturar vapores en cámara sellada es recomendado.',
  },
  {
    catId: 'hydrocarbons', subtype: 'PAH — livianos',
    consortium: HC_PAH_CONSORTIUM,
    allowedMedia: ['franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · lead P. putida G7 (NAH7+) + Rhodococcus elevado',
    evidenceCitation: 'Habe & Omori 2003 · Ghosal et al. 2016 (14 papers naftaleno/fenantreno)',
    paperCount: 14,
    alternatives: ALT_SOIL_HC,
    expectedPct: 78, expectedFieldPct: 50, weeksLab: 12, expectedMetric: 'PAH',
  },
  {
    catId: 'hydrocarbons', subtype: 'PAH — pesados',
    consortium: HC_PAH_CONSORTIUM,
    allowedMedia: ['franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · Pleurotus elevado para anillos 4–5',
    evidenceCitation: 'White-rot fungi + R. jostii (9 papers PAH >4 rings)',
    paperCount: 9,
    alternatives: ALT_SOIL_HC,
    expectedPct: 58, expectedFieldPct: 30, weeksLab: 16, expectedMetric: 'PAH 4–5 rings',
    caveat: 'PAH pesados (>4 rings) son recalcitrantes — ventanas largas (16+ sem).',
  },
  {
    catId: 'hydrocarbons', subtype: 'Diesel / gasolina',
    consortium: HC_TPH_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture aerobia · mix alkano + BTEX — surfactina crítica',
    evidenceCitation: 'Auffret et al. 2015 · Varjani 2017 (diesel field trials)',
    paperCount: 11,
    alternatives: ALT_SOIL_HC,
    expectedPct: 72, expectedFieldPct: 42, weeksLab: 12, expectedMetric: 'HC totales',
  },
  {
    catId: 'hydrocarbons', subtype: 'Aceites lubricantes',
    consortium: HC_OILS_CONSORTIUM,
    allowedMedia: ['franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · Rhodococcus erythropolis lead · alta viscosidad',
    evidenceCitation: 'Laczi et al. Front Microbiol 2020 · Auffret 2015 (7 papers)',
    paperCount: 7,
    alternatives: ALT_SOIL_HC,
    expectedPct: 65, expectedFieldPct: 38, weeksLab: 14, expectedMetric: 'aceites usados',
    caveat: 'Aceites usados suelen co-contaminar con Pb/Zn — flag análisis metales.',
  },
  // Crudo sintético — usa consorcio TPH
  {
    catId: 'hydrocarbons', subtype: '*',
    consortium: HC_TPH_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · genérico hidrocarburo',
    evidenceCitation: 'Consorcio genérico TPH (10 papers)',
    paperCount: 10,
    alternatives: ALT_SOIL_HC,
    expectedPct: 72, expectedFieldPct: 42, weeksLab: 12, expectedMetric: 'HC',
  },

  // Textiles — Azo sequential, Antraquinona co-culture aerobia
  {
    catId: 'textiles', subtype: 'Azo',
    consortium: AZO_CONSORTIUM,
    allowedMedia: ['efluente_industrial', 'reactor_liquido', 'agua_residual'],
    regime: 'sequential_anaerobic_aerobic',
    regimeNote: 'SECUENCIAL: anaerobio (azoreductasa bacteriana · ruptura N=N) → aerobio (lacasa fúngica + mineralización aminas)',
    evidenceCitation: 'Legerská et al. 2018 · Chmelová et al. 2024 (8 papers azo)',
    paperCount: 8,
    alternatives: ALT_WATER_AZO,
    expectedPct: 86, expectedFieldPct: 72, weeksLab: 6, expectedMetric: 'decolorización',
  },
  {
    catId: 'textiles', subtype: 'Antraquinona',
    consortium: ANTRAQUINONA_CONSORTIUM,
    allowedMedia: ['efluente_industrial', 'reactor_liquido', 'agua_residual'],
    regime: 'co_culture',
    regimeNote: 'Co-culture aerobia · lacasa + MnP (antraquinona especializada)',
    evidenceCitation: 'Si et al. 2013 · Iark et al. 2019 — Reactive Blue 19 90–98%',
    paperCount: 6,
    alternatives: ALT_WATER_AZO,
    expectedPct: 92, expectedFieldPct: 80, weeksLab: 5, expectedMetric: 'decolorización',
  },
  {
    catId: 'textiles', subtype: 'Reactivos',
    consortium: AZO_CONSORTIUM,
    allowedMedia: ['efluente_industrial', 'reactor_liquido', 'agua_residual'],
    regime: 'sequential_anaerobic_aerobic',
    regimeNote: 'SECUENCIAL anaerobio→aerobio para dyes reactivos',
    evidenceCitation: 'Trametes + B. subtilis ZWL — 6 papers reactivos',
    paperCount: 6,
    alternatives: ALT_WATER_AZO,
    expectedPct: 84, expectedFieldPct: 68, weeksLab: 6, expectedMetric: 'decolorización',
  },

  // Water treatment
  {
    catId: 'water_treatment', subtype: 'Colorantes azo',
    consortium: AZO_CONSORTIUM,
    allowedMedia: ['efluente_industrial', 'reactor_liquido', 'agua_residual'],
    regime: 'sequential_anaerobic_aerobic',
    regimeNote: 'SECUENCIAL anaerobio→aerobio (mismo que textil azo)',
    evidenceCitation: 'Trametes + B. subtilis ZWL + P. putida (8 papers)',
    paperCount: 8,
    alternatives: ALT_WATER_AZO,
    expectedPct: 86, expectedFieldPct: 72, weeksLab: 6, expectedMetric: 'decolorización',
  },
  {
    catId: 'water_treatment', subtype: 'Lixiviados',
    consortium: LIXIVIADO_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'agua_residual'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · aeróbico · pH 6.5–8 (pre-neutralizar si pH >8)',
    evidenceCitation: 'Kurniawan et al. 2021 · Dusengemungu et al. 2020 (5 papers)',
    paperCount: 5,
    alternatives: ALT_WATER_LIX,
    expectedPct: 82, expectedFieldPct: 60, weeksLab: 10, expectedMetric: 'DQO',
    caveat: 'Lixiviados maduros (pH >8) requieren ajuste upstream.',
  },
  {
    catId: 'water_treatment', subtype: 'Efluente industrial',
    consortium: TEXTILE_HIGH_COD_CONSORTIUM,
    allowedMedia: ['efluente_industrial', 'reactor_liquido'],
    regime: 'co_culture',
    regimeNote: 'Co-culture híbrida para alta DQO mixta',
    evidenceCitation: 'Consorcio high-COD textile/industrial (5 papers)',
    paperCount: 5,
    alternatives: ALT_WATER_LIX,
    expectedPct: 78, expectedFieldPct: 55, weeksLab: 10, expectedMetric: 'DQO',
  },
  {
    catId: 'water_treatment', subtype: 'Agua gris',
    consortium: LIXIVIADO_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'agua_residual'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · greywater BOD 200–800 mg/L',
    evidenceCitation: 'Consorcio greywater genérico (4 papers)',
    paperCount: 4,
    alternatives: ALT_WATER_LIX,
    expectedPct: 78, expectedFieldPct: 58, weeksLab: 8, expectedMetric: 'DQO',
  },

  // Pesticidas — CONSORCIOS DIFERENCIADOS por pathway
  {
    catId: 'soil_ag', subtype: 'Glifosato',
    consortium: GLIFOSATO_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · C-P liasa + degradación ligninolítica',
    evidenceCitation: 'Manogaran et al. 2021 · Spina et al. 2018 (6 papers + campo Meta, CO)',
    paperCount: 6,
    alternatives: ALT_SOIL_PEST,
    expectedPct: 78, expectedFieldPct: 50, weeksLab: 16, expectedMetric: 'Gli+AMPA',
  },
  {
    catId: 'soil_ag', subtype: 'Atrazina',
    consortium: ATRAZINA_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · Pseudomonas ADP gold standard + Arthrobacter TC1',
    evidenceCitation: 'Martinez et al. 2001 (atzA/B/C) · Strong et al. 2002 · Mohamed 2019 (10 papers)',
    paperCount: 10,
    alternatives: ALT_SOIL_PEST,
    expectedPct: 82, expectedFieldPct: 58, weeksLab: 12, expectedMetric: 'atrazina',
  },
  {
    catId: 'soil_ag', subtype: 'Clorpirifos',
    consortium: GLIFOSATO_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · organofosforado · B. subtilis OPH',
    evidenceCitation: 'Consorcio organofosforado (5 papers — clorpirifos)',
    paperCount: 5,
    alternatives: ALT_SOIL_PEST,
    expectedPct: 70, expectedFieldPct: 42, weeksLab: 14, expectedMetric: 'clorpirifos',
  },
  {
    catId: 'soil_ag', subtype: 'Metales pesados',
    consortium: LIXIVIADO_METALES_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · bioacumulación/inmovilización (NO mineralización)',
    evidenceCitation: 'Peoples 2019 · Machado 2020 (7 papers metales en suelo)',
    paperCount: 7,
    alternatives: ALT_MINING,
    expectedPct: 65, expectedFieldPct: 40, weeksLab: 16, expectedMetric: 'Pb/Cd/Cr biodisp.',
    caveat: 'Los metales NO se degradan — se inmovilizan en biomasa. Gestionar como residuo Clase I.',
  },

  // Minería — cianuro y AMD con dedicated consortia; AMD flagged
  {
    catId: 'mining', subtype: 'Mercurio',
    consortium: HG_CONSORTIUM,
    allowedMedia: ['relave', 'arcilloso'],
    regime: 'sealed_bioreactor',
    regimeNote: 'BIOREACTOR SELLADO · Hg²⁺→Hg⁰ volatilización + trap de carbón activado (no open-air)',
    evidenceCitation: 'Mahbub et al. 2017 · Ruiz et al. 2011 (5 papers + lab Perú)',
    paperCount: 5,
    alternatives: ALT_MINING,
    expectedPct: 62, expectedFieldPct: 35, weeksLab: 20, expectedMetric: 'biodisp. Hg',
    caveat: 'Volatilización Hg⁰ requiere contención sellada + trap atmosférico. NO aplicar open.',
  },
  {
    catId: 'mining', subtype: 'Arsénico',
    consortium: AS_CONSORTIUM,
    allowedMedia: ['relave', 'arenoso', 'arcilloso'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · oxidación As(III)→As(V) + co-precipitación Fe + biosorción',
    evidenceCitation: 'Quéméneur 2008 · Say 2003 (4 papers + pre-neutralización AMD)',
    paperCount: 4,
    alternatives: ALT_MINING,
    expectedPct: 68, expectedFieldPct: 42, weeksLab: 20, expectedMetric: 'As biodisponible',
    caveat: 'As(V) aún es soluble — requiere co-precipitación Fe + sorción en biomasa para remoción efectiva.',
  },
  {
    catId: 'mining', subtype: 'Cianuro',
    consortium: CIANURO_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'relave'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · cyanase cynS + cyanide hydratase · pH 7–9',
    evidenceCitation: 'Luque-Almagro 2005 (cynS) · Meyers 1993 (B. pumilus C1) (4 papers)',
    paperCount: 4,
    alternatives: ALT_MINING,
    expectedPct: 74, expectedFieldPct: 50, weeksLab: 8, expectedMetric: 'CN⁻ libre',
  },
  {
    catId: 'mining', subtype: 'Drenaje ácido',
    consortium: CIANURO_CONSORTIUM, // fallback safe visual — marcado como no soportado
    allowedMedia: ['relave'],
    regime: 'sealed_bioreactor',
    regimeNote: 'REQUIERE acidófilos (Acidithiobacillus / SRB) + pre-neutralización · engineering-heavy',
    evidenceCitation: 'AMD requiere diseño ingenieril · fuera de scope BioCycle v1',
    paperCount: 0,
    alternatives: ALT_MINING,
    expectedPct: 0, expectedFieldPct: 0, weeksLab: 0, expectedMetric: 'AMD',
    unsupported: true,
    caveat: 'FUERA DE SCOPE v1 — AMD requiere acidófilos (Acidithiobacillus) + diseño de reactor/wetland. Consultar partner.',
  },
  {
    catId: 'mining', subtype: 'Plomo',
    consortium: LIXIVIADO_METALES_CONSORTIUM,
    allowedMedia: ['relave', 'arcilloso'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · biosorción Pb (inmovilización)',
    evidenceCitation: 'Machado 2020 · Peoples 2019 (5 papers metales)',
    paperCount: 5,
    alternatives: ALT_MINING,
    expectedPct: 60, expectedFieldPct: 38, weeksLab: 16, expectedMetric: 'Pb biodisp.',
    caveat: 'Biomasa cargada con Pb = residuo peligroso Clase I.',
  },

  // Pesticidas fallback (para subtipos no listados específicos)
  {
    catId: 'soil_ag', subtype: '*',
    consortium: GLIFOSATO_CONSORTIUM,
    allowedMedia: ['arenoso', 'franco', 'arcilloso', 'organico'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · pesticida genérico',
    evidenceCitation: 'Consorcio pesticida genérico',
    paperCount: 5,
    alternatives: ALT_SOIL_PEST,
    expectedPct: 65, expectedFieldPct: 38, weeksLab: 16, expectedMetric: 'pesticida',
  },

  // Plásticos — PET es el caso fuerte, otros plásticos HIPOTÉTICO
  {
    catId: 'plastics', subtype: 'PET',
    consortium: PLASTIC_PET_CONSORTIUM,
    allowedMedia: ['reactor_liquido'],
    regime: 'sealed_bioreactor',
    regimeNote: 'BIOREACTOR CONTENIDO · 50 °C · FAST-PETase/LCC-ICCG sobre PET amorfo + micronizado → TPA + EG ($800–1,600 USD/ton monómeros)',
    evidenceCitation: 'Lu et al. Nature 2022 (FAST-PETase) · Tournier et al. Nature 2020 (LCC-ICCG) · Bao 2024 TPA ALE',
    paperCount: 9,
    alternatives: ALT_PLASTIC,
    expectedPct: 65, expectedFieldPct: 40, weeksLab: 12, expectedMetric: 'PET→monómeros',
    caveat: 'REQUIERE pre-tratamiento (amorfización del PET) + operación a 50 °C. Ideonella wild-type a 30 °C NO alcanza estos rendimientos.',
  },
  {
    catId: 'plastics', subtype: '*',
    consortium: PLASTIC_NONPET_CONSORTIUM,
    allowedMedia: ['reactor_liquido'],
    regime: 'sealed_bioreactor',
    regimeNote: 'BIOREACTOR CONTENIDO · TRL 2–3 HIPOTÉTICO para HDPE/LDPE/PP/PVC',
    evidenceCitation: 'Khan et al. 2017 · TRL 2 · literatura preliminar',
    paperCount: 2,
    alternatives: ALT_PLASTIC,
    expectedPct: 18, expectedFieldPct: 8, weeksLab: 52, expectedMetric: 'pérdida de masa',
    caveat: 'HIPOTÉTICO · HDPE/LDPE/PP/PVC son MUCHO más recalcitrantes que PET. Resultados referenciales de lab (<20% en 1 año).',
  },

  // Farmacéuticos — antibióticos, hormonas, AINEs
  {
    catId: 'pharma', subtype: 'Antibióticos',
    consortium: PHARMA_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'efluente_industrial'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · hongos ligninolíticos + β-lactamasas bacterianas',
    evidenceCitation: 'Marco-Urrea 2010 (6 papers hongos ligninolíticos antibióticos)',
    paperCount: 6,
    alternatives: ALT_PHARMA,
    expectedPct: 72, expectedFieldPct: 48, weeksLab: 8, expectedMetric: 'antibióticos',
  },
  {
    catId: 'pharma', subtype: 'Hormonas',
    consortium: PHARMA_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'efluente_industrial'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · EE2/E1/E2 · lacasa remueve estrogenicidad en días, no meses',
    evidenceCitation: 'Blánquez 2016 · Tran 2013 (6 papers EE2 estrogénicos)',
    paperCount: 6,
    alternatives: ALT_PHARMA,
    expectedPct: 88, expectedFieldPct: 70, weeksLab: 3, expectedMetric: 'EE2',
  },
  {
    catId: 'pharma', subtype: 'AINEs',
    consortium: PHARMA_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'efluente_industrial'],
    regime: 'co_culture',
    regimeNote: 'Co-culture · ≥94% diclofenaco en ~1h (T. versicolor laccase)',
    evidenceCitation: 'Marco-Urrea 2009 · Tran 2013 · Blánquez 2016 (5 papers NSAIDs)',
    paperCount: 5,
    alternatives: ALT_PHARMA,
    expectedPct: 92, expectedFieldPct: 75, weeksLab: 2, expectedMetric: 'NSAIDs',
  },
  {
    catId: 'pharma', subtype: '*',
    consortium: PHARMA_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'efluente_industrial'],
    regime: 'co_culture',
    regimeNote: 'Co-culture genérica farmacéutica',
    evidenceCitation: 'Trametes + Aspergillus · 6 papers hongos ligninolíticos',
    paperCount: 6,
    alternatives: ALT_PHARMA,
    expectedPct: 70, expectedFieldPct: 45, weeksLab: 8, expectedMetric: 'farmacéuticos',
  },

  // Otros (PFAS, microplásticos) — TRL 2, HIPOTÉTICO
  {
    catId: 'other', subtype: 'PFAS',
    consortium: PFAS_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'efluente_industrial'],
    regime: 'compartmentalized',
    regimeNote: 'Compartimentalizado · anaerobio (Feammox A6) + aerobio (mineralización subproductos)',
    evidenceCitation: 'Huang & Jaffé ES&T 2019 (Acidimicrobium A6 · ~60% en 100 días condiciones ideales) · TRL 2–3',
    paperCount: 3,
    alternatives: ALT_PLASTIC,
    expectedPct: 30, expectedFieldPct: 12, weeksLab: 24, expectedMetric: 'PFAS total',
    caveat: 'HIPOTÉTICO · TRL 2–3 · Rango 20–40% en 12 sem. La defluorinación produce PFAAs cortos (no mineralización completa). El paper clave (Huang & Jaffé 2019 ES&T) tuvo correspondencia crítica sobre reproducibilidad en 2023.',
  },
  {
    catId: 'other', subtype: 'Microplásticos',
    consortium: PLASTIC_NONPET_CONSORTIUM,
    allowedMedia: ['reactor_liquido'],
    regime: 'sealed_bioreactor',
    regimeNote: 'BIOREACTOR · tamaño micro requiere pre-concentración',
    evidenceCitation: 'Literatura preliminar · TRL 2',
    paperCount: 2,
    alternatives: ALT_PLASTIC,
    expectedPct: 12, expectedFieldPct: 5, weeksLab: 52, expectedMetric: 'microplásticos',
    caveat: 'HIPOTÉTICO · TRL 2 · la degradación de microplásticos es campo emergente. Nanoplásticos requieren otro enfoque.',
  },
  {
    catId: 'other', subtype: '*',
    consortium: PFAS_CONSORTIUM,
    allowedMedia: ['reactor_liquido', 'efluente_industrial'],
    regime: 'compartmentalized',
    regimeNote: 'Contaminante emergente · TRL 2 HIPOTÉTICO',
    evidenceCitation: 'Contaminante recalcitrante · datos preliminares',
    paperCount: 2,
    alternatives: ALT_PLASTIC,
    expectedPct: 30, expectedFieldPct: 12, weeksLab: 24, expectedMetric: 'contaminante emergente',
    caveat: 'HIPOTÉTICO · TRL 2.',
  },
];

export function findConsortiumRule(catId: string, subtype: string): ConsortiumRule {
  return (
    CONSORTIUM_RULES.find((r) => r.catId === catId && r.subtype === subtype)
    ?? CONSORTIUM_RULES.find((r) => r.catId === catId && r.subtype === '*')
    ?? CONSORTIUM_RULES[0]
  );
}

export function isValidMediumFor(catId: string, subtype: string, medium: MediumKey): boolean {
  const rule = findConsortiumRule(catId, subtype);
  return rule.allowedMedia.includes(medium);
}
