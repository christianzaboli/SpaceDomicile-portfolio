import { isFeatureEnabled } from "./featureFlags.js";

export function trackEvent(name, payload = {}) {
  if (!isFeatureEnabled("analytics")) {
    return;
  }

  const detail = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("commerce:analytics", { detail }));

  if (import.meta.env.DEV) {
    console.info("[analytics]", detail);
  }
}
