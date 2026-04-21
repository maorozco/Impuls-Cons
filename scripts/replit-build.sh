#!/usr/bin/env bash
# replit-build.sh — build step for Replit deployment (Reserved VM).
# Runs once per deploy. Installs workspace deps, builds Next.js, pushes schema.
#
# Env vars used: DATABASE_URL (optional, enables drizzle push).
# Called from .replit [deployment] build = ["bash", "scripts/replit-build.sh"]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "▸ Impulso BioCycle · Replit build starting"
echo "  pwd: $REPO_ROOT"
echo "  node: $(node --version || echo missing)"
echo "  python: $(python --version || echo missing)"

# ── Activate pnpm via corepack (bundled with Node 20 on the Nix env) ─
# Replit's nixpkgs-24_05 doesn't expose pkgs.pnpm directly, so we rely on
# Node's corepack to provide a pinned pnpm version at build time.
echo "▸ corepack enable pnpm"
corepack enable --install-directory "$HOME/.local/bin" pnpm 2>/dev/null || true
export PATH="$HOME/.local/bin:$PATH"
corepack prepare pnpm@10.33.0 --activate
echo "  pnpm: $(pnpm --version)"

# ── 1. Workspace Node deps (landing + agents + shared libs) ─────────
echo "▸ pnpm install --frozen-lockfile"
pnpm install --frozen-lockfile

# ── 2. Python deps for ml-api (FastAPI + RAG + ML model) ────────────
echo "▸ pip install ml-api requirements"
pip install --upgrade pip --quiet
pip install -r artifacts/ml-api/requirements.txt --quiet

# ── 3. Next.js production build ─────────────────────────────────────
echo "▸ next build"
(cd artifacts/landing && pnpm build)

# ── 4. Drizzle schema push (idempotent) ─────────────────────────────
# Runs only if DATABASE_URL is set (created via Replit Database tab).
# drizzle-kit push is idempotent: reruns are no-ops when schema matches.
if [ -n "${DATABASE_URL:-}" ]; then
  echo "▸ drizzle-kit push (DATABASE_URL is set)"
  (cd artifacts/landing && pnpm db:push) || {
    echo "⚠ drizzle push failed — check schema vs DB state"
    echo "  Deploy continues; fix with: pnpm --filter @workspace/landing db:push"
  }
else
  echo "▸ skipping drizzle push (DATABASE_URL not set)"
  echo "  Provision Postgres via Replit Database tab, then redeploy."
fi

echo "✓ Build complete"
