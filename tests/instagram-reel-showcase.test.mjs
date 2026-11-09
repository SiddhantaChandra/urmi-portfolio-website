import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchPostAverages } from "../supabase/functions/sync-instagram-stats/instagram.mjs";
import { selectReelShowcase } from "../supabase/functions/sync-instagram-stats/reel-showcase.mjs";

const posts = Array.from({ length: 8 }, (_, index) => ({
  id: String(index + 1),
  media_product_type: "REELS",
  caption: `Published reel ${index + 1}`,
  timestamp: `2026-11-0${index + 1}T12:00:00Z`,
  thumbnail_url: `https://scontent.cdninstagram.com/reel-${index + 1}.jpg`,
  permalink: `https://www.instagram.com/reel/reel-${index + 1}/`,
  like_count: 1,
  comments_count: 0,
}));
const insights = new Map(
  posts.map((post, index) => [post.id, { views: 800 - index * 100 }]),
);

test("selects five newest reels and five most viewed lifetime reels independently", () => {
  const result = selectReelShowcase(
    [
      ...posts.toReversed(),
      { ...posts[0], id: "feed", media_product_type: "FEED" },
    ],
    insights,
  );
  assert.deepEqual(
    result.recent.map((reel) => reel.id),
    ["8", "7", "6", "5", "4"],
  );
  assert.deepEqual(
    result.popular.map((reel) => reel.id),
    ["1", "2", "3", "4", "5"],
  );
  assert.equal(result.ranking, "lifetime_views");
  assert.equal(result.recent[0].thumbnailUrl, posts[7].thumbnail_url);
  assert.equal(result.recent[0].permalink, posts[7].permalink);
  assert.equal(result.recent[0].caption, posts[7].caption);
  assert.equal(result.popular[0].views, 800);
});

test("keeps recent reels when insights fail, but never claims a partial popularity ranking", () => {
  const partial = new Map(insights);
  partial.set("1", { views: null });
  const result = selectReelShowcase(posts, partial);
  assert.equal(result.recent.length, 5);
  assert.deepEqual(result.popular, []);
  const zeroes = new Map(posts.map((post) => [post.id, { views: 0 }]));
  assert.deepEqual(
    selectReelShowcase(posts, zeroes).popular.map((reel) => reel.id),
    ["8", "7", "6", "5", "4"],
  );
});

test("deduplicates a trial/normal caption pair before filling all five recent slots", () => {
  const caption = "The same detailed film recommendation. ".repeat(5);
  const result = selectReelShowcase(
    posts.map((post, index) => ({
      ...post,
      caption: index >= 6 ? caption : post.caption,
    })),
    insights,
  );
  assert.deepEqual(
    result.recent.map((reel) => reel.id),
    ["8", "6", "5", "4", "3"],
  );
  assert.equal(result.popular.length, 5);
});

test("prefers a feed-shared version of a duplicate and preserves distinct generic captions", () => {
  const caption =
    "A detailed film recommendation about growing up and learning to enjoy the present. ".repeat(
      2,
    );
  const result = selectReelShowcase(
    posts.map((post, index) => ({
      ...post,
      caption: index >= 6 ? caption : "New reel",
      is_shared_to_feed: index === 6,
    })),
    insights,
  );
  assert.deepEqual(
    result.recent.map((reel) => reel.id),
    ["7", "6", "5", "4", "3"],
  );
  assert.equal(result.recent[0].sharedToFeed, true);
  assert.equal(result.recent[1].sharedToFeed, false);
});

test("hashtag changes do not let a trial copy occupy a second recent slot", () => {
  const caption =
    "On-Gaku is a refreshing film about making music simply because you enjoy it. ".repeat(
      3,
    );
  const result = selectReelShowcase(
    posts.map((post, index) => ({
      ...post,
      caption:
        index === 7
          ? `${caption}\n#animereel #音楽`
          : index === 6
            ? `${caption}\n#indieanime`
            : post.caption,
    })),
    insights,
  );
  assert.deepEqual(
    result.recent.map((reel) => reel.id),
    ["8", "6", "5", "4", "3"],
  );
});

