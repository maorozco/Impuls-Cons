# `lib/` — rules engines, scoring, data ports

> **Filosofía:** los JSX no deben tener números hardcoded. Cada dominio tiene un módulo aquí que es la fuente de verdad. Cambiar un precio o un consorcio = cambiar **aquí**, no en la UI.

## Catálogo

| Archivo | Para qué | Consumidor |
|---|---|---|
| `consortia-rules.ts` | Mapeo contaminante+subtipo → consorcio + alternativas + medio válido | `/biocycle/disenador` |
| `cotiza-rules.ts` | Mapeo operación (refineria/textil/…) → pricing model + regulación | `/biocycle/portal` Cotiza |
| `biocycle-data.ts` | CONSORTIA_DATA ported desde Python | reutilizable (hoy solo docs) |
| `scoring.ts` | Avatar scoring post-waitlist (🟢🟡🔴) | server action waitlist |
| `countries.ts` | Lista países + normativa por default | Portal, landing |
| `db.ts` | Drizzle client + schema export | server actions + /api |
| `email.ts` | Resend client + templates | waitlist thank-you |
| `i18n.ts` | EN/ES translations para landing pública | `/[lang]` rutas |
| `utils.ts` | cn() (tailwind-merge) + misc | todo |

## `consortia-rules.ts` — cómo funciona

Estructura:
```ts
export interface ConsortiumRule {
  catId: string;     // match CATEGORIES[i].id en Diseñador
  subtype: string;   // match subtypes[j] o '*' como wildcard
  consortium: ConsortiumMember[];  // 4 especies con pct suma ~100
  allowedMedia: MediumKey[];       // solo medios compatibles
  evidenceCitation: string;        // short cite para la UI
  alternatives: AlternativeMethod[];  // cost comparison
  expectedPct: number;             // degradación mid-range (±15pp)
  expectedMetric: string;
}
```

**Reglas:**
1. **Solo BSL-1 / GRAS** en `consortium[].bsl`. Nunca BSL-2+ (P. aeruginosa, etc).
2. **Wildcards se resuelven de específico a genérico**: `findConsortiumRule('water_treatment', 'Lixiviados')` busca subtype exacto, luego `*`, luego catch-all.
3. **Alternatives deben ser plausibles para el medio**: no listar "excavación" cuando el contaminante es aguas. Usar los 6 arrays pre-definidos (`ALT_SOIL_HC`, `ALT_WATER_AZO`, `ALT_WATER_LIX`, `ALT_SOIL_PEST`, `ALT_MINING`, `ALT_PLASTIC`, `ALT_PHARMA`).
4. **`allowedMedia` restringe el selector de Medio** en el Diseñador. Si cambias el conjunto, el UI se auto-actualiza vía `useEffect`.

**Para añadir un contaminante:**
- Reutilizar un consorcio existente si el mecanismo es el mismo (ej: lindano usa GLIFOSATO_CONSORTIUM porque es co-metabolismo)
- Añadir nueva regla con `subtype` exacto ANTES del wildcard de la categoría

## `cotiza-rules.ts` — cómo funciona

Estructura:
```ts
export interface CotizaRule {
  opSlug: 'refineria' | 'textil' | 'agro' | 'relleno' | 'mineria' | 'consultora';
  opLabel, subtitle: string;
  allowedContaminants: [{key, label, consortiumKey}];  // select options
  baseline: {
    volumeUnit, volumeRange: [min, default, max],
    conventional: {method, costPerUnit, co2PerUnit},
    biocycle: {baseCost, slopePerUnit, co2PerUnit, weeksDuration},
    expected: {metric, range, ci, weeks, source},
    regulationByCountry: Partial<Record<CountryCode, string>>
  };
  supportsQuote: boolean;  // false solo para 'consultora' (muestra mailto:)
}
```

**computeQuote(input)** es una función pura. Llama cambia → UI se re-renderiza. No hace side-effects.

**Formula pricing:**
- `pilotCostTotal = (baseCost + slopePerUnit * volume) * urgencyMult[urgency]`
- `urgencyMult = {low: 0.95, med: 1, high: 1.18}`
- `savings = conventional - biocycle`, clamped ≥0
- `roi = savings / pilotCost * 100`, capped a 999

**Para añadir un país**: extender `CountryCode` union + añadir entry en cada `regulationByCountry`.

**Para añadir una operación nueva**: extender `OpSlug` union + añadir entry completa en `COTIZA_RULES`. El Portal lo pick-uppea automático.

## Reglas duras del folder

1. **Pure functions**: nada en `lib/` hace I/O excepto `db.ts` y `email.ts` (explícitos).
2. **No depender de Next.js**: `lib/` debe poder importarse desde scripts Node puros, agentes, o incluso Python (vía bindings).
3. **Type-safe**: todo export tiene `export type` o `export interface`. No `any`.
4. **Comentarios de fuente**: cada número hardcoded lleva referencia (ej: `// Ecopetrol 2024 benchmark` o `// ANLA Res. 631/2015`).
5. **Idempotencia**: funciones como `computeQuote` o `findConsortiumRule` devuelven los mismos outputs para los mismos inputs.

## Cuándo NO poner algo aquí

- Si es específico de **una ruta** → va en el archivo de esa ruta
- Si es un **componente React** → va en `components/`
- Si es una **query a DB** → preferir server action en `app/actions.ts` (usa `db.ts`)
- Si es un **cliente externo con secrets** → va en `lib/` pero solo server-side (ej: `email.ts` usa `RESEND_API_KEY`)
