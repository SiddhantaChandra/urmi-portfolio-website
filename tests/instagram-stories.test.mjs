import assert from "node:assert/strict";
import { test } from "node:test";
import { readStoryAverage } from "../app/api/instagram-stats/story-average.mjs";
import { fetchStoryObservations } from "../supabase/functions/sync-instagram-stories/stories.mjs";

const credential = { accountId: "123", accessToken: "fixture-token" };
const observedAt = "2026-11-08T16:00:00.000Z";
const timestamp = "2026-11-08T01:00:00+0000";
const profile = { id: "123", username: "uwummie" };
const insight = (value) => ({
  data: [{ name: "views", values: [{ value }] }],
});

test("hourly collection deduplicates Stories, keeps timestamps and never fetches account insights", async (t) => {
  const requests = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    requests.push(url);
    assert.equal(url.origin, "https://graph.facebook.com");
    if (url.pathname === "/v26.0/123") return Response.json(profile);
    if (url.pathname.endsWith("/stories")) {
      assert.equal(url.searchParams.get("fields"), "id,timestamp");
      return Response.json(
        url.searchParams.has("after")
          ? {
              data: [
                { id: "1", timestamp },
                { id: "2", timestamp },
              ],
            }
          : {
              data: [{ id: "1", timestamp }],
              paging: {
                next: "https://untrusted.example/ignored",
                cursors: { after: "page-two" },
              },
            },
      );
    }
    assert.ok(
      ["/v26.0/1/insights", "/v26.0/2/insights"].includes(url.pathname),
    );
    assert.equal(url.searchParams.get("metric"), "views");
    return Response.json(insight(url.pathname.includes("/1/") ? 100 : 0));
  });
  assert.deepEqual(await fetchStoryObservations(credential, observedAt), {
    accountId: "123",
    observations: [
      { story_id: "1", published_at: "2026-11-08T01:00:00.000Z", views: 100 },
      { story_id: "2", published_at: "2026-11-08T01:00:00.000Z", views: 0 },
    ],
  });
  assert.equal(requests.length, 5);
});

test("preserves unavailable per-Story counts as null and supports no active Stories", async (t) => {
  let stories = [
    { id: "1", timestamp },
    { id: "2", timestamp },
  ];
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname === "/v26.0/123") return Response.json(profile);
    if (url.pathname.endsWith("/stories"))
      return Response.json({ data: stories });
    return url.pathname.includes("/1/")
      ? Response.json({ error: { code: 10 } }, { status: 403 })
      : Response.json({ data: [] });
  });
  const result = await fetchStoryObservations(credential, observedAt);
  assert.deepEqual(
    result.observations.map((story) => story.views),
    [null, null],
  );
  stories = [];
  assert.deepEqual(await fetchStoryObservations(credential, observedAt), {
    accountId: "123",
    observations: [],
  });
});

test("rejects another account, invalid publication dates and repeated cursors", async (t) => {
  let scenario = "account";
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname === "/v26.0/123")
      return Response.json(
        scenario === "account" ? { ...profile, username: "other" } : profile,
      );
    assert.ok(url.pathname.endsWith("/stories"));
    return Response.json({
      data: [
        {
          id: "1",
          timestamp:
            scenario === "date"
              ? "invalid"
              : scenario === "future"
                ? "2026-11-09T00:00:00Z"
                : timestamp,
        },
      ],
      ...(scenario === "cursor"
        ? { paging: { next: "ignored", cursors: { after: "same" } } }
        : {}),
    });
  });
  for (const value of ["account", "date", "future", "cursor"]) {
    scenario = value;
    await assert.rejects(
      fetchStoryObservations(credential, observedAt),
      /authorize @uwummie|timestamp|cursor/,
    );
  }
});

test("the hourly collector also supports existing Instagram Login credentials", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url.origin, "https://graph.instagram.com");
    if (url.pathname.endsWith("/me"))
      return Response.json({ user_id: "123", username: "uwummie" });
    assert.equal(url.pathname, "/v26.0/123/stories");
    return Response.json({ data: [] });
  });
  assert.deepEqual(
    await fetchStoryObservations({ accessToken: "fixture" }, observedAt),
    {
      accountId: "123",
      observations: [],
    },
  );
});

