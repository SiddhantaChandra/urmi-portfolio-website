"use client";

import { useRef, useState } from "react";
import { PreviewDialog } from "./ReelUI";
import StoryWall from "./StoryWall";
import useReelMotion from "./useReelMotion";
import Waves from "./Waves";
import "./Reels.css";

export default function ReelsShowcase({ showcase, loading = false }) {
  const root = useRef(null);
  const [preview, setPreview] = useState(null);
  useReelMotion(root);

  return (
    <div className="reels-showcase" ref={root}>
      <StoryWall onPreview={setPreview} />
      <Waves showcase={showcase} loading={loading} />
      <p className="reels-preview-note">
        Featured Works uses sample covers · Stories in motion features published
        Instagram reels
      </p>
      <PreviewDialog reel={preview} onClose={() => setPreview(null)} />
    </div>
  );
}
