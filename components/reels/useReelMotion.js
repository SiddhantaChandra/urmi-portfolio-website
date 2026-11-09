"use client";

import { useEffect } from "react";

export default function useReelMotion(ref) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !window.IntersectionObserver || !Element.prototype.animate)
      return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
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
          if (preference.matches) continue;
          if (target.dataset.reveal === "wave") {
            const covers = [
              ...target.querySelectorAll(".wave-entrance"),
            ].filter((node) => node.getClientRects().length);
            const centre = (covers.length - 1) / 2;
            covers.forEach((node, index) => {
              play(
                node,
                [
                  {
                    opacity: 0.2,
                    transform: "translateY(38px) scale(.975)",
                    clipPath: "inset(10% 0 0 0)",
                  },
                  {
                    opacity: 1,
                    transform: "translateY(0) scale(1)",
                    clipPath: "inset(0)",
                  },
                ],
                Math.abs(index - centre) * 75,
                900,
              );
            });
          } else if (target.dataset.reveal === "wall") {
            rise(target.querySelector("[data-enter='heading']"));
          } else {
            rise(target);
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -3% 0px" },
    );
    for (const node of root.querySelectorAll("[data-reveal]"))
      observer.observe(node);
    function finishMotion() {
      if (preference.matches)
        for (const animation of animations) animation.finish();
    }
    preference.addEventListener("change", finishMotion);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", finishMotion);
      for (const animation of animations) animation.cancel();
    };
  }, [ref]);
}
