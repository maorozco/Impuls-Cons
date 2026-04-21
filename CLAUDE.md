# Impulso BioCycle — guía operativa para Claude

> **Qué es:** Plataforma de IA que diseña *consorcios microbianos* (recetas de bacterias + hongos) para biorremediación. App en Streamlit, Python 3.11+. Construida para Red Bull Basement Colombia 2026.
>
> **El "elevator pitch" honesto** (no el de marketing): "El Waze de la biorremediación. No fabricamos enzimas ni cápsulas ni rellenos sanitarios — diseñamos la receta óptima para que un cliente las combine y degrade un contaminante específico en un sitio específico." Más detalle en `.research-synthesis.md`.

---

## Cómo está organizado este repo

Es un **monorepo híbrido** (pnpm + Python). Hoy hay **dos apps vivas y demoables**: la app Streamlit (MVP técnico) y la landing Next.js (producto comercial + Portal B2B + Diseñador B2C + Asesoría RAG).

```
.
├── artifacts/
│   ├── impulso-biocycle/   ← Streamlit MVP — ver CLAUDE.md adentro
│   ├── landing/            ← Next.js (producto real) — ver CLAUDE.md adentro
│   │   ├── app/biocycle/   ← 5 rutas del producto BioCycle (ver CLAUDE.md)
│   │   ├── components/biocycle/ ← componentes BioCycle (ver CLAUDE.md)
│   │   └── lib/            ← rules engines + scoring (ver CLAUDE.md)
│   ├── ml-api/             ← FastAPI ML + RAG backend — ver CLAUDE.md adentro
│   ├── agents/             ← Claude agents (scraper, classifier, etc) — ver CLAUDE.md adentro
│   ├── api-server/         ← Express 5 + Drizzle (skeleton · no demoable)
│   └── mockup-sandbox/     ← React mockups antiguos (deprecated)
├── lib/                    ← schemas zod, drizzle db, hooks generados (TS)
├── scripts/                ← dev.sh (one-command), smoke.sh (healthcheck)
├── marketing/              ← launch-plan, avatares, ad hooks, AI/ML moat
├── .planning/              ← workspace GSD si se inicializa
├── .research-synthesis.md  ← investigación de mercado + pivote A+C
├── .qa-screenshots/        ← capturas Playwright de todas las rondas QA
├── pyproject.toml          ← dependencias Python (uv)
├── pnpm-workspace.yaml     ← packages TS
└── README.md               ← onboarding 5-min para colaboradores
```

**Cada dominio tiene su CLAUDE.md con reglas propias.** Lee el que corresponda al código que vas a tocar:
- `artifacts/impulso-biocycle/CLAUDE.md` — Streamlit (views/ no pages/, BSL-1 only)
- `artifacts/landing/CLAUDE.md` — Next.js App Router (rutas biocycle, quote rules, RAG chat)
- `artifacts/landing/app/biocycle/CLAUDE.md` — las 5 rutas del producto
- `artifacts/landing/components/biocycle/CLAUDE.md` — componentes compartidos
- `artifacts/landing/lib/CLAUDE.md` — rules engines (cotiza-rules, consortia-rules)
- `artifacts/ml-api/CLAUDE.md` — FastAPI (ML Gradient Boosting + RAG TF-IDF)
- `artifacts/agents/CLAUDE.md` — pipeline Reddit scraper → classifier → synthesizer → feeder

## Cómo correr todo local (one-command)

```bash
# scripts/dev.sh inicia Next (3000) + ml-api (5001) + postgres local si es necesario.
./scripts/dev.sh

# Streamlit solo (si quieres el MVP técnico aparte):
cd artifacts/impulso-biocycle
../../.venv/bin/streamlit run app.py --server.port 5000 --server.address 127.0.0.1 --server.headless true
```

Healthcheck rápido: `./scripts/smoke.sh` — verifica que las 5 rutas responden 200 + ML API + insights.

---

## Cómo correr la app local

```bash
# Crear venv (Python 3.11+, probado con 3.14)
/opt/homebrew/bin/python3.14 -m venv .venv
.venv/bin/pip install streamlit plotly pandas scikit-learn

# Lanzar (puerto 5000 por convención del .replit)
cd artifacts/impulso-biocycle
../../.venv/bin/streamlit run app.py --server.port 5000 --server.address 127.0.0.1 --server.headless true

# Abrir
open http://127.0.0.1:5000
```

