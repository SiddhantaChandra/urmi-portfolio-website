import Portfolio from "../components/Portfolio";
import { getInstagramStats } from "../lib/instagram-stats";
import {
  getSeoConfig,
  profileStructuredData,
  serializeJsonLd,
} from "../lib/seo.mjs";

export default async function Home() {
  const { stats } = await getInstagramStats();
  const { siteUrl } = getSeoConfig();
  const profile = profileStructuredData(siteUrl);
  return (
    <>
      {profile && (
        <script
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized with HTML characters escaped.
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(profile) }}
        />
      )}
      <Portfolio initialStats={stats} />
    </>
  );
}
