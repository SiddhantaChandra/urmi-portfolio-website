import { fetchSnapshot, SyncError } from "./instagram.mjs";
import { authorizeSync, callDatabase, credentialForSync } from "./shared.mjs";

async function readPerformanceHistory() {
  const url = new URL(
    "/rest/v1/instagram_mediakit_stats",
    Deno.env.get("SUPABASE_URL"),
  );
  url.search = new URLSearchParams({
    select: "snapshot",
    username: "eq.uwummie",
  });
  const secret = JSON.parse(
    Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}",
  ).default;
  const key = secret ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const response = await fetch(url, {
    headers: {
      apikey: key,
      ...(!secret ? { Authorization: `Bearer ${key}` } : {}),
    },
    redirect: "error",
    signal: AbortSignal.timeout(6000),
  });
  if (!response.ok)
    throw new SyncError("Saved performance history query failed");
  const [row] = await response.json();
  return row?.snapshot?.performance;
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  if (!authorizeSync(request)) return new Response(null, { status: 401 });

  const observedAt = new Date().toISOString();
  try {
    const { accessToken, accountId } = await credentialForSync();
    const snapshot = await fetchSnapshot(
      accessToken,
      observedAt,
      accountId,
      readPerformanceHistory,
    );
    await callDatabase("publish_instagram_mediakit_stats", {
      new_snapshot: snapshot,
      new_observed_at: observedAt,
    });
    return Response.json({ synced: true });
  } catch (error) {
    console.error(
      error instanceof SyncError ? error.message : "Instagram sync failed",
    );
    return Response.json({ synced: false }, { status: 502 });
  }
});
