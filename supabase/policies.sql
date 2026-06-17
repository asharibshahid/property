alter table public.properties enable row level security;

revoke all on public.properties from anon, authenticated;
revoke all on public.public_properties from anon, authenticated;

grant select on public.public_properties to anon, authenticated;
grant insert on public.properties to anon, authenticated;

drop policy if exists "Public can insert pending properties" on public.properties;
drop policy if exists "Admins can read all properties" on public.properties;
drop policy if exists "Admins can update all properties" on public.properties;
drop policy if exists "Admins can delete all properties" on public.properties;

create policy "Public can insert pending properties"
on public.properties
for insert
to anon, authenticated
with check (
  status = 'pending'
  and approved_at is null
);

-- Admin setup:
-- Admin authorization is enforced in the Next.js server using a signed
-- HTTP-only admin session cookie.
-- Admin reads, updates, and deletes use SUPABASE_SERVICE_ROLE_KEY only after
-- the server validates ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET.
-- Do not expose the service-role key or admin credential env vars to the browser.
