# Known Issues and Open Decisions

Tracks unresolved agent behavior questions and architectural decisions.
Each item should include the date raised and enough context to make a decision.
Remove rows once resolved and codify the decision in CLAUDE.md.

---

## Open

| Date | Issue | Context |
|---|---|---|
| — | No open issues | — |

---

## Resolved

| Date | Issue | Decision |
|---|---|---|
| 2026-04-04 | Default branch name | `main` is the default branch. All feature branches cut from `main`, PRs merge back to `main`. |
| 2026-04-04 | Known issues location | Moved to `.claude/KNOWN_ISSUES.md` to keep CLAUDE.md concise as the log grows. |
| 2026-04-04 | `PreToolUse` hook uses `python3` for JSON parsing — may fail silently if not present | Accepted for now; revisit if environment lacks `python3`. |
