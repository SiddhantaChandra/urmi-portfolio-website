# SEO setup and measurement

## Production configuration

The owner-confirmed canonical origin is **https://www.urmichakraborty.com** and is built into `lib/seo.mjs`. The apex domain currently redirects to www. Optional settings are in `seo.env.example`; put verification/analytics values in `.env.local` and the hosting provider's **build environment** without overwriting Supabase/contact settings. `SITE_URL` can override the canonical origin for a future domain move. Static metadata, robots and sitemap are generated at build time, so changing only a running server's environment is insufficient.

Production builds use the confirmed domain and are indexable by default. Vercel preview/development builds, development mode and `SITE_NOINDEX=true` builds emit noindex and an empty sitemap. On other preview hosts, explicitly set `SITE_NOINDEX=true`. Previews allow crawling so bots can actually read their noindex tags; robots.txt is not used as a substitute for noindex.

The sitemap contains the homepage only. Section anchors, APIs, Instagram posts and externally published Telegraph articles are not separate pages on this site. No artificial `lastmod`, campaign results, ratings or follower statistics are put in structured data.

## Local verification

```powershell
npm run test:seo
npm run build
npm run start -- --port 3187
```

In a second terminal, check the production-mode build:

```powershell
npm run check:seo -- http://localhost:3187 https://www.urmichakraborty.com
```

For a preview build made with `SITE_NOINDEX=true`, use:

```powershell
npm run check:seo -- http://localhost:3187 https://www.urmichakraborty.com --expect-noindex
```

The checker fetches the actual HTML without running JavaScript, the crawl routes, social preview PNG and API headers. It does not send a contact message. Its JSON report is written to `reports/seo/rendered-checks.json`.

## Performance audit

Run one audit at a time against a production build, with other browser automation stopped. Lighthouse 13.6.0 is pinned for reproducibility. `--preset=desktop` uses Lighthouse's desktop settings; the default is simulated mobile. Both reports include the exact settings, browser version, timestamps, metrics and audit details.

```powershell
npx --yes lighthouse@13.6.0 http://localhost:3187 --output=json --output=html --output-path=.taste-skill/seo/after-mobile --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --quiet
npx --yes lighthouse@13.6.0 http://localhost:3187 --preset=desktop --output=json --output=html --output-path=.taste-skill/seo/after-desktop --only-categories=performance,accessibility,best-practices,seo --chrome-flags="--headless=new" --quiet
node scripts/summarize-seo.mjs
```

The baseline is saved as `before-mobile.report.json` and `before-desktop.report.json`. Local Lighthouse artifacts/screenshots under `.taste-skill/` and generated summaries under `reports/seo/` are ignored by Git. These local results do not include public hosting latency, real audience device distributions or an enabled analytics tag. Rerun on the deployed site after configuring analytics.

Asset optimization can be reproduced with `node scripts/optimize-seo-assets.mjs` using Sharp installed with Next.js. It preserves originals and the sakura atlas's dimensions/transparency, encodes the atlas as AVIF and freezes the low-opacity grain's first frame as a palette PNG. The interactive branch/petal animation remains in place. The font binaries and their licences were already in the repository; the page now uses one shared self-hosted font definition rather than duplicate downloads.

## Search Console and structured data

1. Add the production property in Google Search Console. Verify via DNS, or put the HTML verification token in `GOOGLE_SITE_VERIFICATION` and rebuild before completing HTML-tag verification.
2. Submit the actual production `/sitemap.xml`. Use URL Inspection's live test to check rendered text, canonical, crawl/indexing permission and resources; request indexing of the homepage.
3. Run Google's Rich Results Test on the deployed homepage and confirm its `ProfilePage` / `Person` matches visible identity and the Instagram link. Local structural checks do not establish rich-result eligibility or guarantee appearance.
4. Record the selected canonical and indexing outcome after Google processes the page. A successful submission is not proof of indexing.

## Enquiry and real-user measurement

An optional GA4 integration is included. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to a real `G-...` web-stream ID in the build environment. It is omitted entirely when unset or when the build is not indexable. Configure analytics/consent according to the site's launch requirements before enabling it. Disable Enhanced Measurement's form interactions to keep submit attempts separate from confirmed enquiries.

- `generate_lead` fires after `/api/contact` successfully confirms `received: true`, once per successful submission. Its parameters are only `form_id=portfolio_contact`, `method=contact_form` and the page path. Failed submissions, email-draft fallbacks and mailto clicks are not reported as successful enquiries. No names, emails, companies, subjects, messages or enquiry IDs are sent.
- `web_vital` reports Next.js `useReportWebVitals` metrics with `metric_name`, `metric_id`, `metric_value`, `metric_rating`, `navigation_type` and `page_path`. LCP, INP, FCP and TTFB values are milliseconds; CLS is a unitless score. The raw performance entries and navigation query strings are not sent. Use the latest value per metric ID, then calculate the 75th percentile per metric/device class. Do not average the combined metrics. INP requires actual visitor interactions.
- Page location and referrer are configured without query strings/fragments. Ad personalization and Google Signals are disabled by this integration. Do not enable extra form-content collection in the analytics property.

Verify events in GA4 DebugView/Realtime on production with a real enquiry only when the owner is ready to receive it; local browser verification intercepts the endpoint to avoid creating enquiries or sending emails. Mark `generate_lead` as a key event. In Traffic acquisition, filter **Session default channel group = Organic Search** and count `generate_lead` key events. Existing saved enquiries remain the source of truth for whether a message was received; analytics can be blocked by visitors.

Register `metric_name`, `metric_rating`, `navigation_type` as event-scoped custom dimensions and `metric_value` as a custom metric, or export events to BigQuery for percentiles/deduplication. Do not register the high-cardinality metric ID as a reporting dimension. Set the metric unit to Standard because values include both milliseconds and unitless CLS; separate by metric name when analyzing.

## Content and 30/60/90-day review

After launch, capture a dated Search Console baseline (clicks, impressions, CTR, position) with separate branded and non-branded query segments. Initial branded terms: Urmi Chakraborty, Urmi and uwummie. Treat creator/collaboration terms as hypotheses until Search Console shows impressions; no search volumes or rank forecasts have been assumed.

At 30, 60 and 90 days after the actual deployment date, compare equal windows for those search segments and organic enquiry key events, noting publication and campaign dates. Check mobile and desktop field p75 LCP <= 2.5 s, INP <= 200 ms and CLS <= 0.1. Lighthouse TBT is a lab blocking metric, not field INP. Search Console/CrUX may lack enough traffic initially; label insufficient data rather than reporting a pass.

For each of two or three future collaboration case studies, obtain the approved brand/campaign name, live work URL, brief, Urmi's role, format/deliverables, creative decisions and permission to publish any measured outcomes with their dates. Only then create an original, substantive case-study page with a unique title/canonical and sitemap entry. The current logos establish listed partnerships, not campaign scope or outcomes. Telegraph articles remain linked to their original publications.

References: [Google SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), [ProfilePage requirements](https://developers.google.com/search/docs/appearance/structured-data/profile-page), [noindex and crawlability](https://developers.google.com/search/docs/crawling-indexing/block-indexing), [Web Vitals](https://web.dev/articles/vitals), [Lighthouse scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring), [GA4 events](https://developers.google.com/analytics/devguides/collection/ga4/events).
