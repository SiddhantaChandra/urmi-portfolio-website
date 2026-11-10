import { getSeoConfig } from "../lib/seo.mjs";

export default function robots() {
  const { siteUrl, indexable } = getSeoConfig();
  return {
    // Previews must remain crawlable so bots can read the page's noindex tag.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    ...(indexable && { sitemap: `${siteUrl}/sitemap.xml` }),
  };
}
