#!/usr/bin/env bash
# dev.sh — one-command local dev for Impulso BioCycle
#
# Starts:
#   1. Streamlit app          (http://127.0.0.1:5000)
#   2. Next.js landing        (http://127.0.0.1:3000)
#   3. Agents pipeline watch  (fixture mode, every ~60s)
#
# All services run in mock/fixture mode unless you populate .env files.
# Logs are tailed in this terminal. Press Ctrl+C to stop everything.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# ── Pretty helpers ────────────────────────────────────────────────────
C_RESET='\033[0m'
C_GREEN='\033[0;32m'
C_CYAN='\033[0;36m'
C_YELLOW='\033[0;33m'
C_RED='\033[0;31m'
C_DIM='\033[2m'

banner() {
  printf "\n${C_CYAN}══════════════════════════════════════════════════════════${C_RESET}\n"
  printf "${C_CYAN}  %s${C_RESET}\n" "$1"
  printf "${C_CYAN}══════════════════════════════════════════════════════════${C_RESET}\n"
}

step() {
  printf "${C_GREEN}▸${C_RESET} %s\n" "$1"
}

warn() {
  printf "${C_YELLOW}⚠${C_RESET}  %s\n" "$1"
}

fail() {
  printf "${C_RED}✗${C_RESET} %s\n" "$1" >&2
  exit 1
}

# ── Pre-flight checks ─────────────────────────────────────────────────
banner "Impulso BioCycle · local dev"
step "Checking prerequisites..."

command -v pnpm >/dev/null 2>&1 || fail "pnpm not found — install with: npm install -g pnpm"
command -v node >/dev/null 2>&1 || fail "node not found — install Node 20+"

# Find Python — prefer repo venv, fallback to Homebrew (pyenv is known broken on this mac)
PYTHON_BIN=""
STREAMLIT_BIN=""
if [[ -x "$REPO_ROOT/.venv/bin/streamlit" ]]; then
  PYTHON_BIN="$REPO_ROOT/.venv/bin/python"
  STREAMLIT_BIN="$REPO_ROOT/.venv/bin/streamlit"
elif command -v /opt/homebrew/bin/python3 >/dev/null 2>&1; then
  PYTHON_BIN="/opt/homebrew/bin/python3"
  STREAMLIT_BIN="$(command -v streamlit || true)"
fi

if [[ -z "$STREAMLIT_BIN" || ! -x "$STREAMLIT_BIN" ]]; then
  warn "Streamlit not found. Creating venv..."
  /opt/homebrew/bin/python3 -m venv "$REPO_ROOT/.venv"
  "$REPO_ROOT/.venv/bin/pip" install --quiet streamlit plotly pandas scikit-learn anthropic openai psycopg2-binary python-dotenv
  PYTHON_BIN="$REPO_ROOT/.venv/bin/python"
  STREAMLIT_BIN="$REPO_ROOT/.venv/bin/streamlit"
fi

step "Python: $PYTHON_BIN"
step "Streamlit: $STREAMLIT_BIN"

# ── Install Node deps if needed ───────────────────────────────────────
if [[ ! -d "$REPO_ROOT/artifacts/landing/node_modules" ]] || [[ ! -d "$REPO_ROOT/artifacts/agents/node_modules" ]]; then
  step "Installing Node workspace deps (pnpm)..."
  pnpm install --silent
fi

# ── Kill any lingering dev processes on our ports ─────────────────────
step "Cleaning up previous dev processes..."
for port in 3000 5000; do
  pids="$(lsof -ti :$port 2>/dev/null || true)"
  if [[ -n "$pids" ]]; then
    echo "$pids" | xargs kill -9 2>/dev/null || true
    printf "   ${C_DIM}killed PIDs on :$port${C_RESET}\n"
  fi
done

# ── Start services ────────────────────────────────────────────────────
LOG_DIR="/tmp/biocycle-dev"
mkdir -p "$LOG_DIR"
: > "$LOG_DIR/streamlit.log"
: > "$LOG_DIR/landing.log"
: > "$LOG_DIR/agents.log"
: > "$LOG_DIR/ml-api.log"

banner "Starting services"

# Free ports 5001 too
lsof -ti :5001 2>/dev/null | xargs kill -9 2>/dev/null || true

step "FastAPI ml-api (:5001) → $LOG_DIR/ml-api.log"
(
  cd "$REPO_ROOT"
  "$PYTHON_BIN" artifacts/ml-api/main.py >"$LOG_DIR/ml-api.log" 2>&1
) &
ML_API_PID=$!

step "Streamlit legacy (:5000) → $LOG_DIR/streamlit.log"
(
  cd "$REPO_ROOT/artifacts/impulso-biocycle"
  "$STREAMLIT_BIN" run app.py \
    --server.port 5000 \
    --server.address 127.0.0.1 \
    --server.headless true \
    --browser.gatherUsageStats false \
    >"$LOG_DIR/streamlit.log" 2>&1
) &
STREAMLIT_PID=$!

step "Next.js landing + biocycle app (:3000) → $LOG_DIR/landing.log"
(
  cd "$REPO_ROOT/artifacts/landing"
  pnpm dev >"$LOG_DIR/landing.log" 2>&1
) &
LANDING_PID=$!

