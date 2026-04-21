#!/usr/bin/env bash
# replit-start.sh — runtime entrypoint for Replit deployment.
# Starts two processes:
#   • FastAPI ml-api in background on 127.0.0.1:5001 (loopback · internal)
#   • Next.js in foreground on 0.0.0.0:3000 (public · external port 80)
#
# Called from .replit [deployment] run = ["bash", "scripts/replit-start.sh"]

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

echo "▸ Impulso BioCycle · starting services"

# ── ml-api · FastAPI on loopback ────────────────────────────────────
# Uses the consolidated requirements.txt installed during build.
# Only reachable by the Next.js server via ML_API_URL=http://127.0.0.1:5001.
echo "▸ launching ml-api on 127.0.0.1:5001"
(
  cd artifacts/ml-api
  python main.py --host 127.0.0.1 --port 5001
) &
ML_API_PID=$!

# Clean shutdown of ml-api when Next.js exits.
trap "echo '▸ stopping ml-api'; kill $ML_API_PID 2>/dev/null || true" EXIT INT TERM

# ── Wait briefly for ml-api to bind (up to ~15s) ────────────────────
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null http://127.0.0.1:5001/healthz 2>/dev/null; then
    echo "✓ ml-api up after ${i}×0.5s"
    break
  fi
  sleep 0.5
done

# ── Next.js · public-facing server ──────────────────────────────────
# Binds 0.0.0.0:3000 so Replit's proxy can forward from externalPort 80.
echo "▸ launching Next.js on 0.0.0.0:3000"
cd artifacts/landing
exec pnpm start --hostname 0.0.0.0 --port 3000
