"use client";

import { useEffect, useId, useRef, useState } from "react";
import "./Vermilion.css";

// The existing summary uses illustrative performance data. Keep it explicit here.
const periods = {
  month: {
    label: "Last 30 days",
    reach: "1.3M",
    engagement: "8.7%",
    likes: "4.2K",
    comments: "178",
    impressions: "2.4M",
    engaged: "84.2K",
    follower: "12.4%",
    clicks: "5.6K",
    total: "96.5K",
    posts: "318",
    totalReach: "1.8M",
    points: [20, 28, 24, 40, 32, 50, 46, 64, 52, 76, 67, 93],
  },
  quarter: {
    label: "Last 90 days",
    reach: "3.8M",
    engagement: "9.2%",
    likes: "4.6K",
    comments: "192",
    impressions: "6.9M",
    engaged: "241K",
    follower: "13.1%",
    clicks: "16.2K",
    total: "278K",
    posts: "318",
    totalReach: "4.6M",
    points: [12, 21, 18, 38, 35, 30, 56, 47, 69, 61, 84, 96],
  },
};

function Metric({ label, value }) {
  return (
    <div className="vi-metric">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ReachLandscape({ points, value }) {
  const id = useId();
  const coords = points.map((p, i) => [
    (i / (points.length - 1)) * 960,
    270 - p * 2.3,
  ]);
  const line = coords
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  return (
    <figure className="vi-landscape">
      <svg
        viewBox="0 0 960 330"
        role="img"
        aria-label={`Accounts reached: ${value}. Illustrative trend over the selected period.`}
      >
        <defs>
          <clipPath id={id}>
            <path d={`${line} L960 310 H0Z`} />
          </clipPath>
        </defs>
        <path
          d="M0 265 Q90 210 200 250 T400 200 T600 210 T800 140 T960 170 V310 H0Z"
          className="vi-landscape-back"
        />
        <path d={`${line} L960 310 H0Z`} className="vi-landscape-fill" />
        <g clipPath={`url(#${id})`} className="vi-landscape-hatching">
          {Array.from({ length: 42 }, (_, i) => (
            <path key={i} d={`M${i * 28 - 200} 330 l260-310`} />
          ))}
        </g>
        <path
          className="vi-draw"
          d={line}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          pathLength="1"
        />
        {coords
          .filter((_, i) => i % 3 === 0 || i === points.length - 1)
          .map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="currentColor" />
          ))}
        <text x="0" y="327" className="vi-svg-label">
          Day 1
        </text>
        <text x="960" y="327" textAnchor="end" className="vi-svg-label">
          Today
        </text>
      </svg>
      <figcaption>
        Accounts reached <strong>{value}</strong>
        <span>Illustrative trend</span>
      </figcaption>
    </figure>
  );
}

export default function InstagramPerformance() {
  const [period, setPeriod] = useState("month");
  const metrics = periods[period];
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.dataset.visible = "true";
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );
    for (const node of ref.current.querySelectorAll(
      ".vi-landscape,.vi-more-metrics",
    ))
      observer.observe(node);
    return () => observer.disconnect();
  }, [period]);
  return (
    <section
      ref={ref}
      id="summary"
      className="vermilion-theme vi-summary vi-press-summary"
      aria-labelledby="performance-title"
    >
      <header className="vi-summary-head">
        <div>
          <h2 id="performance-title">Instagram Performance</h2>
          <p>The story. The response. The impact.</p>
        </div>
        <div className="vi-period" role="group" aria-label="Performance period">
          {Object.entries(periods).map(([id, p]) => (
            <button
              type="button"
              key={id}
              aria-pressed={period === id}
              onClick={() => setPeriod(id)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </header>
      <div
        key={period}
        className="vi-period-content"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="vi-press-performance">
          <div className="vi-press-reach">
            <span>Accounts reached</span>
            <strong>{metrics.reach}</strong>
            <span>
              Stories worth stopping for.
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4 20 20 4M4 4h16v16" />
              </svg>
            </span>
          </div>
          <dl>
            <Metric label="Engagement rate" value={metrics.engagement} />
            <Metric label="Accounts engaged" value={metrics.engaged} />
          </dl>
        </div>
        <div className="vi-press-chart">
          <ReachLandscape points={metrics.points} value={metrics.reach} />
          <dl>
            <Metric label="Avg likes" value={metrics.likes} />
            <Metric label="Avg comments" value={metrics.comments} />
            <Metric label="Total impressions" value={metrics.impressions} />
          </dl>
        </div>
        <dl className="vi-more-metrics">
          <Metric label="Follower engagement" value={metrics.follower} />
          <Metric label="Bio link clicks" value={metrics.clicks} />
          <Metric label="Total engagements" value={metrics.total} />
          <Metric label="Total posts · lifetime" value={metrics.posts} />
          <Metric label="Total reach" value={metrics.totalReach} />
        </dl>
      </div>
      <footer className="vi-summary-foot">
        <p>Behind every number, someone who stayed for the story.</p>
        <span>Illustrative data · {metrics.label.toLowerCase()}</span>
      </footer>
    </section>
  );
}
