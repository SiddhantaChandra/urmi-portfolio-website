import assert from "node:assert/strict";
import test from "node:test";
import {
  reportSuccessfulEnquiry,
  reportWebVital,
  validMeasurementId,
} from "../lib/analytics.mjs";
import {
  getSeoConfig,
  productionOrigin,
  profileStructuredData,
  serializeJsonLd,
} from "../lib/seo.mjs";

const production = {
  NODE_ENV: "production",
  SITE_URL: "https://portfolio.example/",
};

test("only configured production builds are indexable", () => {
  assert.deepEqual(getSeoConfig(production), {
    siteUrl: "https://portfolio.example",
    indexable: true,
  });
  for (const env of [
    { ...production, NODE_ENV: "development" },
    { ...production, VERCEL_ENV: "preview" },
    { ...production, VERCEL_ENV: "development" },
    { ...production, SITE_NOINDEX: "true" },
  ])
    assert.equal(getSeoConfig(env).indexable, false);
  assert.equal(
    getSeoConfig({ ...production, VERCEL_ENV: "production" }).indexable,
    true,
  );
  assert.deepEqual(getSeoConfig({ NODE_ENV: "production" }), {
    siteUrl: productionOrigin,
    indexable: true,
  });
});

test("canonical configuration rejects non-public or ambiguous origins", () => {
  for (const SITE_URL of [
    "not a url",
    "http://portfolio.example",
    "https://localhost",
    "https://127.0.0.1",
    "https://[::1]",
    "https://portfolio.example/path",
    "https://portfolio.example/?x=1",
    "https://portfolio.example/#x",
    "https://user:pass@portfolio.example",
  ]) {
    assert.throws(() => getSeoConfig({ ...production, SITE_URL }));
  }
});

test("profile identities and images use the canonical origin and JSON-LD escapes script injection", () => {
  assert.equal(profileStructuredData(undefined), null);
  const profile = profileStructuredData("https://portfolio.example");
  assert.equal(profile.mainEntity.name, "Urmi Chakraborty");
  assert.equal(profile.mainEntity.url, profile.url);
  assert.equal(
    new URL(profile.mainEntity.image).origin,
    "https://portfolio.example",
  );
  const hostile = { name: "</script><script>alert(1)</script>" };
  assert.ok(!serializeJsonLd(hostile).includes("<"));
  assert.deepEqual(JSON.parse(serializeJsonLd(hostile)), hostile);
});

test("analytics accepts only GA4 IDs and excludes enquiry contents and performance entries", () => {
  assert.equal(validMeasurementId("G-ABC123"), "G-ABC123");
  assert.equal(validMeasurementId('G-ABC";alert(1)'), null);
  const events = [];
  globalThis.window = {
    location: { pathname: "/" },
    gtag: (...args) => events.push(args),
  };
  try {
    reportSuccessfulEnquiry();
    reportWebVital({
      name: "INP",
      id: "test",
      value: 123.5,
      rating: "good",
      navigationType: "navigate",
      entries: [{ secret: "not sent" }],
    });
    reportWebVital({ name: "unknown", value: 1 });
    assert.equal(events.length, 2);
    assert.deepEqual(events[0], [
      "event",
      "generate_lead",
      { form_id: "portfolio_contact", method: "contact_form", page_path: "/" },
    ]);
    assert.equal(events[1][2].metric_value, 123.5);
    assert.equal(events[1][2].entries, undefined);
    window.gtag = () => {
      throw new Error("blocked");
    };
    assert.doesNotThrow(reportSuccessfulEnquiry);
  } finally {
    delete globalThis.window;
  }
});
