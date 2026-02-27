import axios from "axios";

const API_BASE_URL =
  typeof window !== "undefined"
    ? window.location.origin + "/api/v1"
    : "http://localhost:48000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Token management ---

let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
  if (token) {
    localStorage.setItem("timevault_access_token", token);
  } else {
    localStorage.removeItem("timevault_access_token");
  }
}

export function getAccessToken(): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    accessToken = localStorage.getItem("timevault_access_token");
  }
  return accessToken;
}

export function clearTokens(): void {
  accessToken = null;
  localStorage.removeItem("timevault_access_token");
  localStorage.removeItem("timevault_refresh_token");
}

// --- Request interceptor: attach Authorization header ---

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Response interceptor: handle 401 ---

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);
