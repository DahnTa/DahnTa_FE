import { getTokens, setTokens, clearTokens } from "../services/tokenService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const buildUrl = (path) => {
  if (!path.startsWith("/")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}${path}`;
};

const refreshAccessToken = async () => {
  try {
    const { refreshToken } = getTokens() || {};
    if (!refreshToken) return null;

    const res = await fetch(buildUrl("/api/auth/refresh"), {
      method: "POST",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    if (!res.ok) return null;
    const data = await res.json();
    if (data?.accessToken) {
      setTokens({ accessToken: data.accessToken, refreshToken });
      return data.accessToken;
    }
    return null;
  } catch (err) {
    console.error("Failed to refresh token", err);
    return null;
  }
};

export const apiRequest = async (path, options = {}) => {
  const tokens = getTokens();
  const headers = { ...defaultHeaders, ...(options.headers || {}) };
  if (tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  const doFetch = async (retry = false) => {
    const res = await fetch(buildUrl(path), {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (res.status === 401 && !retry) {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        headers.Authorization = `Bearer ${newAccessToken}`;
        return doFetch(true);
      }
      clearTokens();
      throw new Error("Unauthorized");
    }

    if (res.status === 204) return null;

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const error = new Error(data?.message || "Request failed");
      error.status = res.status;
      error.data = data;
      throw error;
    }
    return data;
  };

  return doFetch(false);
};

export const withAuth = (fn) => async (...args) => {
  const tokens = getTokens();
  if (!tokens?.accessToken) throw new Error("Not authenticated");
  return fn(...args);
};
