"use client";

import { useEffect, useId, useRef } from "react";
import "./Vermilion.css";

const countFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatCount(value) {
  return Number.isFinite(value) ? countFormat.format(value) : "—";
}

function Metric({ label, value, title }) {
  return (
    <div className="vi-metric">
      <dt title={title}>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function ReachLandscape({ points }) {
  const id = useId();
  if (!points?.length) {
    return <p className="vi-empty">Daily reach is currently unavailable.</p>;
  }
  const peak = Math.max(...points.map((point) => point.value));
  const max = Math.max(1, peak);
  const start = Date.parse(points[0].endTime);
  const duration = Date.parse(points.at(-1).endTime) - start;
  const coords = points.map((point) => [
    duration ? ((Date.parse(point.endTime) - start) / duration) * 960 : 480,
    310 - (point.value / max) * 270,
  ]);
  const line = coords
    .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");
  return (
    <figure className="vi-landscape">
      <svg
        viewBox="0 0 960 330"
        role="img"
        aria-label={`Daily accounts reached, from ${dateFormat.format(new Date(points[0].endTime))} to ${dateFormat.format(new Date(points.at(-1).endTime))}. Highest daily reach: ${peak}.`}
      >
        <defs>
          <clipPath id={id}>
            <path d={`${line} L960 310 H0Z`} />
          </clipPath>
        </defs>
        <path d={`${line} L960 310 H0Z`} className="vi-landscape-fill" />
        <g clipPath={`url(#${id})`} className="vi-landscape-hatching">
          {Array.from({ length: 42 }, (_, i) => (
            <path key={`hatch-${i * 28}`} d={`M${i * 28 - 200} 330 l260-310`} />
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
          .map(([x, y]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="4" fill="currentColor" />
          ))}
        <text x="0" y="327" className="vi-svg-label">
          {dateFormat.format(new Date(points[0].endTime))}
        </text>
        <text x="960" y="327" textAnchor="end" className="vi-svg-label">
          {dateFormat.format(new Date(points.at(-1).endTime))}
        </text>
      </svg>
      <figcaption>
        Daily accounts reached <strong>Peak {formatCount(peak)}</strong>
        <span>Daily reach is not additive</span>
      </figcaption>
      <details>
        <summary>View daily reach values</summary>
        <table>
          <thead>
            <tr>
              <th scope="col">Period ending</th>
              <th scope="col">Accounts reached</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.endTime}>
                <td>{dateFormat.format(new Date(point.endTime))}</td>
                <td>{point.value.toLocaleString("en")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  );
}

export default function InstagramPerformance({ stats }) {
  const metrics = stats?.performance;
  const ref = useRef(null);
  useEffect(() => {
    if (!metrics) return;
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
  }, [metrics]);
  return (
    <section
      ref={ref}
      id="summary"
      className="vermilion-theme vi-summary vi-press-summary"
      aria-labelledby="performance-title"
    >
      <svg
        className="vi-summary-curve"
        viewBox="0 0 1000 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M0 100 A500 100 0 0 1 1000 100 V0 H0 Z" />
      </svg>
      <header className="vi-summary-head">
        <div>
          <h2 id="performance-title">Instagram Performance</h2>
          <p>The story. The response. The impact.</p>
        </div>
        <span className="vi-period">Last 30 days</span>
      </header>
      <div className="vi-period-content" aria-live="polite" aria-atomic="true">
        {stats === undefined ? (
          <p className="vi-empty">Loading Instagram performance…</p>
        ) : !metrics ? (
          <p className="vi-empty">
            Instagram performance is currently unavailable.
          </p>
        ) : (
          <>
            <div className="vi-press-performance">
              <div className="vi-press-reach">
                <span>Accounts reached</span>
                <strong>{formatCount(metrics.reach)}</strong>
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
                <Metric
                  label="Engagement rate"
                  title="Accounts engaged ÷ accounts reached × 100"
                  value={
                    Number.isFinite(metrics.engagementRate)
                      ? `${metrics.engagementRate.toFixed(1)}%`
                      : "—"
                  }
                />
                <Metric
                  label="Accounts engaged"
                  value={formatCount(metrics.accountsEngaged)}
                />
              </dl>
            </div>
            <div className="vi-press-chart">
              <ReachLandscape points={metrics.dailyReach} />
              <dl>
                <Metric
                  label="Total likes"
                  value={formatCount(metrics.likes)}
                />
                <Metric
                  label="Total comments"
                  value={formatCount(metrics.comments)}
                />
                <Metric
                  label="Total views"
                  value={formatCount(metrics.views)}
                />
              </dl>
            </div>
            <dl className="vi-more-metrics">
              <Metric label="Saves" value={formatCount(metrics.saves)} />
              <Metric label="Shares" value={formatCount(metrics.shares)} />
              <Metric
                label="Profile link taps"
                value={formatCount(metrics.profileLinkTaps)}
              />
              <Metric
                label="Total interactions"
                value={formatCount(metrics.interactions)}
              />
              <Metric
                label="Total posts · lifetime"
                value={formatCount(metrics.posts)}
              />
            </dl>
          </>
        )}
      </div>
      <footer className="vi-summary-foot">
        <p>Behind every number, someone who stayed for the story.</p>
        <span>
          {metrics ? (
            <>
              Meta Instagram Insights ·{" "}
              {dateFormat.format(new Date(metrics.window.start))}–
              {dateFormat.format(new Date(Date.parse(metrics.window.end) - 1))}{" "}
              UTC
              <br />
              Engagement rate = accounts engaged ÷ reach × 100.
              <br />
              Updated{" "}
              <time dateTime={stats.updatedAt}>
                {dateFormat.format(new Date(stats.updatedAt))}
              </time>
              . Meta data may be delayed up to 48 hours.
            </>
          ) : (
            "Awaiting Instagram insights"
          )}
        </span>
      </footer>
    </section>
  );
}
