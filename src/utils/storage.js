// LocalStorage 관리
const STORAGE_KEY = 'stocksim_game_state';
const AUTH_KEY = 'stocksim_auth';

export const saveGameState = (gameState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState));
  } catch (error) {
    console.error('Failed to save game state:', error);
  }
};

export const loadGameState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.error('Failed to load game state:', error);
    return null;
  }
};

export const clearGameState = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear game state:', error);
  }
};

export const saveAuth = (isLoggedIn) => {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(isLoggedIn));
  } catch (error) {
    console.error('Failed to save auth:', error);
  }
};

export const loadAuth = () => {
  try {
    const saved = localStorage.getItem(AUTH_KEY);
    return saved ? JSON.parse(saved) : false;
  } catch (error) {
    console.error('Failed to load auth:', error);
    return false;
  }
};

export const clearAuth = () => {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch (error) {
    console.error('Failed to clear auth:', error);
  }
};

