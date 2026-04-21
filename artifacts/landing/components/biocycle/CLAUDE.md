# `components/biocycle/*` — componentes BioCycle

> **Qué vive aquí:** componentes específicos del producto BioCycle. NO son primitives genéricos (eso va en `components/ui/`).

## Catálogo

| Archivo | Dónde se usa | Notas |
|---|---|---|
| `sidebar.tsx` | layout BioCycle | Nav + "Qué hacemos (y qué NO)" con ✓/✗ + stats TRL/MOs/refs |
| `topbar.tsx` | layout BioCycle | Breadcrumbs + search + Tour/Novedades + "Reservar piloto" |
| `onboarding.tsx` | layout BioCycle | Modal tour 5 pasos + persiste `localStorage.biocycle_onboarded_v1` |
| `asesoria-chat.tsx` | `/biocycle/asesoria` | Chat RAG con markdown pro + historia + source cards |
| `descubrimientos-feed.tsx` | `/biocycle/descubrimientos` | Feed de 10 papers peer-reviewed |
| `biocycle-image.tsx` | todos | `<img>` optimizado con WebP 1x/2x + lazy + `bc-caption` |

## Reglas de composición

1. **`sidebar.tsx` tiene tono honesto**: el card "Qué hacemos (y qué NO)" lista ✓ plástico en reactor, ✓ hidrocarburos in-situ, ✗ NO playas/océanos. Nunca cambiar a "Pivote A+C activo" (jerga).
2. **`onboarding.tsx` no usa jerga técnica**: los 5 pasos hablan de "fuentes que puedes abrir y leer", no "corpus RAG" o "guardrails". Cambios al copy: actualizar también `tests/biocycle.spec.ts` si los testids cambian.
3. **`asesoria-chat.tsx` historial conversacional**: envía últimos 12 turnos al backend en cada request. NO persistir a DB (se pierde al recargar, intencional).
4. **`biocycle-image.tsx` genera srcset**: mete `id` (coincide con el archivo en `public/biocycle/img/<id>@1x.webp` y `@2x.webp`). Sizes obligatorio.

## AsesoriaChat — detalles críticos

Archivo: `asesoria-chat.tsx` (~460 líneas).

**Estructura:**
- `SUGGESTIONS` — 6 cards iniciales (Costos/Seguridad/Competencia/Piloto/Hidrocarburos/Regulación)
- `BANNED_TOPICS` — regex de combinaciones pivote A+C (plástico + playa/costa/mar/océano)
- `send()` — arma `history: [{role, content}]` desde `messages`, envía al backend
- `<SourceCard>` — card expandible con excerpt + `<mark>` highlights (tipo Perplexity/Elicit)
- `renderWithHighlights()` — helper que envuelve tokens de query en `<mark>`

**Markdown config (no tocar sin re-test):**
```tsx
<ReactMarkdown
  remarkPlugins={[remarkGfm]}
  rehypePlugins={[rehypeSanitize, rehypeHighlight]}
  components={{
    a: ...target="_blank",
    table: wrap in .md-table-wrap,
    blockquote: ...,
  }}
>
```

CSS wrapper: `<div className="md prose prose-sm biocycle-prose max-w-none">`. Los estilos viven en `app/biocycle/asesoria/asesoria.css` bajo `.msg.a .bubble .biocycle-prose`.

**Code blocks** tienen tema dark-forest custom override sobre github.css (hljs classes `.hljs-keyword` → lime, `.hljs-string` → amarillo, etc).

## Onboarding — 5 pasos sin jerga

Estructura `TourStep` ampliada con `bullets?: string[]` y `footnote?: string`. Los pasos son:

1. **welcome** — "Tour de 90 segundos"
2. **sidebar** — 5 secciones con verbos claros (no "RAG")
3. **paths** — "Si eres lab → Construye · Si eres empresa → Gestiona"
4. **metrics** — "fuentes que puedes abrir y leer" (no "corpus auditables")
5. **asesoria** — "el asistente te dice con honestidad cuándo algo NO tiene evidencia"

Keyboard:
- `Enter` avanza al siguiente paso (el botón está detrás del backdrop a veces)
- `Esc` cierra y persiste onboarded
- `?tour=1` autostarts incluso si ya onboarded

## Cuándo crear un componente nuevo aquí

- Es específico del producto BioCycle (no sirve en la landing pública)
- Se reutiliza en 2+ rutas
- Tiene su propio estado/ciclo de vida

Si es específico de UNA ruta, mételo en `app/biocycle/<ruta>/page.tsx` como subcomponente local (ver `DegradationCurve`, `AlternativesPanel` en `disenador/page.tsx`).
