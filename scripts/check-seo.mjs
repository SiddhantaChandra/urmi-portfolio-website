import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const args = process.argv.slice(2);
const base = new URL(
  args.find((arg) => arg.startsWith("http")) || "http://localhost:3187",
);
const siteArg = args.filter((arg) => arg.startsWith("http"))[1];
const site = siteArg ? new URL(siteArg).origin : null;
const noindex = args.includes("--expect-noindex");
const checks = [];
function check(name, fn) {
  fn();
  checks.push({ name, passed: true });
}
const decode = (value) =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&#x27;", "'")
    .replaceAll("&quot;", '"');
const attr = (tag, key) =>
  decode(tag.match(new RegExp(`\\b${key}="([^"]*)"`))?.[1] || "");
const response = await fetch(base);
assert.equal(response.status, 200);
const html = await response.text();
const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => tag);
const meta = (name) =>
  attr(
    metas.find(
      (tag) => attr(tag, "name") === name || attr(tag, "property") === name,
    ) || "",
    "content",
  );
check(
  "Full name, creator description and one H1 are present without JavaScript",
  () => {
    assert.match(
      html,
      /<title>Urmi Chakraborty \(@uwummie\) \| Anime Content Creator<\/title>/,
    );
    assert.match(meta("description"), /anime and manga storytelling/i);
    assert.equal([...html.matchAll(/<h1\b/g)].length, 1);
    assert.match(html, /I’m Urmi Chakraborty/);
    assert.match(html, /The Telegraph Online/);
    assert.ok(!meta("keywords"));
  },
);
check("Robots metadata matches the intended deployment", () => {
  assert.match(meta("robots"), noindex ? /noindex/ : /^index, follow$/);
  assert.equal(meta("twitter:card"), "summary_large_image");
  assert.equal(meta("og:type"), "website");
});
const canonical = [...html.matchAll(/<link\b[^>]*>/g)]
  .map(([tag]) => tag)
  .find((tag) => attr(tag, "rel") === "canonical");
const rawProfile = html.match(
  /<script type="application\/ld\+json">([^<]*)<\/script>/,
)?.[1];
check("Canonical and profile schema use the confirmed origin only", () => {
  if (!site) {
    assert.ok(
      noindex,
      "Pass the production origin as the second URL for indexable builds.",
    );
    assert.ok(!canonical);
    assert.ok(!rawProfile);
    return;
  }
  assert.equal(new URL(attr(canonical || "", "href")).href, `${site}/`);
  assert.equal(new URL(meta("og:url")).href, `${site}/`);
  const profile = JSON.parse(rawProfile);
  assert.equal(profile["@type"], "ProfilePage");
  assert.equal(profile.mainEntity["@type"], "Person");
  assert.equal(profile.mainEntity.name, "Urmi Chakraborty");
  assert.equal(profile.url, `${site}/`);
  assert.deepEqual(profile.mainEntity.sameAs, [
    "https://www.instagram.com/uwummie",
  ]);
});
check("Article links and section anchors are crawlable", () => {
  const anchors = [...html.matchAll(/<a\b[^>]*>/g)].map(([tag]) =>
    attr(tag, "href"),
  );
  assert.equal(
    anchors.filter((href) => href.startsWith("https://www.telegraphindia.com/"))
      .length,
    9,
  );
  for (const href of anchors.filter(
    (href) => href.startsWith("#") && href.length > 1,
  )) {
    assert.ok(
      html.includes(`id="${href.slice(1)}"`),
      `Broken section link: ${href}`,
    );
  }
});
const robots = await fetch(new URL("/robots.txt", base));
const robotsText = await robots.text();
const sitemap = await fetch(new URL("/sitemap.xml", base));
const sitemapText = await sitemap.text();
check("Crawl routes expose only canonical indexable pages", () => {
  assert.equal(robots.status, 200);
  assert.match(robotsText, /Allow: \/\n/);
  assert.match(robotsText, /Disallow: \/api\//);
  assert.equal(sitemap.status, 200);
  if (noindex) {
    assert.ok(!robotsText.includes("Sitemap:"));
    assert.ok(!sitemapText.includes("<loc>"));
  } else {
    assert.ok(robotsText.includes(`Sitemap: ${site}/sitemap.xml`));
    assert.deepEqual(
      [...sitemapText.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]),
      [`${site}/`],
    );
  }
});
const imageUrl = new URL(meta("og:image"));
const imageResponse = await fetch(
  new URL(imageUrl.pathname + imageUrl.search, base),
);
const imageBytes = Buffer.from(await imageResponse.arrayBuffer());
check("Social preview is a real 1200×630 PNG with alt text", () => {
  assert.equal(imageResponse.status, 200);
  assert.match(imageResponse.headers.get("content-type"), /image\/png/);
  assert.equal(imageBytes.readUInt32BE(16), 1200);
  assert.equal(imageBytes.readUInt32BE(20), 630);
  assert.match(meta("og:image:alt"), /Urmi Chakraborty/);
});
const api = await fetch(new URL("/api/contact", base), { method: "HEAD" });
check("API responses are excluded from indexing", () => {
  assert.match(api.headers.get("x-robots-tag"), /noindex/);
});
const result = {
  url: base.href,
  canonicalOrigin: site,
  expectedNoindex: noindex,
  measuredAt: new Date().toISOString(),
  checks,
};
await mkdir("reports/seo", { recursive: true });
await writeFile(
  "reports/seo/rendered-checks.json",
  `${JSON.stringify(result, null, 2)}\n`,
);
console.log(
  `${checks.length} rendered SEO checks passed (${noindex ? "noindex" : "indexable"}).`,
);
