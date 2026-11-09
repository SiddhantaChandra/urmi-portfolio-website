"use client";

import { useRef } from "react";
import StoryWall from "./StoryWall";
import useReelMotion from "./useReelMotion";
import Waves from "./Waves";
import "./Reels.css";

export default function ReelsShowcase({ showcase, loading = false }) {
  const root = useRef(null);
  useReelMotion(root);

  return (
    <div className="reels-showcase" ref={root}>
      <Waves showcase={showcase} loading={loading} />
      <StoryWall />
    </div>
  );
}
