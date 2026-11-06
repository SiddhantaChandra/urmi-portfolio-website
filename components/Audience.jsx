import { scaleLinear } from "d3-scale";
import { arc, pie } from "d3-shape";
import "./Audience.css";

// Placeholder statistics, separate from chart geometry for easy replacement.
const audienceData = {
  gender: [
    { id: "male", label: "Male", value: 69.2 },
    { id: "female", label: "Female", value: 30.8 },
  ],
  ages: [
    { id: "13-17", label: "13–17", value: 5.9 },
    { id: "18-24", label: "18–24", value: 33.7 },
    { id: "25-34", label: "25–34", value: 45.7 },
    { id: "35-44", label: "35–44", value: 10.5 },
    { id: "45-54", label: "45–54", value: 2.5 },
  ],
  countries: [
    { id: "india", label: "India", value: 52.4 },
    { id: "united-states", label: "United States", value: 13.6 },
    { id: "bangladesh", label: "Bangladesh", value: 3.5 },
    { id: "pakistan", label: "Pakistan", value: 2.5 },
    { id: "philippines", label: "Philippines", value: 2.3 },
    { id: "canada", label: "Canada", value: 2.0 },
  ],
};

const percentage = (value) => `${value.toFixed(1)}%`;
const barScale = scaleLinear().domain([0, 100]).range([0, 100]).clamp(true);
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
    </section>
  );
}

function HorizontalBarChart({ id, title, data, className = "" }) {
  return (
    <section className={className} aria-labelledby={`${id}-title`}>
      <ChartHeading id={`${id}-title`}>{title}</ChartHeading>
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
    </section>
  );
}

export default function Audience() {
  return (
    <section
      id="audience"
      className="audience-section"
      aria-labelledby="audience-title"
    >
      <div className="audience-layout">
        <div className="audience-intro">
          <h2
            id="audience-title"
            className="audience-title font-serif-editorial"
          >
            The Audience
          </h2>
          <p className="audience-description font-serif-editorial">
            A shared love for anime. A curiosity for the stories within.
          </p>
          <div className="audience-brush" aria-hidden="true" />
        </div>
        <div className="audience-charts">
          <div className="audience-charts-top">
            <GenderChart data={audienceData.gender} />
            <HorizontalBarChart
              id="audience-ages"
              title="Age range"
              data={audienceData.ages}
              className="audience-ages"
            />
          </div>
          <HorizontalBarChart
            id="audience-countries"
            title="Top countries"
            data={audienceData.countries}
            className="audience-countries"
          />
          <p className="sr-only">
            Illustrative audience statistics using mock data.
          </p>
        </div>
      </div>
    </section>
  );
}