**Si pyenv da error de bibliotecas faltantes** (Library not loaded `/Users/justinjimenez/...`), es porque la versión de pyenv apunta a un usuario inexistente. Usa el Python de Homebrew (`/opt/homebrew/bin/python3.14`).

**No uses `pip install -e .`**: el `pyproject.toml` declara `name = "repl-nix-workspace"` y no es la app — la app vive en `artifacts/impulso-biocycle` sin su propio pyproject.

---

## Estado real del producto (lee esto antes de cambiar UI o copy)

La investigación más reciente (`.research-synthesis.md`, Sección 3) documenta un **pivote interno del 16-abr-2026** que **la UI actual no refleja completamente**. Cosas que el equipo internamente ya descartó pero la app insinúa:

- ❌ "Cápsulas que degradan plástico en una playa" — geometría + UV + salinidad lo desmontan en Q&A técnico.
- ❌ "El plástico desaparece" — produce monómeros líquidos (TPA + EG); siempre hay que mencionar recuperación.
- ❌ "Semanas en campo abierto" — sólo en lab a 50°C+ con PET amorfo.

**Lo que sí podemos prometer** (recomendación pivote A+C):

1. Plástico → biorreactor enzimático contenido. Output = monómeros vendibles a $800–1,600 USD/ton.
2. Cápsulas → suelos con hidrocarburos / pesticidas (décadas de evidencia in-situ).
3. La **plataforma de IA** es el producto core; el plástico es el flagship emocional, los hidrocarburos son el primer ingreso real.

**TRL del sistema integrado: 3–4.** Cada componente (FAST-PETase, alginato-CaCl₂, AlphaFold) es 7–9, pero la integración no está demostrada a escala.

→ Lista completa de "no prometer" en `.research-synthesis.md` Sección 11.

---

## Reglas duras (rompe esto y rompes el producto)

Hay dos tipos: **reglas técnicas** (rompen la app) y **reglas científico-narrativas** (rompen el pitch).

### Técnicas

1. **La carpeta de vistas se llama `views/`, NO `pages/`.** Streamlit auto-detecta `pages/` y crea navegación nativa que rompe el sidebar manual.
2. **Solo microorganismos BSL-1 o GRAS** en datos (`data.py`, `views/asesoria_ia.py`). Nunca *Pseudomonas aeruginosa* ni nada BSL-2+.
3. **CSS global vive en `app.py`** — clases `.hero-section`, `.discovery-card`, `.result-section`. Si una vista necesita CSS adicional, lo declara local al inicio de su `render()`.
4. **Estáticos se sirven en `/app/static/`**, no rutas relativas. Carpeta física: `artifacts/impulso-biocycle/static/`.
5. **Navegación programática usa `st.session_state["nav_page"]`** + `st.rerun()` (ver `app.py:226-229`).
6. **`ml_model.get_predictor()` es singleton** — entrena al primer llamado (~50 ms con 43 muestras). No re-instanciar.

### Científico-narrativas (anclan al pivote, ver `.research-synthesis.md` §11)

7. **Nunca prometer "limpiar contaminación existente con cápsulas en campo".** Vender al cliente que quiere valorizar residuos en biorreactor contenido o biorremediar suelos con HC/pesticidas.
8. **Nunca afirmar SaaS "listo".** El primer cliente real es un piloto 90 días con un lab universitario.
9. **Nunca competir con Carbios en el mismo plano.** Son categorías distintas: Carbios = planta industrial centralizada €230M; BioCycle = inteligencia distribuida.
10. **Nunca mostrar resultados sin disclaimer** "estimación basada en literatura científica revisada por pares; los resultados reales pueden variar según condiciones del sitio".

---

## Atajos útiles para Claude

