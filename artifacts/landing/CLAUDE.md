# Landing Next.js — guía operativa

> **Qué es:** Producto comercial + aplicación BioCycle B2B/B2C. Next.js 14 App Router, TypeScript, Tailwind, Drizzle ORM sobre Postgres. Es la app que el jurado y los prospectos van a usar en vivo.
>
> **Lo que vendemos a través de esta app:** un piloto de 90 días (diseño de consorcio + despliegue con lab aliado + reporte regulatorio). NO vendemos bacterias a granel, NI un SaaS "self-serve listo".

## Arquitectura

```
artifacts/landing/
├── app/
│   ├── [lang]/             ← landing pública (waitlist, hero, founder, thank-you)
│   ├── biocycle/           ← aplicación BioCycle (5 rutas · B2B + B2C)
│   ├── admin/              ← dashboard admin (auth bypass en localhost)
│   ├── api/                ← route handlers: insights, waitlist, contact
│   └── actions.ts          ← server actions (waitlist submit)
├── components/
│   ├── biocycle/           ← asesoria-chat, onboarding, sidebar, topbar…
│   ├── sections/           ← landing sections (hero, dream, founder, problem)
│   └── ui/                 ← primitives (button, input, reveal)
├── lib/
│   ├── consortia-rules.ts  ← mapeo contaminante → consorcio (Diseñador)
│   ├── cotiza-rules.ts     ← operación → costos + regulación (Portal)
│   ├── biocycle-data.ts    ← CONSORTIA_DATA port desde Python
│   ├── db.ts               ← Drizzle client
│   ├── scoring.ts          ← avatar scoring post-waitlist
│   └── email.ts            ← Resend client
├── drizzle/                ← schema + migraciones (7 tablas)
├── tests/                  ← Playwright (biocycle.spec.ts · 45 tests)
└── middleware.ts           ← redirects + admin-bypass local
```

## Stack y decisiones duras

- **Next.js 14 App Router** (no pages/). Rutas con literal segments (`/biocycle/*`), no (grupos).
- **React 18**, TypeScript strict, `'use client'` explícito donde hay hooks.
- **Tailwind** + CSS modules co-locados (`asesoria.css`, `portal.css`, `disenador.css`). El Tailwind config tiene `@tailwindcss/typography` habilitado para `prose` en el chat.
- **Drizzle ORM** + Postgres local (homebrew) con fallback a Neon. Schema en `drizzle/schema.ts`.
- **Playwright 1.59+** para visual regression y E2E. `pnpm test:biocycle` corre los 45 tests.
- **No usamos shadcn generado**: usamos primitives de Radix (`@radix-ui/react-*`) + CSS propio.
- **Markdown en el chat**: `react-markdown@9 + remark-gfm + rehype-sanitize + rehype-highlight` con tema github.css + overrides. Clase base `.biocycle-prose`.

## Cómo correr

```bash
pnpm dev              # Next en 3000
pnpm typecheck        # tsc --noEmit
pnpm test:biocycle    # 45 tests Playwright
pnpm build            # producción
pnpm db:push          # aplica schema a Postgres
```

**Dependencias críticas** (no remover sin discutir): `react-markdown`, `@tailwindcss/typography`, `rehype-highlight`, `highlight.js`, `drizzle-orm`, `sharp` (para WebP conversion).

## Reglas duras (rompe esto y rompes el pitch)

1. **Nunca prometer resultados sin disclaimer** — todo número ficticio o estimativo lleva badge `ESTIMACIÓN ±X%` o `HIPOTÉTICO`. Reglas concretas:
   - `.tag-real` (verde) = dato de CONSORTIA_DATA / paper peer-reviewed
   - `.tag-hypo` (ámbar) = estimación referencial
   - Caso ilustrativo del Portal: banner ámbar grande + watermark + hover-tooltips
2. **BSL-1 / GRAS únicamente** en todas las listas de microorganismos. Nunca *P. aeruginosa*.
3. **Pivote A+C vigente**: plástico solo en biorreactor contenido; hidrocarburos in-situ con cápsulas alginato. En el Diseñador, la combinación `plastics + in-situ` está bloqueada con alert.
4. **Anclaje a evidencia**: consortia-rules.ts + cotiza-rules.ts son la fuente de verdad. NO hardcodear números en JSX.
5. **`?tab=escucha` / `?tour=1` se respetan**: deep links son parte del flujo (hero "NUEVO" → escucha, onboarding re-trigger, etc).

## Rutas principales

| Ruta | Audiencia | Qué hace |
|---|---|---|
| `/` (o `/[lang]`) | Público | Landing + waitlist (EN/ES) |
| `/biocycle/inicio` | Prospects | Hero + problem + value + metrics |
| `/biocycle/descubrimientos` | Técnicos | Feed de 10 papers peer-reviewed |
| `/biocycle/disenador` | B2C (labs) | Wizard 3 pasos → consorcio + curva + alternativas |
| `/biocycle/asesoria` | Ambos | Chat RAG sobre 61 docs + markdown pro |
| `/biocycle/portal` | B2B (HSEQ) | Cotiza + Escucha Activa + Caso ilustrativo |
| `/admin/insights` | Staff | Dashboard reddit posts + pain synthesis |

## Cómo conectamos con ml-api

El chat RAG y el Diseñador hablan a `http://127.0.0.1:5001` (env `NEXT_PUBLIC_ML_API_URL`):
- `POST /api/rag/answer` — chat (body: `{query, locale, top_k, history}`)
- `POST /api/ml/predict` — probabilidad degradación (body: `{contaminant, temp_C, pH, mode, ...}`)
- `GET /healthz` — provider + corpus size

**El Diseñador tiene fallback deterministico** si ml-api está abajo: `consortia-rules.ts` contiene `expectedPct` por contaminante y una penalización por pH/temp/contaminación mixta. Entonces nunca se rompe el flujo visual.

## Tests críticos a no romper

- `tests/biocycle.spec.ts` — 45 tests. Visual regression en 5 rutas a 1440×900.
- Al introducir cambios visuales grandes, re-genera baselines: `pnpm test:biocycle --update-snapshots`.
- Si agregas una nueva ruta, añade smoke test en `tests/biocycle.spec.ts` (patrón: navegar + esperar title + screenshot).

## Variables de entorno

Ver `.env.example`. Las clave para dev local:
- `DATABASE_URL` — Postgres local (`postgres://justindiaz@127.0.0.1:5432/biocycle`)
- `NEXT_PUBLIC_ML_API_URL=http://127.0.0.1:5001`
- `ANTHROPIC_API_KEY` / `OPENROUTER_API_KEY` / `RESEND_API_KEY`

## Trampas conocidas

- **Drizzle-kit no carga `.env.local`** por default — `drizzle.config.ts` tiene `dotenv` explícito.
- **Apify scraper requiere renting** del actor (403). Hay fallback a Reddit public JSON API en `artifacts/agents/scraper/main.ts`.
- **Sharp crash** al instalar: `pnpm approve-builds` y aprobar `sharp`.
- **Visual regression flaky en Playwright** con Streamlit embebido — los baselines de `disenador` y `portal` solo capturan el top de la página (no los results, que dependen de state).
- **Onboarding backdrop intercepta clicks** — en tests, usar keyboard (Escape/Enter) o pre-seed `localStorage.biocycle_onboarded_v1=1` en `storageState`.
