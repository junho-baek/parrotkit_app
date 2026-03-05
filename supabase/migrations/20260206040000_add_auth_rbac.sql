create table if not exists public.profiles (
    id uuid primary key references auth.users on delete cascade,
    meta jsonb default '{}'::jsonb,
    created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id);
create table if not exists public.user_roles (
    user_id uuid primary key references auth.users on delete cascade,
    role text not null default 'user',
    created_at timestamptz default now()
);
alter table public.user_roles enable row level security;
create policy "user_roles_select_own"
on public.user_roles for select
using (auth.uid() = user_id);
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.profiles (id)
    values (new.id)
    on conflict (id) do nothing;
    insert into public.user_roles (user_id, role)
    values (new.id, 'user')
    on conflict (user_id) do nothing;
    return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    claims jsonb;
    user_role text;
begin
    claims := coalesce(event->'claims', '{}'::jsonb);
    select role into user_role
    from public.user_roles
    where user_id = (event->>'user_id')::uuid;
    if user_role is null then
        user_role := 'user';
    end if;
    claims := jsonb_set(claims, '{role}', to_jsonb(user_role), true);
    event := jsonb_set(event, '{claims}', claims, true);
    return event;
end;
$$;
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
