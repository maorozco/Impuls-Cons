# Impulso BioCycle — Replit Deployment Guide

> **Audiencia:** el Replit Agent, o un humano siguiéndolo paso a paso.
> **Objetivo:** dejar la app corriendo en `https://biocycle-xxx.replit.app` con paridad total al entorno local, en < 15 minutos.

---

## ¿Qué desplegamos?

**Un solo Repl** que corre dos servicios:

1. **Next.js landing + app BioCycle** (puerto público · `3000` → externo `80`)
2. **FastAPI ml-api** (loopback `127.0.0.1:5001` · solo interno, no público)

Postgres se provisiona nativamente en Replit. El agents pipeline (Reddit scraper → classifier → synthesizer) va en un **Scheduled Deployment separado**.

**Decisión arquitectónica clave:** usamos Reserved VM (Shared Medium · $20/mo) en vez de Autoscale porque `rag.Retrieval` + `ml_model.get_predictor()` son singletons con cold-start de ~2s. En Autoscale con scale-to-zero cada primer request paga ese precio, lo cual rompe la demo del jurado. Reserved VM queda siempre caliente.

---

## Paso 1 — Importar el repo

1. Crear Repl → "Import from GitHub" → pegar URL del repo.
2. Replit detecta `.replit` (root) + `replit.nix` automáticamente.
3. Primera vez: ejecuta `pnpm install` + `pip install` (~1–2 min). Dejar terminar.

## Paso 2 — Provisionar Postgres

1. Panel izquierdo → pestaña **"Database"** → botón **"Create a PostgreSQL database"**.
2. Replit inyecta automáticamente estos secrets: `DATABASE_URL`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`, `PGPORT`.
3. Aplicar el schema:
   ```bash
   pnpm db:push
   ```
   (esto corre `drizzle-kit push` sobre la DB nueva y crea las 7 tablas).
4. Verificar:
   ```bash
   psql $DATABASE_URL -c "\dt"
   ```
   Deben aparecer: `waitlist`, `waitlist_responses`, `reddit_posts`, `reddit_classifications`, `pain_synthesis`, `competitor_mentions`, `agent_drafts`.

## Paso 3 — Pegar secrets

Abrir pestaña 🔒 **"Secrets"** y agregar los que lista `REPLIT-SECRETS.md`. Mínimo obligatorio:

- `ANTHROPIC_API_KEY`
- `RESEND_API_KEY` + `RESEND_FROM`
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CALENDLY_URL` + `CALENDLY_GREEN_LINK`

Recomendados: `OPENROUTER_API_KEY` (fallback LLM), `APIFY_API_KEY` (scraper premium).

## Paso 4 — Verificar en dev (antes del deploy)

Click el botón verde **"Run"** (workflow `dev`) arriba del Repl.

Replit lanza los dos procesos en paralelo:
- `ml-api` en `127.0.0.1:5001` (se ve en el split output)
- `Next.js` en `0.0.0.0:3000` (el webview se abre al detectar el puerto)

**Verificación rápida** en Shell:
```bash
curl -s http://127.0.0.1:5001/healthz | head -c 200
# → {"ok":true,"model":"gradient_boosting","corpus_size":61,"llm_provider":"anthropic",...}

curl -s http://localhost:3000/biocycle/inicio | grep -o "Construye tu"
# → Construye tu

curl -s http://localhost:3000/api/insights | head -c 100
# → {"mode":"live"|"mock", ...}
```

Si todo responde 200, estás listo para deploy.

## Paso 5 — Deploy a producción

1. Click **"Deploy"** (botón arriba del Repl).
2. Elegir **"Reserved VM"** → tier **"Shared Medium · $20/mo"**.
3. Replit lee del `.replit`:
   - Build: `bash scripts/replit-build.sh` (pnpm install + pip install + next build + drizzle push)
   - Run: `bash scripts/replit-start.sh` (lanza ml-api en bg + Next en fg)
4. Click **"Deploy"** → esperar ~3–5 min.
5. Al terminar, Replit da la URL: `https://biocycle-xxx.replit.app`.

## Paso 6 — Smoke test post-deploy

Desde la Shell del Repl o tu terminal local:

```bash
APP=https://biocycle-xxx.replit.app  # ← tu URL

# 1. Landing carga
curl -fsI "$APP/biocycle/inicio" | head -1
# → HTTP/2 200

# 2. Portal ruta con deep-link
curl -fsI "$APP/biocycle/portal?tab=escucha" | head -1

# 3. API insights (via proxy Next)
curl -s "$APP/api/insights" | head -c 150

# 4. Health check del ml-api vía proxy
curl -s "$APP/api/healthz"

# 5. Endpoint ML predict (vía proxy Next)
curl -s -X POST "$APP/api/ml/predict" \
  -H "Content-Type: application/json" \
  -d '{"contaminant":"hydrocarbons","temp_C":28,"pH":6.8,"mode":"in_situ","contamination_pct":12,"pretreatment":true,"time_weeks":12}'

# 6. RAG chat end-to-end
curl -s -X POST "$APP/api/rag/answer" \
  -H "Content-Type: application/json" \
  -d '{"query":"qué consorcio para TPH","locale":"es","top_k":4}' | head -c 400
```

