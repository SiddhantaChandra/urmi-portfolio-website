import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fetchPostAverages,
  fetchSnapshot,
  resolveUnifiedAccountId,
} from "../supabase/functions/sync-instagram-stats/instagram.mjs";

const observedAt = "2026-11-07T09:00:00.000Z";
const profile = {
  user_id: "17841401130346306",
  username: "uwummie",
  followers_count: 300,
  media_count: 23,
};

test("fetches all Unified Login metrics for the configured Instagram account", async (t) => {
  const accountId = profile.user_id;
  const requests = t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/stories")) return Response.json({ data: [] });
    if (url.pathname.endsWith("/media")) return Response.json({ data: [] });
    assert.equal(url.origin, "https://graph.facebook.com");
    if (url.pathname === `/v26.0/${accountId}`) {
      assert.equal(
        url.searchParams.get("fields"),
        "id,username,followers_count,media_count",
      );
      return Response.json({
        id: accountId,
        username: "uwummie",
        followers_count: 300,
        media_count: 23,
      });
    }
    assert.equal(url.pathname, `/v26.0/${accountId}/insights`);
    if (
      url.searchParams.get("metric_type") === "total_value" &&
      !url.searchParams.has("breakdown")
    ) {
      return insight("views", { value: 2700 });
    }
    if (url.searchParams.get("breakdown") === "gender") {
      return demographics("gender", { U: 300 });
    }
    return Response.json({ data: [] });
  });

  const snapshot = await fetchSnapshot("fixture-token", observedAt, accountId);
  assert.equal(snapshot.followers, 300);
  assert.equal(snapshot.views, 2700);
  assert.deepEqual(snapshot.audience.gender, []);
  assert.equal(requests.mock.callCount(), 39);
  assert.equal(snapshot.stories.views, 0);
  assert.equal(snapshot.stories.scope, "active");
  assert.equal(snapshot.stories.observedAt, observedAt);
  assert.equal(snapshot.performance.posts, 23);
});

function insight(name, total_value) {
  return Response.json({ data: [{ name, total_value }] });
}

function demographics(dimension, entries) {
  return insight("follower_demographics", {
    breakdowns: [
      {
        dimension_keys: ["timeframe", dimension],
        results: Object.entries(entries).map(([key, value]) => ({
          dimension_values: ["LAST_30_DAYS", key],
          value,
        })),
      },
    ],
  });
}

test("uses Meta's unique reach total and real daily points, preserving zero and unavailable metrics", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/media")) return Response.json({ data: [] });
    if (url.pathname.endsWith("/me")) return Response.json(profile);
    if (url.searchParams.get("metric_type") === "time_series") {
      assert.equal(url.searchParams.get("metric"), "reach");
      return Response.json({
        data: [
          {
            name: "reach",
            values: [
              { value: 140, end_time: "2026-11-06T08:00:00+0000" },
              { value: 100, end_time: "2026-11-05T08:00:00+0000" },
              { value: 0, end_time: "2026-11-07T08:00:00+0000" },
            ],
          },
        ],
      });
    }
    if (url.searchParams.has("breakdown")) return Response.json({ data: [] });
    assert.equal(url.searchParams.get("period"), "day");
    assert.ok(url.searchParams.get("metric").includes("total_interactions"));
    assert.ok(!url.searchParams.get("metric").includes("impressions"));
    return Response.json({
      data: Object.entries({
        reach: 200,
        accounts_engaged: 10,
        views: 600,
        likes: 0,
        comments: 2,
        total_interactions: 20,
        saves: 3,
        shares: 5,
      }).map(([name, value]) => ({ name, total_value: { value } })),
    });
  });
  const { performance } = await fetchSnapshot("fixture-token", observedAt);
  assert.equal(performance.reach, 200); // Not the sum of daily unique accounts.
  assert.equal(performance.engagementRate, 5);
  assert.equal(performance.likes, 0);
  assert.equal(performance.profileLinkTaps, null);
  assert.equal(performance.interactions, 20);
  assert.deepEqual(
    performance.dailyReach.map((point) => point.value),
    [100, 140, 0],
  );
  assert.equal(performance.dailyReach[0].endTime, "2026-11-05T08:00:00.000Z");
});

test("rejects malformed performance totals and daily points", async (t) => {
  for (const invalid of ["total", "series"]) {
    const mock = t.mock.method(globalThis, "fetch", async (url) => {
      if (url.pathname.endsWith("/media")) return Response.json({ data: [] });
      if (url.pathname.endsWith("/me")) return Response.json(profile);
      if (url.searchParams.has("breakdown")) return Response.json({ data: [] });
      if (url.searchParams.get("metric_type") === "time_series") {
        return Response.json({
          data:
            invalid === "series"
              ? [{ name: "reach", values: [{ end_time: "invalid", value: 1 }] }]
              : [],
        });
      }
      return insight("reach", { value: invalid === "total" ? "200" : 200 });
    });
    await assert.rejects(
      fetchSnapshot("fixture-token", observedAt),
      /invalid reach count|Invalid daily reach value/,
    );
    mock.mock.restore();
  }
});

