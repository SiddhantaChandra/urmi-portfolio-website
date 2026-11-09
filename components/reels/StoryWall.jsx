// biome-ignore-all lint/a11y/noNoninteractiveTabindex: The horizontal scroll region needs keyboard access for arrow and Home/End navigation.

"use client";

import { useEffect, useRef, useState } from "react";
import { Cover } from "./ReelUI";
import { wallReels } from "./reels";

export default function StoryWall({ onPreview }) {
  const gallery = useRef(null);
  const destination = useRef(null);
  const [edges, setEdges] = useState({ previous: false, next: true });

  useEffect(() => {
    const track = gallery.current;
    function updateEdges() {
      const nextEdges = {
        previous: track.scrollLeft > 2,
        next: track.scrollLeft < track.scrollWidth - track.clientWidth - 2,
      };
      setEdges((current) =>
        current.previous === nextEdges.previous &&
        current.next === nextEdges.next
          ? current
          : nextEdges,
      );
    }
    function finishScroll() {
      destination.current = null;
      updateEdges();
    }
    updateEdges();
    track.addEventListener("scroll", updateEdges, { passive: true });
    track.addEventListener("scrollend", finishScroll);
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", updateEdges);
      track.removeEventListener("scrollend", finishScroll);
      observer.disconnect();
    };
  }, []);

  function move(direction) {
    const track = gallery.current;
    const origin = track.children[0].offsetLeft;
    const maximum = track.scrollWidth - track.clientWidth;
    const stops = [
      ...new Set([
        0,
        ...Array.from(track.children, (card) =>
          Math.min(maximum, card.offsetLeft - origin),
        ),
        maximum,
      ]),
    ];
    const current = destination.current ?? track.scrollLeft;
    const target =
      direction > 0
        ? (stops.find((position) => position > current + 2) ?? maximum)
        : (stops.findLast((position) => position < current - 2) ?? 0);
    destination.current = target;
    track.scrollTo({
      left: target,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }

  function handleKeyDown(event) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      destination.current = null;
      gallery.current.scrollTo({
        left: event.key === "Home" ? 0 : gallery.current.scrollWidth,
        behavior: "instant",
      });
    }
  }

  return (
    <section
      className="reels-section reels-wall reels-entry"
      id="story-wall"
      aria-labelledby="wall-title"
      data-reveal="wall"
    >
      <svg
        className="reels-entry-curve"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 0 A500 100 0 0 0 1000 0 Z" />
      </svg>
      <header className="wall-head">
        <h2 id="wall-title" data-enter="heading">
          <s className="wall-former-role">Ex-Journalist</s>
          <span className="wall-current-role">Full-time storyteller.</span>
        </h2>
        <p className="wall-story-note">
          <span>The medium changed.</span>
          <span>The love for stories never did.</span>
        </p>
      </header>
      <div className="wall-toolbar">
        <fieldset className="wall-controls" aria-label="Gallery controls">
          {[-1, 1].map((direction) => (
            <button
              key={direction}
              className="wall-scroll-button"
              type="button"
              aria-label={direction === -1 ? "Previous covers" : "Next covers"}
              aria-controls="wall-gallery"
              disabled={direction === -1 ? !edges.previous : !edges.next}
              onClick={() => move(direction)}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                aria-hidden="true"
              >
                <path
                  d={
                    direction === -1
                      ? "M20 12H4m7-7-7 7 7 7"
                      : "M4 12h16m-7-7 7 7-7 7"
                  }
                />
              </svg>
            </button>
          ))}
        </fieldset>
      </div>
      <div className="wall-carousel">
        <section
          className="wall-gallery"
          id="wall-gallery"
          ref={gallery}
          aria-roledescription="carousel"
          aria-label="Scrollable cover gallery"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onPointerDown={() => {
            destination.current = null;
          }}
          onWheel={() => {
            destination.current = null;
          }}
          data-lenis-prevent-horizontal=""
        >
          {wallReels.map((reel, index) => (
            <figure
              className="wall-piece"
              data-reel={reel.id}
              key={reel.id}
              aria-label={`${index + 1} of ${wallReels.length}: ${reel.film}`}
            >
              <div className="wall-card-entry">
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
              </div>
            </figure>
          ))}
        </section>
      </div>
    </section>
  );
}
