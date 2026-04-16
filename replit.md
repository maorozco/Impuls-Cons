# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.
Also includes a Python Streamlit application (Impulso BioCycle).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Impulso BioCycle (Streamlit App)

A multi-page Streamlit web app in Spanish for microbial consortia design and biodegradation discovery.

### Location
`artifacts/impulso-biocycle/`

### Run Command
```bash
cd artifacts/impulso-biocycle && streamlit run app.py --server.port 5000 --server.address 0.0.0.0
```

### Structure
- `app.py` — Main app with sidebar navigation, page routing
- `data.py` — All hardcoded data (discoveries, consortia recipes, degradation curves, cost data)
- `pages/descubrimientos.py` — Page 1: 10 scientific discoveries with filter buttons
- `pages/disenador.py` — Page 2: Full consortia designer with all 9 results sections
- `.streamlit/config.toml` — Theme config (green palette)

### Features
- Page 1: 10 research discovery cards with category filter buttons
- Page 2: 3-step consortia designer with:
  - 23+ contamination subtypes across 5 categories
  - Sequential loading simulation (11 seconds)
  - Results A-I: Consortium recipe, success gauge, compatibility table, capsule formulation, degradation Plotly chart, process output, Plotly cost comparison, deployment protocol, limitations
- All text in Spanish
- Python dependencies: streamlit, plotly, pandas
