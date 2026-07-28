-- DUONERA V11: member accounts, limited discovery, choices and mutual matches.
-- Run once in Supabase Dashboard > SQL Editor before publishing the V11 files.

create extension if not exists pgcrypto;

alter table public.duonera_leads
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.duonera_profiles
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists consent_discovery boolean not null default false,
  add column if not exists is_approved boolean not null default false,
  add column if not exists is_discoverable boolean not null default false,
  add column if not exists public_photo_paths text[] not null default '{}';

create unique index if not exists duonera_leads_user_id_unique
  on public.duonera_leads(user_id)
  where user_id is not null;

create unique index if not exists duonera_profiles_user_id_unique
  on public.duonera_profiles(user_id)
  where user_id is not null;

create table if not exists public.duonera_choices (
  id uuid primary key default gen_random_uuid(),
  chooser_user_id uuid not null references auth.users(id) on delete cascade,
  chosen_profile_id uuid not null references public.duonera_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (chooser_user_id, chosen_profile_id)
);

create table if not exists public.duonera_premium_selections (
  id uuid primary key default gen_random_uuid(),
  member_user_id uuid not null references auth.users(id) on delete cascade,
  candidate_profile_id uuid not null references public.duonera_profiles(id) on delete cascade,
  position smallint not null check (position between 1 and 3),
  selection_note text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (member_user_id, position)
);

alter table public.duonera_choices enable row level security;
alter table public.duonera_premium_selections enable row level security;

grant select on public.duonera_leads to authenticated;
grant select, insert, update on public.duonera_profiles to authenticated;
grant select on public.duonera_choices to authenticated;
grant select, insert, update, delete on public.duonera_premium_selections to authenticated;

drop policy if exists "duonera_member_read_own_lead" on public.duonera_leads;
create policy "duonera_member_read_own_lead"
on public.duonera_leads
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "duonera_admin_read_member_leads" on public.duonera_leads;
create policy "duonera_admin_read_member_leads"
on public.duonera_leads
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz');

drop policy if exists "duonera_member_read_own_profile" on public.duonera_profiles;
create policy "duonera_member_read_own_profile"
on public.duonera_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "duonera_admin_read_member_profiles" on public.duonera_profiles;
create policy "duonera_admin_read_member_profiles"
on public.duonera_profiles
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz');

drop policy if exists "duonera_member_insert_own_profile" on public.duonera_profiles;
create policy "duonera_member_insert_own_profile"
on public.duonera_profiles
for insert
to authenticated
with check (
  user_id = auth.uid()
  and is_approved = false
  and is_discoverable = false
  and coalesce(array_length(public_photo_paths, 1), 0) = 0
);

drop policy if exists "duonera_admin_update_member_profiles" on public.duonera_profiles;
create policy "duonera_admin_update_member_profiles"
on public.duonera_profiles
for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz');

drop policy if exists "duonera_member_read_own_choices" on public.duonera_choices;
create policy "duonera_member_read_own_choices"
on public.duonera_choices
for select
to authenticated
using (chooser_user_id = auth.uid());

drop policy if exists "duonera_member_read_premium_selection" on public.duonera_premium_selections;
create policy "duonera_member_read_premium_selection"
on public.duonera_premium_selections
for select
to authenticated
using (member_user_id = auth.uid());

drop policy if exists "duonera_admin_read_choices" on public.duonera_choices;
create policy "duonera_admin_read_choices"
on public.duonera_choices
for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz');

