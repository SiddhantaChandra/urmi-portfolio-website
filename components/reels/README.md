# Reel showcases

The home page renders Featured Works (the `StoryWall` component), then Waves, immediately after Instagram performance.

- Featured Works shows the full gallery without filters. On desktop, its three-line introduction sits in the gap between the middle cards; smaller layouts keep the introduction above the gallery.
- Waves retains the opposing-wave arrangement, centre-first entrances, and subtle scroll movement.
- Featured Works uses the cover preview dialog. Waves links directly to each published reel, opening Instagram in a new tab. Both use locally hosted fonts and lazy Next Image loading. Reduced motion shows completed layouts and skips movement.

`reels.js` contains sample covers, editorial copy, and demonstration collection labels for Featured Works only. The page and cover previews identify those samples.

Stories in motion (Waves) reads `stats.reels.showcase` from the existing cached `/api/instagram-stats` response. Its top row contains the five newest distinct published reels, sorted by publication timestamp. Identical long captions (80 or more characters, with normalized whitespace) are grouped before choosing five: a feed-shared version wins, otherwise the newer publication wins. Short or missing captions never merge distinct reels. Meta does not expose a readable trial-status flag, and `is_shared_to_feed=false` also applies to normal Reels-only posts, so that field alone is never used to exclude a reel. This removes duplicate trial/normal pairs without dropping legitimate Reels-only publications.

The bottom row contains the five reels with the highest lifetime Instagram `views`, with newer reels first on ties. The same reel can appear in both independent collections. The scheduled sync requests `caption`, `thumbnail_url`, `permalink`, and `is_shared_to_feed` alongside its existing paginated media fields and reuses its existing lifetime reel insights; it retries views alone if the combined insight request fails or omits views. Incomplete pagination never produces a ranking, and missing view counts leave Popular unavailable rather than creating a partial top five. Empty Popular snapshots have a 30-second cache revalidation and 60-second expiry so a repaired sync becomes visible promptly. The client bypasses its browser cache when loading stats. Missing/expired thumbnails retain a direct Instagram link. The CDN thumbnails are unoptimized because their signed URLs are refreshed by the daily sync. No API credential reaches the client.

The disposable `/delete` studies have been removed. Production components have no dependency on that directory.

## Artwork

Mock cover stills come from the [Studio Ghibli image gallery](https://www.ghibli.jp/info/013344/). They were resized to local WebP assets. Sources:

- `https://www.ghibli.jp/gallery/chihiro010.jpg`
- `https://www.ghibli.jp/gallery/mononoke020.jpg`
- `https://www.ghibli.jp/gallery/howl030.jpg`
- `https://www.ghibli.jp/gallery/ponyo010.jpg`
- `https://www.ghibli.jp/gallery/karigurashi020.jpg`
- `https://www.ghibli.jp/gallery/mimi030.jpg`
- `https://www.ghibli.jp/gallery/majo010.jpg`
- `https://www.ghibli.jp/gallery/totoro020.jpg`

The local Cormorant Garamond and Plus Jakarta Sans files match the portfolio typography. Their SIL Open Font License files are included in `assets/`.
