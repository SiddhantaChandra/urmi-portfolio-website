"use client";

import { useEffect, useState } from "react";
import Audience from "./Audience";
import BrandsAndContact, { PortfolioFooter } from "./BrandsAndContact";
import Hero from "./Hero";
import AudienceInsights from "./insights/AudienceInsights";
import InstagramPerformance from "./insights/InstagramPerformance";
import ReelsShowcase from "./reels/ReelsShowcase";

export default function Portfolio({ initialStats = null }) {
  const [instagramStats, setInstagramStats] = useState(initialStats);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStats() {
      try {
        const response = await fetch("/api/instagram-stats", {
          signal: controller.signal,
          cache: "no-store",
        });
        const stats = response.ok ? await response.json() : null;
        if (!controller.signal.aborted)
          setInstagramStats((current) => stats ?? current ?? null);
      } catch {
        // Keep the server snapshot visible if a background refresh fails.
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
