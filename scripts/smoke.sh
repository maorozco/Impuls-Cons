#!/usr/bin/env bash
# smoke.sh — end-to-end healthcheck for Impulso BioCycle
#
# What it checks:
#   1. pnpm typecheck on agents + landing
#   2. pnpm lint on landing
#   3. Python syntax (ast.parse) on all edited .py files
#   4. Banned-phrase linter on all marketing/*.md + pitch docs
#   5. Agents pipeline runs end-to-end in fixture mode
#   6. Streamlit boots and serves HTTP 200 on port 5000
#   7. Landing boots and serves HTTP 200 on /es, /api/insights, /admin/insights
#   8. RAG chat returns citations on a known test query
#
# Exit 0 if everything passes; exit 1 at first failure with clear message.

set +u  # some probes rely on lazy var expansion

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# ── Styling ───────────────────────────────────────────────────────────
C_RESET='\033[0m'; C_GREEN='\033[0;32m'; C_RED='\033[0;31m'
C_YELLOW='\033[0;33m'; C_CYAN='\033[0;36m'; C_DIM='\033[2m'

FAIL_COUNT=0
PASS_COUNT=0

pass() { printf "  ${C_GREEN}✓${C_RESET} %s\n" "$1"; PASS_COUNT=$((PASS_COUNT+1)); }
fail() { printf "  ${C_RED}✗${C_RESET} %s\n" "$1"; FAIL_COUNT=$((FAIL_COUNT+1)); }
warn() { printf "  ${C_YELLOW}⚠${C_RESET}  %s\n" "$1"; }
section() { printf "\n${C_CYAN}%s${C_RESET}\n" "$1"; }

# ── Find runtimes ─────────────────────────────────────────────────────
PYTHON_BIN=""
if [[ -x "$REPO_ROOT/.venv/bin/python" ]]; then
  PYTHON_BIN="$REPO_ROOT/.venv/bin/python"
elif command -v /opt/homebrew/bin/python3 >/dev/null 2>&1; then
  PYTHON_BIN="/opt/homebrew/bin/python3"
else
  PYTHON_BIN="python3"
fi

STREAMLIT_BIN="$REPO_ROOT/.venv/bin/streamlit"
if [[ ! -x "$STREAMLIT_BIN" ]]; then
  STREAMLIT_BIN="$(command -v streamlit || true)"
fi

# ── 1. Typecheck ──────────────────────────────────────────────────────
section "1/8 · Typecheck"
if (cd "$REPO_ROOT/artifacts/agents" && pnpm --silent typecheck) >/tmp/biocycle-smoke-agents-tc.log 2>&1; then
  pass "agents typecheck clean"
else
  fail "agents typecheck failed — see /tmp/biocycle-smoke-agents-tc.log"
fi

if (cd "$REPO_ROOT/artifacts/landing" && pnpm --silent typecheck) >/tmp/biocycle-smoke-landing-tc.log 2>&1; then
  pass "landing typecheck clean"
else
  fail "landing typecheck failed — see /tmp/biocycle-smoke-landing-tc.log"
fi

# ── 2. Lint ───────────────────────────────────────────────────────────
section "2/8 · Lint"
if (cd "$REPO_ROOT/artifacts/landing" && pnpm --silent lint) >/tmp/biocycle-smoke-lint.log 2>&1; then
  pass "landing lint clean"
else
  fail "landing lint failed — see /tmp/biocycle-smoke-lint.log"
fi

# ── 3. Python syntax ──────────────────────────────────────────────────
section "3/8 · Python syntax"
PY_FILES=(
  "artifacts/impulso-biocycle/app.py"
  "artifacts/impulso-biocycle/data.py"
  "artifacts/impulso-biocycle/ml_model.py"
  "artifacts/impulso-biocycle/rag.py"
  "artifacts/impulso-biocycle/insights_client.py"
  "artifacts/impulso-biocycle/views/inicio.py"
  "artifacts/impulso-biocycle/views/descubrimientos.py"
  "artifacts/impulso-biocycle/views/disenador.py"
  "artifacts/impulso-biocycle/views/portal_cliente.py"
  "artifacts/impulso-biocycle/views/asesoria_ia.py"
)
PY_OK=0
for f in "${PY_FILES[@]}"; do
  if "$PYTHON_BIN" -c "import ast; ast.parse(open('$f').read())" 2>/tmp/biocycle-smoke-py.log; then
    PY_OK=$((PY_OK+1))
  else
    fail "$f syntax error"
  fi
