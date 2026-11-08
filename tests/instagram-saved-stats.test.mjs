import assert from "node:assert/strict";
import { test } from "node:test";
import { readSavedStats } from "../app/api/instagram-stats/saved-stats.mjs";

test("visitor stats read only the saved Supabase snapshot and retain its original timestamp", async (t) => {
  const observedAt = "2026-11-07T16:00:00Z";
  const fetch = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url.origin, "https://example.supabase.co");
    assert.equal(url.pathname, "/rest/v1/instagram_mediakit_stats");
    assert.equal(url.searchParams.get("username"), "eq.uwummie");
    assert.equal(options.headers.apikey, "fixture-public-key");
    return Response.json([
      { snapshot: { followers: 300, views: 0 }, observed_at: observedAt },
    ]);
  });
  assert.deepEqual(
    await readSavedStats("https://example.supabase.co", "fixture-public-key"),
    {
      followers: 300,
      views: 0,
      updatedAt: observedAt,
    },
  );
  assert.equal(fetch.mock.callCount(), 1);
});

test("missing configuration/snapshots and query failures do not trigger live Meta fetching", async (t) => {
  let failure = false;
  const fetch = t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url.origin, "https://example.supabase.co");
    return failure ? new Response(null, { status: 503 }) : Response.json([]);
  });
  assert.equal(await readSavedStats(undefined, undefined), null);
  assert.equal(fetch.mock.callCount(), 0);
  assert.equal(
    await readSavedStats("https://example.supabase.co", "fixture"),
    null,
  );
  failure = true;
  await assert.rejects(
    readSavedStats("https://example.supabase.co", "fixture"),
    /Snapshot query failed/,
  );
  assert.equal(fetch.mock.callCount(), 2);
});
