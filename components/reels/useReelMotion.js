"use client";

import { useEffect } from "react";

export default function useReelMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.IntersectionObserver || !Element.prototype.animate)
      return;
    const animations = new Set();
    function play(node, frames, delay = 0, duration = 800) {
      if (!node.getClientRects().length) return;
      const animation = node.animate(frames, {
        duration,
        delay,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "backwards",
      });
      animations.add(animation);
      animation.onfinish = animation.oncancel = () => {
        animations.delete(animation);
      };
    }
    function rise(node, delay = 0) {
      play(
        node,
        [
          { opacity: 0.4, transform: "translateY(24px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        delay,
      );
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          observer.unobserve(target);
          target.dataset.entered = "true";
          if (target.dataset.reveal === "wall") {
            rise(target.querySelector("[data-enter='heading']"));
          } else {
            rise(target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -3% 0px" },
    );
    for (const node of root.querySelectorAll(
      "[data-reveal]:not([data-entered])",
    )) {
      observer.observe(node);
    }
    return () => {
      observer.disconnect();
      for (const animation of animations) animation.cancel();
    };
  }, [ref]);
}
