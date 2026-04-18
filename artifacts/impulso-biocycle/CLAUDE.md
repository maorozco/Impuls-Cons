# Impulso BioCycle — la app Streamlit

> Este archivo es para trabajar **dentro** de la app. La estrategia de producto, pivote y reglas narrativas están en el `CLAUDE.md` del repo raíz.

---

## Estructura

```
artifacts/impulso-biocycle/
├── app.py                  ← entrada — sidebar, CSS global, routing
├── data.py                 ← datasets hardcoded (40KB de Python)
├── ml_model.py             ← Gradient Boosting Regressor (singleton)
├── views/                  ← 5 páginas. NO renombrar a "pages/"
│   ├── inicio.py           ← landing con hero, dos rutas, métricas
│   ├── descubrimientos.py  ← feed de 10 papers científicos
│   ├── disenador.py        ← form 3 pasos → 9 secciones de resultado
│   ├── portal_cliente.py   ← B2B: industria + país → plan/ROI
│   └── asesoria_ia.py      ← "chat" (keyword-match dict, no LLM)
├── static/
│   └── hero.png            ← imagen del hero. Servida en /app/static/hero.png
└── .streamlit/
    └── config.toml         ← puerto 5000, headless=true
```

Cada vista expone una función `render()`. El routing en `app.py` la importa en demanda (`import views.X as X; X.render()`).

---

## Convenciones que importan

### Naming y CSS

- Clases CSS reutilizables (`.hero-section`, `.discovery-card`, `.result-section`, `.stat-box`, `.capsule-card`, `.metric-box`) están definidas en `app.py:10-214` con `unsafe_allow_html=True`. Aplican a TODAS las vistas.
- Si una vista necesita estilos propios (ej: `.lp-hero` en `inicio.py`, `.portal-header` en `portal_cliente.py`), los define en una constante `CSS = """..."""` al inicio del archivo y la inyecta dentro de `render()`.
- **Paleta** (definida también como constantes en `inicio.py:5-12`):
  - Verde profundo `#004D2C` — fondos, footer
  - Verde brillante `#00C853` — bordes, acentos
  - Cian eléctrico `#00D9F5` — CTAs, métricas
  - Lima `#C4FF00` — highlights sutiles
- **Sin emojis en títulos** según el README. (En la práctica varios componentes los usan — alinear si refactorizas.)

### Streamlit en este proyecto

- **Multi-página manual** vía `st.radio` en sidebar + `if/elif` en `app.py:259-273`. NO usar `st.navigation` ni la carpeta `pages/`.
- **State para navegación cross-page**: `st.session_state["nav_page"] = "🧬 Construye tu Consorcio"; st.rerun()` (ver `views/inicio.py:222-224`).
- **State para resultados persistentes**: el diseñador guarda inputs en `st.session_state["consorcio_diseñado"]` y los re-renderiza si está True (`views/disenador.py:427-474`). Esto evita que un cambio de form re-dispare el loading de 12s.
- **Tablas**: `st.dataframe(..., hide_index=True, use_container_width=True, column_config={...})`.
- **Plotly**: `go.Figure` configurado con `paper_bgcolor="white"`, font `#1B4332`, height fijo (360–400). Renderizar con `st.plotly_chart(fig, use_container_width=True)`.

### El modelo ML

- `ml_model.BioCyclePredictor` entrena un `GradientBoostingRegressor` (n_estimators=100, max_depth=4, lr=0.1) sobre **43 muestras hardcoded** de literatura.
- Features: `contaminant`, `temp_C`, `pH`, `mode`, `contamination_pct`, `pretreatment`, `time_weeks`. Encoders: `LabelEncoder` para `contaminant` y `mode`.
- Output: `degradation_pct` clamped a [0, 100].
- **Singleton**: `ml_model.get_predictor()`. Entrena al primer llamado. R² ≈ 0.55 con cross-val.
- **Mapeo subtipo→contaminante ML** en `views/disenador.py:15-46` (`ML_CONTAMINANT_MAP`). Si agregas un subtipo nuevo en `data.SUBTYPES`, mapéalo aquí o cae al fallback `hydrocarbons`.
- **No persistas modelo** en disco — se reentrena rápido al reload (no vale la pena un .pkl).

### Los datos

