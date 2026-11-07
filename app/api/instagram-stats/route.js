import { connection } from "next/server";

export async function GET() {
  await connection();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const noStore = { "Cache-Control": "no-store" };

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
    const { followers, views, viewWindow, audience } = row.snapshot;

    return Response.json(
      { followers, views, viewWindow, audience, updatedAt: row.observed_at },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } },
    );
  } catch {
    return Response.json(null, { status: 503, headers: noStore });
  }
}
