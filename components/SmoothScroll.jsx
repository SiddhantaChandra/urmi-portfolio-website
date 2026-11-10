"use client";

import { ReactLenis } from "lenis/react";

const options = {
  autoRaf: true,
  anchors: true,
  // A short easing tail keeps wheel input responsive through the scroll timelines.
  lerp: 0.25,
  smoothWheel: true,
  syncTouch: false,
  respectReducedMotion: true,
};

export default function SmoothScroll({ children }) {
  return (
    <ReactLenis root options={options}>
      {children}
    </ReactLenis>
  );
}
