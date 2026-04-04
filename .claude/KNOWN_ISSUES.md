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
| 2026-04-04 | Landing page timing | Deferred. Build app first; use real streak screenshot as social proof when ready. |
| 2026-04-04 | Flutter vs web | Deferred. Next.js web-first for speed. Revisit native app after habit loop is validated. |
| 2026-04-04 | "Try It" evaluation method | Claude API rubric scorer chosen (evaluates prompt quality, not output). Revisit: open-ended experimentation linking to external tool may be better pedagogy post-beta. |
| 2026-04-04 | Platform: PWA vs native | Start with Next.js web app. Flutter native deferred to post-validation sprint. |
| 2026-04-04 | Stack | Next.js (App Router) + Supabase (`@supabase/ssr`) + Claude API + Tailwind + shadcn/ui. |
| 2026-04-04 | Auth | Email/password + Google OAuth via Supabase. Sign-up routes to waitlist. `is_admin = true` grants full access. |
| 2026-04-04 | Content storage | JSON files in repo (`content/lessons/`). No CMS or admin UI in MVP. User authors all 46 lessons. |
| 2026-04-04 | Monorepo | Single repo for app + future landing page. Landing page added when app is validated. |
