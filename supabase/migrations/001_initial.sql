-- Migration: 001_initial
-- Creates the profiles and user_progress tables with RLS.
-- A trigger auto-creates a profile row on every new auth.users signup.

-- ── Profiles ─────────────────────────────────────────────────────────────────

create table public.profiles (
  id        uuid references auth.users(id) on delete cascade primary key,
  email     text not null,
  is_admin  boolean not null default false,
  waitlist  boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── User progress ─────────────────────────────────────────────────────────────

create table public.user_progress (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade not null unique,
  completed_lessons   text[] not null default '{}',
  total_xp            integer not null default 0,
  current_streak      integer not null default 0,
  longest_streak      integer not null default 0,
  last_activity_date  date,
  earned_badges       text[] not null default '{}',
  updated_at          timestamptz not null default now()
);

alter table public.user_progress enable row level security;

create policy "Users can view their own progress"
  on public.user_progress for select
  using (auth.uid() = user_id);

create policy "Users can update their own progress"
  on public.user_progress for update
  using (auth.uid() = user_id);

create policy "Users can insert their own progress"
  on public.user_progress for insert
  with check (auth.uid() = user_id);

-- Auto-create progress row on signup
create or replace function public.handle_new_user_progress()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.user_progress (user_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_profile_created
  after insert on public.profiles
  for each row execute procedure public.handle_new_user_progress();
