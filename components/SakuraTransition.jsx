"use client";

import { useEffect, useRef, useState } from "react";
import "./SakuraTransition.css";

// Reuse the painted petals from the hero's atlas.
const PETAL_CROPS = [
  [722, 1124, 122, 94],
  [1002, 1122, 95, 99],
  [1125, 1134, 77, 84],
];

function random(seed) {
  const value = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return value - Math.floor(value);
}

const DURATION = 1200;
const TRAIL_END = DURATION + 300;
const SHOW_MAIN_PETAL = false;
// Sample once per transition, keeping each petal's path stable during its flight.
function createPetals() {
  const variation = Math.random() * 1000000;
  // Depth controls size, speed and translucency; paint back to front.
  return Array.from({ length: 234 }, (_, index) => {
    const seed = index + 1 + variation;
    const trailing = index >= 228;
    const depth = trailing
      ? 0.2 + random(seed + 2801) * 0.5
      : random(seed + 2801);
    const at = trailing
      ? DURATION * (0.57 + random(seed + 3201) * 0.11)
      : random(seed + 3201) ** 0.82 * DURATION * 0.39;
    // Separate exit windows spread the six trailing petals across the ending.
    const tailExit = DURATION - 80 + (index - 228) * 65 + random(seed + 1) * 30;
    return {
      at,
      trailing,
      depth,
      duration: trailing
        ? tailExit - at
        : DURATION * (0.6 - depth * 0.24 + random(seed + 1) * 0.09),
      entry: trailing
        ? 0.3 + random(seed + 3601) * 0.35
        : 0.88 + random(seed + 3601) * 0.3,
      exit: trailing ? 0.12 + depth * 0.05 : 0.18 + depth * 0.2,
      y: 0.02 + random(seed + 401) * 0.88,
      size:
        (0.4 + depth ** 2 * (trailing ? 1.3 : 2.8)) *
        (0.8 + random(seed + 801) * 0.4),
      angle: random(seed + 1201) * Math.PI * 2,
      spin:
        (random(seed + 1601) - 0.5) * (trailing ? 0.7 + depth : 2 + depth * 4),
      phase: random(seed + 2001) * Math.PI * 2,
      arc: (random(seed + 2401) - 0.5) * (trailing ? 0.07 : 0.5),
      fall: trailing
        ? 0.025 + random(seed + 4001) * 0.045
        : 0.08 + random(seed + 4001) * 0.22,
      crop: Math.floor(random(seed + 4401) * PETAL_CROPS.length),
    };
  }).sort((a, b) => a.depth - b.depth);
}

function smoothstep(from, to, value) {
  const t = Math.max(0, Math.min(1, (value - from) / (to - from)));
  return t * t * (3 - 2 * t);
}

