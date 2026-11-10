export function validMeasurementId(value) {
  return /^G-[A-Z0-9]+$/.test(value || "") ? value : null;
}

export const measurementId = validMeasurementId(
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
);

export function reportSuccessfulEnquiry() {
  // Analytics must never change a successfully saved enquiry into an error state.
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "generate_lead", {
        form_id: "portfolio_contact",
        method: "contact_form",
        page_path: window.location.pathname,
      });
    }
  } catch {
    // A blocked or unavailable analytics destination must not affect the form.
  }
}

export function reportWebVital({ name, id, value, rating, navigationType }) {
  if (!["LCP", "INP", "CLS", "FCP", "TTFB"].includes(name)) return;
  try {
    if (typeof window.gtag === "function") {
      window.gtag("event", "web_vital", {
        metric_name: name,
        metric_id: id,
        metric_value: value,
        metric_rating: rating,
        navigation_type: navigationType,
        page_path: window.location.pathname,
        non_interaction: true,
      });
    }
  } catch {
    // Measurement is best effort.
  }
}
