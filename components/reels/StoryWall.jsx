"use client";

import { Cover } from "./ReelUI";
import { wallReels } from "./reels";

export default function StoryWall({ onPreview }) {
  return (
    <section
      className="reels-section reels-wall"
      id="story-wall"
      aria-labelledby="wall-title"
      data-reveal="wall"
    >
      <svg
        className="wall-entry-curve"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 0 A500 100 0 0 0 1000 0 Z" />
      </svg>
      <header className="wall-head">
        <h2 id="wall-title" data-enter="heading">
          Featured Works
        </h2>
      </header>
      <div className="wall-gallery">
        <p className="wall-interlude">
          <span>Fresh obsessions.</span> <span>Familiar favourites.</span>
          <span>A wall of worlds worth falling into.</span>
        </p>
        {wallReels.map((reel) => (
          <figure className="wall-piece" data-reel={reel.id} key={reel.id}>
            <div className="wall-mount">
              <Cover reel={reel} onPreview={onPreview} compact />
              <figcaption>
                <span>
                  {reel.collection === "Recent"
                    ? "Recent reel"
                    : "Popular work"}
                </span>
                <span>{reel.film}</span>
              </figcaption>
            </div>
          </figure>
        ))}
      </div>
    </section>
  );
}