export default function SakuraTransition({ hero, audience }) {
  const stageRef = useRef(null);
  const heroRef = useRef(null);
  const audienceRef = useRef(null);
  const canvasRef = useRef(null);
  const [scene, setScene] = useState("hero");

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const atlas = new window.Image();
    let frame = 0;
    let disposed = false;
    let width = 0;
    let height = 0;
    let animation = null;
    let currentScene = "hero";
    let accumulated = 0;
    let lastInput = 0;
    let ignoreUntil = 0;
    let touchY = null;
    let focusFrame = 0;

    const activePanel = () =>
      currentScene === "hero" ? heroRef.current : audienceRef.current;

    const switchScene = (direction) => {
      currentScene = direction === 1 ? "audience" : "hero";
      const nextPanel = activePanel();
      setScene(currentScene);
      cancelAnimationFrame(focusFrame);
      focusFrame = requestAnimationFrame(() => {
        nextPanel.scrollTop = direction === 1 ? 0 : nextPanel.scrollHeight;
        nextPanel.focus({ preventScroll: true });
      });
    };

    const clear = () => {
      context?.clearRect(0, 0, width, height);
      canvas.style.visibility = "hidden";
    };

    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      animation = null;
      accumulated = 0;
      ignoreUntil = performance.now() + 350;
      clear();
    };

    const render = (now) => {
      frame = 0;
      if (document.hidden || preference.matches || !animation) {
        if (animation && preference.matches && !animation.switched)
          switchScene(animation.direction);
        stop();
        return;
      }

      const elapsed = Math.max(0, now - animation.startedAt);
      const progress = elapsed / DURATION;
      if (elapsed >= TRAIL_END) {
        // Also complete navigation if a slow frame skipped the covered midpoint.
        if (!animation.switched) switchScene(animation.direction);
        stop();
        return;
      }
      const direction = animation.direction;
      canvas.style.visibility = "visible";
      context.clearRect(0, 0, width, height);

      const fade = 1 - smoothstep(TRAIL_END - 40, TRAIL_END, elapsed);
      canvas.style.opacity = String(fade);
      const switching = progress >= 0.5 && !animation.switched;
      const coverage = switching
        ? 1
        : smoothstep(0.45, 0.5, progress) *
          (1 - smoothstep(0.53, 0.67, progress));
      // The close-up fills the lens before this backing conceals the scene cut.
      context.globalAlpha = coverage;
      context.fillStyle = "#f2c8cd";
      context.fillRect(0, 0, width, height);

      // Keep the incoming scene still until the foreground petal covers the lens.
      if (switching) {
        animation.switched = true;
        switchScene(direction);
      }

      const mobile = width < 768;
      const baseSize = mobile ? 42 : Math.min(92, width * 0.065);
      for (const petal of animation.petals) {
        if (!petal.trailing && progress >= 0.68) continue;
        const flight = (elapsed - petal.at) / petal.duration;
        if (flight <= 0 || flight >= 1) continue;
        const travel = flight * (0.9 + flight * 0.1);
        const size =
          baseSize * petal.size * (0.85 + travel * (0.3 + petal.depth * 0.6));
        const flutter = flight * (3 + petal.depth * 4) + petal.phase;
        const x =
          width *
            (0.5 +
              direction *
                (petal.entry - 0.5 - travel * (petal.entry + petal.exit))) +
          Math.sin(flutter) *
            Math.sin(flight * Math.PI) *
            width *
            (petal.trailing ? 0.006 : 0.01 + petal.depth * 0.025);
        const y =
          petal.y * height +
          travel * height * petal.fall * direction +
          Math.sin(flight * Math.PI) * height * petal.arc;
        if (x < -size || x > width + size || y < -size || y > height + size)
          continue;

        const [sx, sy, sw, sh] = PETAL_CROPS[petal.crop];
        context.save();
        context.globalAlpha =
          smoothstep(0, 0.08, flight) *
          (petal.trailing ? 1 : 1 - smoothstep(0.75, 1, flight)) *
          (0.55 + petal.depth * 0.45) *
          (petal.trailing ? 1 : 1 - smoothstep(0.5, 0.68, progress));
        context.translate(x, y);
        context.rotate(petal.angle + flight * petal.spin * direction);
        context.scale(0.65 + Math.abs(Math.cos(flutter)) * 0.35, 1);
        context.drawImage(
          atlas,
          sx,
          sy,
          sw,
          sh,
          -size / 2,
          -((size * sh) / sw) / 2,
          size,
          (size * sh) / sw,
        );
        context.restore();
      }

      // The foreground petal fills the lens, then sweeps past it. The remaining
      // petals emerge from behind its departing edge over the incoming scene.
      const approach = smoothstep(0.23, 0.48, progress);
      const departure = smoothstep(0.5, 0.7, progress);
      if (SHOW_MAIN_PETAL && approach > 0 && departure < 1) {
        const diagonal = Math.hypot(width, height);
        const size = diagonal * 0.055 * 75 ** approach;
        const settle = smoothstep(0, 0.72, approach);
        const x =
          width * (0.5 + direction * 0.36 * (1 - settle)) -
          direction * departure ** 2 * (width * 0.6 + size * 0.75);
        const y =
          height * (0.5 - 0.2 * (1 - settle)) -
          direction * departure * height * 0.18;
        const [sx, sy, sw, sh] = PETAL_CROPS[0];
        context.save();
        context.globalAlpha = smoothstep(0, 0.12, approach);
        context.translate(x, y);
        context.rotate(direction * (-0.6 + settle * 0.72 + departure * 0.25));
        context.drawImage(
          atlas,
          sx,
          sy,
          sw,
          sh,
          -size / 2,
          -((size * sh) / sw) / 2,
          size,
          (size * sh) / sw,
        );
        context.restore();
      }
      context.globalAlpha = 1;
      // A real-time stinger: it keeps flying even after the visitor stops scrolling.
      frame = requestAnimationFrame(render);
    };

    const start = (direction) => {
      if (disposed || document.hidden) return;
      if (animation) {
        if (performance.now() - animation.startedAt < DURATION) return;
        // The soft tail is decorative and can yield to the next navigation.
        stop();
      }
      // Scene navigation also works when the decorative animation is unavailable.
      if (
        preference.matches ||
        !context ||
        !atlas.complete ||
        !atlas.naturalWidth
      ) {
        switchScene(direction);
        ignoreUntil = performance.now() + 350;
        return;
      }
      const petals = createPetals();
      animation = {
        startedAt: performance.now(),
        direction,
        switched: false,
        petals,
      };
      if (!frame) frame = requestAnimationFrame(render);
    };

    const consume = (delta, event, threshold = 140) => {
      if (!delta) return;
      if (
        (animation && performance.now() - animation.startedAt < DURATION) ||
        performance.now() < ignoreUntil
      ) {
        event.preventDefault();
        return;
      }
      const panel = activePanel();
      const atStart = panel.scrollTop <= 1;
      const atEnd =
        panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1;
      const leaving =
        currentScene === "hero" ? delta > 0 && atEnd : delta < 0 && atStart;
      if (!leaving) {
        accumulated = 0;
        return;
      }
      // Collect intent at the edge; the next scene cannot peek into view.
      event.preventDefault();
      const now = performance.now();
      if (now - lastInput > 350 || Math.sign(accumulated) !== Math.sign(delta))
        accumulated = 0;
      lastInput = now;
      accumulated += Math.sign(delta) * Math.min(Math.abs(delta), 90);
      if (Math.abs(accumulated) >= threshold) {
        accumulated = 0;
        start(Math.sign(delta));
      }
    };
    const onWheel = (event) => {
      if (event.ctrlKey || event.metaKey) return;
      const unit =
        event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? height : 1;
      consume(event.deltaY * unit, event);
    };
    const onTouchStart = (event) => {
      touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
      accumulated = 0;
    };
    const onTouchMove = (event) => {
      if (touchY === null || event.touches.length !== 1) return;
      const y = event.touches[0].clientY;
      consume(touchY - y, event, 80);
      touchY = y;
    };
    const onKeyDown = (event) => {
      if (!stage.contains(event.target) && event.target !== document.body)
        return;
      if (
        event.defaultPrevented ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.target.closest(
          "input, textarea, select, button, a, [contenteditable='true']",
        )
      )
        return;
      const delta = {
        ArrowDown: 40,
        ArrowUp: -40,
        PageDown: 90,
        PageUp: -90,
        End: 90,
        Home: -90,
        " ": event.shiftKey ? -90 : 90,
      }[event.key];
      if (delta) {
        if (event.target === document.body)
          activePanel().focus({ preventScroll: true });
        consume(delta, event);
      }
    };
    const onPreferenceChange = () => {
      if (animation && preference.matches && !animation.switched)
        switchScene(animation.direction);
      stop();
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context?.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);
    atlas.src = "/images/sakura-branch-spite.webp";
    resize();
    stage.addEventListener("wheel", onWheel, { passive: false });
    stage.addEventListener("touchstart", onTouchStart, { passive: true });
    stage.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", stop);
    preference.addEventListener("change", onPreferenceChange);

    return () => {
      disposed = true;
      document.documentElement.style.overflow = previousOverflow;
      cancelAnimationFrame(frame);
      cancelAnimationFrame(focusFrame);
      resizeObserver.disconnect();
      stage.removeEventListener("wheel", onWheel);
      stage.removeEventListener("touchstart", onTouchStart);
      stage.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", stop);
      preference.removeEventListener("change", onPreferenceChange);
    };
  }, []);

  return (
    <div ref={stageRef} className="sakura-scenes">
      <section
        ref={heroRef}
        className="sakura-scene"
        hidden={scene !== "hero"}
        inert={scene !== "hero"}
        aria-label="Introduction and Hanafuda"
        tabIndex={-1}
      >
        {hero}
      </section>
      <section
        ref={audienceRef}
        className="sakura-scene"
        hidden={scene !== "audience"}
        inert={scene !== "audience"}
        aria-label="Audience"
        tabIndex={-1}
      >
        {audience}
      </section>
      <canvas
        ref={canvasRef}
        className="sakura-transition-petals"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
