import { getTokens, clearTokens } from "../services/tokenService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const defaultHeaders = {
  "Content-Type": "application/json",
};

const buildUrl = (path) => {
  if (!path.startsWith("/")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}${path}`;
};

export const apiRequest = async (path, options = {}) => {
  const tokens = getTokens();
  const headers = { ...defaultHeaders, ...(options.headers || {}) };
  if (tokens?.accessToken) {
    headers.Authorization = `Bearer ${tokens.accessToken}`;
  }

  // 디버그: 요청 정보 출력 (토큰 전체)
  const hasToken = !!tokens?.accessToken;
  const fullToken = tokens?.accessToken || "없음";
  console.log(`[API] ${options.method || "GET"} ${path} | 토큰있음: ${hasToken}`);
  console.log(`[API] 토큰 전체:`, fullToken);

  const doFetch = async () => {
    const res = await fetch(buildUrl(path), {
      method: options.method || "GET",
      headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (res.status === 401) {
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

  return doFetch();
};

export const withAuth = (fn) => async (...args) => {
  const tokens = getTokens();
  if (!tokens?.accessToken) throw new Error("Not authenticated");
  return fn(...args);
};