- `data.SUBTYPES` — dict categoría → lista subtipos. Estructura el dropdown del diseñador.
- `data.CONSORTIA_DATA` — dict subtipo → lista de 4 microorganismos con `microorganism`, `safety`, `role`, `proportion`, `optimal_range`. Si agregas subtipo, agrega entrada aquí también.
- `data.SUCCESS_PROBABILITIES` — dict subtipo → int 0-100 (probabilidad base ANTES de los ajustes por temp/contaminación/pretrat en `disenador.get_success_probability`).
- `data.PUBLICATIONS_COUNT` — dict subtipo → int (n papers). Se muestra en el card "Basado en N publicaciones".
- `data.DEGRADATION_CURVES` — dict cat_type → curvas `natural`, `convencional`, `biocycle` (17 puntos cada una, weeks 0-16).
- `data.DISCOVERIES` — lista 10 dicts con `title`, `category`, `year`, `institution`, `description`, `result`, `link`, `color`.
- `data.CATEGORY_COLORS` — dict para badges de descubrimientos.
- `data.get_category_type(categoria)` — helper para mapear "Plásticos"/"Hidrocarburos…" a key de `DEGRADATION_CURVES`.

---

## Cómo agregar cosas

### Una nueva vista
1. `views/mi_vista.py` con función `render()`.
2. En `app.py:217`: agregar etiqueta a `NAV_PAGES` (con emoji prefix — el routing usa el string completo).
3. En `app.py:259+`: agregar `elif pagina == "📊 Mi Vista":` con `import views.mi_vista as v; v.render()`.

### Un nuevo contaminante
1. Agregar a `data.SUBTYPES[categoría]` (lista).
2. Agregar consorcio a `data.CONSORTIA_DATA[subtipo]` (4 microorganismos BSL-1/GRAS).
3. Agregar `data.SUCCESS_PROBABILITIES[subtipo]` y `data.PUBLICATIONS_COUNT[subtipo]`.
4. En `views/disenador.ML_CONTAMINANT_MAP` mapear a uno de los `contaminant` que el ML conoce (ver `ml_model.train()`). O agregar muestras nuevas al training data del modelo.

### Una nueva pregunta al chat IA
1. `views/asesoria_ia.py:RESPONSES` — dict de strings con triggers en otra estructura (revisar la lógica de matching, está basado en `if any(kw in query.lower() for kw in [...])`).
2. Si la pregunta nueva no encaja en ningún keyword, agregar un `elif` en la función de matching.

### Un microorganismo nuevo
**Verificar BSL-1/GRAS antes de meterlo a `CONSORTIA_DATA`.** Fuentes: ATCC, DSMZ, FDA GRAS list. Si no es BSL-1/GRAS no entra — viola la regla narrativa #2 del CLAUDE.md raíz.

---

## Bugs/UX conocidos (de la QA del 2026-04-16)

Sacados de `.qa-screenshots/`:

1. **Métricas inconsistentes** Inicio "847 microorganismos" vs Descubrimientos "50+ microorganismos". Decidir cuál es la fuente de verdad y propagar.
2. **`Asesoría IA` se vende como IA pero es un dict de keywords.** Agregar disclaimer "respuestas pre-cargadas" o reemplazar por un LLM real (Anthropic/OpenAI vía API + RAG sobre los descubrimientos).
3. **Botón "Descargar reporte"** en `disenador.py:827` muestra toast "Próximamente" — botón muerto; o lo implementas o lo quitas.
4. **Plástico + In-situ**: hay un `st.warning` en `disenador.py:358` pero según el pivote, debería ser `st.error` y bloquear el botón "Diseñar".
5. **Logo del sidebar** (emoji 🧬 + texto) se ve genérico. La marca del hero (`hero.png`) es hermosa — usarla también en el sidebar.
6. **Footer existe en home pero falta** en otras páginas (existe pero es chiquito).
7. **El segundo hero "Impulso BioCycle / Biorremediación Inteligente con IA"** en Diseñador / Descubrimientos / Portal es redundante con el sidebar — podría comprimirse.

Ver `ROADMAP-10X.md` para mejoras estratégicas.

---

## Cómo correr / debugear

```bash
# Desde el repo raíz
cd artifacts/impulso-biocycle
../../.venv/bin/streamlit run app.py --server.port 5000 --server.address 127.0.0.1 --server.headless true

# Logs en stdout. Recargar al guardar = activado por defecto.
```

**Para QA con Playwright**: `npx playwright install chromium` (una vez), luego script con `chromium.launch({headless:true})`. Ver `/tmp/qa-deep.mjs` como referencia. Importante: nuevo `browserContext` por cada vista (Streamlit es flaky con clicks rápidos consecutivos en radios).

**Para debugear un import**: 
```bash
.venv/bin/python -c "
import sys; sys.path.insert(0, 'artifacts/impulso-biocycle')
from views import disenador
print('OK')
"
```
