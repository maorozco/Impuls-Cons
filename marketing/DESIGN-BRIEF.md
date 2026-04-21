# Design Brief — Impulso BioCycle

> **Úsalo con:** v0.dev · Lovable · bolt.new · Cursor · Figma Make · ChatGPT Canvas. Pega este doc completo + los screenshots actuales en `.qa-screenshots/v2/` y pide rediseño nivel Linear / Vercel / Anthropic / Stripe.

---

## 1 · Qué es la app

**Impulso BioCycle** es una plataforma de IA que diseña **consorcios microbianos** (mezclas optimizadas de bacterias y hongos BSL‑1/GRAS) para **biorremediación** — la degradación biológica de contaminantes. Hoy, cuando una empresa tiene suelo con hidrocarburos, una planta textil vierte colorantes azo, o un relleno sanitario sobrepasa los límites regulatorios de lixiviados, el camino convencional es excavar + llevar a relleno, o tratamiento fisicoquímico costoso. BioCycle ofrece una alternativa: "dinos qué contaminante, qué condiciones de sitio, qué volumen — te diseñamos la receta microbiana óptima, su protocolo operativo y te damos la predicción de degradación basada en 4,797 referencias peer‑reviewed".

**Modelo honesto (pivote A+C, 2026‑04‑16):**

- **Plástico** → sólo en **biorreactor enzimático contenido** (produce monómeros TPA+EG vendibles a $800–1,600/ton). NUNCA en playa ni campo abierto.
- **Suelos con hidrocarburos / pesticidas** → **cápsulas de alginato** in‑situ. Décadas de evidencia de campo.

**TRL del sistema integrado: 3–4** (componentes individuales son 7–9). Primer cliente real = piloto 90 días $3K USD con lab universitario aliado.

---

## 2 · Propósito del producto

Tres audiencias, tres propósitos:

1. **Operador industrial (HSEQ manager LATAM, Remediation PM USA)** — "Tengo un sitio contaminado con deadline regulatorio; necesito una cotización rápida + piloto creíble."
2. **Laboratorio universitario** — "Queremos diseñar un consorcio para un paper; necesitamos la plataforma que acelera la literatura."
3. **Jurado de Capital Semilla Nacional** — "Enséñame en 4 minutos que esto funciona y que son honestos sobre qué no hacen."

El pitch del producto en una línea: **"Waze de la biorremediación — no fabricamos las bacterias, diseñamos la receta óptima para que un cliente las combine y degrade un contaminante específico en un sitio específico."**

---

## 3 · Pestañas y funcionamiento

La app tiene **5 vistas principales** con navegación en sidebar izquierdo.

### 3.1 🏠 Inicio (home)
- Hero con imagen de marca (Impulso Biocycle + tagline "Accelerating the Natural Cycle through Intelligence")
- 2 CTAs primarios: **"Construye tu Consorcio"** (laboratorios) y **"Gestiona tus Residuos"** (empresas)
- Sección "¿Qué es?" — 1 párrafo + grid de 3 value props
- "Dos caminos, un objetivo" — 2 path cards profundas explicando B2C (lab) vs B2B (empresa)
- Sección "Problemas que resolvemos" — 4 cards con estadística + descripción (11.6M toneladas de residuos Colombia, etc.)
- "Cómo funciona" — 3 pasos ilustrados con cápsula microbiana + bacterias como protagonistas visuales
- Métricas: **28 microorganismos BSL-1/GRAS · 4,797 referencias · 33 contaminantes · 30+ países**
- Footer con disclaimer científico

### 3.2 📚 Descubrimientos
- Feed de **10 papers peer-reviewed** que sustentan el producto (Nature, Science, PNAS, Environmental Science & Technology)
- Cada card: institución (UT Austin, Carbios, ETH Zürich…), año (2019–2025), categoría (Plásticos, Hidrocarburos, PFAS, Textiles…), descripción de 2–3 líneas, resultado cuantitativo ("FAST-PETase degrada PET en 24h a 50°C"), link al DOI, badge color por categoría
- 3 stats boxes arriba: discoveries count, category count, years covered

