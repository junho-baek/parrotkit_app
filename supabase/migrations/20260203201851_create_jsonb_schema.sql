-- Supabase JSONB-centric schema for deundeun
-- Generated: 2026-02-03

create extension if not exists "pgcrypto";
create table if not exists plans (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'draft',
  input jsonb not null default '{}'::jsonb,
  brief jsonb not null default '{}'::jsonb,
  asset_refs jsonb not null default '{}'::jsonb,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  type text not null,
  url text not null,
  source_url text,
  segment_index int,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references plans(id) on delete cascade,
  name text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists plans_status_created_at_idx
  on plans (status, created_at desc);
create index if not exists assets_plan_type_created_at_idx
  on assets (plan_id, type, created_at desc);
create index if not exists assets_plan_segment_idx
  on assets (plan_id, segment_index);
create index if not exists events_plan_created_at_idx
  on events (plan_id, created_at desc);
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
do $$
begin
  if not exists (
    select 1
    from pg_trigger
    where tgname = 'plans_set_updated_at'
  ) then
    create trigger plans_set_updated_at
    before update on plans
    for each row execute procedure set_updated_at();
  end if;
end;
$$;
