import { useEffect, useRef } from "react";

const clamp = (value) => Math.max(0, Math.min(1, value));
const smoothstep = (value) => value * value * (3 - 2 * value);

// Interpolated, layered noise gives the edge uneven shoulders rather than a sine wave.
function noise(position, seed) {
  const hash = (index) => {
    const value = Math.sin(index * 127.1 + seed * 311.7) * 43758.5453;
    return value - Math.floor(value);
  };
  const index = Math.floor(position);
  const blend = smoothstep(position - index);
  return hash(index) * (1 - blend) + hash(index + 1) * blend;
}

function edgePath(width, height, depth, phase) {
  const count = Math.max(64, Math.ceil(width / 14));
  const points = Array.from({ length: count + 1 }, (_, index) => {
    const x = index / count;
    const broad = noise(x * 9 + phase, 7);
    const detail = noise(x * 21 - phase * 0.8, 19);
    const ripple = noise(x * 37 + phase * 1.3, 31);
    const distortion =
      (broad - 0.5) * 2.6 + (detail - 0.5) * 1.4 + (ripple - 0.5) * 0.7;
    const y = depth * (0.5 + Math.tanh(distortion) * 0.48);
    return [x * width, y];
  });
  const point = ([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`;
  let path = `M ${point(points[0])}`;

  for (let index = 1; index < points.length - 1; index += 1) {
    const current = points[index];
    const next = points[index + 1];
    path += ` Q ${point(current)} ${point([
      (current[0] + next[0]) / 2,
      (current[1] + next[1]) / 2,
    ])}`;
  }

  path += ` L ${point(points.at(-1))} L ${width} ${height} L 0 ${height} Z`;
  return `path("${path}")`;
}

export default function useAudienceEdge() {
  const screenRef = useRef(null);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen || !CSS.supports("clip-path", 'path("M 0 0 L 1 0 L 1 1 Z")')) {
      return;
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastPaint = 0;
    let phase = 0;
    let width = 0;
    let height = 0;
    let maxDepth = 0;

    function stop() {
      cancelAnimationFrame(frame);
      frame = 0;
      lastPaint = 0;
      screen.style.removeProperty("clip-path");
    }

    function draw(time) {
      frame = 0;
      const top = screen.getBoundingClientRect().top;
      const viewport = window.innerHeight;

      // The finished panel is completely unclipped; no idle loop at or above the top.
      if (motion.matches || document.hidden || top <= 0 || top >= viewport) {
        stop();
        return;
      }

      if (!lastPaint || time - lastPaint >= 1000 / 30) {
        phase += lastPaint ? Math.min(time - lastPaint, 64) * 0.0003 : 0;
        lastPaint = time;
        // Ease the contour flat over the final third of a screen of travel.
        const remaining = smoothstep(clamp(top / (viewport * 0.35)));
        screen.style.clipPath = edgePath(
          width,
          height,
          maxDepth * remaining,
          phase,
        );
      }
      frame = requestAnimationFrame(draw);
    }

    function update() {
      const top = screen.getBoundingClientRect().top;
      if (
        motion.matches ||
        document.hidden ||
        top <= 0 ||
        top >= window.innerHeight
      ) {
        stop();
      } else if (!frame) {
        frame = requestAnimationFrame(draw);
      }
    }

    function measure() {
      width = screen.offsetWidth;
      height = screen.offsetHeight;
      // Keep the contour inside the existing padding, clear of chart headings.
      const padding = Number.parseFloat(getComputedStyle(screen).paddingTop);
      maxDepth = Math.min(130, window.innerHeight * 0.18, padding * 0.98);
      lastPaint = 0;
      update();
    }

    const observer = new ResizeObserver(measure);
    observer.observe(screen);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", update);
    motion.addEventListener("change", update);
    measure();

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", measure);
      document.removeEventListener("visibilitychange", update);
      motion.removeEventListener("change", update);
    };
  }, []);

  return screenRef;
}
