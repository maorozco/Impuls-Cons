# `/biocycle/*` — 5 rutas del producto

> **Qué vive aquí:** la aplicación BioCycle. No es la landing (la landing está en `app/[lang]`). Son 5 rutas que un prospecto o un jurado va a recorrer en el pitch.

## Layout compartido

`app/biocycle/layout.tsx` envuelve las 5 rutas con sidebar + topbar + onboarding modal. CSS global está en `biocycle.css` (no editar sin revisar las 5 rutas).

Componentes del layout:
- `<Sidebar>` — nav vertical + "Qué hacemos (y qué NO)" + stats (TRL 3-4, 28 MOs, 4,797 refs)
- `<Topbar>` — breadcrumbs + search Cmd+K + botones Tour/Novedades/Reservar piloto
- `<Onboarding>` — tour de 5 pasos la primera vez (persiste a `localStorage.biocycle_onboarded_v1`)

## Las 5 rutas

### `inicio/` — Hero comercial
- Hero con title serif + stats hero-meta (**no lleva "$3K USD · 90 días"** — eliminado; usar "33 contaminantes modelados" o similar)
- Hero-tag "NUEVO · Escucha Activa" es un **`<Link href="/biocycle/portal?tab=escucha">`** (no `<div>`)
- Botón "Abrir demo interactiva" → `<Link href="/biocycle/disenador">` (antes era `<a href="#">` muerto)
- Problem stats anclados a fuentes reales (Supersevicios 2024, USEPA, UN Environment 2019, BID 2024)

### `descubrimientos/` — Feed de papers
- 10 papers peer-reviewed del corpus con citation, avatar, trust score
- Featured paper arriba, resto en feed scroll
- CSS local: `.p-link svg {width:12px; height:12px}` (fix para flechas gigantes pasado)
- Imagen hero cap `max-height:320px`, featured image cap `220px`

### `disenador/` — Wizard B2C
- **3 pasos**: contaminante → modo → condiciones → botón Diseñar
- Consorcio viene de `@/lib/consortia-rules.ts` (mapeo catId+subtype → 4 MOs reales)
- **Medio es interactivo** con pills (`arenoso/franco/arcilloso/orgánico` o `efluente/reactor/agua_residual` según contaminante). Auto-snapea a un medio válido cuando cambia el contaminante.
- **Plazo regulatorio** es condicional: solo se muestra si mode no es lab (`bioreactor_lab`, `bioreactor_ind`, `compost`)
- **Barra de carga animada** con 6 stages (~3.5s mínimo) al clicar Diseñar, incluso si el backend responde rápido. Implementado con `setInterval` + `.design-progress` CSS.
- **Botón pasa a "Rediseñar con estos cambios"** una vez hay resultado. Cada click re-fetch.
- Después del resultado: scroll automático a `resultsRef` para que se vea el output.
- Componentes internos: `CompatibilityMatrix`, `DegradationCurve`, `AlternativesPanel` (todos en el mismo archivo al final de `page.tsx`).

### `asesoria/` — Chat RAG
- Componente principal: `AsesoriaChat` en `components/biocycle/asesoria-chat.tsx`
- **Markdown pro** con `react-markdown + remark-gfm + rehype-sanitize + rehype-highlight`
- Clase wrapper `.biocycle-prose max-w-none` (override de `@tailwindcss/typography`)
- **Historia conversacional** se envía al backend (últimos 12 mensajes) para que el chat "recuerde"
- **Source cards clickeables** con `<mark>` highlights sobre los tokens de query
- Guardrail banned-phrases: pivote A+C (plástico en playa/mar/océano → banner ámbar)

### `portal/` — Portal B2B
- **Tabs**: `cotiza | escucha | caso`. Lee `?tab=` de la URL al montar.
- **Cotiza tab**:
  - Form lee de `@/lib/cotiza-rules.ts` (6 operaciones: refineria, textil, agro, relleno, mineria, consultora)
  - `consultora` no tiene quote — muestra CTA `mailto:` para agendar call técnico
  - **Auto-recompute** cuando ya hay quote y el usuario cambia cualquier input (debounce 250ms)
  - Tooltips `?` (`.help-dot`) en cada KPI explicando qué significa
  - Bloque "¿Qué estamos vendiendo?" en empty-state + línea-resumen en populated state
- **Escucha Activa tab**:
  - Fetch `/api/insights` al abrir tab (cancellable)
  - Fallback a datos demo con badge "DEMO" si API falla
  - Quotes tienen links clickeables (Reddit/LinkedIn) con `target="_blank"`
  - Card de Competidores tiene explainer (qué significa score −1 a +1)
- **Caso ilustrativo tab**:
  - Banner ámbar grande al inicio con "Caso ILUSTRATIVO · datos HIPOTÉTICOS"
  - Watermark diagonal sutil con `.caso-wrap::before`
  - Hovers sobre números muestran tooltip "estimación ±20%"

## Reglas duras específicas de estas rutas

1. **Números siempre anclados a rules**: `page.tsx` NUNCA tiene números del consorcio/precios hardcoded. Viene todo de `lib/consortia-rules.ts` o `lib/cotiza-rules.ts`.
2. **Contaminantes BSL-1/GRAS solamente** en `consortia-rules.ts`. Nada BSL-2+.
3. **El Diseñador tiene fallback offline**: si ml-api está caído, `consortia-rules.expectedPct` + penalizaciones pH/temp dan un número creíble.
4. **Al agregar un tab o una pestaña**: respeta `data-testid="tab-<id>"` + `data-testid="tab-content-<id>"` (los tests los esperan).
5. **Al agregar una operación nueva al Portal**: extender `COTIZA_RULES` en `lib/cotiza-rules.ts`, NO el JSX de `portal/page.tsx`.

## Testing manual rápido

```
# Diseñador — consortium cambia con contaminante
/biocycle/disenador → click "Textiles" → click "Diseñar" → verificar
  que aparecen Trametes versicolor, Bacillus subtilis (no Pseudomonas TPH)

# Portal cotiza — auto-recompute
/biocycle/portal → click "Generar" → cambiar "Volumen a tratar" → ver
  indicador "actualizando…" + número nuevo en <1s

# Portal deep link
/biocycle/portal?tab=escucha → abre directo en Escucha Activa

# Chat con markdown
/biocycle/asesoria → pedir respuesta con **bold**, listas, tabla, código →
  verificar que renderiza como documento editorial, no raw Markdown
```
