alter table public.references
  add column if not exists transcript jsonb not null default '[]'::jsonb,
  add column if not exists transcript_source text not null default 'none',
  add column if not exists transcript_language text,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb;

alter table public.recipes
  add column if not exists analysis_metadata jsonb not null default '{}'::jsonb,
  add column if not exists script_source text not null default 'default';
