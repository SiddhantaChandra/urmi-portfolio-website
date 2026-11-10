"use client";

import Script from "next/script";
import { useReportWebVitals } from "next/web-vitals";
import { useEffect } from "react";
import { measurementId, reportWebVital } from "../lib/analytics.mjs";

function initializeAnalytics() {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // biome-ignore lint/complexity/noArguments: gtag's documented queue uses an Arguments object.
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  let referrer = "";
  try {
    if (document.referrer) {
      const url = new URL(document.referrer);
      referrer = url.origin + url.pathname;
    }
  } catch {
    // An invalid referrer is omitted.
  }
  window.gtag("config", measurementId, {
    page_location: window.location.origin + window.location.pathname,
    page_referrer: referrer,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

export default function SeoAnalytics() {
  useEffect(initializeAnalytics, []);
  useReportWebVitals(reportWebVital);
  return (
    <Script
      id="seo-analytics"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      strategy="afterInteractive"
    />
  );
}