### 3.3 🧬 Construye tu Consorcio (diseñador técnico)
- **Paso 1**: selector de contaminante (33 subtipos organizados en 7 categorías: Plásticos, Hidrocarburos, Suelos agrícolas, Aguas residuales, Minería, Textiles, Residuos farmacéuticos)
- **Paso 2**: modo de aplicación (Biorreactor lab / Biorreactor industrial / In-situ suelo / In-situ agua / Compostaje). **Bloqueo inteligente**: Plástico + In-situ → error rojo con redirect al pivote A+C
- Si plástico: sub-selectores de pretratamiento (trituración + limpieza — afectan probabilidad de éxito)
- **Paso 3**: condiciones del entorno (temperatura, pH, tipo de medio, % contaminación mixta, volumen a tratar)
- Botón primario **"Diseñar Consorcio Óptimo"** → loading con pasos (ML crunching, verificación compatibilidad, predicción degradación)
- **Resultado** (9 secciones):
  1. Consorcio recomendado: **dataframe** con 4 microorganismos, % proporción, rol, rango óptimo, badge BSL-1/GRAS
  2. Matriz de compatibilidad entre las 4 especies
  3. **Probabilidad de éxito** — big number 52% + gauge Plotly animado 0→N + label "Moderada — Viable con optimización"
  4. Formulación de cápsula alginato (material, costo < $0.001 USD, proveedor Brenntag Colombia, diámetro)
  5. Protocolo de preparación — 5 pasos cards
  6. Predicción de degradación — chart Plotly con 3 curvas (BioCycle vs Método convencional vs Atenuación natural), tooltip rico con citation
  7. 3 KPIs grandes: "% degradación 12 semanas", "tiempo a 50%", "aceleración vs natural"
  8. **Comparación de costos** — bar chart horizontal con paleta brand, 4–5 métodos, savings card con gradient
  9. Expander Protocolo de despliegue + Limitaciones y notas
- CTA final: card gradient verde oscuro "¿Quieres llevar este consorcio a un piloto de 90 días?" con email

### 3.4 🏭 Gestiona tus Residuos (portal B2B)
- **3 tabs**:
  - **Cotiza**: selector tipo operación (refinería, textil, agro, relleno, consultora ambiental…) + país + volumen → plan de producto (cronograma), inversión mensual USD, ahorro anual, ROI, impacto ambiental (CO₂ evitado), cumplimiento normativo (ANLA, Res. 631/2015, EPA)
  - **🎧 Escucha Activa · dolor del mercado**: nuestra diferencia — panel multi-agente que ANALIZA quejas públicas de Reddit en tiempo real (4,797 posts clasificados, top avatares detectados). Muestra top 3 dolores de la semana con quote verbatim + subreddit + avatar_match (remediation_pm_usa / hseq_latam / compliance_eu). Top competidores mencionados con sentimiento agregado (Veolia −0.15, AECOM −0.42, Carbios +0.05)
  - **📊 Caso ilustrativo**: "Refinería Andina S.A. — datos compuestos". Flow completo: caracterización → consorcio diseñado → cronograma 90d → ROI estimado ($1.87M convencional vs $285K BioCycle piloto). Etiquetado claramente como ejemplo.

### 3.5 💬 Asesoría IA (chat con RAG)
- Chat conversational sobre biorremediación con **RAG** (TF-IDF retrieval) sobre corpus de **61 documentos** (10 papers + 33 consorcios + 18 bases de datos internas de contaminantes)
- Genera respuestas con Claude Sonnet / OpenRouter con **citaciones a fuentes** expandibles
- 6 preguntas frecuentes sugeridas (costos, seguridad, diferencia vs Carbios, piloto, hidrocarburos, regulación)
- Skeleton loader shimmer mientras piensa
- Banner de status: verde si LLM activo · azul si modo TF-IDF offline
- Guardrails duros: nunca promete limpiar playas, nunca "plástico desaparece", nunca AlphaFold comercial — todos los outputs pasan por banned-phrase linter

---

## 4 · Sistema de diseño actual

### 4.1 Paleta de colores

| Token | Hex | Uso |
|---|---|---|
| `forest-deep` | `#004D2C` | Fondos oscuros, CTAs críticos, hero sidebar |
| `forest-mid` | `#1B5E20` | Texto en bg claro, borders primarios |
| `green-bright` | `#00C853` | **Brand primary** — bordes, acentos, success states |
| `cyan-electric` | `#00D9F5` | **CTAs**, números grandes, highlights |
| `lime-yellow` | `#C4FF00` | Accents sutiles, "siguiente paso" labels |
| `off-white` | `#F4FBF7` | Bg cards suaves |
| `ink` | `#1B4332` | Texto principal |
| `muted` | `#6A8A74` | Texto secundario, captions |
| `warning` | `#EF6C00` | Costos altos (NO usar rojo puro) |

Gradientes brand:
- Hero: `linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #00C853 100%)`
- Cards success: `linear-gradient(135deg, #E8F5E9, #F1F8E9)`

### 4.2 Tipografía

- **Display / Sans**: `Inter` (weights 400, 500, 600, 700, 800, 900) — reemplazar system-ui
- **Mono / tabular**: `Geist Mono` — para números grandes, code, métricas
- **Tamaños**: type scale 1.25 (12 / 14 / 16 / 18 / 20 / 24 / 32 / 40 / 56)
- Tracking: `-0.02em` en headings grandes
- Big number displays: `font-variant-numeric: tabular-nums; letter-spacing: -0.04em`

### 4.3 Espaciado y radii

- Sistema 8-point: `4, 8, 12, 16, 24, 32, 48, 64`
- Radii: `8` (chips/badges), `12` (cards), `14` (big cards), `20` (hero)

### 4.4 Efectos

