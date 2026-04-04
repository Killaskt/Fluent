# Fluent — Project Summary (v2)



## What Is This?



A Duolingo-style mobile app that teaches people how to actually use AI in their lives and work. Gamified, self-paced, streak-based — built for the massive audience that knows AI matters but feels frozen and doesn't know where to start.



---



## The Problem



There's a gap between awareness and action that almost no product addresses well:



- **80% of U.S. adults** want to learn AI (edX, Fall 2025)
- **54%** say AI skills are critical for their career
- **Only 4%** are actually pursuing AI education
- **50%** are more concerned than excited about AI — up from 37% in 2021 (Pew, March 2026)
- Of those who DO take AI training, only **42%** can identify where AI would actually help their job (DataCamp, 2026)



People aren't lacking information. They're lacking a structured, personal, low-friction path that connects AI to their actual life. Existing resources are blog posts, YouTube tutorials, and traditional online courses — none of which create habits or sustained engagement.



---



## The Insight



AI has put tech-savvy and non-technical people in the same boat. A marketing director and a junior developer are equally confused about agents, MCP, and which tool to pick. This means one product can serve both audiences with shared foundations and diverging paths — which is unusual and valuable.



The second insight: the frozen feeling comes from AI content being organized around technology ("here's what GPT-4 does") rather than around the learner ("here's how AI helps YOU write emails faster"). The entry point needs to be their life, not the tech.



---



## The Product: "Fluent"



**Tagline concept:** Become fluent in AI.



The name borrows the language-learning metaphor directly from Duolingo. "I'm getting fluent in AI" is a shareable identity. Your profile says something like "Fluent in AI for Marketing — Level 12," which is specific enough to brag about and immediately understood.



### Core Experience



- **Duolingo mechanics:** Daily streaks, XP, skill trees, badges, daily challenges, optional leaderboards
- **Bite-sized lessons:** Under 5 minutes each, designed to feel completable and satisfying (see Lesson Micro-Design below)
- **Role-based entry:** Onboarding asks "what do you do?" and immediately shows AI applied to that context before teaching any fundamentals
- **Self-paced:** No cohorts, no deadlines. Learn at your own speed with gentle streak nudges



### Lesson Micro-Design



This is the actual product. Every lesson follows the same rhythm so the user always knows what to expect:



**Step 1 — Concept (60-90 seconds)**

One idea, explained plainly. No jargon unless the jargon IS the lesson. Uses a concrete analogy or comparison the user already understands. Delivered as short text with one visual/diagram max. The rule: if you can't explain it in 3 short paragraphs, split it into two lessons.



**Step 2 — See It (60 seconds)**

A concrete example of the concept in action. For prompting lessons, this is a before/after (bad prompt → good prompt → AI output). For tool lessons, this is a screenshot or short walkthrough. For concept lessons, this is a real-world scenario. The user watches, they don't do anything yet.



**Step 3 — Try It (90-120 seconds)**

The user does something. This is the critical piece. Types include:



- **Prompt challenge:** Given a scenario, write a prompt. AI evaluates it and shows what a better version would produce.
- **Pick the best:** Two or three AI outputs shown — pick which one is better and why.
- **Spot the problem:** An AI output with a hallucination or error — find it.
- **Match it:** Match tools to use cases, prompting techniques to scenarios, etc.
- **Mini-task:** Open [tool] and do [specific small thing]. Screenshot or self-report completion.



**Step 4 — Lock It (30-45 seconds)**

A quick check — 1-2 multiple choice or fill-in-the-blank questions that confirm the concept stuck. Fast, low-friction, gives the user the "I got it" feeling.



**Total lesson time: 4-5 minutes.** Every lesson ends with XP earned, progress updated, and a nudge toward the next lesson or a "great stopping point" if they've hit their daily goal.



### Monetization



- **Free tier:** Fundamentals course + role-based quick-start (the viral loop — everyone can begin, build a streak, and share progress)
- **Premium ($9-15/month or $60-80/year):** Full role tracks, all tool electives, advanced content, streak freezes, bonus features