test("finds @uwummie among paginated Unified Login assets", async (t) => {
  const requests = t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url.origin, "https://graph.facebook.com");
    assert.equal(url.pathname, "/v26.0/me/assigned_instagram_accounts");
    return Response.json(
      url.searchParams.has("after")
        ? { data: [{ username: "uwummie", id: profile.user_id }] }
        : {
            data: [{ username: "other", id: "123" }],
            paging: {
              next: "https://untrusted.example",
              cursors: { after: "next-cursor" },
            },
          },
    );
  });
  assert.equal(await resolveUnifiedAccountId("fixture-token"), profile.user_id);
  assert.equal(requests.mock.callCount(), 2);
});

test("reports when a valid token has no assigned @uwummie account", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ data: [] }));
  await assert.rejects(
    resolveUnifiedAccountId("fixture-token"),
    /no assigned @uwummie/,
  );
});

test("builds one snapshot with a 30-day UTC window and a true zero count", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/media")) return Response.json({ data: [] });
    if (url.pathname.endsWith("/me")) return Response.json({ data: [profile] });
    assert.ok(url.pathname.endsWith(`/${profile.user_id}/insights`));
    if (url.searchParams.get("metric_type") === "time_series")
      return Response.json({ data: [] });
    if (!url.searchParams.has("breakdown")) {
      assert.equal(
        url.searchParams.get("since"),
        String(Date.parse("2026-10-08") / 1000),
      );
      assert.equal(
        url.searchParams.get("until"),
        String(Date.parse("2026-11-07") / 1000 - 1),
      );
      return insight("views", { value: 0 });
    }
    assert.equal(url.searchParams.get("timeframe"), "last_30_days");
    const dimension = url.searchParams.get("breakdown");
    const data = {
      age: { "65+": 50, "18-24": 50 },
      gender: { U: 50, F: 40, M: 90 },
      country: { JP: 1, CA: 2, BD: 3, PK: 4, PH: 5, US: 15, IN: 70 },
    };
    return demographics(dimension, data[dimension]);
  });

  const snapshot = await fetchSnapshot("fixture-token", observedAt);
  assert.equal(snapshot.followers, 300);
  assert.equal(snapshot.views, 0);
  assert.deepEqual(
    snapshot.audience.ages.map(({ id }) => id),
    ["18-24", "65+"],
  );
  assert.deepEqual(
    snapshot.audience.gender.map(({ id, value }) => [id, value.toFixed(1)]),
    [
      ["male", "69.2"],
      ["female", "30.8"],
    ],
  );
  assert.equal(snapshot.audience.countries.length, 5);
  assert.deepEqual(
    snapshot.audience.countries.map(({ id, value }) => [id, value]),
    [
      ["IN", 70],
      ["US", 15],
      ["PH", 5],
      ["PK", 4],
      ["others", 6],
    ],
  );
  assert.equal(snapshot.audience.countries[4].label, "Others");
  assert.deepEqual(snapshot.audience.countries[4].countries, [
    { id: "BD", label: "Bangladesh", value: 3 },
    { id: "CA", label: "Canada", value: 2 },
    { id: "JP", label: "Japan", value: 1 },
  ]);
  assert.deepEqual(snapshot.audience.countries[0], {
    id: "IN",
    label: "India",
    value: 70,
  });
});

test("represents empty views and privacy-limited demographics as unavailable", async (t) => {
  const requests = t.mock.method(globalThis, "fetch", async (url) =>
    url.pathname.endsWith("/me")
      ? Response.json({ ...profile, followers_count: 55 })
      : Response.json({ data: [] }),
  );

  const snapshot = await fetchSnapshot("fixture-token", observedAt);
  assert.equal(snapshot.views, null);
  assert.deepEqual(snapshot.audience, { gender: [], ages: [], countries: [] });
  assert.equal(requests.mock.callCount(), 36);
  assert.equal(snapshot.performance.reach, null);
  assert.equal(snapshot.performance.engagementRate, null);
  assert.deepEqual(snapshot.performance.dailyReach, []);
});

test("rejects tokens for a different account before requesting insights", async (t) => {
  const requests = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ ...profile, username: "different" }),
  );
  await assert.rejects(
    fetchSnapshot("fixture-token", observedAt),
    /must authorize @uwummie/,
  );
  assert.equal(requests.mock.callCount(), 1);
});

