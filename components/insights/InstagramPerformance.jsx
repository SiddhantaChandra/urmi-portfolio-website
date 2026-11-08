"use client";

import { useEffect, useRef, useState } from "react";
import "./Vermilion.css";

const countFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const millionFormat = new Intl.NumberFormat("en", {
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatCount(value) {
  if (!Number.isFinite(value)) return "—";
  const formatted = countFormat.format(value);
  return formatted.endsWith("M") ? millionFormat.format(value) : formatted;
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
  const [period, setPeriod] = useState("lifetime");
  const isLifetime = period === "lifetime";
  const selectedMetrics =
    stats?.performancePeriods?.[period] ??
    (isLifetime ? null : stats?.performance);
  const metrics = selectedMetrics ?? {};
  const periodAverages = isLifetime || stats?.schemaVersion >= 3 ? metrics : {};
  const reelMetrics = stats?.reels ?? {};
  const accountMetrics =
    stats?.performancePeriods?.last30Days ?? stats?.performance ?? {};
  const ref = useRef(null);
  useEffect(() => {
    if (!selectedMetrics) return;
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
  }, [selectedMetrics]);
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
          <h2 id="performance-title">Instagram</h2>
        </div>
      </header>
      <div className="vi-period-content">
        <div className="vi-press-performance">
          <div id="performance-headline" className="vi-press-reach">
            <span
              title={
                isLifetime
                  ? "Total views across the saved history shown below"
                  : "Total views during the last 30 complete UTC days"
              }
            >
              Total views
            </span>
            <strong aria-live="polite">{formatCount(metrics.views)}</strong>
          </div>
          <p className="vi-press-story">
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
          </p>
          <dl aria-live="polite" aria-atomic="true">
            <Metric
              label="Engagement rate"
              title="Accounts engaged ÷ accounts reached × 100, during the last 30 complete UTC days"
              value={
                Number.isFinite(accountMetrics.engagementRate)
                  ? `${accountMetrics.engagementRate.toFixed(1)}%`
                  : "—"
              }
            />
            <Metric
              label="Accounts engaged"
              title="Accounts engaged during the last 30 complete UTC days"
              value={formatCount(accountMetrics.accountsEngaged)}
            />
          </dl>
          <fieldset className="vi-period" aria-label="Performance period">
            {[
              ["lifetime", "Lifetime"],
              ["last30Days", "30 days"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={period === value}
                aria-controls="performance-headline performance-metrics"
                onClick={() => setPeriod(value)}
              >
                {label}
              </button>
            ))}
          </fieldset>
        </div>
        <div id="performance-metrics" aria-live="polite" aria-atomic="true">
          {stats === undefined ? (
            <p className="vi-empty">Loading Instagram performance…</p>
          ) : !selectedMetrics ? (
            <p className="vi-empty">
              {isLifetime ? "Lifetime" : "30-day"} performance is currently
              unavailable.
            </p>
          ) : (
            <>
              <dl className="vi-more-metrics vi-total-metrics">
                <Metric
                  label="Total likes"
                  title={
                    isLifetime
                      ? "Lifetime likes across all currently published posts"
                      : undefined
                  }
                  value={formatCount(metrics.likes)}
                />
                <Metric
                  label="Accounts reached (30 days)"
                  title="Unique accounts reached during the last 30 complete UTC days, regardless of the selected period. Adding shorter date ranges would double-count accounts."
                  value={formatCount(accountMetrics.reach)}
                />
                <Metric label="Saves" value={formatCount(metrics.saves)} />
                <Metric label="Shares" value={formatCount(metrics.shares)} />
              </dl>
              <dl
                className="vi-more-metrics vi-overall-metrics"
                aria-label="Overall account performance"
              >
                <Metric
                  label="Total interactions"
                  value={formatCount(metrics.interactions)}
                />
                <Metric
                  label="Profile views"
                  title={
                    isLifetime
                      ? "Profile visits across the saved history shown below"
                      : "Profile visits during the last 30 complete UTC days"
                  }
                  value={formatCount(metrics.profileViews)}
                />
                <Metric
                  label="Avg Likes"
                  title={
                    isLifetime
                      ? "Average likes per post across all published posts"
                      : "Average likes per post published during the last 30 complete UTC days"
                  }
                  value={formatCount(periodAverages.averageLikes)}
                />
                <Metric
                  label="Bio Link Taps"
                  title={
                    isLifetime && metrics.bioLinkHistory
                      ? `Instagram website-link taps tracked from ${dateFormat.format(new Date(metrics.bioLinkHistory.start))} to ${dateFormat.format(new Date(Date.parse(metrics.bioLinkHistory.end) - 1))} UTC`
                      : "Instagram website-link taps during the last 30 complete UTC days"
                  }
                  value={formatCount(metrics.bioLinkClicks)}
                />
              </dl>
            </>
          )}
        </div>
        <section className="vi-reels" aria-labelledby="reels-title">
          <h3 id="reels-title" className="vi-press-story">
            Reels
          </h3>
          <dl className="vi-more-metrics vi-reel-metrics">
            <Metric
              label="Avg Reels Views"
              title="Average lifetime views per published reel"
              value={formatCount(reelMetrics.averageViews)}
            />
            <Metric
              label="Avg Reel Reach"
              title="Average lifetime accounts reached per published reel; the same account may be counted on different reels"
              value={formatCount(reelMetrics.averageReach)}
            />
            <Metric
              label="Avg Story Views"
              title={
                stats?.storyAverage?.scope === "active"
                  ? "Average recorded views per active Story with available insights, refreshed hourly while completed Story data is unavailable. Active Stories are still gaining views."
                  : "Average last recorded views per expired Story with available insights"
              }
              value={formatCount(stats?.storyAverage?.views)}
            />
            <Metric
              label="Total Reels Watch Time (hrs.)"
              title="Total lifetime watch time across all published reels, including replays, in hours"
              value={formatCount(reelMetrics.totalWatchTimeHours)}
            />
          </dl>
        </section>
      </div>
      <footer className="vi-summary-foot">
        <p>Behind every number, someone who stayed for the story.</p>
        <span>
          {selectedMetrics?.window ? (
            <>
              Meta Instagram Insights ·{" "}
              {isLifetime ? "Tracked history" : "30 days"} ·{" "}
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
