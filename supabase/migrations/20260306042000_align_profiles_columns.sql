alter table public.profiles
  add column if not exists email text,
  add column if not exists username text,
  add column if not exists interests text[] not null default '{}'::text[],
  add column if not exists onboarding_completed boolean not null default false,
  add column if not exists subscription_id text,
  add column if not exists subscription_status text not null default 'free',
  add column if not exists plan_type text not null default 'free',
  add column if not exists subscription_ends_at timestamptz,
  add column if not exists updated_at timestamptz not null default now();

update public.profiles p
set
  email = coalesce(p.email, lower(u.email)),
  username = coalesce(
    p.username,
    nullif(lower(u.raw_user_meta_data->>'username'), ''),
    nullif(split_part(lower(u.email), '@', 1), ''),
    'user_' || replace(p.id::text, '-', '')
  ),
  updated_at = now()
from auth.users u
where p.id = u.id;

update public.profiles
set email = coalesce(email, id::text || '@legacy.local')
where email is null;

update public.profiles
set username = coalesce(username, 'user_' || replace(id::text, '-', ''))
where username is null;

alter table public.profiles
  alter column email set not null,
  alter column username set not null;

create unique index if not exists profiles_email_unique on public.profiles(email);
create unique index if not exists profiles_username_unique on public.profiles(username);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (
      id,
      email,
      username,
      interests,
      onboarding_completed,
      subscription_status,
      plan_type,
      updated_at
    )
    values (
      new.id,
      lower(new.email),
      coalesce(
        nullif(lower(new.raw_user_meta_data->>'username'), ''),
        nullif(split_part(lower(new.email), '@', 1), ''),
        'user_' || replace(new.id::text, '-', '')
      ),
      '{}'::text[],
      false,
      'free',
      'free',
      now()
    )
    on conflict (id) do update
      set email = excluded.email,
          username = excluded.username,
          updated_at = now();

    insert into public.user_roles (user_id, role)
    values (new.id, 'user')
    on conflict (user_id) do nothing;

    return new;
end;
$$;
