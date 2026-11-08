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
  const snapshot = await fetchSnapshot(
    accessToken,
    updatedAt,
    accountId,
    // A saved-history outage may shorten the live display's coverage, but must
    // not take working Meta metrics offline. Only the worker writes archives.
    async () =>
      (await readSavedStats().catch(() => null))?.performance?.bioLinkHistory,
  );
  return { ...snapshot, updatedAt };
}

async function readSavedStats() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) return null;
  const url = new URL("/rest/v1/instagram_mediakit_stats", supabaseUrl);
  url.search = new URLSearchParams({
    select: "snapshot,observed_at",
    username: "eq.uwummie",
  });
  const response = await fetch(url, {
    headers: { apikey: publishableKey },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Snapshot query failed");
  const [row] = await response.json();
  return row ? { ...row.snapshot, updatedAt: row.observed_at } : null;
}

export async function GET() {
  await connection();
  const noStore = { "Cache-Control": "no-store" };

  if (process.env.INSTAGRAM_ACCESS_TOKEN) {
    try {
      const stats = await fetchMetaStats(
        process.env.INSTAGRAM_ACCESS_TOKEN,
        process.env.INSTAGRAM_ACCOUNT_ID,
      );
      return Response.json(stats, {
        headers: noStore,
      });
    } catch (error) {
      console.warn(
        error instanceof SyncError
          ? error.message
          : "Instagram live fetch failed; checking saved snapshot",
      );
    }
  }

  try {
    const stats = await readSavedStats();
    return Response.json(stats, {
      headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
    });
  } catch {
    return Response.json(null, { status: 503, headers: noStore });
  }
}
