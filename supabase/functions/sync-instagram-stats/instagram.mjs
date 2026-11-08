const instagramOrigin = "https://graph.instagram.com";
const unifiedOrigin = "https://graph.facebook.com";
const day = 86_400_000;
const username = "uwummie";
const countryNames = new Intl.DisplayNames(["en"], {
  type: "region",
  fallback: "none",
});
const genderLabels = {
  M: { id: "male", label: "Male" },
  F: { id: "female", label: "Female" },
};

export class SyncError extends Error {}

export async function resolveUnifiedAccountId(accessToken) {
  let after;
  do {
    const body = await graphRequest(
      unifiedOrigin,
      "/v26.0/me/assigned_instagram_accounts",
      { fields: "id,username", limit: 100, ...(after ? { after } : {}) },
      accessToken,
      "Instagram account lookup",
    );
    if (!Array.isArray(body?.data)) {
      throw new SyncError("Invalid Instagram account lookup response");
    }
    const account = body.data.find(
      (item) => item?.username?.toLowerCase() === username,
    );
    if (account && typeof account.id === "string" && /^\d+$/.test(account.id)) {
      return account.id;
    }
    const next = body.paging?.next ? body.paging?.cursors?.after : undefined;
    if (next && next === after)
      throw new SyncError("Invalid Instagram account cursor");
    after = next;
  } while (after);
  throw new SyncError(
    "The Meta token has no assigned @uwummie account. Share @uwummie with this app in Meta's Unified Login setup.",
  );
}

function isCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

export async function graphRequest(origin, path, params, token, operation) {
  const url = new URL(path, origin);
  url.search = new URLSearchParams({ ...params, access_token: token });

  try {
    const response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(8000),
    });
    const body = await response.json();
    if (body?.error?.code === 190) {
      throw new SyncError("Instagram authorization expired or was revoked");
    }
    if (!response.ok || body?.error) {
      const code = body?.error?.code;
      const detail = Number.isInteger(code) ? `, Meta code ${code}` : "";
      throw new SyncError(`${operation} failed (${response.status}${detail})`);
    }
    return body;
  } catch (error) {
    if (error instanceof SyncError) throw error;
    throw new SyncError(
      `${operation} returned an unreadable response or timed out`,
    );
  }
}

export async function refreshCredential(accessToken) {
  const body = await graphRequest(
    instagramOrigin,
    "/refresh_access_token",
    { grant_type: "ig_refresh_token" },
    accessToken,
    "Token refresh",
  );
  if (
    !body?.access_token ||
    typeof body.access_token !== "string" ||
    !isCount(body.expires_in) ||
    body.expires_in === 0
  ) {
    throw new SyncError("Instagram returned an invalid refreshed credential");
  }
  return {
    accessToken: body.access_token,
    expiresAt: new Date(Date.now() + body.expires_in * 1000).toISOString(),
  };
}

function metricTotal(body, name) {
  if (!Array.isArray(body?.data)) {
    throw new SyncError(`Invalid ${name} insight response`);
  }
  if (body.data.length === 0) return null;
  const metric = body.data.find((item) => item?.name === name);
  if (!metric) return null;
  const result = metric.total_value;
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new SyncError(`Missing ${name} insight total`);
  }
  return result;
}

const performanceMetrics = [
  "views",
  "reach",
  "accounts_engaged",
  "likes",
  "comments",
  "total_interactions",
  "saves",
  "shares",
  "profile_links_taps",
];

function insightCount(body, name) {
  const total = metricTotal(body, name);
  if (total === null) return null;
  if (!isCount(total.value)) {
    throw new SyncError(`Instagram returned an invalid ${name} count`);
  }
  return total.value;
}

function reachSeries(body) {
  if (!Array.isArray(body?.data)) {
    throw new SyncError("Invalid daily reach response");
  }
  const metric = body.data.find((item) => item?.name === "reach");
  if (!metric) return [];
  if (!Array.isArray(metric.values)) {
    throw new SyncError("Missing daily reach values");
  }
  const points = metric.values.map((point) => {
    const end = Date.parse(point?.end_time);
    if (!Number.isFinite(end) || !isCount(point?.value)) {
      throw new SyncError("Invalid daily reach value");
    }
    return { endTime: new Date(end).toISOString(), value: point.value };
  });
  return points.sort((a, b) => a.endTime.localeCompare(b.endTime));
}

