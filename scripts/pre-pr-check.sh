#!/usr/bin/env bash
# scripts/pre-pr-check.sh
# Run this before opening any PR. Exits non-zero if any gate fails.
# Called by: npm run pre-pr
# Called automatically by: Claude Code agents (CLAUDE.md §6)

set -euo pipefail

PASS=0
FAIL=0
WARNINGS=()

red()    { printf '\033[0;31m%s\033[0m\n' "$*"; }
green()  { printf '\033[0;32m%s\033[0m\n' "$*"; }
yellow() { printf '\033[0;33m%s\033[0m\n' "$*"; }
bold()   { printf '\033[1m%s\033[0m\n' "$*"; }

check() {
  local label="$1"; shift
  if "$@" >/dev/null 2>&1; then
    green "  [PASS] $label"
    PASS=$((PASS + 1))
  else
    red   "  [FAIL] $label"
    FAIL=$((FAIL + 1))
  fi
}

warn() {
  local label="$1"
  yellow "  [WARN] $label"
  WARNINGS+=("$label")
}

bold "=== Pre-PR Gate ==="
echo ""

# ── 1. Git state ───────────────────────────────────────────────────────────────
bold "-- Git state"
check "Working tree is clean" git diff --quiet
check "No untracked files staged" bash -c 'test -z "$(git ls-files --others --exclude-standard)"'

# ── 2. Branch is not main/master ──────────────────────────────────────────────
bold "-- Branch"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [[ "$CURRENT_BRANCH" == "main" || "$CURRENT_BRANCH" == "master" ]]; then
  red "  [FAIL] Currently on protected branch: $CURRENT_BRANCH"
  FAIL=$((FAIL + 1))
else
  green "  [PASS] On feature branch: $CURRENT_BRANCH"
  PASS=$((PASS + 1))
fi

# ── 3. Secret scanning ────────────────────────────────────────────────────────
bold "-- Secret scanning"
SECRET_PATTERNS='(password|secret|api_key|apikey|auth_token|private_key|access_token)\s*[:=]\s*["\x27][^"\x27]{6,}'
if git diff origin/main...HEAD 2>/dev/null | grep -iE "$SECRET_PATTERNS" >/dev/null 2>&1; then
  red "  [FAIL] Potential secrets found in diff — review before pushing"
  FAIL=$((FAIL + 1))
else
  check "No obvious secrets in diff" true
fi

if git diff --cached --name-only 2>/dev/null | grep -E '\.env$|\.env\.' >/dev/null 2>&1; then
  red "  [FAIL] .env file is staged — never commit secrets"
  FAIL=$((FAIL + 1))
else
  check "No .env files staged" true
fi

# ── 4. Lint + type-check ──────────────────────────────────────────────────────
bold "-- Lint & types"
check "ESLint + tsc --noEmit" npm run lint

# ── 5. Tests ──────────────────────────────────────────────────────────────────
bold "-- Tests"
check "Test suite passes" npm test

# ── 6. Production build ───────────────────────────────────────────────────────
bold "-- Build"
check "next build succeeds" npm run build

# ── 7. Debug artifacts ────────────────────────────────────────────────────────
bold "-- Artifacts"
DEBUG_PATTERNS='console\.log\|debugger;\|TODO.*REMOVE\|FIXME.*REMOVE'
if git diff origin/main...HEAD 2>/dev/null | grep -E "$DEBUG_PATTERNS" >/dev/null 2>&1; then
  warn "Debug statements or TODO-REMOVE markers found in diff"
else
  check "No debug artifacts in diff" true
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
bold "=== Results ==="
green "  Passed:   $PASS"
if [[ $FAIL -gt 0 ]]; then
  red "  Failed:   $FAIL"
fi
if [[ ${#WARNINGS[@]} -gt 0 ]]; then
  yellow "  Warnings: ${#WARNINGS[@]}"
  for w in "${WARNINGS[@]}"; do
    yellow "    - $w"
  done
fi

echo ""
if [[ $FAIL -gt 0 ]]; then
  red "PRE-PR CHECK FAILED — fix the issues above before opening a PR."
  exit 1
else
  green "PRE-PR CHECK PASSED — safe to open PR."
  exit 0
fi
