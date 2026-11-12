import axios from "axios";
import { session } from "./session";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = session.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// An expired or invalid token ends the session. Auth endpoints are skipped so a
// failed login can show its own error instead of reloading the page.
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = String(error.config?.url ?? "").startsWith("/auth/");
    if (error.response?.status === 401 && !isAuthRequest && session.getToken()) {
      const wasAdmin = session.getUser()?.role === "ADMIN";
      session.clear();
      window.location.href = wasAdmin ? "/admin-login" : "/login";
    }
    return Promise.reject(error);
  },
);
