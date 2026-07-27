-- DUONERA V9: private profile photos.
-- Run once in Supabase Dashboard > SQL Editor before publishing V9.

alter table public.duonera_profiles
add column if not exists photo_paths text[] not null default '{}';

insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'duonera-profile-photos',
  'duonera-profile-photos',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "duonera_public_upload_profile_photos" on storage.objects;
create policy "duonera_public_upload_profile_photos"
on storage.objects
for insert
to anon
with check (
  bucket_id = 'duonera-profile-photos'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and lower(storage.extension(name)) in ('jpg', 'jpeg', 'png', 'webp')
);

drop policy if exists "duonera_admin_read_profile_photos" on storage.objects;
create policy "duonera_admin_read_profile_photos"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'duonera-profile-photos'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
);

drop policy if exists "duonera_admin_upload_profile_photos" on storage.objects;
create policy "duonera_admin_upload_profile_photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'duonera-profile-photos'
  and lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
);

grant update on table public.duonera_profiles to authenticated;

drop policy if exists "duonera_admin_update_profiles" on public.duonera_profiles;
create policy "duonera_admin_update_profiles"
on public.duonera_profiles
for update
to authenticated
using (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
)
with check (
  lower(coalesce(auth.jwt() ->> 'email', '')) = 'info@duonera.cz'
);
