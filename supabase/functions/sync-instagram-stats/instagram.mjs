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

function isCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

async function graphRequest(origin, path, params, token, operation) {
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
  const result = body.data.find((item) => item?.name === name)?.total_value;
  if (!result || typeof result !== "object" || Array.isArray(result)) {
    throw new SyncError(`Missing ${name} insight total`);
  }
  return result;
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

  return (dimension === "country" ? buckets.slice(0, 6) : buckets).map(
    ({ id, label, count }) => ({
      id,
      label,
      value: (count / population) * 100,
    }),
  );
}

export async function fetchSnapshot(accessToken, observedAt, accountId) {
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
        ? "id,username,followers_count"
        : "user_id,username,followers_count",
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
    !isCount(account.followers_count)
  ) {
    throw new SyncError("Instagram returned an invalid profile");
  }
  if (account.username.toLowerCase() !== username) {
    throw new SyncError("Instagram token must authorize @uwummie");
  }

  const end = new Date(observedAt);
  end.setUTCHours(0, 0, 0, 0);
  const start = new Date(end.getTime() - 30 * day);
  const insightsPath = `/${version}/${resolvedId}/insights`;
  const dimensions = ["gender", "age", "country"];
  const [viewsResponse, ...demographics] = await Promise.all([
    graphRequest(
      origin,
      insightsPath,
      {
        metric: "views",
        period: "day",
        metric_type: "total_value",
        since: start.getTime() / 1000,
        until: end.getTime() / 1000,
      },
      accessToken,
      "Instagram views",
    ),
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

  const views = metricTotal(viewsResponse, "views");
  if (views !== null && !isCount(views.value)) {
    throw new SyncError("Instagram returned an invalid views count");
  }

  return {
    followers: account.followers_count,
    views: views?.value ?? null,
    viewWindow: { start: start.toISOString(), end: end.toISOString() },
    audience: {
      gender: demographicChart(demographics[0], "gender"),
      ages: demographicChart(demographics[1], "age"),
      countries: demographicChart(demographics[2], "country"),
    },
  };
}
