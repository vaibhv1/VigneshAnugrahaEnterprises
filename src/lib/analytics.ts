export type AnalyticsEvent =
  | "whatsapp_click"
  | "phone_click"
  | "email_click"
  | "form_start"
  | "form_submit"
  | "service_click"
  | "project_click"
  | "enquiry_cta_click";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** Sends a conversion event when a Google Analytics measurement ID is configured. */
export function track(event: AnalyticsEvent, params?: Record<string, string>) {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", event, params);
}

export function installAnalytics() {
  const id = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!id || window.gtag) return;
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true });
}