test("reads durable averages without a five-minute expiry and validates missing/zero data", async (t) => {
  let row = {
    account_id: "123",
    average_views: 120,
    story_count: 2,
    observed_at: "2026-01-01T00:00:00Z",
  };
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url.pathname, "/rest/v1/instagram_story_averages");
    assert.equal(url.searchParams.get("account_id"), "eq.123");
    assert.equal(options.headers.apikey, "public-fixture");
    return Response.json(row ? [row] : []);
  });
  const read = () =>
    readStoryAverage("https://example.supabase.co", "public-fixture", "123");
  assert.deepEqual(await read(), {
    views: 120,
    count: 2,
    scope: "completed",
    observedAt: row.observed_at,
  });
  row = { ...row, average_views: 0 };
  assert.equal((await read()).views, 0);
  row = { ...row, average_views: null, story_count: 0 };
  assert.equal((await read()).views, null);
  row = { ...row, story_count: 2 };
  assert.equal(await read(), null);
  row = null;
  assert.equal(await read(), null);
  assert.equal(await readStoryAverage(undefined, undefined), null);
});

test("uses active Story views until completed history exists, including real zeroes", async (t) => {
  let row = {
    average_views: null,
    story_count: 0,
    active_average_views: 100,
    active_story_count: 2,
    observed_at: observedAt,
  };
  t.mock.method(globalThis, "fetch", async () => Response.json([row]));
  const read = () => readStoryAverage("https://example.supabase.co", "fixture");
  assert.deepEqual(await read(), {
    views: 100,
    count: 2,
    scope: "active",
    observedAt,
  });
  row = { ...row, active_average_views: 0 };
  assert.equal((await read()).views, 0);
  row = { ...row, average_views: 200, story_count: 1 };
  assert.equal((await read()).views, 200);
  assert.equal((await read()).scope, "completed");
  row = {
    ...row,
    average_views: null,
    story_count: 0,
    active_average_views: null,
  };
  assert.equal((await read()).views, null);
  assert.equal((await read()).count, 0);
});

test("worker requires authorization and writes only Story observations, preserving stored data on failure", async (t) => {
  let handler;
  const settings = {
    INSTAGRAM_SYNC_SECRET: "fixture-sync-secret",
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
  await import("../supabase/functions/sync-instagram-stories/index.mjs");
  const operations = [];
  let fail = false;
  t.mock.method(console, "error", () => {});
  t.mock.method(globalThis, "fetch", async (url, options) => {
    const path = new URL(url).pathname;
    operations.push(path);
    if (path.endsWith("/read_instagram_mediakit_token"))
      return Response.json(credential);
    if (path === "/v26.0/123") return Response.json(profile);
    if (path.endsWith("/stories")) {
      if (fail) throw new Error("fixture failure");
      return Response.json({ data: [] });
    }
    assert.equal(path, "/rest/v1/rpc/save_instagram_story_views");
    assert.equal(options.headers.apikey, "fixture-secret-key");
    const args = JSON.parse(options.body);
    assert.equal(args.new_account_id, "123");
    assert.deepEqual(args.new_observations, []);
    assert.ok(Number.isFinite(Date.parse(args.new_observed_at)));
    return new Response(null, { status: 204 });
  });
  const request = (authorized = false, method = "POST") =>
    new Request("https://example.supabase.co", {
      method,
      ...(authorized
        ? {
            headers: {
              "x-instagram-sync-secret": settings.INSTAGRAM_SYNC_SECRET,
            },
          }
        : {}),
    });
  assert.equal((await handler(request(false, "GET"))).status, 405);
  assert.equal((await handler(request())).status, 401);
  assert.equal(operations.length, 0);
  assert.equal((await handler(request(true))).status, 200);
  assert.equal(operations.length, 4);
  operations.length = 0;
  fail = true;
  assert.equal((await handler(request(true))).status, 502);
  assert.ok(
    !operations.some((path) => path.endsWith("/save_instagram_story_views")),
  );
});