test("authorizes the worker and preserves the snapshot when Meta rejects a token", async (t) => {
  let handler;
  const settings = {
    INSTAGRAM_SYNC_SECRET: "test-sync-secret",
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SERVICE_ROLE_KEY: "fixture-service-key",
  };
  globalThis.Deno = {
    env: { get: (key) => settings[key] },
    serve: (run) => {
      handler = run;
    },
  };
  t.after(() => {
    delete globalThis.Deno;
  });
  await import("../supabase/functions/sync-instagram-stats/index.mjs");

  const operations = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const path = new URL(url).pathname;
    operations.push(path);
    if (path.endsWith("/read_instagram_mediakit_token")) {
      return Response.json({
        accessToken: "fixture-token",
        expiresAt: new Date(Date.now() + 60 * 86_400_000).toISOString(),
      });
    }
    assert.equal(options.redirect, "error");
    return Response.json(
      { error: { code: 190, message: "private Meta error" } },
      { status: 400 },
    );
  });
  const errors = t.mock.method(console, "error", () => {});
  const url = "https://example.supabase.co/functions/v1/sync-instagram-stats";

  assert.equal(
    (await handler(new Request(url, { method: "POST" }))).status,
    401,
  );
  assert.equal(operations.length, 0);
  const response = await handler(
    new Request(url, {
      method: "POST",
      headers: { "x-instagram-sync-secret": settings.INSTAGRAM_SYNC_SECRET },
    }),
  );
  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), { synced: false });
  assert.deepEqual(operations, [
    "/rest/v1/rpc/read_instagram_mediakit_token",
    "/v26.0/me",
  ]);
  assert.match(errors.mock.calls[0].arguments[0], /expired or was revoked/);
});

test("uses the winning credential when another run refreshes first", async (t) => {
  let handler;
  const settings = {
    INSTAGRAM_SYNC_SECRET: "test-sync-secret",
    SUPABASE_URL: "https://example.supabase.co",
    SUPABASE_SECRET_KEYS: JSON.stringify({ default: "fixture-secret-key" }),
  };
  globalThis.Deno = {
    env: { get: (key) => settings[key] },
    serve: (run) => {
      handler = run;
    },
  };
  t.after(() => {
    delete globalThis.Deno;
  });
  await import(
    "../supabase/functions/sync-instagram-stats/index.mjs?renewal-test"
  );

  const oldExpiry = new Date(Date.now() + 10 * 86_400_000).toISOString();
  let credentialReads = 0;
  let published = false;
  const historyEnd = new Date();
  historyEnd.setUTCHours(0, 0, 0, 0);
  const historyStart = new Date(
    historyEnd.getTime() - 5 * 86_400_000,
  ).toISOString();
  const savedHistory = {
    accountId: profile.user_id,
    start: historyStart,
    end: historyEnd.toISOString(),
    windows: [
      { start: historyStart, end: historyEnd.toISOString(), value: 80 },
    ],
  };
  const savedPerformanceHistory = {
    accountId: profile.user_id,
    start: historyStart,
    end: historyEnd.toISOString(),
    windows: [
      {
        start: historyStart,
        end: historyEnd.toISOString(),
        values: { views: 80 },
      },
    ],
  };
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const { pathname, searchParams } = new URL(url);
    switch (pathname) {
      case "/rest/v1/rpc/read_instagram_mediakit_token":
        assert.equal(options.headers.apikey, "fixture-secret-key");
        assert.equal(options.headers.Authorization, undefined);
        credentialReads += 1;
        return Response.json(
          credentialReads === 1
            ? { accessToken: "old-token", expiresAt: oldExpiry }
            : {
                accessToken: "winning-token",
                expiresAt: new Date(Date.now() + 60 * 86_400_000).toISOString(),
              },
        );
      case "/refresh_access_token":
        assert.equal(searchParams.get("access_token"), "old-token");
        assert.equal(searchParams.get("grant_type"), "ig_refresh_token");
        return Response.json({
          access_token: "replacement-token",
          expires_in: 5_184_000,
        });
      case "/rest/v1/rpc/replace_instagram_mediakit_token": {
        const args = JSON.parse(options.body);
        assert.equal(args.previous_expiry, oldExpiry);
        assert.equal(args.replacement.accessToken, "replacement-token");
        assert.ok(
          Date.parse(args.replacement.expiresAt) > Date.parse(oldExpiry),
        );
        return Response.json(false);
      }
      case "/v26.0/me":
        assert.equal(searchParams.get("access_token"), "winning-token");
        return Response.json(profile);
      case "/rest/v1/instagram_mediakit_stats":
        return Response.json([
          {
            snapshot: {
              performance: {
                bioLinkHistory: savedHistory,
                performanceHistory: savedPerformanceHistory,
              },
            },
          },
        ]);
      case `/v26.0/${profile.user_id}/insights`:
        if (searchParams.get("metric") === "website_clicks")
          return insight("website_clicks", { value: 123 });
        return Response.json({ data: [] });
      case "/rest/v1/rpc/publish_instagram_mediakit_stats": {
        const snapshot = JSON.parse(options.body).new_snapshot;
        const performance = snapshot.performance;
        assert.equal(performance.bioLinkHistory.start, historyStart);
        assert.equal(performance.bioLinkClicksTracked, 123);
        assert.equal(performance.bioLinkHistory.windows.length, 1);
        assert.equal(performance.performanceHistory.start, historyStart);
        assert.equal(
          performance.performanceHistory.windows[0].values.views,
          80,
        );
        assert.equal(
          performance.performanceHistory.windows[0].stale.views,
          true,
        );
        assert.equal(snapshot.performancePeriods.lifetime.views, null);
        assert.equal(snapshot.defaultPerformancePeriod, "lifetime");
        assert.equal(snapshot.schemaVersion, 3);
        published = true;
        return new Response(null, { status: 204 });
      }
      default:
        return Response.json({ data: [] });
    }
  });

  const response = await handler(
    new Request("https://example.supabase.co", {
      method: "POST",
      headers: { "x-instagram-sync-secret": settings.INSTAGRAM_SYNC_SECRET },
    }),
  );
  assert.equal(response.status, 200);
  assert.equal(credentialReads, 2);
  assert.equal(published, true);
});

