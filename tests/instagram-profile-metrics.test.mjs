import assert from "node:assert/strict";
import { test } from "node:test";
import {
  bioLinkHistoryTotal,
  fetchBioLinkHistory,
  fetchSnapshot,
} from "../supabase/functions/sync-instagram-stats/instagram.mjs";

const origin = "https://graph.facebook.com";
const accountId = "123";
const day = 86400000;
const observedAt = "2026-11-08T09:00:00Z";

test("backfills disjoint inclusive query ranges, bounded to 30 days, using totals only", async (t) => {
  const ranges = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url.searchParams.get("metric"), "website_clicks");
    assert.equal(url.searchParams.get("metric_type"), "total_value");
    assert.equal(url.searchParams.get("period"), "day");
    const since = Number(url.searchParams.get("since"));
    const until = Number(url.searchParams.get("until"));
    assert.ok(until - since + 1 <= (30 * day) / 1000);
    ranges.push({ since, until });
    return Response.json({
      data: [{ name: "website_clicks", total_value: { value: 2 } }],
    });
  });
  const history = await fetchBioLinkHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
  );
  ranges.sort((a, b) => a.since - b.since);
  assert.equal(ranges.length, 25);
  assert.equal(history.start, "2024-11-09T00:00:00.000Z");
  assert.equal(history.end, "2026-11-08T00:00:00.000Z");
  for (let i = 1; i < ranges.length; i++)
    assert.equal(ranges[i].since, ranges[i - 1].until + 1);
  assert.equal(bioLinkHistoryTotal(history), 50);
});

test("updates windows rather than adding overlapping totals, preserving history beyond API retention", async (t) => {
  const previous = {
    accountId,
    start: "2024-11-09T00:00:00.000Z",
    end: "2026-11-08T00:00:00.000Z",
    windows: [],
  };
  const start = Date.parse(previous.start);
  const end = Date.parse(previous.end);
  for (let since = start; since < end; since += 30 * day)
    previous.windows.push({
      start: new Date(since).toISOString(),
      end: new Date(Math.min(since + 30 * day, end)).toISOString(),
      value: 10,
    });
  let calls = 0;
  t.mock.method(globalThis, "fetch", async (url) => {
    calls++;
    assert.ok(
      Number(url.searchParams.get("since")) * 1000 >= Date.parse("2026-09-01"),
    );
    return Response.json({
      data: [{ name: "website_clicks", total_value: { value: 12 } }],
    });
  });
  const updated = await fetchBioLinkHistory(
    origin,
    accountId,
    "fixture",
    "2026-11-09T09:00:00Z",
    previous,
  );
  assert.equal(updated.start, previous.start);
  assert.equal(updated.windows[0].value, 10); // Already aged past the retention boundary.
  assert.equal(updated.windows.length, previous.windows.length);
  assert.equal(calls, 2);
  assert.equal(bioLinkHistoryTotal(updated), 254); // 23 saved + 2 replaced, never 250 + 24.
  const again = await fetchBioLinkHistory(
    origin,
    accountId,
    "fixture",
    "2026-11-09T09:00:00Z",
    updated,
  );
  assert.equal(bioLinkHistoryTotal(again), 254);
});

test("retains known values on failed refresh but does not publish a partial or stale total", async (t) => {
  const previous = {
    accountId,
    start: "2026-11-01T00:00:00.000Z",
    end: "2026-11-08T00:00:00.000Z",
    windows: [
      {
        start: "2026-11-01T00:00:00.000Z",
        end: "2026-11-08T00:00:00.000Z",
        value: 42,
      },
    ],
  };
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ error: { code: 10 } }, { status: 403 }),
  );
  const failed = await fetchBioLinkHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
    previous,
  );
  assert.equal(failed.windows[0].value, 42);
  assert.equal(failed.windows[0].stale, true);
  assert.equal(bioLinkHistoryTotal(failed), null);
});

test("missing totals remain unavailable, true zeros remain zero, and a later refresh repairs a gap", async (t) => {
  let missing = true;
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      data: missing
        ? []
        : [{ name: "website_clicks", total_value: { value: 0 } }],
    }),
  );
  const previous = {
    accountId,
    start: "2026-11-01T00:00:00.000Z",
    windows: [],
  };
  const incomplete = await fetchBioLinkHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
    previous,
  );
  assert.equal(bioLinkHistoryTotal(incomplete), null);
  missing = false;
  const complete = await fetchBioLinkHistory(
    origin,
    accountId,
    "fixture",
    observedAt,
    incomplete,
  );
  assert.equal(bioLinkHistoryTotal(complete), 0);
});

test("rejects overlapping saved windows and ignores history belonging to another account", async (t) => {
  const previous = {
    accountId,
    start: "2026-10-01",
    windows: [{ start: "2026-10-02", end: "2026-10-05", value: 4 }],
  };
  await assert.rejects(
    fetchBioLinkHistory(origin, accountId, "fixture", observedAt, previous),
    /Invalid saved bio-link window/,
  );
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({
      data: [{ name: "website_clicks", total_value: { value: 0 } }],
    }),
  );
  const fresh = await fetchBioLinkHistory(
    origin,
    "456",
    "fixture",
    observedAt,
    previous,
  );
  assert.equal(fresh.accountId, "456");
  assert.equal(fresh.start, "2024-11-09T00:00:00.000Z");
});

test("isolates optional profile visits and website taps from core account metrics", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/me"))
      return Response.json({
        user_id: accountId,
        username: "uwummie",
        followers_count: 50,
        media_count: 0,
      });
    const metric = url.searchParams.get("metric");
    if (metric === "profile_views")
      return Response.json({
        data: [{ name: metric, total_value: { value: 4689 } }],
      });
    if (metric === "website_clicks")
      return Response.json({
        data: [{ name: metric, total_value: { value: 20 } }],
      });
    if (url.searchParams.get("metric_type") === "time_series")
      return Response.json({ data: [] });
    assert.ok(
      !metric.includes("profile_views") && !metric.includes("website_clicks"),
    );
    return Response.json({
      data: [{ name: "reach", total_value: { value: 100 } }],
    });
  });
  const snapshot = await fetchSnapshot("fixture", observedAt);
  assert.equal(snapshot.performance.profileViews, 4689);
  assert.equal(snapshot.performance.bioLinkClicksTracked, 500);
  assert.equal(snapshot.performance.reach, 100);
});
