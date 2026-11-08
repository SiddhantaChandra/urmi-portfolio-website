import { graphRequest, SyncError } from "../sync-instagram-stats/instagram.mjs";

// This hourly path deliberately avoids media, account insights and backfills.
export async function fetchStoryObservations(credential, observedAt) {
  const unified = credential.accountId != null;
  const origin = unified
    ? "https://graph.facebook.com"
    : "https://graph.instagram.com";
  if (unified && !/^\d+$/.test(credential.accountId))
    throw new SyncError("Invalid Instagram account ID");
  const profile = await graphRequest(
    origin,
    `/v26.0/${unified ? credential.accountId : "me"}`,
    { fields: unified ? "id,username" : "user_id,username" },
    credential.accessToken,
    "Instagram Story account",
  );
  const account = Array.isArray(profile?.data) ? profile.data[0] : profile;
  const accountId = unified ? account?.id : account?.user_id;
  const now = Date.parse(observedAt);
  if (
    !Number.isFinite(now) ||
    typeof accountId !== "string" ||
    !/^\d+$/.test(accountId) ||
    (unified && accountId !== credential.accountId) ||
    account?.username?.toLowerCase() !== "uwummie"
  )
    throw new SyncError("Story token must authorize @uwummie");

  const stories = new Map();
  const cursors = new Set();
  let after;
  let complete = false;
  for (let page = 0; page < 100; page++) {
    const body = await graphRequest(
      origin,
      `/v26.0/${accountId}/stories`,
      { fields: "id,timestamp", limit: 100, ...(after ? { after } : {}) },
      credential.accessToken,
      "Instagram active Stories",
    );
    if (!Array.isArray(body?.data))
      throw new SyncError("Invalid Instagram Stories response");
    for (const story of body.data) {
      const publishedAt = Date.parse(story?.timestamp);
      if (
        typeof story?.id !== "string" ||
        !/^\d+$/.test(story.id) ||
        !Number.isFinite(publishedAt) ||
        publishedAt > now
      )
        throw new SyncError("Invalid Instagram Story ID or timestamp");
      stories.set(story.id, {
        story_id: story.id,
        published_at: new Date(publishedAt).toISOString(),
      });
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
  if (!complete) throw new SyncError("Incomplete Instagram Stories pagination");

  const observations = [...stories.values()];
  for (let offset = 0; offset < observations.length; offset += 6) {
    await Promise.all(
      observations.slice(offset, offset + 6).map(async (story) => {
        story.views = null;
        try {
          const body = await graphRequest(
            origin,
            `/v26.0/${story.story_id}/insights`,
            { metric: "views", period: "lifetime" },
            credential.accessToken,
            "Instagram Story views",
          );
          const value = body?.data?.find((item) => item.name === "views")
            ?.values?.[0]?.value;
          if (Number.isSafeInteger(value) && value >= 0) story.views = value;
        } catch {
          // Preserve a previous successful count when a Story expires or fails.
        }
      }),
    );
  }
  return { accountId, observations };
}