### Platform (MVP)



- **PWA (Progressive Web App)** for fastest time-to-launch — works on phones via browser, no app store approval needed
- Convert to React Native or Flutter for native iOS/Android once validated
- Push notifications for streaks may require native eventually, but PWA gets you started



---



## Competitive Moat



Content alone isn't defensible. Here's what is:



**1. The Pace Problem Is the Moat**

AI curriculum has a half-life of 3-4 months before pieces go stale. That's a nightmare for blogs and Udemy courses, but an advantage for an app with an update pipeline. If Fluent has a system where modules get versioned, deprecated content gets flagged, and new tool launches turn into new electives within weeks — that operational discipline is the moat. Nobody writing static courses can keep up. The product is the curriculum-as-a-living-thing.



How this works in practice: each lesson has a "last verified" date. A background process flags lessons where the underlying tool has had a major update. Stale lessons get a banner ("this lesson is being updated") and get prioritized in the content queue. Users see freshness, not rot. A "What's New" feed ties curriculum updates to real AI news — "Claude just launched X, we added a lesson on it."



**2. Onboarding Data Flywheel**

Once thousands of people answer "what do you do" and "what have you tried," you have a dataset about AI adoption patterns that nobody else has. That informs what you build next faster than competitors can guess. You know which roles are most underserved, which tools people are most confused by, which lessons have the highest drop-off. This compounds over time.



**3. The Habit Loop**

A blog post has zero switching cost. An app where you have a 47-day streak, Level 14 status, and 12 badges has enormous switching cost — not because of lock-in, but because of identity. "I'm a Fluent user" becomes part of how people see themselves, same as "I'm on a 200-day Duolingo streak." This is hard to replicate because it requires both good content AND good product design AND time for users to build investment.



---



## Curriculum Architecture



```
         ┌──────────────────────────┐
         │    ONBOARDING SURVEY     │
         │  "What do you do?"       │
         │  + AI awareness quiz     │
         └────────────┬─────────────┘
                      │
         ┌────────────▼─────────────┐
         │   ROLE-BASED QUICK-START │
         │  (5-10 min, immediate    │
         │   value for YOUR context)│
         └────────────┬─────────────┘
                      │
         ┌────────────▼─────────────┐
         │      FUNDAMENTALS        │
         │   (Now motivated by      │
         │    what they just saw)   │
         └────────────┬─────────────┘
                      │
         ┌────────────▼─────────────┐
         │      ROLE TRACKS         │
         │  Office · Marketing ·    │
         │  Student · Creative ·    │
         │  Developer               │
         └────────────┬─────────────┘
                      │
         ┌────────────▼─────────────┐
         │     TOOL ELECTIVES       │
         │  Claude · ChatGPT ·      │
         │  Cursor · VS Code ·      │
         │  NotebookLM · etc.       │
         │  (Unlock as tracks       │
         │   introduce tools)       │
         └──────────────────────────┘
```



Developer is now a role track, not a separate branch. It shares fundamentals with everyone else, but its role-specific content is more technical (APIs, agents, MCP, dev environments). This makes the architecture cleaner — one path with role variations, not a fork.



### Key Structural Decisions



1. **Role-based quick-start before fundamentals.** The frozen person doesn't need "AI is important" — they know that. They need "here's AI doing something useful for YOU right now." Motivation first, theory second.

2. **Role tracks replace the generic "User Track."** Instead of one broad "AI Power User" course, content is wrapped in the learner's context. Same underlying skills (prompting, tool selection, workflow design), different examples and exercises.

3. **Developer is a role, not a fork.** A developer answering "What do you do?" gets the dev quick-start and dev role track, just like a marketer gets the marketing version. The architecture is flat — one flow with role variations.

4. **Tool electives are neutral at the base, opinionated in depth.** Fundamentals teach tool-agnostic concepts. Electives go deep on specific products. A Claude elective is naturally longer than a ChatGPT one — that's fine, they're separate modules.



