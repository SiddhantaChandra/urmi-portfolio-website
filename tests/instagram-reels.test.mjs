import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fetchPostAverages,
  fetchReelPerformance,
  fetchStoryPerformance,
} from "../supabase/functions/sync-instagram-stats/instagram.mjs";

const origin = "https://graph.facebook.com";
const unavailable = {
  averageViews: null,
  averageReach: null,
  averageWatchTimeSeconds: null,
  totalWatchTimeHours: null,
};

function insights(views, average, total, reach = views) {
  return Response.json({
    data: [
      ["views", views],
      ["reach", reach],
      ["ig_reels_avg_watch_time", average],
      ["ig_reels_video_view_total_time", total],
    ].map(([name, value]) => ({ name, values: [{ value }] })),
  });
}

test("averages all published reels once across media pages and converts watch-time units", async (t) => {
  const reel = {
    id: "1",
    media_product_type: "REELS",
    like_count: 1,
    comments_count: 0,
    timestamp: "2025-01-01T00:00:00Z",
  };
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(url);
    if (url.pathname.endsWith("/media")) {
      assert.ok(url.searchParams.get("fields").includes("media_product_type"));
      return Response.json(
        url.searchParams.has("after")
          ? {
              data: [
                reel,
                { ...reel, id: "2", timestamp: "2026-11-01T00:00:00Z" },
                { ...reel, id: "3", media_product_type: "FEED" },
              ],
            }
          : {
              data: [reel],
              paging: { next: "ignored", cursors: { after: "second" } },
            },
      );
    }
    assert.equal(url.searchParams.get("period"), "lifetime");
    assert.equal(url.searchParams.has("since"), false);
    return url.pathname.includes("/1/")
      ? insights(100, 5000, 3_600_000, 80)
      : insights(300, 15000, 7_200_000, 180);
  });
  const result = await fetchPostAverages(
    origin,
    "123",
    "fixture",
    100,
    3,
    true,
    {
      start: "2026-10-09T00:00:00Z",
      end: "2026-11-08T00:00:00Z",
    },
    true,
  );
  assert.deepEqual(result.reels, {
    averageViews: 200,
    averageReach: 130,
    averageWatchTimeSeconds: 10,
    totalWatchTimeHours: 3,
  });
  assert.equal(
    calls.filter((url) => url.pathname.endsWith("/insights")).length,
    2,
  );
});

test("preserves zero and isolates missing metrics without presenting partial totals", async (t) => {
  const posts = ["1", "2"].map((id) => ({ id, media_product_type: "REELS" }));
  const mock = t.mock.method(globalThis, "fetch", async () =>
    insights(0, 0, 0),
  );
  assert.deepEqual(await fetchReelPerformance(origin, "fixture", posts), {
    averageViews: 0,
    averageReach: 0,
    averageWatchTimeSeconds: 0,
    totalWatchTimeHours: 0,
  });
  mock.mock.mockImplementation(async (url) =>
    url.pathname.includes("/1/")
      ? insights(100, 5000, 3_600_000)
      : insights(300, null, null),
  );
  assert.deepEqual(await fetchReelPerformance(origin, "fixture", posts), {
    ...unavailable,
    averageViews: 200,
    averageReach: 200,
  });
  mock.mock.mockImplementation(async () =>
    Response.json({ error: { code: 10 } }, { status: 403 }),
  );
  assert.deepEqual(
    await fetchReelPerformance(origin, "fixture", posts),
    unavailable,
  );
});

test("does not guess reel membership or fetch insights after incomplete pagination", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.ok(url.pathname.endsWith("/media"));
    return Response.json({ data: [{ id: "1", media_product_type: "REELS" }] });
  });
  assert.deepEqual(
    await fetchReelPerformance(origin, "fixture", [{ id: "1" }]),
    unavailable,
  );
  assert.deepEqual(await fetchReelPerformance(origin, "fixture", []), {
    ...unavailable,
    totalWatchTimeHours: 0,
  });
  const incomplete = await fetchPostAverages(
    origin,
    "123",
    "fixture",
    100,
    2,
    true,
    undefined,
    true,
  );
  assert.equal(incomplete.reels, undefined);
});

test("keeps views and watch time when one reel's reach is unavailable", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.ok(url.searchParams.get("metric").split(",").includes("reach"));
    return insights(
      100,
      5000,
      3_600_000,
      url.pathname.includes("/1/") ? 80 : null,
    );
  });
  const result = await fetchReelPerformance(origin, "fixture", [
    { id: "1", media_product_type: "REELS" },
    { id: "2", media_product_type: "REELS" },
  ]);
  assert.deepEqual(result, {
    averageViews: 100,
    averageReach: null,
    averageWatchTimeSeconds: 5,
    totalWatchTimeHours: 2,
  });
});

test("sums views of paginated active Stories once and ignores token-bearing paging URLs", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(url);
    assert.equal(url.origin, origin);
    if (url.pathname.endsWith("/stories"))
      return Response.json(
        url.searchParams.has("after")
          ? { data: [{ id: "1" }, { id: "2" }] }
          : {
              data: [{ id: "1" }],
              paging: {
                next: "https://untrusted.example/ignored",
                cursors: { after: "next" },
              },
            },
      );
    assert.equal(url.searchParams.get("metric"), "views");
    return insights(url.pathname.includes("/1/") ? 120 : 80, 0, 0);
  });
  assert.deepEqual(await fetchStoryPerformance(origin, "123", "fixture"), {
    views: 200,
    count: 2,
    scope: "active",
  });
  assert.equal(calls.length, 4);
});

test("Story views preserve true zero and become unavailable on expiry or missing insights", async (t) => {
  let scenario = "empty";
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/stories"))
      return Response.json({
        data: scenario === "empty" ? [] : [{ id: "1" }, { id: "2" }],
      });
    if (scenario === "expired")
      return Response.json({ error: { code: 10 } }, { status: 403 });
    return insights(
      scenario === "missing" && url.pathname.includes("/2/") ? null : 0,
      0,
      0,
    );
  });
  for (const value of ["empty", "zero", "missing", "expired"]) {
    scenario = value;
    const result = await fetchStoryPerformance(origin, "123", "fixture");
    assert.equal(
      result.views,
      value === "empty" || value === "zero" ? 0 : null,
    );
    assert.equal(result.scope, "active");
  }
});

test("rejects incomplete Story pagination and malformed Story membership", async (t) => {
  const mock = t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      data: [{ id: "1" }],
      paging: { next: "ignored", cursors: { after: "same" } },
    }),
  );
  await assert.rejects(
    fetchStoryPerformance(origin, "123", "fixture"),
    /Stories cursor/,
  );
  mock.mock.mockImplementation(async () =>
    Response.json({ data: [{ id: "../invalid" }] }),
  );
  await assert.rejects(
    fetchStoryPerformance(origin, "123", "fixture"),
    /Story ID/,
  );
});
