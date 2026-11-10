# SEO implementation and measurement

Started: 10 November 2026 (Asia/Kolkata).

Goal: make Urmi Chakraborty / @uwummie easy to identify in search and help relevant brands discover her anime and manga storytelling work.

## Ordered task list

- [x] Review source, installed Next.js documentation, existing metadata, content and deployment configuration.
- [x] Capture production-build mobile and desktop Lighthouse baselines before changes.
- [x] Establish the production URL and centralize canonical/indexing configuration: owner confirmed https://www.urmichakraborty.com/.
- [x] Rewrite title and description around Urmi's work; remove design-style search copy and obsolete meta keywords.
- [x] Add canonical, Open Graph and Twitter metadata and a branded social preview image.
- [x] Add robots.txt and sitemap.xml; prevent preview indexing and exclude API endpoints from sitemap discovery.
- [x] Add a visible full-name introduction and anime/manga creator descriptor while preserving the design.
- [x] Explain the Telegraph writing background and collaboration formats using existing evidence.
- [x] Add ProfilePage / Person JSON-LD consistent with visible content and validate its structure/serialization locally. Google's deployed validation remains below.
- [x] Measure loading, interaction and layout stability; improve critical artwork, shared font delivery and decorative grain. The mobile LCP target remains open below.
- [x] Add a reproducible SEO check for rendered HTML, metadata routes, links and structured data.
- [x] Prepare optional GA4 measurement for confirmed enquiries and real-user Core Web Vitals. No destination is enabled yet.
- [x] Run production build, 60 regression tests, responsive visual QA and final Lighthouse measurements.
- [x] Record before/after results, limitations and deployment instructions in this file.

## Launch and content dependencies

These remain open until the required external facts/access or traffic exist. They must not be reported as completed by local tests.

- [x] Confirm production domain and inspect its existing deployment and apex redirect.
- [ ] Deploy the reviewed implementation to Vercel. The live site still serves its older revision; current live robots.txt and sitemap.xml return 404.
- [ ] Verify Google Search Console ownership, submit the production sitemap and inspect the indexed/rendered homepage.
- [ ] Validate the deployed profile markup with Google's Rich Results Test.
- [ ] Configure the analytics destination and verify one real successful enquiry event without sending form fields or email addresses.
- [ ] Collect production field data and review mobile/desktop 75th-percentile LCP, INP and CLS.
- [ ] Continue mobile performance work until LCP reaches <= 2.5 s. Current simulated mobile result is 4.7 s; do not mark this target achieved.
- [ ] Replace the original 400×50 decorative Instagram-stat artwork with an approved higher-resolution/vector source if resolving Lighthouse's mobile image-resolution warning. Current mobile Best Practices score is 96; no artificial upscaling was used.
- [ ] Publish two or three original collaboration case studies once briefs, deliverables, creative approach and approved results are supplied. Existing logos alone do not establish campaign details or outcomes.
- [ ] Review branded/non-branded organic clicks and organic enquiries 30, 60 and 90 days after launch. Set dates from actual launch; do not invent a baseline.

## Measurement protocol

- Test a local **production build**, not the development server.
- Use the same browser, Lighthouse version and throttling settings before and after; record exact results and artifacts.
- Lighthouse scores are lab measurements, not search rankings or production field Core Web Vitals.
- LCP target: <= 2.5 s; CLS: <= 0.1; field INP: <= 200 ms at the 75th percentile. Lighthouse TBT is recorded separately and does not stand in for INP.
- Baseline search impressions, clicks, CTR, position and enquiries require Search Console/analytics access and real production traffic.

## Results

Local implementation complete; launch/account/traffic dependencies remain open above.

### Local production-build comparison

Lighthouse 13.6.0, Chrome 157; default simulated mobile and desktop preset. One sequential run per final device. These are lab results, not Google rankings or field CWV. Lighthouse already scored the original page's basic SEO checks at 100; new canonical/schema/social/discovery work is validated separately.

| Metric | Mobile before | Mobile after | Desktop before | Desktop after |
| --- | ---: | ---: | ---: | ---: |
| Performance | 79 | 83 | 99 | 99 |
| Accessibility | 95 | 100 | 95 | 100 |
| Best Practices | 100 | 96 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| LCP | 5.6 s | 4.7 s | 1.0 s | 1.0 s |
| Total Blocking Time | 50 ms | 50 ms | 0 ms | 0 ms |
| CLS | 0 | 0 | 0 | 0 |

- The mobile Best Practices difference is the existing low-resolution decorative stat artwork, exposed near the fold by the shorter introduction. It does not represent broken SEO metadata.
- Sakura atlas: 203,692 -> 82,688 bytes (about 59% smaller), full dimensions/transparency retained; high-priority preload confirmed by Lighthouse.
- Grain: animated 54,585-byte GIF -> static 18,417-byte PNG (about 66% smaller), removing a constantly repainting fixed overlay animation.
- Font CSS shares the existing licensed Cormorant/Jakarta binaries through next/font/local. The first measurement caught duplicate downloads introduced by separate family definitions; those were removed before the final audit.
- Fixed heading order, country-label contrast and reel link accessible names. Full lint now has no errors; nine existing CSS `!important` warnings remain. Two existing AudienceInsights lint errors were resolved while preserving its data-loaded reveal behavior.
- Seven rendered SEO checks pass: source HTML identity/H1, deployment indexing rules, canonical/profile schema, nine article links/section anchors, crawl routes, real 1200×630 social PNG and API noindex header.
- The same seven checks also pass against an actual preview build with `SITE_NOINDEX=true`: canonical stays on the production domain, robots metadata is noindex, and no sitemap URLs are exposed. See `reports/seo/preview-checks.json`.
- Browser-intercepted contact verification: one lead on success, none on failure, email fallback intact, zero console errors and no analytics requests while disabled. No real message/email was sent.
- Screenshots reviewed at 1440, 768 and 390 px; no horizontal overflow. Existing design-style findings (decorative cards, small labels, carousel edges and scroll overlays) were preserved and recorded, not silently called clean.

### Existing live deployment baseline

Separately measured https://www.urmichakraborty.com/ on 10 November 2026: mobile Performance 88, Accessibility 95, Best Practices 100, SEO 100; LCP 3.8 s, TBT 50 ms, CLS 0. This is an older deployed revision in a different network environment; it is not the local before/after comparison. Apex redirects to www; homepage returns 200. The crawl routes are currently 404. No Search Console/CrUX data was available.

### Artifacts and handoff

- [Setup, commands and 30/60/90-day review procedure](docs/seo.md)
- [Canonical, verification and optional analytics environment settings](seo.env.example)
- [Portable Lighthouse results and exact settings](reports/seo/lighthouse-summary.json)
- [Rendered HTML/metadata checks](reports/seo/rendered-checks.json)
- [Contact browser checks](reports/seo/browser-checks.json)
- [Preview indexing checks](reports/seo/preview-checks.json)
- [Responsive visual checks and inherited findings](reports/seo/visual-checks.json)
- [Existing live baseline](reports/seo/live-baseline.json)
- Local full reports/screenshots: `.taste-skill/seo/` (ignored generated artifacts).

Remaining external inputs: Search Console verification/account access, a real GA4 measurement ID, approved case-study evidence and production deployment/traffic. Public verification/GA4 identifiers were requested; never request or store account passwords here.
