import { cacheLife } from "next/cache";
import { connection } from "next/server";
import {
  fetchSnapshot,
  resolveUnifiedAccountId,
  SyncError,
} from "../../../supabase/functions/sync-instagram-stats/instagram.mjs";

async function fetchMetaStats(accessToken, configuredId) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  const accountId =
    configuredId || (await resolveUnifiedAccountId(accessToken));
  const updatedAt = new Date().toISOString();
  const snapshot = await fetchSnapshot(accessToken, updatedAt, accountId);
  return { ...snapshot, updatedAt };
}

export async function GET() {
  await connection();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const noStore = { "Cache-Control": "no-store" };

  if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    try {
      const stats = await fetchMetaStats(
        process.env.INSTAGRAM_ACCESS_TOKEN,
        process.env.INSTAGRAM_ACCOUNT_ID,
      );
      return Response.json(stats, { headers: noStore });
    } catch (error) {
      console.warn(
        error instanceof SyncError
          ? error.message
          : "Instagram live fetch failed; checking saved snapshot",
      );
    }
  }

  try {
    const url = new URL("/rest/v1/instagram_mediakit_stats", supabaseUrl);
    url.search = new URLSearchParams({
      select: "snapshot,observed_at",
      username: "eq.uwummie",
    });
    const response = await fetch(url, {
      headers: { apikey: publishableKey },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error("Snapshot query failed");

    const [row] = await response.json();
    if (!row) return Response.json(null, { headers: noStore });
    const { followers, views, viewWindow, audience, performance } =
      row.snapshot;

    return Response.json(
      {
        followers,
        views,
        viewWindow,
        audience,
        performance,
        updatedAt: row.observed_at,
      },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } },
    );
  } catch {
    return Response.json(null, { status: 503, headers: noStore });
  }
}