---



## Course Inventory



### Onboarding Survey (5-8 questions)



Places the user into a starting level (Beginner / Intermediate) and recommends a role track. Questions cover: what they do (role), technical comfort, AI tool exposure, goals, time commitment, and motivation ("why now?").



### Role-Based Quick-Starts (~10 min each)



One per role. Immediately shows AI doing something useful:



- **Office/Admin:** "Let AI handle the email you've been avoiding"
- **Marketing:** "Write three headline variants in 30 seconds"
- **Student:** "Turn your messy notes into study materials"
- **Creative:** "Brainstorm 20 ideas for your stuck project"
- **Developer:** "Fix this bug with an AI pair programmer"



### Fundamentals (~2 weeks at 15-20 min/day)



| Module | Topic | Core Question | Lessons |
|--------|-------|---------------|---------|
| F1 | The AI Landscape | "What actually exists and what does it do?" | ~6 lessons |
| F2 | Prompting | "How do I talk to AI to get useful results?" | ~8 lessons |
| F3 | The AI Toolkit | "Which tool should I use and when?" | ~5 lessons |
| F4 | Staying Current | "How do I keep up without drowning?" | ~4 lessons |



### Role Tracks (~4-8 weeks each, varies by depth)



Built around practical use cases. Same underlying skills, different wrapping:



- **AI for Office Work** — email, documents, scheduling, data, meetings
- **AI for Marketing** — copy, research, campaigns, analytics, content
- **AI for Students** — studying, writing, research, projects
- **AI for Creative Work** — ideation, writing, visual, music, iteration
- **AI for Developers** — dev environment, APIs, agents, MCP, AI-native app design, advanced patterns



### Tool Electives (~1-2 weeks each)



| Elective | Scope |
|----------|-------|
| Claude Deep Dive | Claude.ai, Claude Code, Cowork, Projects, API — largest elective |
| ChatGPT & OpenAI | ChatGPT, GPTs, Codex — shorter |
| Cursor Mastery | Agent mode, .cursorrules, multi-file editing |
| VS Code + AI | Copilot, extensions, the "vanilla" AI coding setup |
| NotebookLM & Research | Research workflows, document analysis |
| Open Source AI | Local models, Ollama, Hugging Face |
| MCP & Tool Building | Building MCP servers, connecting AI to custom tools |



---



## Gamification System



- **Daily streak** with visual counter and streak freezes as rewards
- **XP** earned per lesson, exercise, and challenge (scaled by difficulty)
- **Skill tree** showing progress through the curriculum as a visual map
- **Badges** — "First Prompt," "Streak Week," "Tool Explorer," "Agent Architect," etc.
- **Daily challenge** — 2-3 minute quick exercise (prompt challenge, spot-the-hallucination quiz, mini task)
- **AI News of the Day** — curated daily snippet tied to curriculum concepts
- **Progress milestones** — "You're more AI-fluent than 70% of people who started this month"
- **Optional leaderboard** — weekly, compare XP with friends or global learners



---



## MVP Definition



### What's In MVP



| Component | Scope | Why |
|-----------|-------|-----|
| Onboarding survey | Full (all questions) | Takes 2 min to build, drives personalization |
| Quick-start | Office/Admin only | Broadest audience, simplest to demonstrate |
| Fundamentals | All 4 modules, ~23 lessons | This is the free tier — it needs to be complete |
| Role track | AI for Office Work | Most universal, highest addressable market |
| Tool elective | Claude Deep Dive | Richest ecosystem, most content to work with |
| Gamification | Streaks, XP, progress bar, daily challenge | Minimum viable habit loop |
| Platform | PWA (mobile-responsive web app) | Fastest to ship, no app store gatekeeping |



### What's NOT in MVP



- Other role quick-starts and tracks (Marketing, Student, Creative, Developer)
- Other tool electives
- Leaderboards and social features
- Video content (text + interactive only for v1)
- AI tutor / in-app chatbot
- Community features
- Native mobile app