function chartCategory(dimension, key) {
  if (dimension === "gender") {
    return Object.hasOwn(genderLabels, key) ? genderLabels[key] : null;
  }
  if (dimension === "age") {
    if (!/^\d{2}(?:-\d{2}|\+)$/.test(key)) {
      return { id: "unknown", label: "Unknown" };
    }
    return { id: key, label: key.replace("-", "–") };
  }
  if (!/^(?:[A-Z]{2}|\d{3})$/.test(key)) {
    return { id: "unknown", label: "Unknown" };
  }
  return { id: key, label: countryNames.of(key) ?? key };
}

function demographicChart(body, dimension) {
  const total = metricTotal(body, "follower_demographics");
  if (total === null || total.breakdowns?.length === 0) return [];

  const breakdown = Array.isArray(total.breakdowns)
    ? total.breakdowns.find(
        (item) =>
          Array.isArray(item?.dimension_keys) &&
          item.dimension_keys.includes(dimension),
      )
    : null;
  if (!breakdown || !Array.isArray(breakdown.results)) {
    throw new SyncError(`Invalid ${dimension} demographics response`);
  }

  const index = breakdown.dimension_keys.indexOf(dimension);
  const categories = new Map();
  let population = 0;
  for (const row of breakdown.results) {
    const key = row?.dimension_values?.[index];
    if (
      !Array.isArray(row?.dimension_values) ||
      typeof key !== "string" ||
      !isCount(row.value)
    ) {
      throw new SyncError(`Invalid ${dimension} demographics bucket`);
    }
    if (row.value === 0) continue;
    const category = chartCategory(dimension, key);
    if (!category) continue;
    const count = (categories.get(category.id)?.count ?? 0) + row.value;
    categories.set(category.id, { ...category, count });
    population += row.value;
  }

  const buckets = [...categories.values()];
  if (dimension === "country") {
    buckets.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
  } else if (dimension === "age") {
    buckets.sort((a, b) => a.id.localeCompare(b.id));
  } else {
    const order = ["male", "female"];
    buckets.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  }

  const chartBuckets = dimension === "country" ? buckets.slice(0, 4) : buckets;
  if (dimension === "country" && buckets.length > 4) {
    chartBuckets.push({
      id: "others",
      label: "Others",
      count: buckets.slice(4).reduce((sum, bucket) => sum + bucket.count, 0),
      countries: buckets.slice(4, 7).map(({ id, label, count }) => ({
        id,
        label,
        value: (count / population) * 100,
      })),
    });
  }

  return chartBuckets.map(({ id, label, count, countries }) => ({
    id,
    label,
    value: (count / population) * 100,
    ...(countries ? { countries } : {}),
  }));
}

const unavailablePostAverages = {
  averageLikes: null,
  averageComments: null,
  followerEngagement: null,
};

const unavailableReels = {
  averageViews: null,
  averageReach: null,
  averageWatchTimeSeconds: null,
  totalWatchTimeHours: null,
};

