function safeUrl(value, acceptsHost) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      !url.username &&
      !url.password &&
      !url.port &&
      acceptsHost(url.hostname)
      ? url.href
      : null;
  } catch {
    return null;
  }
}

const newestFirst = (a, b) =>
  Date.parse(b.timestamp) - Date.parse(a.timestamp) || a.id.localeCompare(b.id);

// Meta does not expose a readable trial-status flag. For matching long-form
// captions prefer a feed-shared version, then the newer publication. Repeated
// short/generic captions are not enough evidence that two reels are duplicates.
export function selectRecentReels(reels) {
  const selected = new Map();
  for (const reel of [...reels].sort(newestFirst)) {
    const caption = reel.caption
      ?.normalize("NFKC")
      .replace(/(^|\s)#[\p{L}\p{N}_]+/gu, " ")
      .trim()
      .replace(/\s+/g, " ");
    const key = caption?.length >= 80 ? `caption:${caption}` : `id:${reel.id}`;
    const existing = selected.get(key);
    if (
      !existing ||
      (reel.sharedToFeed === true && existing.sharedToFeed !== true)
    )
      selected.set(key, reel);
  }
  return [...selected.values()].sort(newestFirst).slice(0, 5);
}

// Publish only display metadata, never raw Graph responses or paging URLs.
export function selectReelShowcase(posts, insights) {
  const reels = posts
    .filter((post) => post.media_product_type === "REELS")
    .map((post) => ({
      id: post.id,
      caption: typeof post.caption === "string" ? post.caption : "",
      timestamp: post.timestamp,
      sharedToFeed:
        typeof post.is_shared_to_feed === "boolean"
          ? post.is_shared_to_feed
          : null,
      permalink: safeUrl(post.permalink, (host) =>
        ["instagram.com", "www.instagram.com"].includes(host),
      ),
      thumbnailUrl: safeUrl(post.thumbnail_url, (host) =>
        ["cdninstagram.com", "fbcdn.net"].some(
          (domain) => host === domain || host.endsWith(`.${domain}`),
        ),
      ),
      views: insights.get(post.id)?.views ?? null,
    }))
    .filter(
      (reel) => reel.permalink && Number.isFinite(Date.parse(reel.timestamp)),
    );
  return {
    ranking: "lifetime_views",
    recent: selectRecentReels(reels),
    // Unknown counts cannot establish the account's true top five.
    popular: reels.every(
      (reel) => Number.isSafeInteger(reel.views) && reel.views >= 0,
    )
      ? [...reels]
          .sort((a, b) => b.views - a.views || newestFirst(a, b))
          .slice(0, 5)
      : [],
  };
}
