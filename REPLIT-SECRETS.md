# Replit Secrets — Impulso BioCycle

> **Cómo:** en el workspace del Repl, clic en el ícono 🔒 "Secrets" (panel izquierdo). Pegar cada secret en orden. Los secrets están disponibles en build-time y runtime del deployment automáticamente.

---

## Secrets obligatorios

Estos son los que la app NECESITA para arrancar sin errores.

| Secret | Ejemplo / Cómo obtener | Dónde se usa |
|---|---|---|
| `DATABASE_URL` | **Auto-inyectado** al crear Postgres en la pestaña "Database" del Repl | Drizzle (landing + agents) |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-…` · [console.anthropic.com](https://console.anthropic.com) | ml-api RAG, agents classifier/synthesizer/feeder |
| `RESEND_API_KEY` | `re_…` · [resend.com/api-keys](https://resend.com/api-keys) | Waitlist thank-you emails |
| `RESEND_FROM` | `hola@biocycle.ai` (dominio verificado en Resend) | Sender email |
| `NEXT_PUBLIC_SITE_URL` | `https://biocycle-xxx.replit.app` o dominio custom | Canonical URLs, OG tags, emails |
| `NEXT_PUBLIC_CALENDLY_URL` | `https://calendly.com/impulso-biocycle/discovery` | Thank-you page CTA |
| `CALENDLY_GREEN_LINK` | `https://calendly.com/impulso-biocycle/tier-green` | Tier-verde post-waitlist CTA |

## Secrets recomendados (fallbacks y calidad)

| Secret | Ejemplo | Qué habilita |
|---|---|---|
| `OPENROUTER_API_KEY` | `sk-or-v1-…` · [openrouter.ai/keys](https://openrouter.ai/keys) | Fallback LLM si Anthropic falla |
| `APIFY_API_KEY` | `apify_api_…` | Scraper premium (sin esto cae a Reddit público, rate-limited) |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `biocycle.replit.app` | Analytics (opcional) |

## Secrets opcionales (tuning y control)

| Secret | Default | Qué hace |
|---|---|---|
| `ML_API_URL` | `http://127.0.0.1:5001` | Next → FastAPI proxy. Override solo si separas en dos Repls |
| `ALLOWED_ORIGINS` | `http://localhost:3000,http://127.0.0.1:3000` | CORS FastAPI (no crítico porque ml-api es loopback) |
| `MOCK_DB` | `false` | Dev only. En prod debe ser `false` |
| `LLM_PROVIDER` | `auto` | `anthropic` / `openrouter` / `ollama`. `auto` prueba cadena completa |
| `LLM_NO_FALLBACK` | `false` | `true` deshabilita la cadena de fallback (solo primer provider) |
| `INSIGHTS_CACHE_TTL_SECONDS` | `300` | Cache de `/api/insights` (5 min por default) |
| `LOG_LEVEL` | `info` | `debug` / `info` / `warn` / `error` |
| `REDDIT_PER_SUB_LIMIT` | `50` | Posts por subreddit en cada tick del scraper |
| `SCRAPER_BACKEND` | `auto` | `apify` / `reddit_public` / `auto` (detecta según API key disponible) |
| `SUBREDDITS_JSON` | `["EnvironmentalProfessionals","civilengineering","remediation"]` | Override de subreddits |
| `OLLAMA_URL` | — | Si corres Ollama local (no en Replit) |
| `OLLAMA_ENABLED` | `false` | Habilitar Ollama como último fallback |
| `ANTHROPIC_MODEL` | `claude-3-5-sonnet-20241022` | Modelo Anthropic (synthesizer, RAG) |
| `ANTHROPIC_CHAT_MODEL` | `claude-3-5-sonnet-20241022` | Modelo del chat RAG |
| `OPENROUTER_CHAT_MODEL` | `nvidia/nemotron-3-super-120b-a12b:free` | Modelo OpenRouter (probado `free` tier) |
| `OPENROUTER_CLASSIFIER_MODEL` | — | Modelo para clasificador de agents |

---

## Template — copy-pasta para Replit Secrets

Podés pegar este bloque completo una vez (borrando los que no te aplican). Replit acepta importar múltiples secrets vía JSON en la UI.

```json
{
  "ANTHROPIC_API_KEY": "sk-ant-…",
  "OPENROUTER_API_KEY": "sk-or-…",
  "APIFY_API_KEY": "apify_api_…",
  "RESEND_API_KEY": "re_…",
  "RESEND_FROM": "hola@biocycle.ai",
  "NEXT_PUBLIC_SITE_URL": "https://biocycle.replit.app",
  "NEXT_PUBLIC_CALENDLY_URL": "https://calendly.com/impulso-biocycle/discovery",
  "CALENDLY_GREEN_LINK": "https://calendly.com/impulso-biocycle/tier-green",
  "LLM_PROVIDER": "auto",
  "INSIGHTS_CACHE_TTL_SECONDS": "300"
}
```

---

## ¿Cómo verifico que los secrets están OK?

1. En el Repl, abrí la pestaña **Shell**.
2. Correr:
   ```bash
   echo "DB: ${DATABASE_URL:0:30}..."
   echo "Anthropic: ${ANTHROPIC_API_KEY:0:12}..."
   echo "Resend: ${RESEND_API_KEY:0:8}..."
   ```
3. Los tres deben mostrar un prefijo (nunca "empty"). `DATABASE_URL` debe empezar con `postgres://` o `postgresql://`.

---

## Notas de seguridad

- **Nunca commit `.env` con keys reales.** El repo ya ignora `.env.local`, pero verificar al rebase.
- Los `NEXT_PUBLIC_*` se inlinean en el bundle cliente al build — NO poner keys privadas ahí.
- Las keys privadas (`ANTHROPIC_API_KEY`, `RESEND_API_KEY`, etc.) solo se usan server-side (en `/api/*` routes, agents, ml-api).
- Rotar `ANTHROPIC_API_KEY` cada 90 días es buena práctica; el cambio en Secrets se propaga al próximo redeploy.
