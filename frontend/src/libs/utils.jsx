export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
export const PAYMENT_MODE = (import.meta.env.VITE_PAYMENT_MODE || "braintree").toLowerCase();

export function buildApiUrl(path = "") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function isMockPaymentMode() {
  return PAYMENT_MODE === "mock";
}

export function normalizePaymentMode(value) {
  return String(value || "").trim().toLowerCase() === "mock" ? "mock" : "braintree";
}

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
};