test("averages all posts across pages, deduplicates media and uses the current follower count", async (t) => {
  const seen = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    seen.push(url);
    assert.equal(url.origin, "https://graph.facebook.com");
    assert.equal(url.pathname, `/v26.0/${profile.user_id}/media`);
    assert.equal(
      url.searchParams.get("fields"),
      "id,like_count,comments_count,timestamp",
    );
    const first = { id: "1", like_count: 100, comments_count: 10 };
    return Response.json(
      url.searchParams.has("after")
        ? { data: [first, { id: "2", like_count: 0, comments_count: 0 }] }
        : {
            data: [first],
            paging: {
              next: "https://untrusted.example/ignored",
              cursors: { after: "page-two" },
            },
          },
    );
  });
  const result = await fetchPostAverages(
    "https://graph.facebook.com",
    profile.user_id,
    "fixture",
    1000,
    2,
  );
  assert.deepEqual(result, {
    averageLikes: 50,
    averageComments: 5,
    followerEngagement: 5.5,
  });
  assert.equal(seen.length, 2);
  assert.equal(seen[1].searchParams.get("after"), "page-two");
});

test("does not convert hidden counts into zero, or publish partial all-post averages", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ data: [{ id: "1", comments_count: 0 }] }),
  );
  const run = (followers, expected) =>
    fetchPostAverages(
      "https://graph.instagram.com",
      profile.user_id,
      "fixture",
      followers,
      expected,
    );
  assert.deepEqual(await run(100, 1), {
    averageLikes: null,
    averageComments: 0,
    followerEngagement: null,
  });
  assert.deepEqual(await run(100, 2), {
    averageLikes: null,
    averageComments: null,
    followerEngagement: null,
  });
});

test("avoids zero follower division and rejects repeated media cursors", async (t) => {
  const mock = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ data: [{ id: "1", like_count: 10, comments_count: 2 }] }),
  );
  assert.deepEqual(
    await fetchPostAverages(
      "https://graph.instagram.com",
      profile.user_id,
      "fixture",
      0,
      1,
    ),
    {
      averageLikes: 10,
      averageComments: 2,
      followerEngagement: null,
    },
  );
  mock.mock.mockImplementation(async () =>
    Response.json({
      data: [],
      paging: { next: "ignored", cursors: { after: "same" } },
    }),
  );
  await assert.rejects(
    fetchPostAverages(
      "https://graph.instagram.com",
      profile.user_id,
      "fixture",
      100,
      1,
    ),
    /Invalid Instagram media cursor/,
  );
});

test("keeps core performance available when the optional media query is denied", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/me")) return Response.json(profile);
    if (url.pathname.endsWith("/media"))
      return Response.json({ error: { code: 10 } }, { status: 403 });
    if (
      url.searchParams.get("metric_type") === "total_value" &&
      !url.searchParams.has("breakdown")
    )
      return insight("reach", { value: 250 });
    return Response.json({ data: [] });
  });
  const { performance } = await fetchSnapshot("fixture", observedAt);
  assert.equal(performance.reach, 250);
  assert.equal(performance.averageLikes, null);
  assert.equal(performance.bioLinkClicksTracked, null);
});
