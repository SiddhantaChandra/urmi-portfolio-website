// Visitors only read Supabase. Meta requests belong to the scheduled worker.
export async function readSavedStats(supabaseUrl, publishableKey) {
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