// Media insights are lifetime values. Keep reels independent of account periods.
export async function fetchReelPerformance(origin, token, posts) {
  if (posts.some((post) => typeof post.media_product_type !== "string"))
    return { ...unavailableReels };
  const reels = posts.filter((post) => post.media_product_type === "REELS");
  const insights = [];
  // Bound concurrency rather than opening one connection per published reel.
  for (let offset = 0; offset < reels.length; offset += 6) {
    insights.push(
      ...(await Promise.all(
        reels.slice(offset, offset + 6).map(async (reel) => {
          try {
            const body = await graphRequest(
              origin,
              `/v26.0/${reel.id}/insights`,
              {
                metric:
                  "views,reach,ig_reels_avg_watch_time,ig_reels_video_view_total_time",
                period: "lifetime",
              },
              token,
              "Instagram reel insights",
            );
            const value = (name) => {
              const metric = body?.data?.find((item) => item.name === name);
              const count = metric?.values?.[0]?.value;
              return Number.isFinite(count) && count >= 0 ? count : null;
            };
            return {
              views: value("views"),
              reach: value("reach"),
              averageWatchTime: value("ig_reels_avg_watch_time"),
              totalWatchTime: value("ig_reels_video_view_total_time"),
            };
          } catch {
            return {
              views: null,
              reach: null,
              averageWatchTime: null,
              totalWatchTime: null,
            };
          }
        }),
      )),
    );
  }
  // Missing insights must not produce a plausible but partial lifetime figure.
  const sum = (key) =>
    insights.every((item) => item[key] !== null)
      ? insights.reduce((total, item) => total + item[key], 0)
      : null;
  const views = sum("views");
  const reach = sum("reach");
  const averageWatchTime = sum("averageWatchTime");
  const totalWatchTime = sum("totalWatchTime");
  return {
    averageViews: reels.length && views !== null ? views / reels.length : null,
    averageReach: reels.length && reach !== null ? reach / reels.length : null,
    // Meta reports both watch-time insights in milliseconds.
    averageWatchTimeSeconds:
      reels.length && averageWatchTime !== null
        ? averageWatchTime / reels.length / 1000
        : null,
    totalWatchTimeHours:
      totalWatchTime === null ? null : totalWatchTime / 3_600_000,
  };
}

// Stories expire after 24 hours; these are current views, never a lifetime total.
export async function fetchStoryPerformance(origin, accountId, token) {
  const stories = new Set();
  const cursors = new Set();
  let after;
  let complete = false;
  for (let page = 0; page < 100; page++) {
    const body = await graphRequest(
      origin,
      `/v26.0/${accountId}/stories`,
      { fields: "id", limit: 100, ...(after ? { after } : {}) },
      token,
      "Instagram active Stories",
    );
    if (!Array.isArray(body?.data))
      throw new SyncError("Invalid Instagram Stories response");
    for (const story of body.data) {
      if (typeof story?.id !== "string" || !/^\d+$/.test(story.id))
        throw new SyncError("Invalid Instagram Story ID");
      stories.add(story.id);
    }
    if (!body.paging?.next) {
      complete = true;
      break;
    }
    after = body.paging?.cursors?.after;
    if (typeof after !== "string" || !after || cursors.has(after))
      throw new SyncError("Invalid Instagram Stories cursor");
    cursors.add(after);
  }
  if (!complete) return { views: null, scope: "active" };
  const ids = [...stories];
  const values = [];
  for (let offset = 0; offset < ids.length; offset += 6) {
    values.push(
      ...(await Promise.all(
        ids.slice(offset, offset + 6).map(async (id) => {
          try {
            const body = await graphRequest(
              origin,
              `/v26.0/${id}/insights`,
              { metric: "views", period: "lifetime" },
              token,
              "Instagram Story views",
            );
            const metric = body?.data?.find((item) => item.name === "views");
            const value = metric?.values?.[0]?.value;
            return isCount(value) ? value : null;
          } catch {
            // Expiry, privacy limits, and failures never turn into zero views.
            return null;
          }
        }),
      )),
    );
  }
  return {
    views: values.every((value) => value !== null)
      ? values.reduce((sum, value) => sum + value, 0)
      : null,
    count: ids.length,
    scope: "active",
  };
}

