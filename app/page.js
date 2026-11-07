"use client";

import { useEffect, useState } from "react";
import Audience from "../components/Audience";
import CollaborationModal from "../components/CollaborationModal";
import Hero from "../components/Hero";
import SakuraTransition from "../components/SakuraTransition";

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
    <main className="h-dvh w-full relative flex flex-col overflow-hidden bg-[#f8f5ee] text-[#1c1917]">
      <SakuraTransition
        hero={
          <Hero
            onOpenCollaboration={() => setIsCollaborationOpen(true)}
            stats={instagramStats}
          />
        }
        audience={<Audience stats={instagramStats} />}
      />

      <CollaborationModal
        isOpen={isCollaborationOpen}
        onClose={() => setIsCollaborationOpen(false)}
      />
    </main>
  );
}
