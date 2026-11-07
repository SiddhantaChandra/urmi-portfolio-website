"use client";

import { useEffect, useState } from "react";
import Audience from "../components/Audience";
import CollaborationModal from "../components/CollaborationModal";
import Hero from "../components/Hero";
import Summary from "../components/Summary";

export default function Home() {
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);
  const [instagramStats, setInstagramStats] = useState(undefined);

  useEffect(() => {
    const controller = new AbortController();

    async function loadStats() {
      try {
        const response = await fetch("/api/instagram-stats", {
          signal: controller.signal,
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
    <main className="relative w-full bg-[#f8f5ee] text-[#1c1917]">
      <Hero
        onOpenCollaboration={() => setIsCollaborationOpen(true)}
        stats={instagramStats}
      />
      <Audience stats={instagramStats} />
      <Summary />

      <CollaborationModal
        isOpen={isCollaborationOpen}
        onClose={() => setIsCollaborationOpen(false)}
      />
    </main>
  );
}
