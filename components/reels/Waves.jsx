"use client";

import { InstagramLink, PublishedCover } from "./ReelUI";

export default function Waves({ showcase, loading }) {
  const recent = showcase?.recent ?? [];
  const popular = showcase?.popular ?? [];
  return (
    <section
      className="reels-section reels-wave"
      id="reel-waves"
      aria-labelledby="wave-title"
    >
      <section
        className="wave-gallery wave-top"
        data-reveal="wave"
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
      <div className="wave-centre" data-reveal="title">
        <span className="wave-side-note">Anime, through my eyes.</span>
        <div>
          <h2 id="wave-title">
            Stories in <em>motion.</em>
          </h2>
          <p>
            A few frames. A different perspective.
            <br />A story that stays with you.
          </p>
        </div>
        <InstagramLink />
      </div>
      <section
        className="wave-gallery wave-bottom"
        data-reveal="wave"
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
    </section>
  );
}