// Traverse only our fixed media endpoint; never follow a token-bearing paging URL.
export async function fetchPostAverages(
  origin,
  accountId,
  token,
  followers,
  expectedPosts,
  includeTotals = false,
  window,
  includeReels = false,
) {
  if (expectedPosts === 0)
    return {
      ...unavailablePostAverages,
      ...(includeTotals ? { totalLikes: 0, totalComments: 0 } : {}),
      ...(includeReels
        ? { reels: { ...unavailableReels, totalWatchTimeHours: 0 } }
        : {}),
    };
  const posts = new Map();
  const cursors = new Set();
  let after;
  for (let page = 0; page < 100; page++) {
    const body = await graphRequest(
      origin,
      `/v26.0/${accountId}/media`,
      {
        fields: `id,like_count,comments_count,timestamp${includeReels ? ",media_product_type" : ""}`,
        limit: 100,
        ...(after ? { after } : {}),
      },
      token,
      "Instagram all-post averages",
    );
    if (!Array.isArray(body?.data))
      throw new SyncError("Invalid Instagram media response");
    for (const post of body.data) {
      if (typeof post?.id !== "string" || !post.id)
        throw new SyncError("Invalid Instagram media ID");
      posts.set(post.id, post);
    }
    if (!body.paging?.next) {
      if (!posts.size || (isCount(expectedPosts) && posts.size < expectedPosts))
        return { ...unavailablePostAverages };
      const values = [...posts.values()];
      const average = (field) =>
        values.every((post) => isCount(post[field]))
          ? values.reduce((sum, post) => sum + post[field], 0) / posts.size
          : null;
      const averageLikes = average("like_count");
      const averageComments = average("comments_count");
      let recentAverages = { ...unavailablePostAverages };
      if (
        window &&
        values.every((post) => Number.isFinite(Date.parse(post.timestamp)))
      ) {
        const recent = values.filter((post) => {
          const timestamp = Date.parse(post.timestamp);
          return (
            timestamp >= Date.parse(window.start) &&
            timestamp < Date.parse(window.end)
          );
        });
        const recentAverage = (field) =>
          recent.length && recent.every((post) => isCount(post[field]))
            ? recent.reduce((sum, post) => sum + post[field], 0) / recent.length
            : null;
        const likes = recentAverage("like_count");
        const comments = recentAverage("comments_count");
        recentAverages = {
          averageLikes: likes,
          averageComments: comments,
          followerEngagement:
            followers > 0 && likes !== null && comments !== null
              ? ((likes + comments) / followers) * 100
              : null,
        };
      }
      return {
        averageLikes,
        averageComments,
        ...(includeReels
          ? { reels: await fetchReelPerformance(origin, token, values) }
          : {}),
        ...(window ? { recentAverages } : {}),
        ...(includeTotals
          ? {
              totalLikes:
                averageLikes === null
                  ? null
                  : values.reduce((sum, post) => sum + post.like_count, 0),
              totalComments:
                averageComments === null
                  ? null
                  : values.reduce((sum, post) => sum + post.comments_count, 0),
            }
          : {}),
        followerEngagement:
          followers > 0 && averageLikes !== null && averageComments !== null
            ? ((averageLikes + averageComments) / followers) * 100
            : null,
      };
    }
    after = body.paging?.cursors?.after;
    if (typeof after !== "string" || !after || cursors.has(after))
      throw new SyncError("Invalid Instagram media cursor");
    cursors.add(after);
  }
  // A capped or incomplete traversal must not be reported as an all-post average.
  return { ...unavailablePostAverages };
}

// Website clicks are additive. Keep disjoint UTC windows so later syncs replace
// recent totals rather than adding overlapping rolling 30-day counts.
export async function fetchBioLinkHistory(
  origin,
  accountId,
  token,
  observedAt,
  previous,
) {
  const end = new Date(observedAt);
  end.setUTCHours(0, 0, 0, 0);
  const earliest = new Date(end);
  earliest.setUTCFullYear(earliest.getUTCFullYear() - 2);
  earliest.setUTCDate(earliest.getUTCDate() + 1);
  const endMs = end.getTime();
  const earliestMs = earliest.getTime();
  let start = earliestMs;
  const saved = new Map();
  if (previous?.accountId === accountId && Array.isArray(previous.windows)) {
    let boundary = Date.parse(previous.start);
    if (
      !Number.isFinite(boundary) ||
      boundary % day ||
      boundary >= endMs ||
      endMs - boundary > 1000 * 30 * day ||
      previous.windows.length > 1000
    )
      throw new SyncError("Invalid saved bio-link history");
    start = boundary;
    for (const window of previous.windows) {
      const windowEnd = Date.parse(window.end);
      if (
        Date.parse(window.start) !== boundary ||
        !Number.isFinite(windowEnd) ||
        windowEnd % day ||
        windowEnd <= boundary ||
        windowEnd - boundary > 30 * day ||
        windowEnd > endMs ||
        (window.value !== null && !isCount(window.value))
      )
        throw new SyncError("Invalid saved bio-link window");
      saved.set(boundary, window);
      boundary = windowEnd;
    }
  }
  const windows = [];
  for (let since = start; since < endMs; since += 30 * day) {
    const until = Math.min(since + 30 * day, endMs);
    const old = saved.get(since);
    windows.push({
      start: new Date(since).toISOString(),
      end: new Date(until).toISOString(),
      value: old && Date.parse(old.end) === until ? old.value : null,
      stale: old && Date.parse(old.end) === until ? old.stale === true : false,
    });
  }
  // Three concurrent requests bound the initial backfill's API load. Subsequent
  // syncs refresh recent windows (including delayed insights) and retry gaps.
  const pending = windows.filter(
    (window) =>
      Date.parse(window.start) >= earliestMs &&
      (window.value === null ||
        window.stale ||
        Date.parse(window.end) > endMs - 30 * day),
  );
  for (let i = 0; i < pending.length; i += 3) {
    await Promise.all(
      pending.slice(i, i + 3).map(async (window) => {
        try {
          const body = await graphRequest(
            origin,
            `/v26.0/${accountId}/insights`,
            {
              metric: "website_clicks",
              period: "day",
              metric_type: "total_value",
              since: Date.parse(window.start) / 1000,
              until: Date.parse(window.end) / 1000 - 1,
            },
            token,
            "Instagram bio-link clicks",
          );
          const value = insightCount(body, "website_clicks");
          window.stale = value === null;
          if (value !== null) window.value = value;
        } catch {
          // Retain already saved windows; never count an unavailable response as 0.
          window.stale = true;
        }
      }),
    );
  }
  return {
    accountId,
    start: new Date(start).toISOString(),
    end: end.toISOString(),
    windows,
  };
}