test("rejects unsafe links, preserves absent thumbnails and captions, and handles empty accounts", () => {
  const result = selectReelShowcase(
    [
      { ...posts[0], caption: undefined, thumbnail_url: undefined },
      {
        ...posts[1],
        thumbnail_url: "https://cdninstagram.com.attacker.test/image.jpg",
      },
      { ...posts[2], permalink: "javascript:alert(1)" },
      { ...posts[3], permalink: "https://instagram.com.attacker.test/reel/x" },
      { ...posts[4], timestamp: "invalid" },
      { ...posts[5], thumbnail_url: "https://scontent.fbcdn.net/cover.jpg" },
    ],
    insights,
  );
  assert.deepEqual(
    result.recent.map((reel) => reel.id),
    ["6", "2", "1"],
  );
  assert.equal(result.recent[1].thumbnailUrl, null);
  assert.equal(result.recent[2].caption, "");
  assert.equal(result.recent[2].thumbnailUrl, null);
  assert.equal(
    result.recent[0].thumbnailUrl,
    "https://scontent.fbcdn.net/cover.jpg",
  );
  assert.deepEqual(selectReelShowcase([], new Map()), {
    ranking: "lifetime_views",
    recent: [],
    popular: [],
  });
});

test("reuses paginated deduplicated media and reel insights without adding Meta requests", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(url);
    if (url.pathname.endsWith("/media")) {
      for (const field of [
        "caption",
        "thumbnail_url",
        "permalink",
        "timestamp",
        "media_product_type",
        "is_shared_to_feed",
      ])
        assert.ok(url.searchParams.get("fields").split(",").includes(field));
      return Response.json(
        url.searchParams.has("after")
          ? { data: posts.slice(3) }
          : {
              data: posts.slice(0, 4),
              paging: {
                next: "https://untrusted.test/?access_token=secret",
                cursors: { after: "next" },
              },
            },
      );
    }
    const id = url.pathname.split("/").at(-2);
    assert.equal(url.searchParams.get("period"), "lifetime");
    return Response.json({
      data: [{ name: "views", values: [{ value: insights.get(id).views }] }],
    });
  });
  const result = await fetchPostAverages(
    "https://graph.facebook.com",
    "123",
    "fixture",
    100,
    8,
    true,
    undefined,
    true,
    true,
  );
  assert.equal(calls.length, 10);
  assert.deepEqual(
    result.reels.showcase.recent.map((reel) => reel.id),
    ["8", "7", "6", "5", "4"],
  );
  assert.deepEqual(
    result.reels.showcase.popular.map((reel) => reel.id),
    ["1", "2", "3", "4", "5"],
  );
  assert.equal(JSON.stringify(result).includes("access_token"), false);
});

test("does not publish selections from an incomplete account traversal", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json({ data: posts.slice(0, 2) }),
  );
  const result = await fetchPostAverages(
    "https://graph.facebook.com",
    "123",
    "fixture",
    100,
    8,
    true,
    undefined,
    true,
    true,
  );
  assert.equal(result.reels, undefined);
});

test("retries missing ranking views independently of unavailable watch-time metrics", async (t) => {
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url) => {
    calls.push(url);
    if (url.pathname.endsWith("/media")) return Response.json({ data: posts });
    if (url.searchParams.get("metric") !== "views")
      return Response.json({ error: { code: 100 } }, { status: 400 });
    const id = url.pathname.split("/").at(-2);
    return Response.json({
      data: [{ name: "views", values: [{ value: insights.get(id).views }] }],
    });
  });
  const result = await fetchPostAverages(
    "https://graph.facebook.com",
    "123",
    "fixture",
    100,
    8,
    true,
    undefined,
    true,
    true,
  );
  assert.equal(result.reels.showcase.popular.length, 5);
  assert.equal(result.reels.averageViews, 450);
  assert.equal(result.reels.totalWatchTimeHours, null);
  assert.equal(calls.length, 17);
});
