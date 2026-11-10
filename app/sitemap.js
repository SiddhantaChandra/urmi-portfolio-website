import { getSeoConfig } from "../lib/seo.mjs";

export default function sitemap() {
  const { siteUrl, indexable } = getSeoConfig();
  // Only real, canonical pages belong here; social posts and external articles do not.
  return indexable ? [{ url: `${siteUrl}/` }] : [];
}