| Lo que necesitas | Dónde está |
|---|---|
| Visión / pitch / pivote más reciente | `.research-synthesis.md` |
| Convenciones de la app Streamlit | `artifacts/impulso-biocycle/CLAUDE.md` |
| Modelo ML (Gradient Boosting, 43 muestras) | `artifacts/impulso-biocycle/ml_model.py` |
| Datos hardcoded (consortia, descubrimientos, costos) | `artifacts/impulso-biocycle/data.py` |
| Capturas QA de las 5 páginas | `.qa-screenshots/` |
| Investigación cruda (30 docs internos) | `~/Downloads/Proyectos_investigacion/` |
| Investigación externa (OSS/avatar/regs/AI stack) | `.research-external.md` |
| Roadmap 10x (ideas concretas) | `ROADMAP-10X.md` |
| **🚀 Launch plan 7 días build-in-public (T-7 → T-0)** | `marketing/LAUNCH-PLAN-7DAYS.md` |
| **🚀 Landing page spec + copy bilingüe** | `marketing/LANDING-PAGE-SPEC.md` |
| **🚀 Waitlist form (thank-you page, 6 preguntas)** | `marketing/WAITLIST-FORM.md` |
| **🚀 Video script Hero (75s ES+EN + variantes)** | `marketing/VIDEO-SCRIPT.md` |
| **🚀 Landing app Next.js (production-ready, Replit-bound)** | `artifacts/landing/` |
| **🚀 Landing README + deployment guide** | `artifacts/landing/README.md` |
| **Marketing: ICP global con 4 segmentos regionales** | `marketing/AVATAR-IDEAL.md` |
| **Marketing: 20 hooks bilingües EN+ES + formatos** | `marketing/ADS-HOOKS.md` |
| **Marketing: script de Mom Test (tier 2, post-waitlist)** | `marketing/CUSTOMER-DISCOVERY-INTERVIEW.md` |
| **Strategy: stack AI/ML frontera + RL applications** | `marketing/AI-ML-MOAT.md` |

---

## Marketing & Discovery

La carpeta `marketing/` contiene 7 documentos vivos que el equipo usa para captación, entrevistas y posicionamiento. Importante:

- **El discovery primario desde 2026-04-17 es la WAITLIST** (ver `LAUNCH-PLAN-7DAYS.md`). Flujo: ads → landing page (`LANDING-PAGE-SPEC.md`) → opt-in → thank-you con form (`WAITLIST-FORM.md`) → segmentación automática 🟢🟡🔴.
- **Las entrevistas 1:1 (`CUSTOMER-DISCOVERY-INTERVIEW.md`) son tier 2** — solo para signups 🟢 score ≥ 8 que agendaron desde el form.
- **El proyecto es internacional + bilingüe EN/ES**, no LATAM-only. Avatar primario USA (Remediation PM), beachhead operacional LATAM (Gerente HSEQ).
- **El AI/ML moat es real, no decorativo**: integramos AlphaFold 3, RFDiffusion 2/3, ESM-3, AlphaGo-style RL para Consortium Search. Ver `marketing/AI-ML-MOAT.md` para qué decir y qué NO prometer (TRL, licencias).
- **Cualquier copy nuevo se valida** contra `marketing/ADS-HOOKS.md` §6 (frases prohibidas) + `.research-synthesis.md` §11 + `marketing/AI-ML-MOAT.md` §5.
- **Ads durante campaña 7 días** apuntan TODAS a la landing (`ADS-HOOKS.md` §4 actualizado). No a "book a demo" ni a PDF downloads durante la campaña activa.

---

## Pequeñas trampas que van a pasar

- **Streamlit es flaky con Playwright** en transiciones consecutivas de radio. Solución: `playwright.chromium` con un `browserContext` nuevo por página testeada (no reutilices la misma sesión para navegar entre vistas). Ver `/tmp/qa-deep.mjs` como referencia.
- **`fullPage: true` no captura todo** porque Streamlit virtualiza el scroll. Captura por slices manuales scrolleando con `window.scrollTo` + `section[data-testid="stMain"].scrollTop = y`.
- **El "chat IA"** (`views/asesoria_ia.py`) NO es IA — es keyword-matching contra un dict de respuestas pre-escritas. No vendas como "ChatGPT de bacterias". Si vamos a llamarlo IA, agregar disclaimer "respuestas pre-cargadas" o reemplazar con un LLM real.
- **Dos métricas inconsistentes en la home**: dice "847 microorganismos catalogados" pero en Descubrimientos dice "50+". Es bandera roja en pitch — alinear.