Los 6 deben retornar `200` con JSON válido. Si `5` o `6` fallan con `ml_api_unreachable`, el proceso `ml-api` no se levantó — ver logs del deployment.

## Paso 7 — Custom domain (opcional)

1. Deployments tab → Settings → **Link a domain** → ingresar `biocycle.ai`.
2. Replit muestra un registro `A` + `TXT`.
3. Pegar en tu DNS (GoDaddy / Cloudflare / etc.).
4. Esperar 5–30 min. HTTPS se emite automáticamente (HTTP-01 challenge).
5. Actualizar `NEXT_PUBLIC_SITE_URL` en Secrets a `https://biocycle.ai` + redeploy.

**Nota:** si usas Cloudflare, DEJAR el toggle naranja **apagado** (DNS-only). El modo proxy rompe la renovación del cert.

## Paso 8 — Scheduled Deployment para el pipeline de agents

El pipeline de agents (Reddit scraper + classifier + synthesizer + feeder) corre en batch, no como HTTP service. Separarlo del Repl principal evita consumo de RAM continuo.

1. Panel izquierdo → **"Deployments"** → **"New deployment"**.
2. Tipo: **"Scheduled"**.
3. Schedule: `0 */6 * * *` (cada 6 horas).
4. Command:
   ```bash
   cd artifacts/agents && AGENT_FIXTURE_MODE=false pnpm run all
   ```
5. Los mismos Secrets se comparten automáticamente — no hace falta duplicar.
6. Costo: ~$1/mo base + compute por ejecución (10min × 4/día ≈ negligible).

Verificar a las 6h:
```bash
psql $DATABASE_URL -c "SELECT COUNT(*) FROM reddit_posts"
psql $DATABASE_URL -c "SELECT theme FROM pain_synthesis ORDER BY created_at DESC LIMIT 3"
```

---

## Troubleshooting

### "Build timeout > 5 min"
- Verificar que `pnpm-lock.yaml` está commiteado (`git status` en el Repl).
- El primer build tarda más porque compila `sharp` + `scikit-learn`. Re-builds usan cache.

### "db:push falla con DATABASE_URL not set"
- La DB Postgres no está provisionada. Volver a Paso 2.

### "ml-api devuelve 502"
- En el Deployment logs, buscar líneas de `scripts/replit-start.sh`.
- Verificar que `ANTHROPIC_API_KEY` está en Secrets (si no, todo el chat falla).
- Probar manual en Shell: `cd artifacts/ml-api && python main.py --host 127.0.0.1 --port 5001` — ver error si hay.

### "Chat responde '502 ml_api_unreachable'"
- El proceso `ml-api` murió. `scripts/replit-start.sh` lo relanza solo cuando haces redeploy. Click "Restart" en Deployments.

### "Next build falla con 'Module not found'"
- Ejecutar `pnpm install` manualmente en Shell y rebuild.

### "Cannot find module '@tailwindcss/typography'"
- Dependencia nueva no instalada. Borrar `node_modules/` y `pnpm install` de nuevo.

### "Port already in use"
- Otro workflow sigue corriendo. En Shell: `pkill -f "pnpm dev"; pkill -f "python main.py"`.

### "drizzle push: relation already exists"
- Normal si redeployas. Drizzle push es idempotente — ignorar.

---

## Checklist de deploy completo

- [ ] Repo importado desde GitHub
- [ ] Postgres DB creada (`pnpm db:push` corrido, 7 tablas listadas)
- [ ] 7 secrets obligatorios pegados
- [ ] `Run` button funciona local (ml-api + Next)
- [ ] Deploy Reserved VM iniciado
- [ ] 6 smoke curl tests pasan
- [ ] Custom domain configurado (si aplica)
- [ ] Scheduled deployment de agents configurado

---

## Arquitectura de referencia

```
    browser
       │ HTTPS
       ▼
  Replit Proxy :80
       │
       ▼
  ┌─ Next.js :3000 (server-side) ──────────┐
  │                                        │
  │  /api/rag/answer ──┐                   │
  │  /api/ml/predict ──┼── fetch ──────────┤
  │  /api/healthz ─────┘                   │
  │                                        │
  │  /biocycle/inicio, /portal, ...        │
  │  (SSR + static assets)                 │
  └─────────────────┬──────────────────────┘
                    │ loopback
                    ▼
           FastAPI ml-api :5001
           (NO expuesto public)
                    │
                    ▼
           rag.py + ml_model.py + data.py
                    │
                    ▼
      ┌─────────────┴─────────────┐
      ▼                           ▼
  Anthropic / OpenRouter     Postgres (Drizzle)
  (LLM fallback chain)       (waitlist, posts, themes)
```

**Agents pipeline (separate Scheduled Deployment):**

```
  cron 0 */6 * * *
       │
       ▼
  pnpm run all
  (scraper → classifier → synthesizer → competitive → feeder)
       │
       ▼
    Postgres (misma DB compartida)
```

---

## Contacto

- Issues de la app: abrir en GitHub.
- Config Replit ambigua: preguntar en el Replit Discord #community-help.
- Secrets perdidos: Replit NO guarda plaintext de secrets — rotar key en el proveedor y pegar nueva.
