import { apiRequest, withAuth } from "./apiClient";
import {
  normalizeStockSummary,
  normalizeHolding,
  normalizeInterest,
  normalizeTransaction,
} from "./apiTypes";

// Auth
export const loginApi = async (payload) =>
  apiRequest("/api/auths/login", { method: "POST", body: payload });

export const signupApi = async (payload) =>
  apiRequest("/api/auths/signup", { method: "POST", body: payload });

export const changePasswordApi = withAuth(async (payload) =>
  apiRequest("/api/auths/password", { method: "POST", body: payload })
);

// Stock

export const fetchStockList = withAuth(async () => {
  const res = await apiRequest("/api/stocks");
  return (res?.dashBoard || []).map(normalizeStockSummary);
});

export const fetchStockDetail = withAuth(async (id) =>
  apiRequest(`/api/stocks/${id}`)
);

export const fetchStockReddit = withAuth(async (id) =>
  apiRequest(`/api/stocks/${id}/reddit`)
);

export const fetchStockCompany = withAuth(async (id) =>
  apiRequest(`/api/stocks/${id}/company`)
);

export const fetchStockNews = withAuth(async (id) =>
  apiRequest(`/api/stocks/${id}/news`)
);

export const fetchStockTotal = withAuth(async (id) =>
  apiRequest(`/api/stocks/${id}/total`)
);

export const fetchMacro = withAuth(async () => apiRequest("/api/stocks/macro"));

export const fetchOrderDetail = withAuth(async (id) =>
  apiRequest(`/api/stocks/${id}/order`)
);

export const buyStock = withAuth(async (id, payload) =>
  apiRequest(`/api/stocks/${id}/orders/buy`, { method: "POST", body: payload })
);

export const sellStock = withAuth(async (id, payload) =>
  apiRequest(`/api/stocks/${id}/orders/sell`, { method: "POST", body: payload })
);

// Game
export const startGame = withAuth(async () =>
  apiRequest("/api/stocks/start", { method: "POST" })
);

export const nextGameDay = withAuth(async () =>
  apiRequest("/api/stocks/next", { method: "POST" })
);

export const finishGame = withAuth(async () =>
  apiRequest("/api/stocks/finish", { method: "POST" })
);

export const fetchGameResult = withAuth(async () =>
  apiRequest("/api/stocks/result")
);

// User
export const fetchAsset = withAuth(async () => apiRequest("/api/users/asset"));

export const fetchHoldings = withAuth(async () => {
  const res = await apiRequest("/api/users/holdings");
  return (res?.holdings || []).map(normalizeHolding);
});

export const fetchTransactions = withAuth(async () => {
  const res = await apiRequest("/api/users/transaction");
  return (res?.transactions || []).map(normalizeTransaction);
});

export const fetchInterest = withAuth(async () => {
  const res = await apiRequest("/api/users/interest");
  return (res?.interests || []).map(normalizeInterest);
});


export const likeInterest = withAuth(async (id) =>
  apiRequest(`/api/users/interest/${id}/like`, { method: "POST" })
);

export const dislikeInterest = withAuth(async (id) =>
  apiRequest(`/api/users/interest/${id}/dislike`, { method: "POST" })
);
