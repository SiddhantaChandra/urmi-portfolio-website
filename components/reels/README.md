# Reel showcases

The home page renders Stories in motion (the `Waves` component), then Featured Works (the `StoryWall` component), immediately after Instagram performance. Stories in motion continues Instagram performance’s cream background without a background entrance animation. Featured Works uses the portfolio red background and cream foreground; its scroll-driven curved entrance opens the “Full-time storyteller” section. Reduced motion shows the settled, straight section edge.

- The StoryWall gallery sits below “Ex-Journalist” (struck through) and “Full-time storyteller.” It features nine published articles by Urmi Chakraborty for The Telegraph Online, in the supplied order. Each cream frame pairs the article’s lead image with its full published headline and a direct link that opens in a new tab. The horizontal, scroll-snapping carousel retains alternating tilts, staggered heights, and scroll-driven arrival animation. Swipe, trackpad scrolling, and previous/next arrows navigate the row; arrows target actual card positions and retain their destination during repeated clicks. Focusing the track also supports arrow keys and Home/End. The introduction stays above the row at every size. The section fills one viewport (`100vh`, with `100dvh` for mobile browser chrome); short landscape viewports allow extra section height to keep the headlines readable. The arrival timeline follows the carousel’s page entry, and movement runs inside each slide so its snap position stays stable. Reduced motion skips arrival movement and uses instant carousel navigation.
- Stories in motion (the `Waves` component) displays five recent and five popular reels in opposing arches on desktop, around its centered title and Instagram link. Tablets from 641–800px show four from each collection in opposing arches; phones through 640px show the first three from each collection above and below the title, with larger covers. At every size, each row enters level and settles vertically into its arch as it scrolls into view, using the same timing and easing. Cards stay upright with no orbiting or scaling, while the heading and Instagram link stay fixed. The movement reverses when scrolling back; reduced motion shows the completed layout immediately.
- Featured Works links directly to each published article, opening The Telegraph Online in a new tab. Waves links directly to each published reel, opening Instagram in a new tab. Both use locally hosted fonts and lazy Next Image loading. Reduced motion shows completed layouts and skips movement.

`articles.js` contains the verified article headlines, publication dates, links, image descriptions, and original image URLs. Lead images from the linked articles are hosted locally in `public/images/articles/` as 800px-wide WebP files (about 283 KiB combined, 66% smaller than the originals). Next Image supplies responsive variants. The publisher is credited on every card; original image rights remain with their respective owners. The article cards use no sample copy or reel preview dialog. `reels.js` and the mock artwork below are legacy sample assets and are not used by StoryWall.

Stories in motion (Waves) reads `stats.reels.showcase` from the existing cached `/api/instagram-stats` response. The API supplies the five newest distinct published reels, sorted by publication timestamp. Matching long captions (80 or more characters, ignoring hashtag changes and normalizing whitespace) are grouped before choosing five: a feed-shared version wins, otherwise the newer publication wins. Short or missing captions never merge distinct reels. Meta does not expose a readable trial-status flag, and `is_shared_to_feed=false` also applies to normal Reels-only posts, so that field alone is never used to exclude a reel. This removes duplicate trial/normal pairs without dropping legitimate Reels-only publications.

The API supplies the five reels with the highest lifetime Instagram `views`, with newer reels first on ties. The same reel can appear in both independent collections. The scheduled sync requests `caption`, `thumbnail_url`, `permalink`, and `is_shared_to_feed` alongside its existing paginated media fields and reuses its existing lifetime reel insights; it retries views alone if the combined insight request fails or omits views. Incomplete pagination never produces a ranking, and missing view counts leave Popular unavailable rather than creating a partial top five. Empty Popular snapshots and legacy duplicate Recent selections have a 30-second cache revalidation and 60-second expiry so a repaired sync becomes visible promptly. The client bypasses its browser cache when loading stats. Missing/expired thumbnails retain a direct Instagram link. The CDN thumbnails are unoptimized because their signed URLs are refreshed by the daily sync. No API credential reaches the client.

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
