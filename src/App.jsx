import React, { useState, useEffect } from "react";
import AuthScreen from "./components/AuthScreen";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import StockDetail from "./components/StockDetail";
import MyPage from "./components/MyPage";
import { GameOverModal, ConfirmModal } from "./components/Modals";
import { MARKET_DATA } from "./utils/marketData";
import { generateNewsHeadline } from "./utils/aiTemplates";
import { saveGameState, loadGameState, clearGameState, saveAuth, loadAuth, clearAuth } from "./utils/storage";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  // Load auth and game state on mount
  useEffect(() => {
    const savedAuth = loadAuth();
    const savedGame = loadGameState();
    
    setIsLoggedIn(savedAuth);
    
    if (savedAuth && savedGame) {
      setGameState(savedGame);
    } else if (savedAuth && !savedGame) {
      // Logged in but no game state - create new game
      initializeGame();
    }
    
    setLoading(false);
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    if (gameState && isLoggedIn) {
      saveGameState(gameState);
    }
  }, [gameState, isLoggedIn]);

  const initializeGame = () => {
    const startDayIndex = Math.floor(Math.random() * (365 - 25));
    const initialGame = {
      startDayIndex,
      currentDayOffset: 0,
      balance: 10000,
      portfolio: {},
      watchlist: [],
      transactions: [],
      newsFeed: [],
      isGameOver: false,
      totalReturn: 0,
    };
    setGameState(initialGame);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    saveAuth(true);
    
    const savedGame = loadGameState();
    if (savedGame) {
      setGameState(savedGame);
    } else {
      initializeGame();
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setGameState(null);
    clearAuth();
    clearGameState();
    setCurrentPage("dashboard");
  };

  const resetGame = () => {
    clearGameState();
    initializeGame();
    setCurrentPage("dashboard");
    setSelectedStockId(null);
  };

  const handleNextDay = () => {
    if (!gameState) return;

    setIsProcessing(true);

    // Simulate processing delay
    setTimeout(() => {
      let nextOffset = gameState.currentDayOffset + 1;
      let isGameOver = false;

      if (nextOffset >= 20) {
        isGameOver = true;
        nextOffset = 19;
      }

      const dayIndex = gameState.startDayIndex + nextOffset;
      let maxChange = 0;
      let topStock = null;
      let changePercent = 0;

      Object.values(MARKET_DATA).forEach((stock) => {
        const priceToday = stock.prices[dayIndex];
        const priceYesterday = stock.prices[dayIndex - 1];
        const pct = ((priceToday - priceYesterday) / priceYesterday) * 100;
        if (Math.abs(pct) > Math.abs(maxChange)) {
          maxChange = pct;
          topStock = stock;
          changePercent = pct;
        }
      });

      let newNewsFeed = [...(gameState.newsFeed || [])];

      if (topStock && !isGameOver) {
        const headline = generateNewsHeadline(topStock.name, changePercent);

        newNewsFeed.unshift({
          day: nextOffset + 1,
          headline: headline,
          stockId: topStock.id,
          timestamp: Date.now(),
        });

        if (newNewsFeed.length > 5) newNewsFeed.pop();
      }

      setGameState({
        ...gameState,
        currentDayOffset: nextOffset,
        isGameOver: isGameOver,
        newsFeed: newNewsFeed,
      });

      setIsProcessing(false);
    }, 500);
  };

  const handleOrder = (stockId, type, quantity, price) => {
    if (!gameState) return;

    const totalCost = quantity * price;
    let newBalance = gameState.balance;
    let newPortfolio = { ...gameState.portfolio };
    let newTransactions = [...gameState.transactions];

    if (type === "BUY") {
      if (gameState.balance < totalCost) return;
      newBalance -= totalCost;

      const currentStock = newPortfolio[stockId] || {
        quantity: 0,
        avgPrice: 0,
      };
      const newQuantity = currentStock.quantity + quantity;
      const newAvgPrice =
        (currentStock.quantity * currentStock.avgPrice + totalCost) /
        newQuantity;

      newPortfolio[stockId] = {
        quantity: newQuantity,
        avgPrice: newAvgPrice,
      };
    } else {
      // SELL
      const currentStock = newPortfolio[stockId];
      if (!currentStock || currentStock.quantity < quantity) return;

      newBalance += totalCost;
      const newQuantity = currentStock.quantity - quantity;

      if (newQuantity === 0) {
        delete newPortfolio[stockId];
      } else {
        newPortfolio[stockId] = {
          ...currentStock,
          quantity: newQuantity,
        };
      }
    }

    newTransactions.push({
      type,
      stockId,
      price,
      quantity,
      day: gameState.currentDayOffset + 1,
      timestamp: Date.now(),
    });

    setGameState({
      ...gameState,
      balance: newBalance,
      portfolio: newPortfolio,
      transactions: newTransactions,
    });
  };

  const toggleWatchlist = (stockId) => {
    if (!gameState) return;
    let newWatchlist = [...gameState.watchlist];
    if (newWatchlist.includes(stockId)) {
      newWatchlist = newWatchlist.filter((id) => id !== stockId);
    } else {
      newWatchlist.push(stockId);
    }
    setGameState({
      ...gameState,
      watchlist: newWatchlist,
    });
  };

  const setViewStock = (stockId) => {
    setSelectedStockId(stockId);
    setCurrentPage("detail");
  };

  const handleQuitGame = () => {
    setIsQuitModalOpen(true);
  };

  const executeQuitGame = () => {
    if (!gameState) return;
    setGameState({
      ...gameState,
      isGameOver: true,
    });
    setIsQuitModalOpen(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        초기화 중...
      </div>
    );

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <Layout
      gameState={gameState}
      onNextDay={handleNextDay}
      onReset={resetGame}
      currentPage={currentPage}
      setPage={setCurrentPage}
      isProcessing={isProcessing}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      onQuitGame={handleQuitGame}
      onLogout={handleLogout}
    >
      {currentPage === "dashboard" && (
        <Dashboard
          gameState={gameState}
          setViewStock={setViewStock}
          toggleWatchlist={toggleWatchlist}
          isDarkMode={isDarkMode}
        />
      )}
      {currentPage === "detail" && (
        <StockDetail
          stockId={selectedStockId}
          gameState={gameState}
          onBack={() => setCurrentPage("dashboard")}
          onOrder={handleOrder}
          isDarkMode={isDarkMode}
          toggleWatchlist={toggleWatchlist}
        />
      )}
      {currentPage === "mypage" && (
        <MyPage
          gameState={gameState}
          setViewStock={setViewStock}
          toggleWatchlist={toggleWatchlist}
          isDarkMode={isDarkMode}
        />
      )}

      <GameOverModal gameState={gameState} onReset={resetGame} />
      <ConfirmModal
        isOpen={isQuitModalOpen}
        onClose={() => setIsQuitModalOpen(false)}
        onConfirm={executeQuitGame}
        isDarkMode={isDarkMode}
      />
    </Layout>
  );
}

