-- Repairs admin approval + homepage featured/ranking support on an existing
-- KHI/Malik Imperium DB.
-- Run this in Supabase SQL Editor if inserts fail with:
-- "Could not find the 'featured_rank' column of 'properties' in the schema cache".

alter table public.properties
  add column if not exists status text default 'pending',
  add column if not exists admin_notes text,
  add column if not exists rejection_reason text,
  add column if not exists approved_at timestamp with time zone,
  add column if not exists updated_at timestamp with time zone default now(),
  add column if not exists is_featured boolean default false,
  add column if not exists featured_rank integer;

update public.properties
set status = 'pending'
where status is null;

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

create index if not exists properties_featured_rank_idx
on public.properties (is_featured, featured_rank, created_at desc)
where status = 'approved';

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
