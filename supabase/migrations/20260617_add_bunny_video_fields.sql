-- Adds Bunny CDN video metadata fields without changing existing property data.
-- This migration is safe to run on an existing database.

alter table public.properties
  add column if not exists video_url text,
  add column if not exists video_size_mb numeric,
  add column if not exists video_duration_seconds integer,
  add column if not exists video_mime_type text,
  add column if not exists images text[],
  add column if not exists is_featured boolean default false,
  add column if not exists featured_rank integer;

do $$
begin
  alter table public.properties
    add constraint properties_video_mime_type_check
    check (video_mime_type is null or video_mime_type = 'video/mp4');
exception
  when duplicate_object then null;
end;
$$;

drop view if exists public.public_properties;

create view public.public_properties as
select
  id,
  title,
  property_type,
  purpose,
  location,
  address,
  size,
  size_unit,
  price,
  bedrooms,
  bathrooms,
  description,
  features,
  images,
  video_url,
  video_size_mb,
  video_duration_seconds,
  video_mime_type,
  status,
  is_featured,
  featured_rank,
  approved_at,
  created_at,
  updated_at
from public.properties
where status = 'approved';

grant select on public.public_properties to anon, authenticated;

notify pgrst, 'reload schema';
