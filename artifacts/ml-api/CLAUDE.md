# `ml-api/` — FastAPI backend (ML + RAG)

> **Qué es:** el servicio Python que sirve (1) el modelo ML de probabilidad de degradación y (2) el RAG sobre 61 documentos. Consumido por la landing Next.js vía HTTP.

## Stack

- **FastAPI** + uvicorn
- **Puerto default**: 5001 (no 5000, porque Streamlit usa ese)
- **Dependencias críticas**: scikit-learn (Gradient Boosting), pandas, numpy, anthropic, openai (para OpenRouter), sentence-transformers
- **Módulos importados desde la app Streamlit**: `ml_model.py`, `rag.py`, `data.py`, `insights_client.py`, `scraper/*` (via sys.path hack)

## Endpoints

| Endpoint | Método | Body/Query | Respuesta |
|---|---|---|---|
| `/healthz` | GET | — | `{ok, model, corpus_size, llm_provider, unique_microorganisms, total_contaminants, aggregate_publications}` |
| `/api/ml/predict` | POST | `{contaminant, temp_C, pH, mode, contamination_pct, pretreatment, time_weeks}` | `{degradation_pct, confidence, n_training_samples}` |
| `/api/rag/answer` | POST | `{query, locale, top_k, history?}` | `{text, sources[], provider, guardrail_triggered}` |

## Cómo corre

```bash
# Desde ml-api/
uvicorn main:app --host 127.0.0.1 --port 5001 --reload

# O via scripts/dev.sh (lanza todo: Next + ml-api + postgres)
./scripts/dev.sh
```

## Cadena de fallback del LLM

**Orden**: Anthropic → OpenRouter → Ollama → fallback estático.

1. Si `ANTHROPIC_API_KEY` está set → usa Claude 3.5 Sonnet/Haiku directo.
2. Si falla (429/timeout) → OpenRouter con `nvidia/nemotron-3-super-120b-a12b:free` (free tier funciona, deepseek free dio 404).
3. Si falla OpenRouter → Ollama local (`http://127.0.0.1:11434/api/chat`, modelo `llama3.2:3b` o similar).
4. Si todo falla → respuesta canned desde `rag.py` (`legacy_fallback`).

**Nota**: Ollama 0.21.0 tiene bug de bfloat/half en macOS Sequoia — si estás ahí, crashea al inferir. La cadena lo maneja y salta al siguiente provider.

## RAG — cómo funciona

Archivo: `artifacts/impulso-biocycle/rag.py`.

**Corpus**: 61 docs en total:
- 10 papers peer-reviewed (DISCOVERIES)
- 33 consorcios validados (CONSORTIA_DATA)
- 18 bases de conocimiento internas (research_docs)

**Retrieval**: TF-IDF sobre full-text, top-k (default 4).
- `Retrieval` class en `rag.py` cachea la matriz
- Retrieval siempre sobre la query sola, NO sobre la query + historia (historia infla el embedding y degrada precisión — patrón estándar LangChain/LlamaIndex)

**Generación**: query + historia + chunks RAG → prompt → LLM.
- Historia se concatena como mensajes previos de user/assistant en el prompt
- Guardrails post-gen: banned-phrase linter (ver `BANNED_TOPICS` en `rag.py`)

**Excerpts**: `extract_excerpt(doc_body, query, max_chars=420)` encuentra la ventana de 2 oraciones con más overlap contra los tokens de la query. Devuelve también `excerpt_highlights` (tokens para resaltar con `<mark>` en el frontend).

## ML model — cómo funciona

Archivo: `artifacts/impulso-biocycle/ml_model.py`.

- **Gradient Boosting Regressor** de scikit-learn
- **43 muestras de training** (synthetic, derivadas de CONSORTIA_DATA + parámetros de literatura)
- **Singleton**: `get_predictor()` entrena al primer llamado (~50ms). No re-instanciar.
- **Features**: contaminant (one-hot), temp_C, pH, mode (in_situ/bioreactor), contamination_pct, pretreatment (bool), time_weeks
- **Output**: degradation_pct (0-100), confidence label (`robust` / `moderate` / `limited`), n_training_samples

## Reglas duras

1. **Nunca exponer las API keys en responses** — guardadas en env, usadas solo en serverside.
2. **Rate limit es en cliente**, no aquí — el frontend usa `AbortSignal.timeout(120000)` para el chat.
3. **Corpus es read-only** — no mutate desde endpoints; los agentes son los que llenan Postgres.
4. **Siempre responder en <8s para Nyquist** — si hit el LLM tarda más, cae al siguiente provider.
5. **BANNED_TOPICS bloquea pivote A+C** — query sobre plástico+playa dispara guardrail y response canned.

## Trampas

- **Imports relativos**: `main.py` añade `sys.path.insert(0, ...)` para pillar `ml_model`, `rag`, etc desde `../impulso-biocycle/`. No mover archivos sin actualizar.
- **Hot reload de uvicorn** puede romperse si editas `rag.py` porque el singleton queda desincronizado. Reinicia en ese caso.
- **CORS**: ya está abierto para `http://127.0.0.1:3000`. Si cambias el puerto del Next, actualizar.
- **Historia larga (>12 mensajes)** degrada latencia. El frontend ya trunca a 12.
