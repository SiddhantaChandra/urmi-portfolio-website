"use client";

import { useEffect, useRef, useState } from "react";
import "./Vermilion.css";

const percent = (value) => `${value.toFixed(1)}%`;
const olderGroups = new Set(["45-54", "55-64", "65+"]);
const dateFormat = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Kolkata",
});

function ChartPanel({ title, aside, children }) {
  return (
    <div className="vi-panel">
      <div className="vi-panel-title">
        <h3>{title}</h3>
        <span>{aside}</span>
      </div>
      {children}
    </div>
  );
}

function GenderSplit({ data }) {
  if (!data.length)
    return <p className="vi-empty">Gender data is currently unavailable.</p>;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <figure className="vi-split-gender">
      <div className="vi-split-figures">
        {data.map((item) => (
          <span key={item.id}>
            <b>
              {item.value.toFixed(1)}
              <small>%</small>
            </b>
            {item.label}
          </span>
        ))}
      </div>
      <div
        className="vi-split-strip"
        role="img"
        aria-label={data
          .map((item) => `${item.label} ${percent(item.value)}`)
          .join(", ")}
      >
        {data.map((item) => (
          <span
            key={item.id}
            style={{ width: `${total ? (item.value / total) * 100 : 0}%` }}
          />
        ))}
      </div>
    </figure>
  );
}

function AgeRibbons({ data }) {
  if (!data.length)
    return <p className="vi-empty">Age data is currently unavailable.</p>;
  const max = Math.max(50, ...data.map((item) => item.value));
  const youngShare = data
    .filter((item) => item.id === "18-24" || item.id === "25-34")
    .reduce((sum, item) => sum + item.value, 0);
  return (
    <figure className="vi-age vi-age-ribbon">
      <div className="vi-age-bars">
        {data.map((item, i) => (
          <div
            key={item.id}
            className="vi-age-item"
            style={{ "--value": `${(item.value / max) * 100}%`, "--i": i }}
          >
            <span className="vi-age-value">{percent(item.value)}</span>
            <div className="vi-age-track" aria-hidden="true">
              <span className="vi-age-fill" />
            </div>
            <span className="vi-age-label">{item.label}</span>
          </div>
        ))}
      </div>
      <figcaption>
        Age range <span>{percent(youngShare)} are 18–34</span>
      </figcaption>
    </figure>
  );
}

function Countries({ data }) {
  const [selected, setSelected] = useState(null);
  if (!data.length)
    return <p className="vi-empty">Country data is currently unavailable.</p>;
  const current = data.find((item) => item.id === selected) ?? data[0];
  return (
    <figure className="vi-countries vi-countries-editorial">
      <div className="vi-country-list">
        {data.map((item) => (
          <button
            className="vi-country"
            type="button"
            key={item.id}
            aria-pressed={current.id === item.id}
            onClick={() => setSelected(item.id)}
            style={{ "--value": `${item.value}%` }}
          >
            <span className="vi-country-code">{item.id}</span>
            <span className="vi-country-name">{item.label}</span>
            <span className="vi-country-mark" aria-hidden="true">
              <i />
            </span>
            <strong>
              {item.value.toFixed(1)}
              <small>%</small>
            </strong>
          </button>
        ))}
      </div>
      <figcaption>
        Top countries{" "}
        <span aria-live="polite">
          {current.label} · {percent(current.value)} of audience
        </span>
      </figcaption>
    </figure>
  );
}

export default function AudienceInsights({ stats }) {
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
    for (const node of ref.current.querySelectorAll(".vi-panel"))
      observer.observe(node);
    return () => observer.disconnect();
  }, [stats]);
  const { gender = [], ages = [], countries = [] } = stats?.audience ?? {};
  const ageGroups = ages.filter((item) => !olderGroups.has(item.id));
  const older = ages.filter((item) => olderGroups.has(item.id));
  if (older.length)
    ageGroups.push({
      id: "45+",
      label: "45+",
      value: older.reduce((sum, item) => sum + item.value, 0),
    });
  return (
    <section
      ref={ref}
      id="audience-insights"
      className="vermilion-theme vi-demographics vi-press-audience"
      aria-labelledby="audience-insights-title"
    >
      <header className="vi-section-head">
        <h2 id="audience-insights-title">Audience Insights</h2>
        <p>Anime is the starting point. The community is the story.</p>
        <span className="vi-seal" aria-hidden="true" lang="ja">
          文化
        </span>
      </header>
      {stats === undefined ? (
        <p className="vi-empty" role="status">
          Loading Instagram audience data…
        </p>
      ) : (
        <>
          <div className="vi-press-spread">
            <ChartPanel title="People, not just numbers." aside="Gender">
              <GenderSplit data={gender} />
            </ChartPanel>
            <ChartPanel title="Coming of age." aside="Audience ages">
              <AgeRibbons data={ageGroups} />
            </ChartPanel>
          </div>
          <div className="vi-press-countries">
            <h3>Beyond borders.</h3>
            <Countries data={countries} />
          </div>
        </>
      )}
      {stats?.updatedAt && (
        <p className="vi-data-note">
          Instagram audience · Updated{" "}
          <time dateTime={stats.updatedAt}>
            {dateFormat.format(new Date(stats.updatedAt))} IST
          </time>
        </p>
      )}
    </section>
  );
}
