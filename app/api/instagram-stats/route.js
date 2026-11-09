import { cacheLife } from "next/cache";
import { connection } from "next/server";
import { readSavedStats } from "./saved-stats.mjs";
import { readStoryAverage } from "./story-average.mjs";

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
  // Retry an incomplete showcase promptly after a successful scheduled sync.
  const hasPopular = stats?.reels?.showcase?.popular?.length > 0;
  cacheLife(
    hasPopular
      ? { stale: 300, revalidate: 300, expire: 3600 }
      : { stale: 30, revalidate: 30, expire: 60 },
  );
  return stats;
}

export async function GET() {
  await connection();
  const noStore = { "Cache-Control": "no-store" };
  const [saved, stories] = await Promise.allSettled([
    fetchSavedStats(),
    fetchSavedStoryAverage(),
  ]);
  const stats = saved.status === "fulfilled" ? saved.value : null;
  const average = stories.status === "fulfilled" ? stories.value : null;
  if (saved.status === "rejected" && !average)
    return Response.json(null, { status: 503, headers: noStore });
  return Response.json(
    stats || average ? { ...stats, storyAverage: average } : null,
    {
      headers: {
        "Cache-Control": stats?.reels?.showcase?.popular?.length
          ? "public, max-age=300, s-maxage=300"
          : "public, max-age=30, s-maxage=30",
      },
    },
  );
}
