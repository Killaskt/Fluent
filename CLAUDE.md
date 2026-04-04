# CLAUDE.md — Fluent Project Agent Guide

This file governs all Claude Code sessions and sub-agent behavior for the Fluent project.
It is the authoritative source of truth for architecture decisions, agent conventions, and
code quality standards. Read it fully before taking action.

### Every session must do this first

1. Read **`.claude/CODEBASE.md`** — it's the living map of the repo. Use it instead of
   exploring the file tree. It tells you where things are and where to add new things.
2. Check **`docs/`** for any relevant planning documents before assuming something isn't
   defined. The product vision, curriculum, and architecture decisions live there.
3. Check **`.claude/KNOWN_ISSUES.md`** for open decisions that may affect your task.

---

## 1. Core Principles

- **Minimal footprint**: Do only what the task requires. No speculative abstractions, no
  extra features, no cleanup of untouched code.
- **Bring decisions to the user**: When facing ambiguity, architectural trade-offs, or
  risks—stop and ask. Do not guess at intent.
- **Measure twice, cut once**: Prefer reversible actions. Destructive or shared-state
  operations require explicit user confirmation.
- **Tests are mandatory**: Every new function, module, or behavior change must have tests
  written before a PR is opened.
- **Run before you open**: All tests and linters must pass locally before pushing or
  creating a PR.

---

## 2. Multi-Agent Architecture

### 2.1 When to Spawn Sub-Agents

Spawn a sub-agent when:
- The task is independently scoped and doesn't need results from another in-progress task.
- The work would consume significant context (deep file exploration, large test runs, web
  research).
- You need to parallelize truly independent workstreams (e.g., writing tests while
  implementing a feature).

Do NOT spawn a sub-agent when:
- A single Glob, Grep, or Read call would suffice.
- The task depends on results not yet returned by another agent.
- The overhead of coordination exceeds the benefit.

### 2.2 Git Worktrees for All Code-Writing Sub-Agents

**Any sub-agent that writes or edits files must run in an isolated git worktree.**

Pass `isolation: "worktree"` when spawning:

```
Agent({
  subagent_type: "general-purpose",
  isolation: "worktree",
  prompt: "..."
})
```

Why: parallel agents writing to the same working tree cause conflicts and corrupt state.
A worktree gives each agent its own isolated copy of the repo on a throwaway branch.
The orchestrator merges completed worktree branches back to the feature branch.

Research-only agents (Explore, read-only general-purpose) do NOT need worktrees.

### 2.3 Sub-Agent Responsibilities

Each sub-agent must be briefed with:

```
1. What the goal is and why it matters in the broader task.
2. What has already been tried or ruled out.
3. Which files or modules are in scope.
4. Whether it should write code or only do research.
5. What format to return results in.
```

Sub-agents must **not**:
- Open PRs unless explicitly told to.
- Push to branches unless explicitly told to.
- Make assumptions about intent — surface ambiguity and return it to the orchestrator.

### 2.4 Orchestrator Responsibilities

The orchestrating agent (top-level Claude Code session) is responsible for:
- Synthesizing sub-agent output before acting on it.
- Making all Git operations (commit, push, PR creation).
- Deciding whether to spawn, re-use, or terminate sub-agents.
- Escalating unresolved ambiguity to the user via `AskUserQuestion`.

### 2.5 Avoiding Duplicate Work

- Never run the same search or read in both the orchestrator and a sub-agent.
- If a sub-agent is assigned research, the orchestrator must wait for results before
  proceeding with implementation.
- Track outstanding sub-agents mentally (or via TodoWrite) to avoid overlap.

---

## 3. Context and Token Management

### 3.1 Protect the Main Context

- **Read `.claude/CODEBASE.md` before any file exploration.** It documents where
  everything lives. Use it to target reads directly instead of sweeping directories.
- **Check `docs/` before assuming something is undefined.** Product decisions, curriculum
  design, and architecture rationale are documented there.
- Offload large file reads, broad codebase exploration, and multi-step research to
  sub-agents with `subagent_type: Explore` or `general-purpose`.
- Prefer targeted tool calls (Glob, Grep with specific paths) over broad sweeps.
- Summarize sub-agent results before incorporating them; do not paste raw output verbatim
  into working memory when a summary suffices.

### 3.2 Read Discipline

- Read only the file sections you need. Use `offset` and `limit` on large files.
- Do not re-read files already read in the session unless the file has changed.
- When searching, use the most specific query possible to minimize result size.

### 3.3 Long-Running Sessions

- Use `TodoWrite` to track state across long tasks. This acts as your external working
  memory and reduces the cognitive load on the context window.
- Mark tasks complete immediately when done — not in batches.
- If the session approaches context limits (many files read, long tool outputs), prefer
  spawning a new sub-agent with a focused, scoped brief over continuing in the main thread.

### 3.4 Token-Efficient Patterns

| Situation | Preferred approach |
|---|---|
| Orient to the codebase | Read `.claude/CODEBASE.md` first — do not sweep directories |
| Find a class/function | `Glob` or `Grep` with specific pattern |
| Understand a module | Read only the relevant file sections |
| Broad exploration | `Agent` with `subagent_type: Explore` |
| Web research | `Agent` with `subagent_type: general-purpose` |
| Codebase-wide refactor | Plan first with `subagent_type: Plan`, then implement |
| After adding files/modules | Update `.claude/CODEBASE.md` immediately |

