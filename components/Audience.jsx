import { scaleLinear } from "d3-scale";
import { arc, pie } from "d3-shape";
import Image from "next/image";
import "./Audience.css";

const snapshotDate = new Intl.DateTimeFormat("en-IN", {
  dateStyle: "medium",
  timeZone: "Asia/Kolkata",
});
const snapshotTime = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
  timeZone: "Asia/Kolkata",
});
const percentage = (value) => `${value.toFixed(1)}%`;
const olderAgeIds = new Set(["45-54", "55-64", "65+"]);
const donutArc = arc().innerRadius(64).outerRadius(100);
const donutLayout = pie()
  .value((item) => item.value)
  .sort(null);

function ChartHeading({ id, children }) {
  return (
    <h3 id={id} className="audience-chart-heading font-serif-editorial">
      <span>{children}</span>
    </h3>
  );
}

function GenderChart({ data }) {
  return (
    <section
      className="audience-gender"
      aria-labelledby="audience-gender-title"
    >
      <ChartHeading id="audience-gender-title">Gender</ChartHeading>
      {data.length === 0 ? (
        <p className="audience-chart-note">Unavailable</p>
      ) : (
        <div className="audience-gender-content">
          <div className="audience-donut">
            <svg viewBox="0 0 204 204" aria-hidden="true" focusable="false">
              <g
                transform="translate(102 102)"
                className="audience-donut-segments"
              >
                {donutLayout(data).map((segment) => (
                  <path
                    key={segment.data.id}
                    data-segment={segment.data.id}
                    className={`audience-fill-${segment.data.id}`}
                    d={donutArc(segment)}
                  />
                ))}
              </g>
            </svg>
            <span
              className="audience-donut-label font-serif-editorial"
              aria-hidden="true"
            >
              Audience
            </span>
          </div>
          <dl className="audience-legend">
            {data.map((item) => (
              <div key={item.id} className="audience-legend-row">
                <dt>
                  <span
                    className={`audience-swatch audience-fill-${item.id}`}
                    aria-hidden="true"
                  />
                  {item.label}
                </dt>
                <dd>{percentage(item.value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </section>
  );
}

function HorizontalBarChart({
  id,
  title,
  data,
  className = "",
  maxValue = 100,
}) {
  const barScale = scaleLinear()
    .domain([0, maxValue])
    .range([0, 100])
    .clamp(true);

  return (
    <section className={className} aria-labelledby={`${id}-title`}>
      <ChartHeading id={`${id}-title`}>{title}</ChartHeading>
      {data.length === 0 ? (
        <p className="audience-chart-note">Unavailable</p>
      ) : (
        <dl className="audience-bars">
          {data.map((item) => (
            <div
              key={item.id}
              className="audience-bar-row"
              data-category={item.id}
            >
              <dt>{item.label}</dt>
              <dd className="audience-bar-graphic" aria-hidden="true">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 16"
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  <g className="audience-bar-track">
                    <rect width="100" height="16" />
                  </g>
                  <g className="audience-bar-fill">
                    <rect width={barScale(item.value)} height="16" />
                  </g>
                </svg>
              </dd>
              <dd className="audience-bar-value">{percentage(item.value)}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  );
}

export default function Audience({ stats }) {
  const { gender = [], ages = [], countries = [] } = stats?.audience ?? {};
  const updatedAt = stats?.updatedAt;
  const updatedDate = updatedAt ? new Date(updatedAt) : null;
  const ageGroups = [];
  let olderShare = null;

  for (const age of ages) {
    if (olderAgeIds.has(age.id)) {
      olderShare = (olderShare ?? 0) + age.value;
    } else {
      ageGroups.push(age);
    }
  }
  if (olderShare !== null) {
    ageGroups.push({ id: "45+", label: "45+", value: olderShare });
  }

  return (
    <section
      id="audience"
      className="audience-section"
      aria-labelledby="audience-title"
    >
      <header className="audience-stage">
        <div className="audience-title-card">
          <h2
            id="audience-title"
            className="audience-title font-serif-editorial"
          >
            <span className="audience-title-top">Audience</span>
            <span className="audience-title-bottom" aria-hidden="true">
              Audience
            </span>
          </h2>
          <p className="audience-description font-serif-editorial">
            A shared love for anime.
          </p>
        </div>
      </header>
      <div className="audience-screen">
        <Image
          className="audience-bamboo"
          src="/bamboo-tree-left.webp"
          alt=""
          width={693}
          height={800}
          sizes="(width < 36rem) 48vw, (width < 75rem) 48px, 65vh"
        />
        <div className="audience-charts">
          {stats === undefined ? (
            <p className="audience-chart-note">
              <output>Loading Instagram audience data…</output>
            </p>
          ) : (
            <>
              <div className="audience-charts-top">
                <GenderChart data={gender} />
                <HorizontalBarChart
                  id="audience-ages"
                  title="Age range"
                  data={ageGroups}
                  className="audience-ages"
                />
              </div>
              <HorizontalBarChart
                id="audience-countries"
                title="Top countries"
                data={countries}
                className="audience-countries"
                maxValue={
                  Math.max(0, ...countries.map(({ value }) => value)) || 100
                }
              />
              {updatedDate && (
                <p className="audience-chart-note">
                  Updated{" "}
                  <time dateTime={updatedAt}>
                    {`${snapshotDate.format(updatedDate)} - ${snapshotTime.format(updatedDate)} IST`}
                  </time>
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
