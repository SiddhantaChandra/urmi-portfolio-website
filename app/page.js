"use client";

import { useState } from "react";
import CollaborationModal from "../components/CollaborationModal";
import Hero from "../components/Hero";

export default function Home() {
  const [isCollaborationOpen, setIsCollaborationOpen] = useState(false);

  return (
    <main className="min-h-screen w-full relative flex flex-col bg-[#f8f5ee] text-[#1c1917]">
      <Hero onOpenCollaboration={() => setIsCollaborationOpen(true)} />

      <CollaborationModal
        isOpen={isCollaborationOpen}
        onClose={() => setIsCollaborationOpen(false)}
      />
    </main>
  );
}