---

## 4. Code Quality Standards

### 4.1 General Rules

- Match the style, naming conventions, and patterns already present in the codebase.
- No dead code, commented-out blocks, or backwards-compatibility shims for unused paths.
- No helper abstractions for one-time use. Three similar lines is better than a premature
  abstraction.
- No docstrings, type annotations, or comments added to code you didn't change.
- Only add comments where logic is non-obvious; never describe what the code does, only why.

### 4.2 Security

- Never introduce command injection, SQL injection, XSS, or OWASP top-10 vulnerabilities.
- Validate only at system boundaries (user input, external API responses).
- Do not hardcode secrets, tokens, or credentials. Use environment variables.
- If insecure code is written accidentally, fix it before moving on.

### 4.3 Error Handling

- Only handle errors that can actually occur. Trust internal guarantees.
- Do not add fallbacks for impossible states.
- Surface real errors clearly; don't silently swallow them.

### 4.4 Dependencies

- Do not add new dependencies without discussing with the user first.
- Prefer standard library or existing project dependencies.

---

## 5. Testing Requirements

### 5.1 Mandatory Coverage

Every PR must include tests for:
- All new public functions and methods.
- All new API endpoints or data transformations.
- All bug fixes (regression test proving the bug is fixed).

### 5.2 Test-First for New Code

- Write the test alongside the implementation, not after.
- Sub-agents assigned implementation should also write tests, or a dedicated test-writing
  sub-agent should run in parallel.

### 5.3 Test Quality

- Tests must be deterministic. No reliance on timing, network, or external state unless
  properly mocked.
- Test names must describe the behavior being verified, not the implementation detail.
- Do not write tests that only check that code runs without error — assert actual outcomes.

### 5.4 Running Tests

Always use `npm run` — never invoke the underlying tools directly:

```bash
npm run lint      # ESLint + tsc --noEmit
npm test          # Jest test suite
npm run check     # lint + test combined
npm run build     # Production build (catches errors dev mode misses)
npm run pre-pr    # Full pre-PR gate (runs scripts/pre-pr-check.sh)
```

---

## 6. Pre-PR Checklist

Run the automated gate first:

```bash
npm run pre-pr
```

`scripts/pre-pr-check.sh` enforces:

- [ ] All new code has tests written and passing.
- [ ] The full test suite passes (`npm test`).
- [ ] ESLint and TypeScript report no errors (`npm run lint`).
- [ ] Production build succeeds (`npm run build`).
- [ ] No secrets, credentials, or debug artifacts are staged.
- [ ] The branch is up to date with the base branch (no avoidable merge conflicts).
- [ ] The PR title is under 70 characters and describes the change, not the work done.
- [ ] The PR body uses `.github/pull_request_template.md` (auto-applied by GitHub).
- [ ] No unrelated files are included in the diff.

If `npm run pre-pr` exits non-zero, fix all failures before pushing.
Do not use `--no-verify` to bypass hooks. Do not open a PR with a failing gate.

---

## 7. Git Conventions

### 7.1 Branching

- All development happens on the designated feature branch for the session (see session
  context at the top of each Claude Code run).
- Never push directly to `main` or `master`.
- Never force-push without explicit user approval.

### 7.2 Commit Messages

- Lead with a present-tense verb: `Add`, `Fix`, `Refactor`, `Remove`, `Update`.
- First line: 50 characters or fewer, describes the change.
- Body (if needed): explain *why*, not *what*. Wrap at 72 characters.
- Always append the session URL at the end of the commit body.

### 7.3 Push Protocol

```bash
git push -u origin <branch-name>
```

On network failure, retry with exponential backoff: 2s, 4s, 8s, 16s. After 4 failures,
report to the user.

---

## 8. Escalation Policy

The following situations require stopping and asking the user before proceeding:

| Situation | Why |
|---|---|
| Ambiguous intent in the task description | Wrong assumption = wasted work or broken code |
| Architectural trade-off with no clear winner | User's priorities should decide |
| A new dependency is needed | User controls the dependency surface |
| A destructive git operation is required | Cannot be undone |
| Test suite fails and root cause is unclear | Don't ship broken code |
| A sub-agent returns conflicting information | Synthesis requires human judgment |
| A task scope is larger than initially estimated | User should re-approve scope |
| Security-sensitive code paths are touched | User should be aware |

Use `AskUserQuestion` to surface these. Provide enough context in the question that the
user can answer without scrolling back through the conversation.

---

## 9. Agent Roster (Update as Agents Are Added)

| Agent type | Use for |
|---|---|
| `Explore` | Codebase exploration, pattern searches, understanding structure |
| `Plan` | Designing implementation strategy before writing code |
| `general-purpose` | Web research, multi-step investigations, complex file searches |
| `claude-code-guide` | Questions about Claude Code features, API, or SDK |

---

## 10. Known Issues and Open Decisions

Tracked in **`.claude/KNOWN_ISSUES.md`** — open that file to view, add, or resolve items.
Keep CLAUDE.md focused on conventions; put all issue tracking there.

---

*Last updated: 2026-04-04. Makefile removed — all tasks now use `npm run`. Update this file whenever agent conventions change. Log decisions in `.claude/KNOWN_ISSUES.md`.*
