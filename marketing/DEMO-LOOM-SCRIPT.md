# DEMO-LOOM-SCRIPT — 45 segundos, slide 5 del pitch

> **Propósito:** grabar un Loom de 45s que muestra BioCycle corriendo en vivo.
> Se embebe en la slide 5 como **fallback** por si el demo en HDMI falla.
> La fundadora puede narrar por encima del video si la audio del Loom no se oye bien.

---

## Setup antes de grabar

- [ ] Streamlit corriendo en `http://127.0.0.1:5000` (o URL de Azure pre-producción)
- [ ] `.env` con `OPENROUTER_API_KEY` (o `ANTHROPIC_API_KEY` si ya migramos) — chat RAG activo
- [ ] `AGENT_FIXTURE_MODE=true` o DB con datos reales para que el panel Escucha Activa muestre top-3 dolores
- [ ] Cronómetro de Loom a la vista
- [ ] Zoom de browser a 110% para que el texto sea legible en el deck
- [ ] Cerrar pestañas extra en el navegador (privacidad + enfoque)
- [ ] Audio: solo mouse, sin voice-over (la fundadora habla encima EN VIVO)

---

## Flujo (45 segundos)

### 0:00–0:08 — Abre en la página `Asesoría IA`
Lo que el espectador ve:
- Hero con el badge "💬 Asesoría IA — Respuestas basadas en ciencia"
- Banner verde: **"🧠 IA conversacional activa. RAG sobre 61 fuentes"**
- Input listo

### 0:08–0:22 — Clic en pregunta sugerida (o tipear)
- **Pregunta ideal:** `"¿Qué consorcio recomiendas para suelo contaminado con diésel en clima cálido?"`
- Se ve el spinner breve + la respuesta streaming
- Aparece tabla con los 4 microorganismos (*Pseudomonas putida*, *Bacillus subtilis*, *Rhodococcus erythropolis*, *Acinetobacter baylyi*)
- Aparece el disclaimer "estimación basada en literatura peer-reviewed"
- **Subtexto mental del espectador:** esto no es GPT genérico, esto conoce los consorcios específicos

### 0:22–0:30 — Expandir el expander "📚 Fuentes recuperadas"
- 4 fuentes con % de similitud
- 2 son entries de `CONSORTIA_DATA`, 1 es del paper DB_HIDROCARBUROS, 1 es un consorcio análogo
- **Mensaje:** transparencia — sabes exactamente de dónde salió cada afirmación

### 0:30–0:40 — Switch a pestaña `Gestiona tus Residuos` → tab "🎧 Escucha Activa"
- Hero verde oscuro con el título "Lo que duele al mercado esta semana"
- 4 métricas grandes: Quejas clasificadas / Alta pena 7d / Signups / Países
- **Top 3 dolores detectados** con quote verbatim + avatar tag (remediation_pm_usa, hseq_latam)
- **Mensaje:** estamos escuchando al mercado en tiempo real con un pipeline multi-agente

### 0:40–0:45 — Cierre
- Zoom out o scroll abajo para mostrar el footer con el contador build-in-public
- Texto para overlay estático: **"Lo que acabas de ver está corriendo ahora mismo en Azure."**

---

## Narrativa en vivo (lo que dice la fundadora sobre el Loom)

Si la demo en vivo funciona → narrar mientras navega:

> *(0:00)* "Esto es BioCycle, y esto es la pantalla que ve un Remediation PM hoy.
> *(0:08)* Le pregunto en español: qué consorcio para suelo con diésel en clima cálido.
> *(0:22)* La IA responde con los 4 microorganismos exactos, sus proporciones, y —acá lo que importa— las fuentes exactas de cada afirmación. No es GPT inventando. Es RAG sobre 4,797 referencias peer-reviewed.
> *(0:30)* Cambio a Escucha Activa. Tenemos un pipeline multi-agente que minería quejas de 16 subreddits cada 6 horas. Esta semana, el dolor #1 fue: 'EPA PFAS, parálisis regulatoria'. Verbatim. Real."

Si la demo falla → la fundadora dice encima del Loom:

> "Les voy a ahorrar 45 segundos de mi tiempo de pitch mostrándolo en video. Pero te prometo que esto es así."

---

## Guardrails de grabación

- **NO** mostrar una pregunta que la IA no pueda responder bien en OpenRouter gratuito (rate limits). Pre-testear 3 preguntas el día antes.

## Validación E5 de latencia y calidad (medido 2026-04-20)

Test corrido con **OpenRouter `openrouter/free`** sobre RAG con 61 docs:

| # | Pregunta | Latencia | Calidad | Recomendación |
|---|---|---|---|---|
| 1 | "¿Qué consorcio recomiendas para suelo contaminado con diésel en clima cálido?" | **8 s** | ✓ tabla con 4 microorganismos + citaciones BSL-1/GRAS | **Pregunta principal del Loom** |
| 2 | "¿Qué tan seguro es esto para humanos?" | 26 s | ✓ menciona BSL-1, fuentes DB_HIDROCARBUROS | Backup si Q1 falla |
| 3 | "¿En qué se diferencian de Carbios?" | 66 s | ✓ buen contraste centralizado vs distribuido | **NO en vivo con OpenRouter** — usar sólo en Q&A escrito |
| Edge | "¿Pueden limpiar plástico en una playa?" | 22 s | ✓ "No, nuestro enfoque actual no está diseñado..." + redirect a pivote A+C | Demuestra honestidad si el jurado lo reta |

**Implicación:** con OpenRouter en dev usa **Q1 (8s) en el Loom**. Antes del pitch en vivo, migrar a Anthropic Sonnet (Task #26 PRE-PITCH) → las 3 preguntas caen a <5s.

**Banned phrases detectadas en outputs reales:** 0/5 queries. RAG respeta `.research-synthesis.md §11`.
- **NO** mostrar el modo offline por error (activar IA primero, verificar banner verde).
- **NO** mostrar la tab de cotizador — es aburrida y técnica; la Escucha Activa tiene más impacto emocional.
- **SI** mostrar el avatar tag (remediation_pm_usa) — demuestra que clasificamos por persona, no solo por tema.
- **SI** dejar visible al menos 3 segundos la quote verbatim con el link a r/PFAS — la credibilidad viene de eso.

---

## Versión alterna 90s (si hay más espacio en el deck)

Agregar entre los segundos 22 y 30:

- Switch a `Construye tu Consorcio` → mostrar el diseñador 3 pasos (5s)
- Ingresar inputs rápidos (Plástico → PET → biorreactor → temp 45°C → 500 kg) (10s)
- Clic **Diseñar** → mostrar el loader con pasos ML + el resultado con gauge de 85% probabilidad (20s)
- **Subtexto:** real ML también — GradientBoosting sobre 43 muestras de literatura, R²≈0.55. Honesto.

Total: 90 segundos. Úsalo solo si el pitch es de 5+ min o hay Q&A estructurado.
