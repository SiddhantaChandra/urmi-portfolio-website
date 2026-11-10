import { mkdir, readFile, writeFile } from "node:fs/promises";

const summaries = [];
for (const stage of ["before", "after"]) {
  for (const device of ["mobile", "desktop"]) {
    const artifact = `.taste-skill/seo/${stage}-${device}.report.json`;
    const report = JSON.parse(await readFile(artifact, "utf8"));
    summaries.push({
      stage,
      device,
      artifact,
      measuredAt: report.fetchTime,
      lighthouseVersion: report.lighthouseVersion,
      browser: report.environment.hostUserAgent,
      url: report.finalDisplayedUrl,
      settings: {
        formFactor: report.configSettings.formFactor,
        throttlingMethod: report.configSettings.throttlingMethod,
        throttling: report.configSettings.throttling,
        screenEmulation: report.configSettings.screenEmulation,
      },
      scores: Object.fromEntries(
        Object.entries(report.categories).map(([key, value]) => [
          key,
          Math.round(value.score * 100),
        ]),
      ),
      metrics: Object.fromEntries(
        [
          "first-contentful-paint",
          "largest-contentful-paint",
          "total-blocking-time",
          "cumulative-layout-shift",
          "speed-index",
        ].map((key) => [
          key,
          {
            value: report.audits[key].numericValue,
            unit: report.audits[key].numericUnit,
            display: report.audits[key].displayValue,
          },
        ]),
      ),
      failedAudits: Object.values(report.audits)
        .filter(
          (audit) =>
            audit.score !== null &&
            audit.score < 1 &&
            audit.scoreDisplayMode === "binary",
        )
        .map((audit) => ({ id: audit.id, title: audit.title })),
    });
  }
}
await mkdir("reports/seo", { recursive: true });
await writeFile(
  "reports/seo/lighthouse-summary.json",
  `${JSON.stringify(
    {
      note: "Single-run local production-build lab measurements, not field CWV or search rankings. Baseline/final audits run sequentially. The final build uses the owner-confirmed canonical domain https://www.urmichakraborty.com. GA4 is not enabled. The live site still serves its earlier deployment. See tasklist-seo.md for open launch dependencies.",
      summaries,
    },
    null,
    2,
  )}\n`,
);
console.log(
  summaries.map(({ stage, device, scores, metrics }) => ({
    stage,
    device,
    ...scores,
    LCP: metrics["largest-contentful-paint"].display,
    TBT: metrics["total-blocking-time"].display,
    CLS: metrics["cumulative-layout-shift"].display,
  })),
);
