# Design Source — Impulso BioCycle

> **⚠️ No tocar.** Este directorio es el source of truth del design system, exportado de
> claude.ai/design el 2026-04-20. Si necesitas cambios visuales, edítalos en
> `artifacts/landing/app/(biocycle)/biocycle.css` o en los componentes React correspondientes —
> NO aquí. Este directorio sirve como referencia inmutable para auditorías de fidelidad visual.

## Inventario

| Archivo | Tamaño | Propósito |
|---|---|---|
| `shared.css` | 22 KB | Design tokens (paleta, tipografía, spacing, radii, shadows) + shell styles |
| `shell.js` | 4.6 KB | Sidebar + topbar HTML injection |
| `Inicio.html` | 56 KB | Home — hero mesh, value grid, paths, problems, steps, metrics banner, footer |
| `Descubrimientos.html` | 17 KB | **PRIMARY** — feed de 10 papers peer-reviewed con filtros |
| `Disenador.html` | 33 KB | Wizard 3 pasos + resultado con gauge, costos, protocolo |
| `Portal.html` | 23 KB | 3 tabs B2B: cotiza, escucha activa, caso ilustrativo |
| `Asesoria.html` | 20 KB | Chat RAG con source expanders |

## Design tokens extraídos (ver `shared.css` para detalle)

**Paleta:**
- `--forest-deep:#004D2C` · `--forest-mid:#1B5E20` · `--forest-ink:#0A2818`
- `--green-bright:#00C853` · `--green-soft:#7BD48A`
- `--cyan-electric:#00D9F5` · `--lime:#C4FF00`
- `--off-white:#F4FBF7` · `--paper:#FAFCF9`
- `--ink:#0E2A1C` · `--ink-2:#1B4332` · `--muted:#6A8A74` · `--muted-2:#8EA598`
- `--line:#E2ECE5` · `--line-strong:#CBDAD0`
- `--warning:#EF6C00` · `--amber:#F4A100`

**Tipografía:** Inter (sans) + Geist Mono (numbers/eyebrows) + Fraunces (italic accents).

**Shell:** sidebar 240px sticky + topbar 54px sticky + main content grid.

## Cómo el repo lo consume

- Next.js: `artifacts/landing/app/(biocycle)/biocycle.css` importa/duplica estos tokens.
- React components: `artifacts/landing/components/biocycle/` implementa la estructura HTML como componentes funcionales.
- El shell (sidebar + topbar) se porta a `artifacts/landing/app/(biocycle)/layout.tsx` nativo de Next.js (no `shell.js`, que es para preview standalone).

## README.source.md

Se conserva el README original de Claude Design en `README.source.md`.