### Sprint Roadmap (Post-MVP)



| Sprint | Content |
|--------|---------|
| 1 | Marketing quick-start + track, ChatGPT elective |
| 2 | Developer quick-start + first 2 dev modules (environment + APIs) |
| 3 | Student + Creative quick-starts and tracks |
| 4 | Remaining dev modules (agents, app design, advanced) |
| 5 | Cursor, VS Code, NotebookLM electives |
| 6 | Leaderboards, social sharing, badges v2 |
| 7 | AI tutor feature, community |
| 8+ | New electives as landscape evolves, open source, MCP |



---



## Market Validation Plan



### Phase 1: Landing Page + Ads (Before Building)



**Goal:** Validate demand and measure willingness-to-pay before writing a line of app code.



**The Landing Page:**

A single page at getfluent.ai (or similar) with:

- The headline: "Become fluent in AI. 5 minutes a day."
- The value prop: role-based, gamified, keeps you current
- A "What do you do?" selector (Office, Marketing, Student, Creative, Developer) — this IS your onboarding survey, but it's also market research
- Email capture: "Join the waitlist — early members get Fluent free for 3 months"
- Optional: "Would you pay $9/month for this?" as a quick survey after signup



**The Ads:**

Run small-budget ($200-500) paid tests across 2-3 channels:



| Channel | Why | Target |
|---------|-----|--------|
| Instagram/Facebook | Where casuals are; visual format works for Duolingo-style branding | 25-45, interested in career development, tech, productivity |
| Google Ads | Capture active intent ("how to learn AI", "AI for my job") | Search terms related to AI learning |
| Reddit | r/artificial, r/ChatGPT, r/productivity — high-intent community | Comments and engagement signal real interest |



**What You're Measuring:**

- **Waitlist conversion rate:** What % of landing page visitors sign up? (>5% = strong signal)
- **Role distribution:** Which roles sign up most? This tells you which track to build second.
- **Willingness to pay:** If you ask about pricing, what % say yes to $9/month?
- **Cost per signup:** How much does it cost to acquire a waitlist email? (<$3 = good for this category)
- **Ad copy performance:** Which messaging resonates? "Don't get left behind" vs "5 minutes a day" vs "AI for [role]"



**Timeline:** 1-2 weeks to build the landing page, 1-2 weeks to run ads, then you have data.



### Phase 2: Beta (After Building MVP)



- Invite top 100-200 waitlist signups to beta
- Measure: daily active usage, streak retention (day 7, day 14, day 30), lesson completion rates, NPS
- Iterate on content and UX based on where people drop off
- Ask: "Would you pay for this?" after they've used it free for 2 weeks



---



## Market Validation Summary



| Signal | Data Point | Source |
|--------|-----------|--------|
| Demand exists | 80% of U.S. adults want to learn AI | edX Fall 2025 |
| Action gap is massive | 54% say it's critical, only 4% are doing it | edX Fall 2025 |
| Emotional state is fear-driven | 50% more concerned than excited about AI | Pew March 2026 |
| Motivation is "staying relevant" | 32% learn to stay relevant, not because employer requires it | edX Fall 2025 |
| Current training fails | Only 42% can apply AI training to their job | DataCamp 2026 |
| Self-paced preferred | 51% want self-directed learning | edX Fall 2025 |
| Gamification proven | Duolingo users 3x more likely to return daily with streaks | Duolingo data |
| No direct competitor | Zero gamified AI-literacy apps found in research | Market scan April 2026 |
| Dev audience validated | 95% of engineers use AI weekly, 46% love Claude Code | Pragmatic Engineer 2026 |



---



## Open Questions (Reduced)



1. **Hands-on exercises** — For MVP, direct users to external tools (open ChatGPT/Claude in a new tab). Embedded sandbox is a v2 feature.
2. **The name** — "Fluent" is the working name. Needs trademark/domain check before the landing page goes up.
3. **Video content** — Not in MVP. Revisit after beta feedback. Text + interactive may be sufficient.
