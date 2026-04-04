# Codebase Map

**Read this before exploring the repo. It saves you token-expensive directory sweeps.**
**Update it every time you add, move, or remove a file, module, or convention.**

---

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js (App Router) | Server components by default. No Pages Router. |
| Auth + DB | Supabase | Use `@supabase/ssr` — NOT the legacy `auth-helpers-nextjs` |
| AI | Claude API | Via `@anthropic-ai/sdk`. Used for "Try It" prompt scoring. |
| Styling | Tailwind CSS + shadcn/ui | shadcn components live in `components/ui/` |
| Language | TypeScript | Strict mode. No `any`. |
| Testing | Jest + React Testing Library | `make test` runs the suite |
| Linting | ESLint + Prettier | `make lint` — must pass before any PR |

---

## Directory Map

```
/
├── app/                          # Next.js App Router root
│   ├── (auth)/                   # Unprotected routes (no session required)
│   │   ├── sign-in/              # Email/pass + Google OAuth sign-in
│   │   ├── sign-up/              # Redirects to /waitlist after account creation
│   │   └── waitlist/             # "You're on the list" holding page
│   ├── (app)/                    # Protected routes — gated by middleware.ts
│   │   ├── dashboard/            # Home screen: streak, daily challenge, resume
│   │   ├── learn/[lessonId]/     # Lesson engine — renders any lesson from JSON
│   │   ├── track/[trackId]/      # Skill tree / module map for a track
│   │   └── profile/              # User XP, badges, progress summary
│   ├── api/                      # API route handlers (server-side only)
│   │   └── score-prompt/         # POST — sends user prompt to Claude, returns score JSON
│   ├── layout.tsx                # Root layout (fonts, providers)
│   └── middleware.ts             # Auth check + waitlist gate (runs on every (app)/* route)
│
├── components/
│   ├── lesson/                   # Lesson step components
│   │   ├── ConceptStep.tsx       # Step 1 — text + optional diagram
│   │   ├── SeeItStep.tsx         # Step 2 — example display (before/after, screenshot, scenario)
│   │   ├── TryItStep.tsx         # Step 3 — interactive exercise types
│   │   └── LockItStep.tsx        # Step 4 — quick knowledge check
│   ├── gamification/
│   │   ├── StreakCounter.tsx      # Flame icon + day count
│   │   ├── XPBar.tsx             # Progress bar + XP total
│   │   └── BadgeDisplay.tsx      # Badge grid / earned badge celebration
│   └── ui/                       # shadcn/ui generated components (do not hand-edit)
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # createServerClient() — use in Server Components + Route Handlers
│   │   ├── client.ts             # createBrowserClient() — use in Client Components only
│   │   └── middleware.ts         # createMiddlewareClient() — used in middleware.ts
│   ├── claude.ts                 # scorePrompt(userPrompt, rubric) → ScoreResult
│   ├── xp.ts                     # awardXP(), calculateStreak(), BADGE_DEFINITIONS
│   └── content.ts                # loadLesson(id), loadTrack(id) — reads from content/lessons/
│
├── content/
│   └── lessons/                  # One JSON file per lesson (46 total for MVP)
│       ├── _schema.json          # JSON schema — read this before authoring a lesson
│       ├── qs-1.json             # Quick-Start lesson 1
│       ├── qs-2.json
│       ├── qs-3.json
│       ├── f1-1.json             # Fundamentals Module 1, Lesson 1
│       └── ...                   # (see Lesson ID Reference below)
│
├── supabase/
│   └── migrations/               # SQL migration files — never edit existing ones, always add new
│
├── types/
│   └── index.ts                  # Shared TypeScript types: Lesson, Step, UserProgress, Badge, etc.
│
├── docs/                         # Project documentation — CHECK HERE before assuming something
│   ├── ProjectSummary.md         # Full product vision, curriculum architecture, monetization
│   └── first-office-course.md    # Lesson-by-lesson MVP content breakdown (all 46 lessons)
│
└── .claude/
    ├── CODEBASE.md               # This file — keep it current
    ├── KNOWN_ISSUES.md           # Open decisions and deferred items
    └── settings.json             # Claude Code hooks and permissions
```

