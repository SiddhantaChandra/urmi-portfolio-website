export async function readStoryAverage(supabaseUrl, publishableKey, accountId) {
  if (!supabaseUrl || !publishableKey) return null;
  const url = new URL("/rest/v1/instagram_story_averages", supabaseUrl);
  url.search = new URLSearchParams({
    select:
      "account_id,average_views,story_count,active_average_views,active_story_count,observed_at",
    username: "eq.uwummie",
    ...(accountId ? { account_id: `eq.${accountId}` } : {}),
  });
  const response = await fetch(url, {
    headers: { apikey: publishableKey },
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Story average query failed");
  const [row] = await response.json();
  if (
    !row ||
    !Number.isSafeInteger(row.story_count) ||
    row.story_count < 0 ||
    !Number.isFinite(Date.parse(row.observed_at)) ||
    (row.story_count === 0
      ? row.average_views !== null
      : !Number.isFinite(row.average_views) || row.average_views < 0)
  )
    return null;
  const useActive =
    row.story_count === 0 &&
    Number.isSafeInteger(row.active_story_count) &&
    row.active_story_count > 0 &&
    Number.isFinite(row.active_average_views) &&
    row.active_average_views >= 0;
  return {
    views: useActive ? row.active_average_views : row.average_views,
    count: useActive ? row.active_story_count : row.story_count,
    scope: useActive ? "active" : "completed",
    observedAt: row.observed_at,
  };
}
