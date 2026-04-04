# Fluent — Standard build targets
# Agents must use these targets rather than invoking tools directly.
# Update the recipes below once the stack is decided.
# All targets must exit non-zero on failure.

.PHONY: help install test lint format check pre-pr clean

# ── Configuration ────────────────────────────────────────────────────────────
# Override via: make test TEST_CMD="pytest -x"
TEST_CMD  ?= echo "[WARN] No test command configured. Set TEST_CMD in Makefile."
LINT_CMD  ?= echo "[WARN] No lint command configured. Set LINT_CMD in Makefile."
FMT_CMD   ?= echo "[WARN] No format command configured. Set FMT_CMD in Makefile."

# ── Targets ───────────────────────────────────────────────────────────────────

help:           ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install:        ## Install project dependencies
	@echo "[install] Installing dependencies..."
	@# Replace with: pip install -e ".[dev]"  OR  npm ci  OR  go mod download
	@echo "[install] Done."

test:           ## Run the full test suite
	@echo "[test] Running tests..."
	@$(TEST_CMD)

lint:           ## Run linter (no auto-fix)
	@echo "[lint] Running linter..."
	@$(LINT_CMD)

format:         ## Auto-format source files
	@echo "[format] Formatting..."
	@$(FMT_CMD)

check: lint test ## Run lint + tests (used in CI)

pre-pr:         ## Full pre-PR gate — must pass before opening any PR
	@echo "=== Pre-PR Check ==="
	@bash scripts/pre-pr-check.sh

clean:          ## Remove build artifacts and caches
	@echo "[clean] Cleaning..."
	@rm -rf dist/ build/ .pytest_cache/ __pycache__/ *.egg-info node_modules/.cache
	@echo "[clean] Done."
