import axios from "axios";
import { API_BASE_URL } from "../libs/utils.jsx";

export class ApiError extends Error {
  constructor(message, options = {}) {
    super(message);
    this.name = "ApiError";
    this.status = options.status ?? 500;
    this.code = options.code ?? "unknown_error";
    this.details = options.details ?? null;
    this.isRetryable = options.isRetryable ?? false;
  }
}

function normalizeApiError(error) {
  if (error instanceof ApiError) {
    return error;
  }

  const status = error.response?.status ?? 500;
  const payload = error.response?.data;
  const message =
    payload?.error ||
    payload?.message ||
    error.message ||
    "Unexpected network error";

  return new ApiError(message, {
    status,
    details: payload,
    isRetryable: status >= 500 || error.code === "ECONNABORTED",
  });
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(normalizeApiError(error)),
);

export async function getJson(url, config) {
  const response = await apiClient.get(url, config);
  return response.data;
}

export async function postJson(url, body, config) {
  const response = await apiClient.post(url, body, config);
  return response.data;
}
