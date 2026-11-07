This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

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

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Instagram stats

The media kit reads public aggregates from Supabase using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The sync keeps one snapshot for `@uwummie`. Views cover the last 30 complete UTC days. The audience charts use follower demographics reported by Instagram.

1. In the [urmi-mediakit app dashboard](https://developers.facebook.com/apps/1096130900092084/), open **API setup with Unified login**. Use a configuration with `instagram_basic` and `instagram_manage_insights`. Authorize `@uwummie` and generate a token. [Meta's Unified Login guide](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-unified-login/get-started)
2. Apply the migration with the Supabase CLI or SQL Editor. In Supabase Vault, create a secret named `instagram_mediakit_token`. Store a JSON object with `accessToken` and `accountId` (the Instagram account ID as a string). Include `expiresAt` as an ISO 8601 timestamp if Meta provides an expiry. Keep the token in Vault or a gitignored local file during setup.
3. With Supabase CLI v3, deploy using `npx supabase functions deploy sync-instagram-stats --remote=<project-ref> --use-api`. Set `INSTAGRAM_SYNC_SECRET` under Edge Function secrets to a random 32-byte hex value. In Vault, add the same value as `instagram_mediakit_sync_secret` and the Supabase project URL as `instagram_mediakit_project_url`.
4. Send a `POST` to `<project-url>/functions/v1/sync-instagram-stats` with the `x-instagram-sync-secret` header. Check the function logs and verify the snapshot at `/api/instagram-stats` against the Instagram dashboard for the matching window. Run [the scheduling SQL](supabase/schedule-instagram-sync.sql) in the SQL Editor after verification. Supabase Cron runs the function every day at 09:00 UTC (14:30 IST).

The worker uses the configured Unified Login token until Meta expires or revokes it. Reauthorize the account and update the Vault entry if that happens. Existing Instagram Login entries with `accessToken` and `expiresAt` still refresh automatically when 14 days or fewer remain. Each failed run leaves the previous snapshot available. Check Edge Function logs for sync failures.

Run `node --test tests/instagram-sync.test.mjs` to check parsing, rolling date windows, and the worker's authorization and failure paths.
