"use client";

import { useState } from "react";
import Audience from "../components/Audience";
import CollaborationModal from "../components/CollaborationModal";
import Hero from "../components/Hero";
import SakuraTransition from "../components/SakuraTransition";

export default function Home() {
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);

  return (
    <main className="h-dvh w-full relative flex flex-col overflow-hidden bg-[#f8f5ee] text-[#1c1917]">
      <SakuraTransition
        hero={<Hero onOpenCollaboration={() => setIsCollaborationOpen(true)} />}
        audience={<Audience />}
      />

      <CollaborationModal
        isOpen={isCollaborationOpen}
        onClose={() => setIsCollaborationOpen(false)}
      />
    </main>
  );
}
