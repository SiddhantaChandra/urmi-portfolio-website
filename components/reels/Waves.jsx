"use client";

import { useRef } from "react";
import { InstagramLink, PublishedCover } from "./ReelUI";
import useWaveMotion from "./useWaveMotion";

export default function Waves({ showcase, loading }) {
  const recent = (showcase?.recent ?? []).slice(0, 5);
  const popular = (showcase?.popular ?? []).slice(0, 5);
  const orbit = useRef(null);
  useWaveMotion(
    orbit,
    recent.length || popular.length
      ? `${recent.map((reel) => reel.id)}|${popular.map((reel) => reel.id)}`
      : null,
  );
  return (
    <section
      className="reels-section reels-wave"
      id="reel-waves"
      aria-labelledby="wave-title"
    >
      <div className="wave-orbit" ref={orbit}>
        <section
          className="wave-gallery wave-top"
          aria-label="Most recent reels"
          aria-busy={loading}
        >
          {recent.map((reel, index) => (
            <div className={`wave-item wave-item-${index}`} key={reel.id}>
              <div className="wave-entrance">
                <PublishedCover reel={reel} collection="Recent" />
              </div>
            </div>
          ))}
          {!recent.length && (
            <output className="wave-status">
              {loading
                ? "Loading recent reels…"
                : "Find the latest reels on Instagram."}
            </output>
          )}
        </section>
        <div className="wave-centre">
          <div>
            <h2 id="wave-title">
              Stories in <em>motion.</em>
            </h2>
          </div>
          <InstagramLink />
        </div>
        <section
          className="wave-gallery wave-bottom"
          aria-label="Most popular reels by lifetime views"
          aria-busy={loading}
        >
          {popular.map((reel, index) => (
            <div className={`wave-item wave-item-${index}`} key={reel.id}>
              <div className="wave-entrance">
                <PublishedCover reel={reel} collection="Popular" />
              </div>
            </div>
          ))}
          {!popular.length && (
            <output className="wave-status">
              {loading
                ? "Loading popular reels…"
                : "Popular reels are temporarily unavailable."}
            </output>
          )}
        </section>
      </div>
    </section>
  );
}
