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
│   │   ├── sign-in/page.tsx      # Email/pass + Google OAuth sign-in ✓
│   │   ├── sign-up/page.tsx      # Creates account → redirects to /waitlist ✓
│   │   └── waitlist/page.tsx     # "You're on the list" holding page ✓
│   ├── (app)/                    # Protected routes — gated by middleware.ts
│   │   ├── dashboard/page.tsx    # Home screen stub (Phase 2+) ✓
│   │   ├── learn/[lessonId]/     # Lesson engine — Phase 3
│   │   ├── track/[trackId]/      # Skill tree / module map — Phase 5
│   │   └── profile/              # User XP, badges — Phase 5
│   ├── api/
│   │   └── score-prompt/         # POST — Claude prompt scorer — Phase 8
│   ├── auth/callback/route.ts    # OAuth + email confirmation handler ✓
│   ├── layout.tsx                # Root layout (fonts, metadata) ✓
│   └── page.tsx                  # Root → redirects to /sign-in ✓
│
├── middleware.ts                 # Entry point — calls lib/supabase/middleware.ts ✓
│
├── components/
│   ├── lesson/                   # Phase 3 — lesson step components
│   ├── gamification/             # Phase 5 — streak, XP bar, badges
│   └── ui/                       # shadcn/ui components (run: npx shadcn@latest add <name>)
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts             # createClient() for Server Components + Route Handlers ✓
│   │   ├── client.ts             # createClient() for Client Components only ✓
│   │   └── middleware.ts         # updateSession() — auth check + waitlist gate logic ✓
│   ├── claude.ts                 # scorePrompt() — Phase 8
│   ├── xp.ts                     # awardXP(), calculateStreak(), BADGE_DEFINITIONS — Phase 4
│   └── content.ts                # loadLesson(), loadTrack() — Phase 3
│
├── content/
│   └── lessons/                  # One JSON file per lesson (46 total for MVP)
│       ├── _schema.json          # JSON schema — read before authoring — Phase 2
│       └── ...
│
├── supabase/
│   └── migrations/
│       └── 001_initial.sql       # profiles + user_progress, RLS, triggers ✓
│
├── types/
│   ├── index.ts                  # Lesson, Step, UserProgress, Badge, Profile types ✓
│   └── database.ts               # Supabase DB type stub (regen: npx supabase gen types) ✓
│
├── jest.config.ts / jest.setup.ts  # Test config ✓
├── tailwind.config.ts            # Brand colours at theme.extend.colors.brand ✓
├── next.config.ts                # Next.js config ✓
├── .env.example                  # All required env vars ✓
│
├── docs/                         # CHECK HERE before assuming something isn't defined
│   ├── ProjectSummary.md         # Product vision, curriculum architecture, monetization
│   └── first-office-course.md    # All 46 lesson breakdowns
│
└── .claude/
    ├── CODEBASE.md               # This file — keep it current
    ├── KNOWN_ISSUES.md           # Open decisions and deferred items
    └── settings.json             # Claude Code hooks and permissions
```

**✓ = built and working. No mark = planned, not yet built.**

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
