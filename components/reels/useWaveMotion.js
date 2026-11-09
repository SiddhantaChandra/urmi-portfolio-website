"use client";

import { useEffect } from "react";

export default function useWaveMotion(ref, contentKey) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !contentKey) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let rows = [];

    function reset() {
      for (const node of root.querySelectorAll(".wave-item")) {
        node.style.removeProperty("--orbit-shift-y");
      }
    }

    function draw() {
      frame = 0;
      if (preference.matches) return;
      const rect = root.getBoundingClientRect();
      for (const { items, startY, top, radiusY } of rows) {
        const progress = Math.max(
          0,
          Math.min(
            1,
            (window.innerHeight * 0.85 - rect.top - top) /
              (window.innerHeight * 0.55),
          ),
        );
        const eased = progress * progress * (3 - 2 * progress);
        for (const { node, y } of items) {
          node.style.setProperty(
            "--orbit-shift-y",
            `${(startY - y) * radiusY * (1 - eased)}px`,
          );
        }
      }
    }

    function schedule() {
      if (!frame && !preference.matches) frame = requestAnimationFrame(draw);
    }

    function measure() {
      cancelAnimationFrame(frame);
      frame = 0;
      reset();
      rows = [];
      if (preference.matches) return;
      // Every row enters level and settles into its arch, at every screen size.
      for (const selector of [".wave-top", ".wave-bottom"]) {
        const items = [...root.querySelectorAll(`${selector} .wave-item`)]
          .filter((node) => node.getClientRects().length)
          .map((node) => ({
            node,
            y: Number(getComputedStyle(node).getPropertyValue("--orbit-y")),
          }));
        if (!items.length) continue;
        const cardHeight = items[0].node.offsetHeight;
        const radiusY = (root.clientHeight - cardHeight) / 2;
        const startY = Math.min(...items.map(({ y }) => y));
        rows.push({
          items,
          startY,
          radiusY,
          top: root.clientHeight / 2 + startY * radiusY - cardHeight / 2,
        });
      }
      draw();
    }

    const resize = new ResizeObserver(measure);
    resize.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    preference.addEventListener("change", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
      preference.removeEventListener("change", measure);
      reset();
    };
  }, [ref, contentKey]);
}
