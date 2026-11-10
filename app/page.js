"use client";

import { useEffect, useState } from "react";
import Audience from "../components/Audience";
import BrandsAndContact, {
  PortfolioFooter,
} from "../components/BrandsAndContact";
import Hero from "../components/Hero";
import AudienceInsights from "../components/insights/AudienceInsights";
import InstagramPerformance from "../components/insights/InstagramPerformance";
import ReelsShowcase from "../components/reels/ReelsShowcase";

export default function Home() {
  const [instagramStats, setInstagramStats] = useState(undefined);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStats() {
      try {
        const response = await fetch("/api/instagram-stats", {
          signal: controller.signal,
          cache: "no-store",
        });
        const stats = response.ok ? await response.json() : null;
        if (!controller.signal.aborted) setInstagramStats(stats);
      } catch {
        if (!controller.signal.aborted) setInstagramStats(null);
      }
    }

    loadStats();
    return () => controller.abort();
  }, []);

  return (
    <>
      <main className="relative w-full bg-[#f8f5ee] text-[#1c1917]">
        <Hero stats={instagramStats} />
        <Audience>
          <AudienceInsights stats={instagramStats} />
        </Audience>
        <InstagramPerformance stats={instagramStats} />
        <ReelsShowcase
          showcase={instagramStats?.reels?.showcase}
          loading={instagramStats === undefined}
        />

        <BrandsAndContact />
      </main>
      <PortfolioFooter />
    </>
  );
}