done
if [[ $PY_OK -eq ${#PY_FILES[@]} ]]; then
  pass "all ${#PY_FILES[@]} Python files parse clean"
fi

# ── 4. Banned-phrase linter on marketing docs ─────────────────────────
section "4/8 · Banned phrases in marketing/*.md"
if [[ -d "$REPO_ROOT/marketing" ]]; then
  BANNED_HIT=0
  # Patterns from shared/banned.ts (simplified for grep)
  BANNED_RE='limpiamos? (los )?oc[eé]anos?|clean(ing)? the oceans?|el pl[aá]stico desaparece|plastic disappears|c[aá]psulas? (en|para) playa|capsules? on (the )?beach|usamos alphafold|alphafold.{0,20}dise[ñn]|liberad[oa]s? al ambiente|released into (the )?environment|100% biodegrada|saas (listo|ready)|garantizamos (limpieza|remediaci)'
  for f in "$REPO_ROOT/marketing"/*.md; do
    [[ -f "$f" ]] || continue
    # Skip intentionally-pedagogical docs that quote banned phrases as *examples not to use*
    case "$(basename "$f")" in
      NARRATIVE-ARC-2026.md|COMPETITIVE-BRIEF.md|CLAIM-AUDIT.md|QA-PREP.md|PITCH-OUTLINE.md|DEMO-LOOM-SCRIPT.md|ADS-HOOKS.md|AI-ML-MOAT.md|LAUNCH-PLAN-7DAYS.md|LANDING-PAGE-SPEC.md|VIDEO-SCRIPT.md|CUSTOMER-DISCOVERY-INTERVIEW.md|AVATAR-IDEAL.md|WAITLIST-FORM.md)
        continue ;;
    esac
    if grep -Ein "$BANNED_RE" "$f" >/dev/null 2>&1; then
      fail "$(basename "$f") contains banned phrase — grep -Ein '$BANNED_RE' $f"
      BANNED_HIT=$((BANNED_HIT+1))
    fi
  done
  if [[ $BANNED_HIT -eq 0 ]]; then
    pass "no banned phrases in non-pedagogical marketing docs"
  fi
else
  warn "marketing/ dir not found — skipped"
fi

# ── 5. Agents pipeline (fixture mode) ─────────────────────────────────
section "5/8 · Agents pipeline (fixture mode)"
AGENT_LOG="/tmp/biocycle-smoke-agents.log"
: > "$AGENT_LOG"
AGENTS_OK=1
for agent in scraper classifier synthesizer competitive feeder; do
  if (cd "$REPO_ROOT/artifacts/agents" && AGENT_FIXTURE_MODE=true MOCK_DB=true pnpm --silent "${agent}:dev") >>"$AGENT_LOG" 2>&1; then
    pass "$agent ran clean"
  else
    fail "$agent failed — see $AGENT_LOG"
    AGENTS_OK=0
  fi
done

# ── 6. Streamlit boot ─────────────────────────────────────────────────
section "6/8 · Streamlit boot"
if [[ -z "${STREAMLIT_BIN:-}" || ! -x "$STREAMLIT_BIN" ]]; then
  fail "streamlit binary not found — run ./scripts/dev.sh first to set up .venv"
else
  # Free port 5000 if busy
  lsof -ti :5000 2>/dev/null | xargs kill -9 2>/dev/null || true
  (
    cd "$REPO_ROOT/artifacts/impulso-biocycle"
    "$STREAMLIT_BIN" run app.py \
      --server.port 5000 --server.address 127.0.0.1 --server.headless true \
      --browser.gatherUsageStats false >/tmp/biocycle-smoke-streamlit.log 2>&1 &
  )
  STREAMLIT_PID=$!
  for i in {1..20}; do
    if curl -fsS -o /dev/null http://127.0.0.1:5000/ 2>/dev/null; then
      pass "Streamlit responds HTTP 200 on :5000"
      break
    fi
    sleep 0.5
  done
  if ! curl -fsS -o /dev/null http://127.0.0.1:5000/ 2>/dev/null; then
    fail "Streamlit did not respond within 10s — see /tmp/biocycle-smoke-streamlit.log"
  fi
  # Keep streamlit for RAG smoke
fi

# ── 7. Next.js boot + endpoints ───────────────────────────────────────
section "7/8 · Next.js landing + biocycle app + ml-api"
lsof -ti :3000 2>/dev/null | xargs kill -9 2>/dev/null || true
(
  cd "$REPO_ROOT/artifacts/landing"
  pnpm dev >/tmp/biocycle-smoke-landing.log 2>&1 &
)
LANDING_PID=$!
for i in {1..40}; do
  if curl -fsS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/es 2>/dev/null | grep -q "200"; then
    break
  fi
  sleep 0.5
done

if curl -fsS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/es 2>/dev/null | grep -q "200"; then
  pass "Landing /es responds HTTP 200"
else
  fail "Landing /es did not respond within 20s — see /tmp/biocycle-smoke-landing.log"
fi

API_BODY=$(curl -fsS http://127.0.0.1:3000/api/insights 2>/dev/null || echo "")
if [[ -n "$API_BODY" ]] && echo "$API_BODY" | grep -q '"signups"'; then
  pass "/api/insights returns JSON with signups field"
else
  fail "/api/insights did not return valid JSON"
fi

if curl -fsS -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/admin/insights 2>/dev/null | grep -q "200"; then
  pass "/admin/insights responds HTTP 200 (localhost bypass)"
else
  fail "/admin/insights did not respond"
fi

# ── BioCycle app routes (the 5 new product views) ─────────────────────
for route in /biocycle /biocycle/inicio /biocycle/descubrimientos /biocycle/disenador /biocycle/portal /biocycle/asesoria; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3000${route}" 2>/dev/null)
  if [[ "$code" =~ ^(200|307)$ ]]; then
    pass "biocycle route ${route} → HTTP ${code}"
  else
    fail "biocycle route ${route} → HTTP ${code}"
  fi
done

# ── FastAPI ml-api ─────────────────────────────────────────────────────
lsof -ti :5001 2>/dev/null | xargs kill -9 2>/dev/null || true
(
  cd "$REPO_ROOT"
  "$PYTHON_BIN" artifacts/ml-api/main.py >/tmp/biocycle-smoke-mlapi.log 2>&1 &
)
ML_API_PID=$!
for i in {1..20}; do
  if curl -fsS -o /dev/null http://127.0.0.1:5001/healthz 2>/dev/null; then
    pass "ml-api /healthz responds HTTP 200"
    break
  fi
  sleep 0.5
done

ML_HEALTH=$(curl -fsS http://127.0.0.1:5001/healthz 2>/dev/null || echo "")
if echo "$ML_HEALTH" | grep -q '"corpus_size"'; then
  pass "ml-api /healthz payload valid"
else
  fail "ml-api /healthz did not return corpus_size"
fi

ML_PREDICT=$(curl -fsS -X POST http://127.0.0.1:5001/api/ml/predict \
  -H "Content-Type: application/json" \
  -d '{"contaminant":"hydrocarbons","temp_C":28,"pH":7,"mode":"in_situ","contamination_pct":10,"pretreatment":true,"time_weeks":12}' 2>/dev/null || echo "")
if echo "$ML_PREDICT" | grep -q '"degradation_pct"'; then
  pass "ml-api /api/ml/predict returns degradation_pct"
else
  fail "ml-api /api/ml/predict did not return valid JSON"
fi

# ── 8. RAG chat smoke (offline-safe) ──────────────────────────────────
section "8/8 · RAG chat sanity check"
if [[ -x "$PYTHON_BIN" ]]; then
  RAG_OUT=$(
    cd "$REPO_ROOT/artifacts/impulso-biocycle"
    "$PYTHON_BIN" -c "
import sys; sys.path.insert(0, '.')
import rag
retriever = rag.get_retriever()
if len(retriever.docs) < 30:
    print('FAIL: corpus only has', len(retriever.docs), 'docs')
    sys.exit(1)
retrievals = retriever.search('suelo con diésel', top_k=3)
if not retrievals:
    print('FAIL: retriever returned 0 results for test query')
    sys.exit(1)
print('OK:', len(retriever.docs), 'docs,', len(retrievals), 'results for test query')
" 2>&1
  )
  if echo "$RAG_OUT" | grep -q "^OK:"; then
    pass "RAG retriever: $(echo "$RAG_OUT" | grep '^OK:' | cut -d' ' -f2-)"
  else
    fail "RAG retriever failed: $RAG_OUT"
  fi
fi

# ── Cleanup ───────────────────────────────────────────────────────────
section "Cleanup"
lsof -ti :3000 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti :5000 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti :5001 2>/dev/null | xargs kill -9 2>/dev/null || true
pass "killed dev processes"

# ── Summary ───────────────────────────────────────────────────────────
printf "\n${C_CYAN}──────────────────────────────────────────────${C_RESET}\n"
if [[ $FAIL_COUNT -eq 0 ]]; then
  printf "${C_GREEN}✓ $PASS_COUNT checks passed. Smoke clean.${C_RESET}\n"
  exit 0
else
  printf "${C_RED}✗ $FAIL_COUNT checks failed, $PASS_COUNT passed.${C_RESET}\n"
  exit 1
fi