drop policy if exists "duonera_admin_manage_premium" on public.duonera_premium_selections;
create policy "duonera_admin_manage_premium"
on public.duonera_premium_selections
for all
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz')
with check (lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz');

-- A visitor sees only fields that are safe for the limited profile preview.
create or replace function public.duonera_discovery_profiles()
returns table (
  id uuid,
  first_name text,
  age integer,
  city text,
  country text,
  gender text,
  looking_for text,
  languages text[],
  height_cm integer,
  occupation text,
  relationship_status text,
  children text,
  smoking text,
  traits text[],
  interests text[],
  about_me text,
  relationship_goal text,
  public_photo_paths text[]
)
language sql
security definer
stable
set search_path = public
as $$
  select
    p.id,
    p.first_name,
    extract(year from age(current_date, p.birth_date))::integer,
    p.city,
    p.country,
    p.gender,
    p.looking_for,
    p.languages,
    p.height_cm,
    p.occupation,
    p.relationship_status,
    p.children,
    p.smoking,
    p.traits,
    p.interests,
    p.about_me,
    p.relationship_goal,
    p.public_photo_paths
  from public.duonera_profiles p
  where p.consent_discovery = true
    and p.is_approved = true
    and p.is_discoverable = true
    and coalesce(array_length(p.public_photo_paths, 1), 0) > 0
  order by p.created_at desc
  limit 12;
$$;

revoke all on function public.duonera_discovery_profiles() from public;
grant execute on function public.duonera_discovery_profiles() to anon, authenticated;

-- After e-mail verification, safely attach older lead/profile rows with the same e-mail.
create or replace function public.duonera_claim_registration()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  claimed_lead integer := 0;
  claimed_profile integer := 0;
begin
  if auth.uid() is null or current_email = '' then
    raise exception 'Authentication required';
  end if;

  if not exists (
    select 1 from public.duonera_leads where user_id = auth.uid()
  ) then
    update public.duonera_leads
    set user_id = auth.uid()
    where id = (
      select id
      from public.duonera_leads
      where user_id is null and lower(email) = current_email
      order by created_at desc
      limit 1
    );
    get diagnostics claimed_lead = row_count;
  end if;

  if not exists (
    select 1 from public.duonera_profiles where user_id = auth.uid()
  ) then
    update public.duonera_profiles
    set user_id = auth.uid()
    where id = (
      select id
      from public.duonera_profiles
      where user_id is null and lower(email) = current_email
      order by created_at desc
      limit 1
    );
    get diagnostics claimed_profile = row_count;
  end if;

  return jsonb_build_object(
    'lead_claimed', claimed_lead = 1,
    'profile_claimed', claimed_profile = 1
  );
end;
$$;

revoke all on function public.duonera_claim_registration() from public;
grant execute on function public.duonera_claim_registration() to authenticated;

create or replace function public.duonera_choose_profile(target_profile_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  own_profile_id uuid;
  target_user_id uuid;
  mutual_choice boolean;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  select id into own_profile_id
  from public.duonera_profiles
  where user_id = auth.uid()
  limit 1;

  if own_profile_id is null then
    raise exception 'Complete your profile first';
  end if;

  select user_id into target_user_id
  from public.duonera_profiles
  where id = target_profile_id
    and consent_discovery = true
    and is_approved = true
    and is_discoverable = true;

  if target_user_id is null or target_user_id = auth.uid() then
    raise exception 'Profile is not available';
  end if;

  insert into public.duonera_choices (chooser_user_id, chosen_profile_id)
  values (auth.uid(), target_profile_id)
  on conflict (chooser_user_id, chosen_profile_id) do nothing;

  select exists (
    select 1
    from public.duonera_choices reverse_choice
    where reverse_choice.chooser_user_id = target_user_id
      and reverse_choice.chosen_profile_id = own_profile_id
  ) into mutual_choice;

  return jsonb_build_object('selected', true, 'mutual', mutual_choice);
end;
$$;

revoke all on function public.duonera_choose_profile(uuid) from public;
grant execute on function public.duonera_choose_profile(uuid) to authenticated;

create or replace function public.duonera_remove_choice(target_profile_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.duonera_choices
  where chooser_user_id = auth.uid()
    and chosen_profile_id = target_profile_id;
$$;

revoke all on function public.duonera_remove_choice(uuid) from public;
grant execute on function public.duonera_remove_choice(uuid) to authenticated;

create or replace function public.duonera_my_choices()
returns table (
  chosen_profile_id uuid,
  is_mutual boolean
)
language sql
security definer
stable
set search_path = public
as $$
  select
    c.chosen_profile_id,
    exists (
      select 1
      from public.duonera_choices reverse_choice
      join public.duonera_profiles target_profile
        on target_profile.user_id = reverse_choice.chooser_user_id
      join public.duonera_profiles own_profile
        on own_profile.user_id = auth.uid()
      where target_profile.id = c.chosen_profile_id
        and reverse_choice.chosen_profile_id = own_profile.id
    ) as is_mutual
  from public.duonera_choices c
  where c.chooser_user_id = auth.uid();
$$;

revoke all on function public.duonera_my_choices() from public;
grant execute on function public.duonera_my_choices() to authenticated;

create or replace function public.duonera_my_premium_selection()
returns table (
  "position" smallint,
  selection_note text,
  profile_id uuid,
  first_name text,
  age integer,
  city text,
  country text,
  occupation text,
  traits text[],
  interests text[],
  about_me text,
  public_photo_paths text[]
)
language sql
security definer
stable
set search_path = public
as $$
  select
    s.position,
    s.selection_note,
    p.id,
    p.first_name,
    extract(year from age(current_date, p.birth_date))::integer,
    p.city,
    p.country,
    p.occupation,
    p.traits,
    p.interests,
    p.about_me,
    p.public_photo_paths
  from public.duonera_premium_selections s
  join public.duonera_profiles p on p.id = s.candidate_profile_id
  where s.member_user_id = auth.uid()
    and s.active = true
    and p.is_approved = true
  order by s.position;
$$;

revoke all on function public.duonera_my_premium_selection() from public;
grant execute on function public.duonera_my_premium_selection() to authenticated;

create or replace function public.duonera_admin_mutual_matches()
returns table (
  first_profile_id uuid,
  first_name text,
  first_email text,
  second_profile_id uuid,
  second_name text,
  second_email text,
  matched_at timestamptz
)
language sql
security definer
stable
set search_path = public
as $$
  select
    first_profile.id,
    first_profile.first_name,
    first_profile.email,
    second_profile.id,
    second_profile.first_name,
    second_profile.email,
    greatest(first_choice.created_at, second_choice.created_at)
  from public.duonera_choices first_choice
  join public.duonera_profiles first_profile
    on first_profile.user_id = first_choice.chooser_user_id
  join public.duonera_profiles second_profile
    on second_profile.id = first_choice.chosen_profile_id
  join public.duonera_choices second_choice
    on second_choice.chooser_user_id = second_profile.user_id
   and second_choice.chosen_profile_id = first_profile.id
  where lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
    and first_profile.id < second_profile.id
  order by greatest(first_choice.created_at, second_choice.created_at) desc;
$$;

revoke all on function public.duonera_admin_mutual_matches() from public;
grant execute on function public.duonera_admin_mutual_matches() to authenticated;

-- Private profile photos remain private. Members may upload/read only their own folder.
drop policy if exists "duonera_public_upload_profile_photos" on storage.objects;

drop policy if exists "duonera_member_upload_own_profile_photos" on storage.objects;
create policy "duonera_member_upload_own_profile_photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'duonera-profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
);

drop policy if exists "duonera_member_read_own_profile_photos" on storage.objects;
create policy "duonera_member_read_own_profile_photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'duonera-profile-photos'
  and (
    (storage.foldername(name))[1] = auth.uid()::text
    or exists (
      select 1
      from public.duonera_profiles p
      where p.user_id = auth.uid()
        and name = any(p.photo_paths)
    )
  )
);

-- Only photos explicitly approved for discovery are copied to this public bucket.
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'duonera-discovery-photos',
  'duonera-discovery-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "duonera_admin_manage_discovery_photos" on storage.objects;
create policy "duonera_admin_manage_discovery_photos"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'duonera-discovery-photos'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
)
with check (
  bucket_id = 'duonera-discovery-photos'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
);
