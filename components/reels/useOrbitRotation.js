"use client";

import { useEffect } from "react";

// A closed curve through the existing layout keeps the cards upright and on
// the same elliptical track, rather than rotating the entire rectangular stage.
function pointOnOrbit(points, position) {
  const count = points.length;
  const index = Math.floor(position);
  const t = position - index;
  const point = (offset) =>
    points[(((index + offset) % count) + count) % count];
  const [a, b, c, d] = [-1, 0, 1, 2].map(point);
  return ["x", "y"].map(
    (axis) =>
      0.5 *
      (2 * b[axis] +
        (-a[axis] + c[axis]) * t +
        (2 * a[axis] - 5 * b[axis] + 4 * c[axis] - d[axis]) * t ** 2 +
        (-a[axis] + 3 * b[axis] - 3 * c[axis] + d[axis]) * t ** 3),
  );
}

export default function useOrbitRotation(ref, contentKey) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !contentKey) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let cards = [];
    let desktopRows = [];
    let radiusX = 0;
    let radiusY = 0;
    let firstRowDepth = 0;
    let lastProgress = null;
    let spreadAmount = 0.08;

    function reset() {
      for (const node of root.querySelectorAll(".wave-item")) {
        node.style.removeProperty("--orbit-shift-x");
        node.style.removeProperty("--orbit-shift-y");
      }
      root.style.removeProperty("--orbit-scale");
    }

    function draw() {
      frame = 0;
      if (preference.matches) return;
      const rect = root.getBoundingClientRect();
      if (desktopRows.length) {
        for (const { items, startY, top } of desktopRows) {
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
        return;
      }
      if (!cards.length) return;
      const span = Math.min(rect.height, window.innerHeight);
      // Let the first cards enter before the small turn, then settle by row entry.
      const entry = span * 0.05;
      const progress = Math.max(
        0,
        Math.min(
          1,
          (window.innerHeight - rect.top - entry) / (firstRowDepth - entry),
        ),
      );
      if (progress === lastProgress) return;
      lastProgress = progress;
      const offset = -(1 - progress);
      root.style.setProperty("--orbit-scale", 0.9 + 0.1 * progress ** 12);
      cards.forEach(({ node, x, y }, index) => {
        const [nextX, nextY] = pointOnOrbit(cards, index + offset);
        const spread = 1 + spreadAmount * (1 - progress ** 12);
        node.style.setProperty(
          "--orbit-shift-x",
          `${(nextX * spread - x) * radiusX}px`,
        );
        node.style.setProperty("--orbit-shift-y", `${(nextY - y) * radiusY}px`);
      });
    }

    function schedule() {
      if (!frame && !preference.matches) frame = requestAnimationFrame(draw);
    }

    function measure() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastProgress = null;
      reset();
      desktopRows = [];
      // Each desktop row enters level, then settles into its own arch.
      if (window.matchMedia("(min-width: 801px)").matches) {
        cards = [];
        for (const selector of [".wave-top", ".wave-bottom"]) {
          const items = [...root.querySelectorAll(`${selector} .wave-item`)]
            .filter((node) => node.getClientRects().length)
            .map((node) => ({
              node,
              y: Number(getComputedStyle(node).getPropertyValue("--orbit-y")),
            }));
          if (!items.length) continue;
          const cardHeight = items[0].node.offsetHeight;
          radiusY = (root.clientHeight - cardHeight) / 2;
          const startY = Math.min(...items.map(({ y }) => y));
          desktopRows.push({
            items,
            startY,
            top: root.clientHeight / 2 + startY * radiusY - cardHeight / 2,
          });
        }
        draw();
        return;
      }
      const recent = [...root.querySelectorAll(".wave-top .wave-item")].filter(
        (node) => node.getClientRects().length,
      );
      const popular = [
        ...root.querySelectorAll(".wave-bottom .wave-item"),
      ].filter((node) => node.getClientRects().length);
      const expected = window.matchMedia("(max-width: 640px)").matches ? 3 : 4;
      spreadAmount =
        expected === 4 && window.matchMedia("(max-width: 1150px)").matches
          ? 0.22
          : 0.08;
      cards = [];
      if (recent.length !== expected || popular.length !== expected) return;
      cards = [...recent, ...popular].map((node) => {
        const style = getComputedStyle(node);
        return {
          node,
          x: Number(style.getPropertyValue("--orbit-x")),
          y: Number(style.getPropertyValue("--orbit-y")),
        };
      });
      cards.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x));
      radiusX = (root.clientWidth - cards[0].node.offsetWidth) / 2;
      radiusY = (root.clientHeight - cards[0].node.offsetHeight) / 2;
      firstRowDepth = Math.max(
        ...cards
          .filter(({ y }) => y < 0)
          .map(
            ({ node, y }) =>
              root.clientHeight / 2 + y * radiusY + node.offsetHeight / 2,
          ),
      );
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
