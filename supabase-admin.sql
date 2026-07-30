-- DUONERA private administration
-- Run once in the Supabase SQL editor for project lhoicaivkkyofirmtbsr.

create or replace function public.duonera_admin_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  result jsonb;
begin
  if current_email not in ('info@duonera.cz', 'ib.luxes@gmail.com') then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  select jsonb_build_object(
    'summary', jsonb_build_object(
      'leads_total', (select count(*) from public.duonera_leads),
      'profiles_total', (select count(*) from public.duonera_profiles),
      'pending_profiles', (select count(*) from public.duonera_profiles where not coalesce(is_approved, false)),
      'approved_profiles', (select count(*) from public.duonera_profiles where coalesce(is_approved, false))
    ),
    'profiles', coalesce((
      select jsonb_agg(to_jsonb(profile_row))
      from (
        select
          id,
          first_name,
          birth_date,
          gender,
          looking_for,
          city,
          country,
          email,
          status,
          is_approved,
          is_discoverable,
          source,
          created_at
        from public.duonera_profiles
        order by created_at desc
        limit 200
      ) profile_row
    ), '[]'::jsonb),
    'leads', coalesce((
      select jsonb_agg(to_jsonb(lead_row))
      from (
        select
          id,
          gender,
          looking_for,
          age,
          city,
          email,
          source,
          created_at
        from public.duonera_leads
        order by created_at desc
        limit 300
      ) lead_row
    ), '[]'::jsonb)
  ) into result;

  return result;
end;
$$;

revoke all on function public.duonera_admin_dashboard() from public;
grant execute on function public.duonera_admin_dashboard() to authenticated;

create or replace function public.duonera_admin_set_profile_state(
  target_profile_id uuid,
  approved boolean,
  discoverable boolean
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  current_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  updated_profile jsonb;
begin
  if current_email not in ('info@duonera.cz', 'ib.luxes@gmail.com') then
    raise exception 'Administrator access required' using errcode = '42501';
  end if;

  update public.duonera_profiles
  set
    is_approved = coalesce(approved, false),
    is_discoverable = coalesce(approved, false) and coalesce(discoverable, false),
    status = case
      when coalesce(approved, false) and coalesce(discoverable, false) then 'approved'
      when coalesce(approved, false) then 'hidden'
      else 'new'
    end
  where id = target_profile_id
  returning jsonb_build_object(
    'id', id,
    'is_approved', is_approved,
    'is_discoverable', is_discoverable,
    'status', status
  ) into updated_profile;

  if updated_profile is null then
    raise exception 'Profile not found' using errcode = 'P0002';
  end if;

  return updated_profile;
end;
$$;

revoke all on function public.duonera_admin_set_profile_state(uuid, boolean, boolean) from public;
grant execute on function public.duonera_admin_set_profile_state(uuid, boolean, boolean) to authenticated;