- Elevations: sombras stacked (`0 2px 12px rgba(0,0,0,0.05)` + `0 20px 40px -20px rgba(27,94,32,0.15)`)
- Glassmorphism opcional en cards sobre gradientes: `backdrop-filter: blur(20px); background: rgba(255,255,255,0.55)`
- Micro-animaciones: hover lift -2px + scale 1.02 / transition 200ms / fadeInUp en entrada
- Reduced-motion respetado

### 4.5 Iconos

Preferir **SVG inline** (Lucide, Phosphor, Heroicons outline) sobre emojis. Emojis reservados para badges informales (🟢 BSL-1) y UX ligera.

---

## 5 · Referencias de inspiración visual

- **Linear.app** — density + typography + dark-accents
- **Anthropic.com** — warm off-whites + serif hybrid
- **Vercel.com** — data viz restraint + monospace numbers
- **Stripe.com** — ilustraciones vectoriales + gradients
- **Perplexity.ai** — citation presentation + sources expansion
- **DeepMind AlphaFold gallery** — científico + premium + accesible (este es el que más nos cuadra dado el dominio)

---

## 6 · Stack técnico y restricciones

- **App principal**: **Streamlit 1.50+** (Python). Layout es `st.columns` + `st.markdown(unsafe_allow_html=True)` + CSS global inyectado. **No hay React.** Cualquier diseño que pases tiene que renderizarse vía markdown+CSS o con `streamlit.components.v1.html`.
- **Landing pública**: Next.js 14 App Router + Tailwind CSS + framer-motion (esa sí tiene libertad total de diseño — ver `artifacts/landing/`).
- **Gráficos**: Plotly (usa `fig.update_layout({paper_bgcolor, plot_bgcolor, font, hoverlabel})` para styling)
- **Target deploy**: Replit Reserved VM (no afecta el diseño)

### Caveat importante para el bot

Si el diseño propuesto requiere **drag-and-drop, modals complejos, routing React, state machines**, sugerir **portarlo a Next.js** (el landing ya está en Next) en vez de intentar dentro de Streamlit. Streamlit tiene techo real de diseño. Cosas razonables en Streamlit:

- CSS global + classes
- Cards HTML custom con markdown
- Plotly bien estilizado
- Componentes nativos con theming (botones, selectboxes, expanders, tabs, chat, sidebar)

Cosas NO razonables en Streamlit:

- Transiciones de route
- Drag-and-drop
- Rich animations sincronizadas
- Modals custom con backdrop blur

---

## 7 · Qué quiero que el bot haga

1. **Rediseñar las 5 vistas del home** con nivel Linear/Vercel, manteniendo la paleta brand pero usando tipografía Inter + Geist Mono + iconos Lucide SVG + gradients sofisticados + micro-animaciones.
2. Devolver el **CSS global listo para pegar en `app.py`** (entre tags `<style>...</style>` dentro de `st.markdown(unsafe_allow_html=True)`).
3. Devolver las **plantillas HTML de los componentes custom** (hero, stat cards, path cards, feature grid, step cards, CTA final, chat message, source card) que yo pueda usar con `st.markdown("""<div class="...">""", unsafe_allow_html=True)`.
4. Sugerir **una ilustración vectorial** para el diagrama "cápsula microbiana" de la home (paso 1 del "Cómo funciona") — puede ser SVG inline.
5. **Respetar** el system design que ya tengo (paleta + pivote A+C + reglas narrativas en `marketing/ADS-HOOKS.md §6` + `.research-synthesis.md §11`).

### Qué NO debe hacer

- NO proponer librerías JS externas pesadas (framer-motion, GSAP) dentro de Streamlit — romper dev flow.
- NO proponer dark mode global (el producto es light-first por accesibilidad de datos científicos).
- NO proponer palette completamente distinta — la brand ya existe.
- NO usar rojo puro `#F44336` ni `#E53935` para costo alto — usar `#EF6C00` naranja quemado.

---

## 8 · Archivos que el bot debe modificar

```
artifacts/impulso-biocycle/app.py                 ← global CSS (lines 10-290)
artifacts/impulso-biocycle/views/inicio.py        ← home (CSS + markdown blocks)
artifacts/impulso-biocycle/views/descubrimientos.py ← feed cards
artifacts/impulso-biocycle/views/disenador.py     ← wizard + results
artifacts/impulso-biocycle/views/portal_cliente.py ← B2B + 3 tabs
artifacts/impulso-biocycle/views/asesoria_ia.py   ← chat + sources
```

---

## 9 · Entregables esperados

1. `app.py` — bloque `<style>` actualizado con design tokens + tipografía + utilities
2. `inicio.py` — sección por sección rediseñada con markdown HTML+CSS
3. **Mockup preview** (puede ser HTML standalone en un solo archivo para preview rápido)
4. Una **lista priorizada** de qué requerirá portar a Next.js si queremos llegar a nivel Linear — porque honestamente hay vistas (asesoría IA, portal con tabs y dashboards) que se lucirían más en React.
