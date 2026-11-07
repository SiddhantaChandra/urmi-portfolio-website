import { useId } from "react";
import "./Summary.css";

const highlights = [
  {
    label: "Engagement Rate",
    value: "8.7%",
    curve: "M2 55 C14 51 21 50 32 40 S50 21 64 25 S84 34 100 21 L122 5",
  },
  {
    label: "Accounts Reached",
    value: "1.3M",
    curve:
      "M2 55 C15 39 20 39 30 40 S44 38 55 30 S70 23 79 25 S92 21 104 15 L122 5",
  },
  { label: "Avg Likes", value: "4.2K" },
];

const activity = [
  {
    label: "Avg Comments",
    value: "178",
    icon: "M43 23c0 9-8 16-19 16-3 0-5 0-8-1l-9 4 2-8a15 15 0 0 1-4-11C5 14 13 7 24 7s19 7 19 16ZM15 23h.1m8.9 0h.1m8.9 0h.1",
  },
  {
    label: "Total Impressions",
    value: "2.4M",
    icon: "M3 24S10 12 24 12s21 12 21 12-7 12-21 12S3 24 3 24ZM24 18a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z",
  },
  {
    label: "Accounts Engaged",
    value: "84.2K",
    icon: "M24 19a7 7 0 1 0-14 0 7 7 0 0 0 14 0ZM3 42v-2a14 11 0 0 1 28 0v2M29 13a7 7 0 1 1 0 12M35 29c7 1 11 5 11 11v2",
  },
];

const totals = [
  {
    label: "Follower Engagement",
    value: "12.4%",
    curve: "M2 55 C15 52 21 52 33 40 S51 23 64 26 S79 31 96 21 L122 5",
  },
  {
    label: "Bio Link Clicks",
    value: "5.6K",
    icon: "M21 28a8 8 0 0 0 11 0l8-8A8 8 0 0 0 29 9l-4 4m2 7a8 8 0 0 0-11 0l-8 8a8 8 0 0 0 11 11l4-4",
  },
  { label: "Total Engagements", value: "96.5K" },
  {
    label: "Total Posts",
    value: "318",
    icon: "M9 9h30a4 4 0 0 1 4 4v26a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4V13a4 4 0 0 1 4-4ZM5 35l9-8 7 6 11-11 11 10M15 19h.1",
  },
  { label: "Total Reach", value: "1.8M" },
];

function MetricIcon({ path }) {
  return (
    <svg
      className="summary-icon"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

function Sparkline({ curve }) {
  const gradientId = useId();

  return (
    <svg className="summary-sparkline" viewBox="0 0 127 73" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x2="0" y2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity=".18" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${curve} V73 H2 Z`} fill={`url(#${gradientId})`} />
      <path d={curve} fill="none" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="122" cy="5" r="4.5" fill="currentColor" />
    </svg>
  );
}

function Waves() {
  const maskId = useId();

  return (
    <svg className="summary-waves" viewBox="0 0 124 62" aria-hidden="true">
      <defs>
        <mask id={maskId}>
          <rect width="124" height="62" fill="white" />
          <circle cx="36" cy="62" r="35" fill="black" />
          <circle cx="106" cy="62" r="35" fill="black" />
        </mask>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="2.2">
        <path
          d="M37 36a35 35 0 0 1 70 0M43 36a29 29 0 0 1 58 0M49 36a23 23 0 0 1 46 0M55 36a17 17 0 0 1 34 0M61 36a11 11 0 0 1 22 0"
          mask={`url(#${maskId})`}
        />
        <path d="M1 62a35 35 0 0 1 70 0M7 62a29 29 0 0 1 58 0M13 62a23 23 0 0 1 46 0M19 62a17 17 0 0 1 34 0M25 62a11 11 0 0 1 22 0" />
        <path d="M71 62a35 35 0 0 1 70 0M77 62a29 29 0 0 1 58 0M83 62a23 23 0 0 1 46 0M89 62a17 17 0 0 1 34 0M95 62a11 11 0 0 1 22 0" />
      </g>
    </svg>
  );
}

function HempLeaves() {
  return (
    <svg
      className="summary-hemp-leaves"
      viewBox="0 0 105 90"
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor">
        <path d="M0 0H104L52 90ZM0 0V60H69L34.5 0 0 60 17 90 52 30 87 30M17 30h70M17 30 52 10 87 30 52 50 17 30 0 40M17 30V70L52 50V10M52 50l17 10V20L34.5 0v40L0 20m0 20 34.5 20V40L69 20m-52 50L0 80m17-50L0 0m52 10V0m35 30 8-30M52 50v40" />
      </g>
    </svg>
  );
}

export default function Summary() {
  return (
    <section
      id="summary"
      className="hero-paper summary-section"
      aria-labelledby="summary-title"
    >
      <div className="summary-layout">
        <div className="summary-grid">
          <header className="summary-intro">
            <h2 id="summary-title" className="summary-title">
              Instagram <span>Summary</span>
            </h2>
            <p className="summary-description">
              A quick snapshot of performance, reach, and engagement.
            </p>
          </header>

          <div className="summary-metrics">
            <dl className="summary-highlights">
              {highlights.map(({ label, value, curve }) => (
                <div className="summary-highlight" key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {value}
                    {curve && <Sparkline curve={curve} />}
                    <Waves />
                  </dd>
                </div>
              ))}
            </dl>

            <dl className="summary-activity">
              {activity.map(({ label, value, icon }) => (
                <div className="summary-activity-item" key={label}>
                  <dt>
                    <MetricIcon path={icon} />
                    {label}
                  </dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>

            <dl className="summary-totals">
              {totals.map(({ label, value, curve, icon }, index) => (
                <div className="summary-total" key={label}>
                  <dt>{label}</dt>
                  <dd>
                    {value}
                    <span className="summary-corners" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                      <span />
                    </span>
                    {(index === 0 || index === 4) && <HempLeaves />}
                    {index === 2 && <Waves />}
                    {curve && <Sparkline curve={curve} />}
                    {icon && <MetricIcon path={icon} />}
                    {index === 1 && (
                      <span className="summary-wash" aria-hidden="true" />
                    )}
                    {index === 4 && (
                      <span
                        className="summary-seal"
                        lang="ja"
                        aria-hidden="true"
                      >
                        印
                      </span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
