MALIK IMPERIUM ESTATES is a custom Next.js App Router real estate app for Karachi property listings.

Public pages read approved, public-safe property data from Supabase. Admin pages use a custom env-based login with a signed HTTP-only cookie session and server-side Supabase service-role operations.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Copy `.env.example` to `.env.local` and fill in the Supabase keys plus admin credentials:

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change_this_password
ADMIN_SESSION_SECRET=change_this_long_random_secret
BUNNY_STORAGE_ZONE=
BUNNY_STORAGE_ACCESS_KEY=
BUNNY_STORAGE_REGION_HOST=storage.bunnycdn.com
BUNNY_CDN_PUBLIC_URL=
```

Use a long random value for `ADMIN_SESSION_SECRET`. These admin env values are server-only and must not be prefixed with `NEXT_PUBLIC_`.

Property media uploads use Bunny Storage/CDN, not Supabase Storage. Images and
optional MP4 videos are uploaded through the server route at
`/api/media/upload`; Supabase stores only the final public CDN URLs. For an
existing Supabase project, run:

```sql
-- supabase/migrations/20260617_add_bunny_video_fields.sql
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