---

## Lesson ID Reference

| ID prefix | Section | Count |
|---|---|---|
| `qs-{n}` | Quick-Start (Office/Admin) | 3 |
| `f1-{n}` | Fundamentals: What Exists | 6 |
| `f2-{n}` | Fundamentals: Prompting | 8 |
| `f3-{n}` | Fundamentals: Which Tool | 5 |
| `f4-{n}` | Fundamentals: Keeping Up | 4 |
| `ow-1-{n}` | Office Work: Email & Comms | 5 |
| `ow-2-{n}` | Office Work: Documents | 5 |
| `ow-3-{n}` | Office Work: Meetings | 5 |
| `ow-4-{n}` | Office Work: Data & Org | 5 |

Full lesson content spec: `docs/first-office-course.md`

---

## Auth + Access Logic

```
Sign up (any method)  →  user created  →  waitlist = true, is_admin = false  →  /waitlist
Sign in (waitlist)    →  is_admin = false  →  /waitlist
Sign in (admin)       →  is_admin = true   →  /dashboard
```

- `is_admin` lives on the Supabase `profiles` table (not in auth.users metadata)
- Middleware at `app/middleware.ts` enforces this on every `(app)/*` route
- To grant admin: `UPDATE profiles SET is_admin = true WHERE email = '...'` in Supabase SQL editor

---

## Key Conventions

- **Server vs Client components**: Default to Server. Add `"use client"` only when you need browser APIs, event handlers, or React hooks. Never fetch data in Client Components — use Server Components + pass props.
- **Supabase client**: Use `lib/supabase/server.ts` in Server Components and Route Handlers. Use `lib/supabase/client.ts` only in Client Components.
- **API routes**: Only for operations that can't be Server Actions — e.g., the Claude API call in `api/score-prompt/` (needs request/response streaming control).
- **Lesson rendering**: The lesson engine in `app/(app)/learn/[lessonId]/` reads a lesson JSON, determines step types, and renders the matching step component. Add new step types to `components/lesson/` and register them in the engine.
- **Content changes**: Edit JSON files in `content/lessons/`. Never hardcode lesson content in components.
- **Migrations**: Always add a new file in `supabase/migrations/`. Never modify existing migration files.
- **Types**: All shared types go in `types/index.ts`. Co-locate component-only types with the component.

---

## Environment Variables

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # Server-only. Never expose to client.

# Claude API
ANTHROPIC_API_KEY=              # Server-only. Never expose to client.

# App
NEXT_PUBLIC_APP_URL=            # Used for OAuth redirect URLs
```

All secrets via environment variables only. No hardcoding. See `.env.example` for the full list.

---

## Where to Add Things

| What you're adding | Where it goes |
|---|---|
| New lesson content | `content/lessons/{id}.json` following `_schema.json` |
| New lesson step type | `components/lesson/` + register in the lesson engine |
| New page/route | `app/(app)/` (protected) or `app/(auth)/` (public) |
| New API endpoint | `app/api/{name}/route.ts` |
| New shared type | `types/index.ts` |
| New DB table/column | New file in `supabase/migrations/` |
| New utility function | `lib/` — group by concern (supabase, claude, xp, content) |
| New shadcn component | Run `npx shadcn@latest add {component}` — it goes to `components/ui/` |
| New gamification badge | Add to `BADGE_DEFINITIONS` in `lib/xp.ts` |
| Project-level docs | `docs/` |
| Open decisions / issues | `.claude/KNOWN_ISSUES.md` |

---

## Updating This File

**You must update this file when you:**
- Add a new directory
- Add a new significant file (components, lib modules, API routes)
- Change a convention
- Add a new environment variable
- Change where a type of thing lives

Update the relevant section inline. Keep descriptions to one line. This file is a map, not a tutorial.
