create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  username text not null unique,
  interests text[] not null default '{}',
  onboarding_completed boolean not null default false,
  subscription_id text,
  subscription_status text not null default 'free',
  plan_type text not null default 'free',
  subscription_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.references (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  source_url text not null,
  platform text,
  video_id text,
  niche text,
  goal text,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  reference_id uuid references public.references(id) on delete set null,
  video_url text not null,
  scenes jsonb not null,
  total_scenes integer not null default 0,
  captured_scene_ids integer[] not null default '{}',
  match_results jsonb not null default '{}'::jsonb,
  captured_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.recipe_captures (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  scene_id integer not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now(),
  unique(recipe_id, scene_id)
);

create table if not exists public.event_logs (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  page text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_recipes_user_created_at on public.recipes(user_id, created_at desc);
create index if not exists idx_event_logs_created_at on public.event_logs(created_at desc);

alter table public.profiles enable row level security;
alter table public.references enable row level security;
alter table public.recipes enable row level security;
alter table public.recipe_captures enable row level security;
alter table public.event_logs enable row level security;

create policy if not exists "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

create policy if not exists "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy if not exists "references_crud_own"
  on public.references for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "recipes_crud_own"
  on public.recipes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "recipe_captures_crud_own"
  on public.recipe_captures for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy if not exists "event_logs_insert_own"
  on public.event_logs for insert
  with check (auth.uid() = user_id or user_id is null);

create policy if not exists "event_logs_select_own"
  on public.event_logs for select
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public)
values ('scene-captures', 'scene-captures', false)
on conflict (id) do nothing;

create policy if not exists "scene_captures_select_own"
  on storage.objects for select
  using (
    bucket_id = 'scene-captures'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "scene_captures_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'scene-captures'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "scene_captures_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'scene-captures'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
