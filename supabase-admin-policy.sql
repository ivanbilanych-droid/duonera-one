-- DUONERA: read-only access for the private administration.
-- Run this file once in Supabase Dashboard > SQL Editor.
-- Before running it, create the user info@duonera.cz in Authentication > Users.

alter table public.duonera_leads enable row level security;
alter table public.duonera_profiles enable row level security;

grant select on table public.duonera_leads to authenticated;
grant select on table public.duonera_profiles to authenticated;

drop policy if exists "duonera_admin_read_leads" on public.duonera_leads;
create policy "duonera_admin_read_leads"
on public.duonera_leads
for select
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
);

drop policy if exists "duonera_admin_read_profiles" on public.duonera_profiles;
create policy "duonera_admin_read_profiles"
on public.duonera_profiles
for select
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
);