export function bioLinkHistoryTotal(history) {
  if (
    !history?.windows?.length ||
    history.windows.some((window) => window.stale || !isCount(window.value))
  )
    return null;
  const value = history.windows.reduce((sum, window) => sum + window.value, 0);
  return isCount(value) ? value : null;
}

const additiveMetrics = {
  likes: "likes",
  comments: "comments",
  views: "views",
  interactions: "total_interactions",
  saves: "saves",
  shares: "shares",
  profileLinkTaps: "profile_links_taps",
};

// Unique accounts cannot be added across windows. Archive only additive counts,
// with fixed, disjoint boundaries so repeated syncs replace rather than inflate.
export async function fetchPerformanceHistory(
  origin,
  accountId,
  token,
  observedAt,
  previous,
  current,
) {
  const end = new Date(observedAt);
  end.setUTCHours(0, 0, 0, 0);
  const endMs = end.getTime();
  const earliest = endMs - 90 * day;
  let start = earliest;
  const saved = new Map();
  if (previous?.accountId === accountId && Array.isArray(previous.windows)) {
    let boundary = Date.parse(previous.start);
    if (
      !Number.isFinite(boundary) ||
      boundary % day ||
      boundary >= endMs ||
      endMs - boundary > 1000 * 30 * day ||
      previous.windows.length > 1000
    )
      throw new SyncError("Invalid saved performance history");
    start = boundary;
    for (const window of previous.windows) {
      const windowEnd = Date.parse(window.end);
      if (
        Date.parse(window.start) !== boundary ||
        !Number.isFinite(windowEnd) ||
        windowEnd % day ||
        windowEnd <= boundary ||
        windowEnd - boundary > 30 * day ||
        windowEnd > endMs ||
        !window.values ||
        typeof window.values !== "object" ||
        Object.values(window.values).some(
          (value) => value !== null && !isCount(value),
        )
      )
        throw new SyncError("Invalid saved performance window");
      saved.set(boundary, window);
      boundary = windowEnd;
    }
  }
  const windows = [];
  for (let since = start; since < endMs; since += 30 * day) {
    const until = Math.min(since + 30 * day, endMs);
    const old = saved.get(since);
    const matching = old && Date.parse(old.end) === until;
    windows.push({
      start: new Date(since).toISOString(),
      end: new Date(until).toISOString(),
      values: matching ? { ...old.values } : {},
      stale: matching ? { ...old.stale } : {},
    });
  }
  const fields = [...Object.keys(additiveMetrics), "profileViews"];
  const pending = windows.filter(
    (window) =>
      Date.parse(window.start) >= earliest &&
      (Date.parse(window.end) > endMs - 30 * day ||
        fields.some(
          (field) => !isCount(window.values[field]) || window.stale[field],
        )),
  );
  for (let i = 0; i < pending.length; i += 3) {
    await Promise.all(
      pending.slice(i, i + 3).map(async (window) => {
        if (
          current?.window.start === window.start &&
          current.window.end === window.end
        ) {
          for (const field of fields) {
            window.stale[field] = !isCount(current[field]);
            if (isCount(current[field])) window.values[field] = current[field];
          }
          return;
        }
        const range = {
          period: "day",
          metric_type: "total_value",
          since: Date.parse(window.start) / 1000,
          until: Date.parse(window.end) / 1000 - 1,
        };
        await Promise.all(
          [{ ...additiveMetrics }, { profileViews: "profile_views" }].map(
            async (metrics) => {
              try {
                const body = await graphRequest(
                  origin,
                  `/v26.0/${accountId}/insights`,
                  {
                    ...range,
                    metric: Object.values(metrics).join(","),
                  },
                  token,
                  "Instagram performance history",
                );
                for (const [field, metric] of Object.entries(metrics)) {
                  const value = insightCount(body, metric);
                  window.stale[field] = value === null;
                  if (value !== null) window.values[field] = value;
                }
              } catch {
                for (const field of Object.keys(metrics))
                  window.stale[field] = true;
              }
            },
          ),
        );
      }),
    );
  }
  return {
    accountId,
    start: new Date(start).toISOString(),
    end: end.toISOString(),
    windows,
  };
}

