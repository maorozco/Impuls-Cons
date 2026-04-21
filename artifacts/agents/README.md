# @workspace/agents — Multi-agent research pipeline

5 agentes que alimentan al portal cliente (panel **Escucha Activa**) + al landing (`/api/insights`) + al deck de pitch.

## Stack

- **Runtime**: Node 20+ vía `tsx` (no build step)
- **LLM**: Anthropic Claude direct (Haiku 4.5 para clasificación, Sonnet 4.7 para síntesis)
- **Scraping**: Apify `trudax/reddit-scraper` actor
- **DB**: Neon Postgres (shared con `artifacts/landing/`) vía Drizzle
- **Deploy**: Azure Container Apps Jobs (cron, scale-to-zero) — configurado en Semana 1.5

## Layout

```
agents/
├── shared/           ← DB client, Anthropic client, banned-phrase lint, types
├── fixtures/         ← sample Reddit posts para dev offline
├── scraper/          ← Apify → reddit_posts
├── classifier/       ← reddit_posts → reddit_classifications (Haiku)
├── synthesizer/      ← high-pain → pain_synthesis (Sonnet, semanal)
├── competitive/      ← reddit_posts → competitor_mentions
└── feeder/           ← pain_synthesis → agent_drafts (humanos aprueban)
```

## Dev local (sin credenciales)

Todos los agentes corren en **FIXTURE_MODE** cuando `AGENT_FIXTURE_MODE=true`:
- `scraper` lee `fixtures/reddit-posts.json` en vez de llamar Apify
- `classifier`/`synthesizer`/`feeder` usan un LLM stub si falta `ANTHROPIC_API_KEY`
- Todos los agentes usan mock-DB si falta `DATABASE_URL` (logs a stdout con [mock])

```bash
# Desde monorepo raíz
pnpm --filter @workspace/agents pipeline:dev
```

Esto corre los 5 agentes en secuencia con fixtures — termina en <30s sin llamar APIs externas.

## Producción

Cuando lleguen credentials, set `DATABASE_URL`, `ANTHROPIC_API_KEY`, `APIFY_API_KEY` y corre:

```bash
pnpm --filter @workspace/agents scraper:live
```

## Guardrails

- **Nunca auto-postea.** El Feeder escribe a `agent_drafts`; humanos revisan en `/admin/insights`.
- **Banned-phrase lint** integrado: cualquier output que incluya frases de `marketing/ADS-HOOKS.md §6`, `.research-synthesis.md §11` o `marketing/AI-ML-MOAT.md §5` se marca con `banned_phrase_hits` y se rechaza por default.
- **Sin prompt injection**: inputs Reddit se sanitizan antes de entrar al prompt (ver `shared/sanitize.ts`).
