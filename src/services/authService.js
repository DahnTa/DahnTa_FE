import { setTokens, clearTokens, getTokens } from "./tokenService";
import { apiRequest } from "../api/apiClient";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const buildUrl = (path) => {
  if (!path.startsWith("/")) return `${BASE_URL}/${path}`;
  return `${BASE_URL}${path}`;
};

export const login = async ({ userAccount, userPassword }) => {
  const res = await apiRequest("/api/auth/login", {
    method: "POST",
    body: { userAccount, userPassword },
  });
  if (res?.accessToken && res?.refreshToken) {
    setTokens({ accessToken: res.accessToken, refreshToken: res.refreshToken });
  }
  return res;
};

export const signup = async (payload) =>
  apiRequest("/api/auth/signup", { method: "POST", body: payload });

export const changePassword = async (payload) =>
  apiRequest("/api/auth/password", { method: "POST", body: payload });

export const refreshToken = async () => {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;
  const res = await fetch(buildUrl("/api/auth/refresh"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokens.refreshToken}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (data?.accessToken) {
    setTokens({ accessToken: data.accessToken, refreshToken: tokens.refreshToken });
    return data.accessToken;
  }
  return null;
};

export const logout = () => clearTokens();
