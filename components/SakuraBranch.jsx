"use client";

import { useEffect, useId, useRef, useState } from "react";

const sprites = {
  branch: [0, 0, 1354, 656],
  flower: [44, 846, 262, 236],
  profile: [368, 847, 229, 224],
  pair: [651, 850, 291, 232],
  cluster: [971, 900, 246, 168],
  bud: [122, 1115, 82, 110],
  fullBud: [420, 1108, 100, 119],
  petal: [722, 1124, 122, 94],
  petalAngled: [1002, 1122, 95, 99],
  petalSmall: [1125, 1134, 77, 84],
};

// These atlas coordinates identify the stems' bases or the face-on flower's center.
const spriteAnchors = {
  flower: [174, 970],
  profile: [377, 1051],
  pair: [807, 1054],
  cluster: [1097, 1054],
  bud: [132, 1214],
  fullBud: [430, 1216],
};

// Each entry is a point on the unmirrored branch, followed by its sprite, width, and rotation.
const growth = [
  [226, 336, "profile", 45, 9],
  [254, 424, "flower", 39, -17],
  [281, 500, "pair", 60, -68],
  [259, 557, "profile", 50, -96],
  [303, 603, "fullBud", 32, 131],
  [338, 555, "cluster", 62, 105],
  [378, 567, "fullBud", 31, 99],

  [368, 393, "flower", 54, 9],
  [401, 376, "pair", 71, -15],
  [435, 374, "profile", 47, 5],
  [438, 413, "cluster", 60, 93],
  [476, 410, "bud", 19, 67],
  [477, 533, "profile", 44, 98],
  [527, 499, "flower", 47, 7],
  [567, 445, "cluster", 60, -29],
  [599, 432, "profile", 55, 14],
  [645, 532, "flower", 55, -18],
  [680, 561, "pair", 71, -115],
  [703, 600, "profile", 53, -82],
  [751, 589, "flower", 45, 15],
  [793, 606, "cluster", 59, 103],

  [670, 401, "flower", 58, -6],
  [707, 376, "cluster", 76, -25],
  [719, 450, "profile", 50, 97],
  [756, 433, "fullBud", 36, 56],
  [776, 337, "pair", 72, -27],
  [782, 304, "profile", 53, -30],
  [819, 298, "fullBud", 34, 27],
  [845, 341, "flower", 55, 22],
  [882, 323, "pair", 72, 14],
  [920, 313, "fullBud", 31, 47],
  [895, 357, "profile", 55, 84],
  [817, 474, "cluster", 66, 14],
  [779, 495, "flower", 46, -23],
  [876, 554, "pair", 62, 147],
  [926, 491, "flower", 50, -9],
  [1000, 510, "profile", 52, 94],

  [1001, 456, "cluster", 64, -27],
  [1050, 445, "flower", 59, 14],
  [1106, 474, "profile", 54, 99],
  [1097, 369, "pair", 76, -26],
  [1147, 376, "flower", 58, 13],
  [1196, 349, "profile", 57, -16],
  [1217, 379, "fullBud", 33, 14],
  [1247, 414, "pair", 69, 147],
  [1270, 321, "cluster", 66, -14],
  [1305, 335, "fullBud", 31, 50],
  [1281, 421, "profile", 50, 91],
  [1331, 429, "bud", 19, 84],

  [448, 369, "bud", 17, 53],
  [464, 418, "bud", 18, 104],
  [484, 538, "bud", 18, 125],
  [713, 613, "bud", 17, 130],

  [821, 619, "bud", 18, 102],
  [938, 317, "bud", 18, 77],

  [912, 549, "bud", 18, 80],

  [1139, 460, "bud", 18, 64],
  [1222, 335, "bud", 17, 46],

  [1321, 344, "bud", 17, 92],
];

const petals = [
  [104, 340, "petalSmall", 18, 8, -3, -75],
  [252, 278, "petal", 19, 9, -7, -116],
  [378, 385, "petalAngled", 16, 8.5, -1, -94],
  [511, 312, "petalSmall", 15, 9, -3, -65],
  [620, 406, "petal", 22, 10, -6, -115],
  [816, 362, "petalAngled", 19, 9.5, -2, -105],
  [1050, 385, "petal", 20, 8.5, -5, -120],
];

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
  const id = useId();
  const stageRef = useRef(null);
  const artRef = useRef(null);
  const branchRef = useRef(null);
  const shakeRef = useRef(null);
  const burstIdRef = useRef(0);
  const [bursts, setBursts] = useState([]);

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
    // Bound rapid clicking without restarting the ambient petals or blossom entrance.
    setBursts((current) => [...current.slice(-2), burst]);
  };

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
    <div ref={stageRef} className="hero-sakura z-10">
      <button
        type="button"
        className="hero-sakura-art"
        onClick={shakeBranch}
        aria-label="Shake the sakura branch and shower petals"
        title="Shake some petals loose"
      >
        <svg
          ref={artRef}
          viewBox="0 0 1354 690"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <image
              id={`${id}-atlas`}
              href="/images/sakura-branch-spite.webp"
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

          <g ref={branchRef} className="sakura-branch-shake">
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
          </g>

          {petals.map(([x, y, name, width, duration, delay, drift]) => (
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
