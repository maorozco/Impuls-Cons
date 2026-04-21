# `agents/` — pipeline de Claude agents

> **Qué es:** pipeline de agentes Claude que alimenta el Portal B2B (tab Escucha Activa) con data real de Reddit + LinkedIn. Escrito en TypeScript, corre local o en cron.

## Pipeline

```
scraper      → classifier     → synthesizer     → feeder
(Reddit+LI)    (Haiku filter)   (Sonnet themes)   (intel update)

reddit_posts → reddit_classifications → pain_synthesis → agent_drafts
                                                         + competitor_mentions
```

Cada etapa lee/escribe a Postgres (tablas Drizzle en `artifacts/landing/drizzle/schema.ts`).

## Agentes

### `scraper/` — Reddit + LinkedIn fetcher

- **Reddit**: intenta Apify actor `trudax/reddit-scraper`; si 403 (actor no rented) cae a Reddit public JSON API (`https://www.reddit.com/r/{sub}/new.json`) con rate limit 1 req/s.
- **LinkedIn**: placeholder — usa fixtures en `fixtures/linkedin_posts.json` hasta que tengamos cuenta de Apify LinkedIn.
- **Subreddits target**: `r/EnvironmentalProfessionals`, `r/civilengineering`, `r/environmental_science`, `r/remediation`, `r/minería`.
- **Output**: rows en `reddit_posts` con `title, body, author, score, url, subreddit, created_at`.

### `classifier/` — Haiku filter

- Lee `reddit_posts WHERE classified_at IS NULL` en batches de 50
- Prompt: "clasifica este post por avatar (hseq_latam / remediation_pm_usa / compliance_eu / founder_biotech / other) + severity (low/med/high) + language".
- Modelo: `claude-3-5-haiku-20241022` (barato, rápido)
- Output: rows en `reddit_classifications` (FK → reddit_posts)

### `synthesizer/` — Sonnet thematic synthesis

- Lee posts clasificados con `severity >= med` de los últimos 7 días
- Prompt largo: "agrupa en 3-5 themes, extrae la mejor quote verbatim de cada uno, devuelve JSON estructurado".
- Modelo: `claude-3-5-sonnet-20241022`
- Output: row en `pain_synthesis` con `themes: TopPain[]` (JSON con `theme, avatar_match, quote_count, top_quotes: [{quote, subreddit, url}]`)
- **Campo clave**: `themes[].top_quotes` es snake_case (`top_quotes`, no `topQuotes`) — el endpoint `/api/insights` en Next tiene defensive destructure.

### `competitive/` — intel agent

- Busca menciones de competidores (Carbios, Veolia, AECOM, Bioteknica) en los posts scrapeados
- Calcula sentiment agregado (−1 a +1) con prompt tipo "¿este post habla positivo/negativo del competidor?"
- Output: `competitor_mentions` rows

### `feeder/` — pitch feeder

- Lee `pain_synthesis` + `competitor_mentions` recientes
- Genera **drafts de pitch** (tweet, email subject, Reddit reply) con `claude-3-5-sonnet`
- Output: `agent_drafts` — el admin los aprueba vía `/admin/insights`
- **Trampa**: OpenRouter free tier dio 404 con `deepseek/deepseek-chat:free` — usar `nvidia/nemotron-3-super-120b-a12b:free` como alternativa.

## Cómo correr

```bash
# Todos los agentes, pipeline completo (debe haber Postgres local corriendo)
cd artifacts/agents
pnpm run all

# Solo uno
pnpm run scraper    # refresca posts
pnpm run classifier # procesa pendientes
pnpm run synthesizer
pnpm run competitive
pnpm run feeder
```

**Env requeridas** (ver `.env.example` root):
- `ANTHROPIC_API_KEY` (mandatory)
- `OPENROUTER_API_KEY` (fallback)
- `DATABASE_URL`
- `APIFY_TOKEN` (opcional — si no, cae a Reddit público)

## Reglas duras

1. **Rate limits**:
   - Reddit público: max 1 req/s
   - Anthropic: batch de 50 classifier, 1 synthesizer call por día
   - Apify: actor debe estar rented (chequear `/v2/users/me/usage`)
2. **Idempotencia**: scraper guarda con `ON CONFLICT (url) DO NOTHING` — correr 2x seguidas no duplica.
3. **PII**: no loggear usernames/quotes en stdout en prod (solo IDs). En dev sí, para debuggear.
4. **Modelo lock**: siempre Haiku para classifier (volumen alto), Sonnet para synthesizer (calidad).
5. **Guardrail temático**: el feeder NUNCA debe generar drafts que prometan "limpiar plástico en playa" — hay banned-phrase linter en `shared/guardrails.ts`.

## Fixtures / offline mode

`fixtures/` tiene:
- `reddit_posts_sample.json` — 50 posts realistas para dev sin API
- `linkedin_posts.json` — placeholder estático
- `competitor_sample.json` — menciones seed

`pnpm run scraper -- --offline` usa fixtures en vez de Apify/Reddit.

## Trampas

- **Drizzle-kit no carga `.env.local`**: el `drizzle.config.ts` tiene dotenv explícito.
- **Node 25** (actual) da warnings sobre `--experimental-detect-module`. Inofensivo, ignorar.
- **sharp no hace falta aquí** pero está en `node_modules` por hoisting de pnpm. Si hay error de build, `pnpm approve-builds`.
- **Ollama crash en macOS Sequoia 26** (bfloat/half bug en 0.21.0): no usar para classifier/synthesizer, la chain OpenRouter arriba ya lo evade.

## Datos en el DB actual (Apr 20)

- `reddit_posts`: ~600 rows (real, live)
- `reddit_classifications`: ~600 rows
- `pain_synthesis`: 2 syntheses con 5 themes cada una
- `agent_drafts`: ~5 drafts pendientes de aprobación
- `competitor_mentions`: ~2,394 menciones últimos 7 días
