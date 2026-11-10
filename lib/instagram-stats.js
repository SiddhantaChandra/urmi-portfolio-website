import { cacheLife } from "next/cache";
import { readSavedStats } from "../app/api/instagram-stats/saved-stats.mjs";
import { readStoryAverage } from "../app/api/instagram-stats/story-average.mjs";
import { selectRecentReels } from "../supabase/functions/sync-instagram-stats/reel-showcase.mjs";

export function hasCompleteShowcase(stats) {
  const showcase = stats?.reels?.showcase;
  const recent = showcase?.recent ?? [];
  return (
    showcase?.popular?.length > 0 &&
    selectRecentReels(recent).length === recent.length
  );
}

async function fetchSavedStoryAverage() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 300, expire: 3600 });
  // A missing migration or Story-sync outage must not hide account metrics.
  return readStoryAverage(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    process.env.INSTAGRAM_ACCOUNT_ID,
  ).catch(() => null);
}

async function fetchSavedStats() {
  "use cache";
  const stats = await readSavedStats(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  // Prerender snapshots while retrying incomplete rankings sooner.
  cacheLife({
    stale: 300,
    revalidate: hasCompleteShowcase(stats) ? 300 : 30,
    expire: 3600,
  });
  return stats;
}

export async function getInstagramStats() {
  const [saved, stories] = await Promise.allSettled([
    fetchSavedStats(),
    fetchSavedStoryAverage(),
  ]);
  const stats = saved.status === "fulfilled" ? saved.value : null;
  const average = stories.status === "fulfilled" ? stories.value : null;
  return {
    stats: stats || average ? { ...stats, storyAverage: average } : null,
    failed: saved.status === "rejected" && !average,
    complete: hasCompleteShowcase(stats),
  };
}