# Agents run once at startup in fixture mode (watch-style: every 60s)
step "Agents pipeline watch (fixture mode) → $LOG_DIR/agents.log"
(
  cd "$REPO_ROOT/artifacts/agents"
  while true; do
    echo "[$(date -u +%H:%M:%S)] === pipeline tick ===" >>"$LOG_DIR/agents.log"
    AGENT_FIXTURE_MODE=true MOCK_DB=true pnpm --silent scraper:dev >>"$LOG_DIR/agents.log" 2>&1 || true
    AGENT_FIXTURE_MODE=true MOCK_DB=true pnpm --silent classifier:dev >>"$LOG_DIR/agents.log" 2>&1 || true
    AGENT_FIXTURE_MODE=true MOCK_DB=true pnpm --silent synthesizer:dev >>"$LOG_DIR/agents.log" 2>&1 || true
    AGENT_FIXTURE_MODE=true MOCK_DB=true pnpm --silent competitive:dev >>"$LOG_DIR/agents.log" 2>&1 || true
    AGENT_FIXTURE_MODE=true MOCK_DB=true pnpm --silent feeder:dev >>"$LOG_DIR/agents.log" 2>&1 || true
    sleep 60
  done
) &
AGENTS_PID=$!

# ── Trap cleanup on exit ──────────────────────────────────────────────
cleanup() {
  printf "\n${C_YELLOW}▸ Stopping services...${C_RESET}\n"
  kill $STREAMLIT_PID $LANDING_PID $AGENTS_PID $ML_API_PID 2>/dev/null || true
  for port in 3000 5000 5001; do
    lsof -ti :$port 2>/dev/null | xargs kill -9 2>/dev/null || true
  done
  printf "${C_GREEN}✓ bye${C_RESET}\n"
}
trap cleanup EXIT INT TERM

# ── Wait for services to become reachable ─────────────────────────────
step "Waiting for services..."
deadline=$((SECONDS + 60))
streamlit_ok=0; landing_ok=0; mlapi_ok=0
while [[ $SECONDS -lt $deadline ]]; do
  if [[ $streamlit_ok -eq 0 ]] && curl -fsS -o /dev/null http://127.0.0.1:5000/ 2>/dev/null; then
    printf "${C_GREEN}✓${C_RESET} Streamlit up at http://127.0.0.1:5000\n"; streamlit_ok=1
  fi
  if [[ $landing_ok -eq 0 ]] && curl -fsS -o /dev/null http://127.0.0.1:3000/ 2>/dev/null; then
    printf "${C_GREEN}✓${C_RESET} Landing up at http://127.0.0.1:3000\n"; landing_ok=1
  fi
  if [[ $mlapi_ok -eq 0 ]] && curl -fsS -o /dev/null http://127.0.0.1:5001/healthz 2>/dev/null; then
    printf "${C_GREEN}✓${C_RESET} ml-api up at http://127.0.0.1:5001\n"; mlapi_ok=1
  fi
  if [[ $streamlit_ok -eq 1 && $landing_ok -eq 1 && $mlapi_ok -eq 1 ]]; then break; fi
  sleep 1
done

[[ $streamlit_ok -eq 0 ]] && warn "Streamlit did not respond. Check $LOG_DIR/streamlit.log"
[[ $landing_ok -eq 0 ]] && warn "Landing did not respond. Check $LOG_DIR/landing.log"
[[ $mlapi_ok -eq 0 ]] && warn "ml-api did not respond. Check $LOG_DIR/ml-api.log"

banner "Services ready"
printf "  ${C_CYAN}BioCycle app:${C_RESET}    http://127.0.0.1:3000/biocycle/inicio  ${C_DIM}← NUEVO · design system${C_RESET}\n"
printf "  ${C_CYAN}Landing ES:${C_RESET}      http://127.0.0.1:3000/es\n"
printf "  ${C_CYAN}Admin:${C_RESET}           http://127.0.0.1:3000/admin/insights\n"
printf "  ${C_CYAN}ml-api health:${C_RESET}   http://127.0.0.1:5001/healthz\n"
printf "  ${C_CYAN}Streamlit legacy:${C_RESET} http://127.0.0.1:5000\n"
printf "  ${C_CYAN}Landing (ES):${C_RESET}     http://127.0.0.1:3000/es\n"
printf "  ${C_CYAN}Admin insights:${C_RESET}   http://127.0.0.1:3000/admin/insights\n"
printf "  ${C_CYAN}API insights:${C_RESET}     http://127.0.0.1:3000/api/insights\n"
printf "\n  ${C_DIM}Logs tail:${C_RESET}        tail -f $LOG_DIR/*.log\n"
printf "  ${C_DIM}Stop all:${C_RESET}         Ctrl+C\n\n"

# ── Tail logs in the foreground ───────────────────────────────────────
exec tail -f "$LOG_DIR/streamlit.log" "$LOG_DIR/landing.log" "$LOG_DIR/agents.log" "$LOG_DIR/ml-api.log"
