# Fluent — Standard build targets
# Agents must use these targets rather than invoking tools directly.
# Update the recipes below once the stack is decided.
# All targets must exit non-zero on failure.

.PHONY: help install test lint format check pre-pr clean

# ── Targets ───────────────────────────────────────────────────────────────────

help:           ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*##' $(MAKEFILE_LIST) | \
	  awk 'BEGIN {FS = ":.*##"}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

install:        ## Install project dependencies
	npm ci

test:           ## Run the full test suite
	npm test

lint:           ## Run linter (no auto-fix)
	npm run lint && npm run type-check

format:         ## Auto-format source files (no-op — ESLint handles formatting)
	npm run lint -- --fix

check: lint test ## Run lint + tests (used in CI)

pre-pr:         ## Full pre-PR gate — must pass before opening any PR
	@echo "=== Pre-PR Check ==="
	@bash scripts/pre-pr-check.sh

clean:          ## Remove build artifacts and caches
	@rm -rf .next/ node_modules/.cache
