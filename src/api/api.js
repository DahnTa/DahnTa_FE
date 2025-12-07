import { apiRequest, withAuth } from "./apiClient";
import {
  normalizeStockSummary,
  normalizeHolding,
  normalizeInterest,
  normalizeTransaction,
} from "./apiTypes";

// Auth
export const loginApi = async (payload) =>
  apiRequest("/api/auth/login", { method: "POST", body: payload });

export const signupApi = async (payload) =>
  apiRequest("/api/auth/signup", { method: "POST", body: payload });

export const changePasswordApi = withAuth(async (payload) =>
  apiRequest("/api/auth/password", { method: "POST", body: payload })
);

// Stock
export const fetchStockList = withAuth(async () => {
  const res = await apiRequest("/api/stock/");
  return (res?.dashBoard || []).map(normalizeStockSummary);
});

export const fetchStockDetail = withAuth(async (id) =>
  apiRequest(`/api/stock/${id}`)
);

export const fetchStockReddit = withAuth(async (id) =>
  apiRequest(`/api/stock/${id}/reddit`)
);

export const fetchStockCompany = withAuth(async (id) =>
  apiRequest(`/api/stock/${id}/company`)
);

export const fetchStockNews = withAuth(async (id) =>
  apiRequest(`/api/stock/${id}/news`)
);

export const fetchStockTotal = withAuth(async (id) =>
  apiRequest(`/api/stock/${id}/total`)
);

export const fetchMacro = withAuth(async () => apiRequest("/api/stock/macro"));

export const fetchOrderDetail = withAuth(async (id) =>
  apiRequest(`/api/stock/${id}/order`)
);

export const buyStock = withAuth(async (id, payload) =>
  apiRequest(`/api/stock/${id}/orders/buy`, { method: "POST", body: payload })
);

export const sellStock = withAuth(async (id, payload) =>
  apiRequest(`/api/stock/${id}/orders/sell`, { method: "POST", body: payload })
);

// Game
export const startGame = withAuth(async () =>
  apiRequest("/api/stock/start", { method: "POST" })
);

export const nextGameDay = withAuth(async () =>
  apiRequest("/api/stock/next", { method: "POST" })
);

export const finishGame = withAuth(async () =>
  apiRequest("/api/stock/finish", { method: "POST" })
);

export const fetchGameResult = withAuth(async () =>
  apiRequest("/api/stock/result")
);

// User
export const fetchAsset = withAuth(async () => apiRequest("/api/user/asset"));

export const fetchHoldings = withAuth(async () => {
  const res = await apiRequest("/api/user/holdings");
  return (res?.holdings || []).map(normalizeHolding);
});

export const fetchTransactions = withAuth(async () => {
  const res = await apiRequest("/api/user/transaction");
  return (res?.transactions || []).map(normalizeTransaction);
});

export const fetchInterest = withAuth(async () => {
  const res = await apiRequest("/api/user/interest");
  return (res?.interests || []).map(normalizeInterest);
});

export const likeInterest = withAuth(async (id) =>
  apiRequest(`/api/user/interest/${id}/like`, { method: "POST" })
);

export const dislikeInterest = withAuth(async (id) =>
  apiRequest(`/api/user/interest/${id}/dislike`, { method: "POST" })
);
