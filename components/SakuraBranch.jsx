"use client";

import { useEffect, useId, useRef, useState } from "react";
import { preload } from "react-dom";
import { growth, petals, spriteAnchors, sprites } from "../lib/sakura-art.mjs";
import sakuraAtlas from "../public/images/sakura-branch-atlas.webp";

const sakuraAtlasUrl = sakuraAtlas.src;

function Sprite({ id, name, width = sprites[name][2] }) {
  const [left, top, spriteWidth, spriteHeight] = sprites[name];
  const [anchorX, anchorY] = spriteAnchors[name] ?? [left, top];
  const scale = width / spriteWidth;

  return (
    <use
      href={`#${id}-${name}`}
      x={(left - anchorX) * scale}
      y={(top - anchorY) * scale}
      width={width}
      height={spriteHeight * scale}
    />
  );
}

export default function SakuraBranch() {
  preload(sakuraAtlasUrl, { as: "image", fetchPriority: "high" });
  const id = useId();
  const stageRef = useRef(null);
  const artRef = useRef(null);
  const branchRef = useRef(null);
  const shakeRef = useRef(null);
  const burstIdRef = useRef(0);
  const [bursts, setBursts] = useState([]);
  const [ambientReady, setAmbientReady] = useState(false);
  const [bloomReady, setBloomReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const atlas = new window.Image();
    atlas.src = sakuraAtlasUrl;
    atlas
      .decode()
      .then(() => {
        if (!cancelled) setBloomReady(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const shakeBranch = () => {
    shakeRef.current?.cancel();
    shakeRef.current = branchRef.current.animate(
      [0, -2.6, 2.1, -1.5, 0.9, -0.4, 0].map((angle) => ({
        transform: `rotate(${angle}deg)`,
      })),
      { duration: 720, easing: "ease-out" },
    );

    const burst = {
      id: ++burstIdRef.current,
      petals: Array.from({ length: 18 }, (_, index) => {
        const [x, y] = growth[Math.floor(Math.random() * growth.length)];
        return {
          x: 1354 - x,
          y,
          name: ["petal", "petalAngled", "petalSmall"][index % 3],
          width: 14 + Math.random() * 12,
          drift: (Math.random() - 0.65) * 260,
          distance: 380 + Math.random() * 180,
          angle: Math.random() * 360,
          delay: index * 22,
        };
      }),
    };
    // Bound rapid clicking without restarting the ambient petals.
    setBursts((current) => [...current.slice(-2), burst]);
  };

  useEffect(() => {
    let timer;
    const start = () => {
      timer = window.setTimeout(() => setAmbientReady(true), 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const art = artRef.current;
    let inView = true;

    const updatePlayback = () => {
      const paused = !inView || document.hidden;
      stage.toggleAttribute("data-paused", paused);
      if (paused) shakeRef.current?.pause();
      else if (shakeRef.current?.playState === "paused")
        shakeRef.current.play();
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      updatePlayback();
    });

    observer.observe(art);
    updatePlayback();
    document.addEventListener("visibilitychange", updatePlayback);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updatePlayback);
      shakeRef.current?.cancel();
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="hero-sakura"
      data-bloom-ready={bloomReady ? "" : undefined}
    >
      <button
        ref={artRef}
        type="button"
        className="hero-sakura-art"
        onClick={shakeBranch}
        aria-label="Shake the sakura branch and shower petals"
        title="Shake some petals loose"
      >
        <span ref={branchRef} className="sakura-branch-shake">
          <svg viewBox="0 0 1354 690" aria-hidden="true" focusable="false">
            <defs>
              <image
                id={`${id}-atlas`}
                href={sakuraAtlasUrl}
                width="1354"
                height="1254"
              />
              {Object.entries(sprites).map(([name, bounds]) => (
                <symbol
                  key={name}
                  id={`${id}-${name}`}
                  viewBox={bounds.join(" ")}
                  overflow="hidden"
                >
                  <use href={`#${id}-atlas`} />
                </symbol>
              ))}
            </defs>
            <g transform="translate(1354 0) scale(-1 1)">
              <Sprite id={id} name="branch" />
              {growth.map(([x, y, name, width, angle]) => (
                <g
                  key={`${x},${y}`}
                  transform={`translate(${x} ${y}) rotate(${angle})`}
                  style={{ "--bloom-delay": `${Math.round(x * 0.36)}ms` }}
                >
                  {name !== "bud" && (
                    <g className="sakura-bud">
                      <Sprite id={id} name="bud" width={width * 0.36} />
                    </g>
                  )}
                  <g className="sakura-blossom">
                    <Sprite id={id} name={name} width={width} />
                  </g>
                </g>
              ))}
            </g>
          </svg>
        </span>
        <svg viewBox="0 0 1354 690" aria-hidden="true" focusable="false">
          {ambientReady &&
            petals.map(([x, y, name, width, duration, delay, drift]) => (
              <g key={x} transform={`translate(${x} ${y})`}>
                <g
                  className="sakura-petal"
                  style={{
                    "--petal-duration": `${duration}s`,
                    "--petal-delay": `${delay}s`,
                    "--petal-drift": `${drift}px`,
                  }}
                >
                  <Sprite id={id} name={name} width={width} />
                </g>
              </g>
            ))}
          {bursts.map((burst) => (
            <g key={burst.id} className="sakura-click-burst">
              {burst.petals.map((petal, index) => (
                <g
                  key={`${burst.id}-${index}`}
                  transform={`translate(${petal.x} ${petal.y})`}
                >
                  <g
                    className="sakura-click-petal"
                    style={{
                      "--fall-delay": `${petal.delay}ms`,
                      "--fall-drift": `${petal.drift}px`,
                      "--fall-distance": `${petal.distance}px`,
                      "--fall-angle": `${petal.angle}deg`,
                    }}
                    onAnimationEnd={
                      index === burst.petals.length - 1
                        ? () => {
                            setBursts((current) =>
                              current.filter(
                                ({ id: burstId }) => burstId !== burst.id,
                              ),
                            );
                          }
                        : undefined
                    }
                  >
                    <Sprite id={id} name={petal.name} width={petal.width} />
                  </g>
                </g>
              ))}
            </g>
          ))}
        </svg>
      </button>
    </div>
  );
}
