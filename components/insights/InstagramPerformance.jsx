"use client";

import { useEffect, useRef } from "react";
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
    for (const node of ref.current.querySelectorAll(".vi-more-metrics"))
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
        </div>
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
            <dl className="vi-more-metrics vi-total-metrics">
              <Metric label="Total likes" value={formatCount(metrics.likes)} />
              <Metric
                label="Total comments"
                value={formatCount(metrics.comments)}
              />
              <Metric label="Total views" value={formatCount(metrics.views)} />
              <Metric label="Saves" value={formatCount(metrics.saves)} />
              <Metric label="Shares" value={formatCount(metrics.shares)} />
              <Metric
                label="Total interactions"
                value={formatCount(metrics.interactions)}
              />
            </dl>
            <dl
              className="vi-more-metrics vi-overall-metrics"
              aria-label="Overall account performance"
            >
              <Metric
                label="Profile views"
                title="Profile visits during the last 30 complete UTC days"
                value={formatCount(metrics.profileViews)}
              />
              <Metric
                label="Avg Likes"
                title="Average likes per post across all published posts"
                value={formatCount(metrics.averageLikes)}
              />
              <Metric
                label="Avg Comments"
                title="Average comments per post across all published posts"
                value={formatCount(metrics.averageComments)}
              />
              <Metric
                label="Follower Engagement"
                title="(Average likes + average comments) ÷ current followers × 100, across all published posts"
                value={
                  Number.isFinite(metrics.followerEngagement)
                    ? `${metrics.followerEngagement.toFixed(1)}%`
                    : "—"
                }
              />
              <Metric
                label="Bio link clicks (tracked total)"
                title={
                  metrics.bioLinkHistory
                    ? `Instagram website-link taps tracked from ${dateFormat.format(new Date(metrics.bioLinkHistory.start))} to ${dateFormat.format(new Date(Date.parse(metrics.bioLinkHistory.end) - 1))} UTC`
                    : "Instagram website-link taps across the available tracked history"
                }
                value={formatCount(metrics.bioLinkClicksTracked)}
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
            </>
          ) : (
            "Awaiting Instagram insights"
          )}
        </span>
      </footer>
    </section>
  );
}
