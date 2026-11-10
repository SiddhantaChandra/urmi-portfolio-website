export const creator = {
  name: "Urmi Chakraborty",
  handle: "uwummie",
  instagram: "https://www.instagram.com/uwummie",
  title: "Urmi Chakraborty (@uwummie) | Anime Content Creator",
  description:
    "Explore anime and manga storytelling by Urmi Chakraborty (@uwummie), from video essays and published features to brand collaborations. Get in touch.",
};

// Canonical public origin confirmed by the site owner on 10 November 2026.
export const productionOrigin = "https://www.urmichakraborty.com";

export function getSeoConfig(env = process.env) {
  let siteUrl;
  {
    const url = new URL(env.SITE_URL?.trim() || productionOrigin);
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.pathname !== "/" ||
      url.search ||
      url.hash ||
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    ) {
      throw new Error(
        "SITE_URL must be the public HTTPS origin, without a path, credentials, query or fragment.",
      );
    }
    siteUrl = url.origin;
  }
  return {
    siteUrl,
    indexable: Boolean(
      siteUrl &&
        env.NODE_ENV === "production" &&
        (!env.VERCEL_ENV || env.VERCEL_ENV === "production") &&
        env.SITE_NOINDEX !== "true",
    ),
  };
}

export function profileStructuredData(siteUrl) {
  if (!siteUrl) return null;
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profile`,
    url: `${siteUrl}/`,
    name: creator.title,
    description: creator.description,
    inLanguage: "en",
    mainEntity: {
      "@type": "Person",
      "@id": `${siteUrl}/#urmi`,
      name: creator.name,
      alternateName: `@${creator.handle}`,
      jobTitle: "Anime and Manga Content Creator",
      url: `${siteUrl}/`,
      image: `${siteUrl}/images/profile.webp`,
      description:
        "Anime and manga content creator behind @uwummie, sharing video essays, recommendations and brand storytelling.",
      sameAs: [creator.instagram],
      knowsAbout: [
        "Anime",
        "Manga",
        "Japanese pop culture",
        "Video essays",
        "Brand storytelling",
      ],
      hasOccupation: {
        "@type": "Occupation",
        name: "Content Creator",
        skills:
          "Video essays, anime and manga recommendations, brand storytelling",
      },
    },
  };
}

export function serializeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
