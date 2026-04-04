-- Migration: 002_lesson_progress
-- Adds per-lesson progress tracking and placement test results.

-- ── Lesson progress ───────────────────────────────────────────────────────────

create table public.lesson_progress (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users(id) on delete cascade not null,
  lesson_id        text not null,
  completed_at     timestamptz not null default now(),
  xp_earned        integer not null default 0,
  try_it_attempts  integer not null default 0,
  tested_out       boolean not null default false,
  unique (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

create policy "Users can view their own lesson progress"
  on public.lesson_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert their own lesson progress"
  on public.lesson_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own lesson progress"
  on public.lesson_progress for update
  using (auth.uid() = user_id);

-- ── Placement test results ────────────────────────────────────────────────────

create table public.placement_test_results (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  module_id  text not null,
  passed     boolean not null,
  score      numeric(4,3) not null,
  taken_at   timestamptz not null default now(),
  unique (user_id, module_id)
);

alter table public.placement_test_results enable row level security;

create policy "Users can view their own placement test results"
  on public.placement_test_results for select
  using (auth.uid() = user_id);

create policy "Users can insert their own placement test results"
  on public.placement_test_results for insert
  with check (auth.uid() = user_id);
