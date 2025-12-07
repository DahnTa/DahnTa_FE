const TOKEN_KEY = "stocksim_tokens";

export const setTokens = ({ accessToken, refreshToken }) => {
  if (!accessToken && !refreshToken) return;
  localStorage.setItem(
    TOKEN_KEY,
    JSON.stringify({ accessToken, refreshToken })
  );
};

export const getTokens = () => {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error("Failed to read tokens", err);
    return null;
  }
};

export const clearTokens = () => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error("Failed to clear tokens", err);
  }
};

export const isAuthenticated = () => {
  const tokens = getTokens();
  return !!tokens?.accessToken;
};
