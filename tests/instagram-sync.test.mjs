import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchSnapshot } from "../supabase/functions/sync-instagram-stats/instagram.mjs";

const observedAt = "2026-11-07T09:00:00.000Z";
const profile = {
  user_id: "17841401130346306",
  username: "uwummie",
  followers_count: 300,
};

test("fetches all Unified Login metrics for the configured Instagram account", async (t) => {
  const accountId = profile.user_id;
  const requests = t.mock.method(globalThis, "fetch", async (url) => {
    assert.equal(url.origin, "https://graph.facebook.com");
    if (url.pathname === `/v26.0/${accountId}`) {
      assert.equal(
        url.searchParams.get("fields"),
        "id,username,followers_count",
      );
      return Response.json({
        id: accountId,
        username: "uwummie",
        followers_count: 300,
      });
    }
    assert.equal(url.pathname, `/v26.0/${accountId}/insights`);
    if (url.searchParams.get("metric") === "views") {
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
  assert.equal(requests.mock.callCount(), 5);
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

test("builds one snapshot with a 30-day UTC window and a true zero count", async (t) => {
  t.mock.method(globalThis, "fetch", async (url) => {
    if (url.pathname.endsWith("/me")) return Response.json({ data: [profile] });
    assert.ok(url.pathname.endsWith(`/${profile.user_id}/insights`));
    if (url.searchParams.get("metric") === "views") {
      assert.equal(
        url.searchParams.get("since"),
        String(Date.parse("2026-10-08") / 1000),
      );
      assert.equal(
        url.searchParams.get("until"),
        String(Date.parse("2026-11-07") / 1000),
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
  assert.equal(snapshot.audience.countries.length, 6);
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
  assert.equal(requests.mock.callCount(), 2);
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
      case "/rest/v1/rpc/publish_instagram_mediakit_stats":
        published = true;
        return new Response(null, { status: 204 });
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