export function performanceHistoryTotals(history) {
  return Object.fromEntries(
    [...Object.keys(additiveMetrics), "profileViews"].map((field) => {
      const windows = history?.windows;
      if (
        !windows?.length ||
        windows.some(
          (window) => window.stale?.[field] || !isCount(window.values[field]),
        )
      )
        return [field, null];
      const value = windows.reduce(
        (sum, window) => sum + window.values[field],
        0,
      );
      return [field, isCount(value) ? value : null];
    }),
  );
}

export async function fetchSnapshot(
  accessToken,
  observedAt,
  accountId,
  historySource,
) {
  const version = "v26.0";
  const unified = accountId != null;
  if (unified && (typeof accountId !== "string" || !/^\d+$/.test(accountId))) {
    throw new SyncError("Unified Login requires an Instagram account ID");
  }
  const origin = unified ? unifiedOrigin : instagramOrigin;
  const profile = await graphRequest(
    origin,
    `/${version}/${unified ? accountId : "me"}`,
    {
      fields: unified
        ? "id,username,followers_count,media_count"
        : "user_id,username,followers_count,media_count",
    },
    accessToken,
    "Instagram profile",
  );
  const account = Array.isArray(profile?.data) ? profile.data[0] : profile;
  const resolvedId = unified ? account?.id : account?.user_id;
  if (
    typeof account?.username !== "string" ||
    typeof resolvedId !== "string" ||
    !/^\d+$/.test(resolvedId) ||
    (unified && resolvedId !== accountId) ||
    !isCount(account.followers_count) ||
    (account.media_count != null && !isCount(account.media_count))
  ) {
    throw new SyncError("Instagram returned an invalid profile");
  }
  if (account.username.toLowerCase() !== username) {
    throw new SyncError("Instagram token must authorize @uwummie");
  }

  const previous =
    typeof historySource === "function" ? await historySource() : historySource;
  // Accept the old bio-link-only callback during rollout.
  const previousHistory = previous?.bioLinkHistory ?? previous;

  const end = new Date(observedAt);
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end.getTime() - 30 * day);
  const insightsPath = `/${version}/${resolvedId}/insights`;
  const dimensions = ["gender", "age", "country"];
  const range = {
    since: start.getTime() / 1000,
    // Meta's range is inclusive. Exclude the current, incomplete day.
    until: end.getTime() / 1000 - 1,
  };
  const [
    profileViews,
    bioLinkClicks,
    bioLinkHistory,
    postAverages,
    totals,
    dailyReach,
    stories,
    ...demographics
  ] = await Promise.all([
    graphRequest(
      origin,
      insightsPath,
      {
        metric: "profile_views",
        period: "day",
        metric_type: "total_value",
        ...range,
      },
      accessToken,
      "Instagram profile visits",
    )
      .then((body) => insightCount(body, "profile_views"))
      .catch(() => null),
    graphRequest(
      origin,
      insightsPath,
      {
        metric: "website_clicks",
        period: "day",
        metric_type: "total_value",
        ...range,
      },
      accessToken,
      "Instagram 30-day bio-link clicks",
    )
      .then((body) => insightCount(body, "website_clicks"))
      .catch(() => null),
    fetchBioLinkHistory(
      origin,
      resolvedId,
      accessToken,
      observedAt,
      previousHistory,
    ),
    fetchPostAverages(
      origin,
      resolvedId,
      accessToken,
      account.followers_count,
      account.media_count,
      true,
      { start: start.toISOString(), end: end.toISOString() },
      true,
    ).catch(() => ({ ...unavailablePostAverages })),
    graphRequest(
      origin,
      insightsPath,
      {
        metric: performanceMetrics.join(","),
        period: "day",
        metric_type: "total_value",
        ...range,
      },
      accessToken,
      "Instagram performance",
    ),
    graphRequest(
      origin,
      insightsPath,
      {
        metric: "reach",
        period: "day",
        metric_type: "time_series",
        ...range,
      },
      accessToken,
      "Instagram daily reach",
    ),
    fetchStoryPerformance(origin, resolvedId, accessToken).catch(() => ({
      views: null,
      scope: "active",
    })),
    ...dimensions.map((dimension) =>
      account.followers_count < 100
        ? { data: [] }
        : graphRequest(
            origin,
            insightsPath,
            {
              metric: "follower_demographics",
              period: "lifetime",
              metric_type: "total_value",
              timeframe: "last_30_days",
              breakdown: dimension,
            },
            accessToken,
            `Instagram ${dimension} demographics`,
          ),
    ),
  ]);

  const counts = Object.fromEntries(
    performanceMetrics.map((name) => [name, insightCount(totals, name)]),
  );

  const { totalLikes, totalComments, recentAverages, reels, ...averages } =
    postAverages;
  const performance = {
    window: { start: start.toISOString(), end: end.toISOString() },
    reach: counts.reach,
    accountsEngaged: counts.accounts_engaged,
    engagementRate:
      counts.accounts_engaged !== null && counts.reach > 0
        ? (counts.accounts_engaged / counts.reach) * 100
        : null,
    ...(recentAverages ?? unavailablePostAverages),
    profileViews,
    bioLinkClicks,
    bioLinkHistory,
    bioLinkClicksTracked: bioLinkHistoryTotal(bioLinkHistory),
    likes: counts.likes,
    comments: counts.comments,
    views: counts.views,
    interactions: counts.total_interactions,
    saves: counts.saves,
    shares: counts.shares,
    profileLinkTaps: counts.profile_links_taps,
    posts: account.media_count ?? null,
    dailyReach: reachSeries(dailyReach),
  };
  const performanceHistory = await fetchPerformanceHistory(
    origin,
    resolvedId,
    accessToken,
    observedAt,
    previous?.performanceHistory,
    performance,
  );
  const lifetime = {
    ...performanceHistoryTotals(performanceHistory),
    ...averages,
    likes: totalLikes ?? null,
    comments: totalComments ?? null,
    reach: null,
    accountsEngaged: null,
    engagementRate: null,
    window: { start: performanceHistory.start, end: performanceHistory.end },
    bioLinkClicks: performance.bioLinkClicksTracked,
    bioLinkHistory,
    posts: performance.posts,
  };

  return {
    schemaVersion: 3,
    defaultPerformancePeriod: "lifetime",
    followers: account.followers_count,
    reels: reels ?? { ...unavailableReels },
    stories: { ...stories, observedAt },
    views: counts.views,
    viewWindow: performance.window,
    performance: { ...performance, performanceHistory },
    performancePeriods: { lifetime, last30Days: performance },
    audience: {
      gender: demographicChart(demographics[0], "gender"),
      ages: demographicChart(demographics[1], "age"),
      countries: demographicChart(demographics[2], "country"),
    },
  };
}
