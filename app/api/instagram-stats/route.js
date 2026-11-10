import { connection } from "next/server";
import { getInstagramStats } from "../../../lib/instagram-stats";

export async function GET() {
  await connection();
  const { stats, failed, complete } = await getInstagramStats();
  if (failed)
    return Response.json(null, {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  return Response.json(stats, {
    headers: {
      "Cache-Control": complete
        ? "public, max-age=300, s-maxage=300"
        : "public, max-age=30, s-maxage=30",
    },
  });
}
