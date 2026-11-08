import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fetchPerformanceHistory,
  fetchPostAverages,
  fetchSnapshot,
  performanceHistoryTotals,
} from "../supabase/functions/sync-instagram-stats/instagram.mjs";

const observedAt = "2026-11-08T09:00:00Z";
const origin = "https://graph.facebook.com";
const accountId = "123";
const day = 86400000;

function totals(url, value = 10) {
  return Response.json({
    data: url.searchParams
      .get("metric")
      .split(",")
      .map((name) => ({ name, total_value: { value } })),
  });
}

test("archives disjoint performance windows, refreshing rather than adding repeated totals", async (t) => {
  const ranges = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    const metric = url.searchParams.get("metric");
    assert.ok(
      !metric.includes("reach") && !metric.includes("accounts_engaged"),
    );
    const since = Number(url.searchParams.get("since"));
    const until = Number(url.searchParams.get("until"));
    assert.ok(until - since + 1 <= (30 * day) / 1000);
    if (metric !== "profile_views") ranges.push({ since, until });
    return totals(url);
  });
  const history = await fetchPerformanceHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
  );
  ranges.sort((a, b) => a.since - b.since);
  assert.equal(ranges.length, 3);
  for (let i = 1; i < ranges.length; i++)
    assert.equal(ranges[i].since, ranges[i - 1].until + 1);
  assert.equal(performanceHistoryTotals(history).views, 30);
  const again = await fetchPerformanceHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
    history,
  );
  assert.equal(performanceHistoryTotals(again).views, 30);
  const next = await fetchPerformanceHistory(
    origin,
    accountId,
    "fixture",
    "2026-11-09T09:00:00Z",
    again,
  );
  assert.equal(next.start, history.start);
  assert.equal(next.windows.length, 4);
  assert.equal(next.windows[0].values.views, 10);
  assert.equal(performanceHistoryTotals(next).views, 40);
});

test("preserves historical values on failure, marks stale totals unavailable, and repairs gaps", async (t) => {
  let failed = false;
  t.mock.method(globalThis, "fetch", async (url) =>
    failed
      ? Response.json({ error: { code: 10 } }, { status: 403 })
      : totals(url, 0),
  );
  const history = await fetchPerformanceHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
  );
  assert.equal(performanceHistoryTotals(history).views, 0);
  failed = true;
  const stale = await fetchPerformanceHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
    history,
  );
  assert.equal(stale.windows.at(-1).values.views, 0);
  assert.equal(performanceHistoryTotals(stale).views, null);
  failed = false;
  const repaired = await fetchPerformanceHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
    stale,
  );
  assert.equal(performanceHistoryTotals(repaired).views, 0);
});

test("rejects overlapping storage and starts fresh for a different account", async (t) => {
  const previous = {
    accountId,
    start: "2026-10-01",
    windows: [{ start: "2026-10-02", end: "2026-10-05", values: { views: 5 } }],
  };
  await assert.rejects(
    fetchPerformanceHistory(origin, accountId, "fixture", observedAt, previous),
    /Invalid saved performance window/,
  );
  t.mock.method(globalThis, "fetch", async (url) => totals(url));
  const history = await fetchPerformanceHistory(
    origin,
    "456",
    "fixture",
    observedAt,
    previous,
  );
  assert.equal(history.accountId, "456");
  assert.equal(history.windows.length, 3);
});

test("returns separate Lifetime and 30-day data without inventing lifetime unique accounts", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/me"))
      return Response.json({
        user_id: accountId,
        username: "uwummie",
        followers_count: 50,
        media_count: 2,
      });
    if (url.pathname.endsWith("/media"))
      return Response.json({
        data: [
          {
            id: "1",
            like_count: 100,
            comments_count: 10,
            timestamp: "2026-11-01T12:00:00Z",
          },
          {
            id: "2",
            like_count: 200,
            comments_count: 20,
            timestamp: "2026-09-01T12:00:00Z",
          },
        ],
      });
    if (url.searchParams.get("metric_type") === "time_series")
      return Response.json({ data: [] });
    return totals(url);
  });
  const snapshot = await fetchSnapshot("fixture", observedAt);
  const { lifetime, last30Days } = snapshot.performancePeriods;
  assert.equal(snapshot.defaultPerformancePeriod, "lifetime");
  assert.equal(lifetime.likes, 300);
  assert.equal(last30Days.likes, 10);
  assert.equal(lifetime.comments, 30);
  assert.equal(lifetime.averageLikes, 150);
  assert.equal(last30Days.averageLikes, 100);
  assert.equal(last30Days.averageComments, 10);
  assert.equal(lifetime.averageComments, 15);
  assert.ok(Math.abs(last30Days.followerEngagement - 220) < 1e-10);
  assert.equal(lifetime.views, 30);
  assert.equal(lifetime.reach, null);
  assert.equal(lifetime.accountsEngaged, null);
  assert.equal(lifetime.engagementRate, null);
  assert.equal(last30Days.reach, 10);
  assert.equal(last30Days.engagementRate, 100);
  assert.equal(last30Days.bioLinkClicks, 10);
  assert.equal(lifetime.bioLinkClicks, 250);
  assert.equal(snapshot.performance.performanceHistory.windows.length, 3);
});

test("recent post averages include the start boundary, exclude incomplete days, and preserve hidden counts", async (t) => {
  const posts = [
    {
      id: "1",
      timestamp: "2026-10-09T00:00:00Z",
      like_count: 0,
      comments_count: 0,
    },
    {
      id: "2",
      timestamp: "2026-11-07T23:59:59Z",
      like_count: 20,
      comments_count: 4,
    },
    {
      id: "3",
      timestamp: "2026-10-08T23:59:59Z",
      like_count: 1000,
      comments_count: 100,
    },
    {
      id: "4",
      timestamp: "2026-11-08T00:00:00Z",
      like_count: 1000,
      comments_count: 100,
    },
  ];
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ data: posts }),
  );
  const run = () =>
    fetchPostAverages(origin, accountId, "fixture", 100, 4, true, {
      start: "2026-10-09T00:00:00Z",
      end: "2026-11-08T00:00:00Z",
    });
  assert.deepEqual((await run()).recentAverages, {
    averageLikes: 10,
    averageComments: 2,
    followerEngagement: 12,
  });
  delete posts[1].like_count;
  assert.deepEqual((await run()).recentAverages, {
    averageLikes: null,
    averageComments: 2,
    followerEngagement: null,
  });
  posts[1].timestamp = "invalid";
  assert.deepEqual((await run()).recentAverages, {
    averageLikes: null,
    averageComments: null,
    followerEngagement: null,
  });
});

test("no posts in the selected window leave averages unavailable rather than dividing by zero", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      data: [
        {
          id: "1",
          timestamp: "2026-09-01T12:00:00Z",
          like_count: 20,
          comments_count: 4,
        },
      ],
    }),
  );
  const result = await fetchPostAverages(
    origin,
    accountId,
    "fixture",
    100,
    1,
    true,
    {
      start: "2026-10-09T00:00:00Z",
      end: "2026-11-08T00:00:00Z",
    },
  );
  assert.equal(result.averageLikes, 20);
  assert.deepEqual(result.recentAverages, {
    averageLikes: null,
    averageComments: null,
    followerEngagement: null,
  });
});
