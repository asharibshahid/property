create extension if not exists pgcrypto;

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  property_type text not null,
  purpose text not null,
  location text not null,
  address text,
  size text not null,
  size_unit text not null,
  price numeric not null,
  bedrooms int,
  bathrooms int,
  description text,
  features text[],
  images text[],
  video_url text,
  video_size_mb numeric,
  video_duration_seconds integer,
  video_mime_type text,
  status text default 'pending',
  is_featured boolean default false,
  featured_rank int,
  seller_name text not null,
  seller_contact text not null,
  seller_whatsapp text,
  seller_email text,
  admin_notes text,
  rejection_reason text,
  approved_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  constraint properties_status_check
    check (status in ('pending', 'approved', 'rejected')),
  constraint properties_purpose_check
    check (purpose in ('Sale', 'Rent')),
  constraint properties_video_mime_type_check
    check (video_mime_type is null or video_mime_type = 'video/mp4')
);

alter table public.properties
  add column if not exists is_featured boolean default false,
  add column if not exists featured_rank int,
  add column if not exists video_url text,
  add column if not exists video_size_mb numeric,
  add column if not exists video_duration_seconds integer,
  add column if not exists video_mime_type text;

create index if not exists properties_featured_rank_idx
on public.properties (is_featured, featured_rank, created_at desc)
where status = 'approved';

do $$
begin
  alter table public.properties
    add constraint properties_video_mime_type_check
    check (video_mime_type is null or video_mime_type = 'video/mp4');
exception
  when duplicate_object then null;
end;
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists properties_set_updated_at on public.properties;

create trigger properties_set_updated_at
before update on public.properties
for each row
execute function public.set_updated_at();

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

notify pgrst, 'reload schema';
