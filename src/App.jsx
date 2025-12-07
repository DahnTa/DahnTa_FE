import React, { useEffect, useState } from "react";
import AuthScreen from "./components/AuthScreen";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import StockDetail from "./components/StockDetail";
import MyPage from "./components/MyPage";
import { GameOverModal, ConfirmModal } from "./components/Modals";
import {
  fetchAsset,
  fetchHoldings,
  fetchInterest,
  fetchStockList,
  fetchTransactions,
  startGame,
  nextGameDay,
  finishGame,
  fetchGameResult,
} from "./api/api";
import { createDefaultGameState } from "./api/apiTypes";
import { login as loginService, logout as logoutService } from "./services/authService";
import { isAuthenticated } from "./services/tokenService";
import { STOCK_INFO } from "./utils/marketData";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [isGuest, setIsGuest] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedStockId, setSelectedStockId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [asset, setAsset] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [interests, setInterests] = useState([]);
  const [gameState, setGameState] = useState(createDefaultGameState());
  const [gameResult, setGameResult] = useState(null);

  const guestStocks = STOCK_INFO.map((s, idx) => {
    const base = s.basePrice || 100;
    const currentPrice = base * 1.01;
    return {
      id: `G${idx + 1}`,
      stockName: s.name,
      stockTag: s.ticker,
      currentPrice,
      marketPrice: base,
      changeRate: 1.01,
      changeAmount: currentPrice - base,
    };
  });

  const guestAsset = {
    totalAmount: 10000000,
    creditChangeRate: 0,
    creditChangeAmount: 0,
    userCredit: 10000000,
    stockValuation: 0,
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const bootstrap = async () => {
    try {
      setLoading(true);
      await Promise.all([loadStocks(), loadUserData()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || isGuest) {
      setLoading(false);
      return;
    }
    bootstrap();
  }, [isLoggedIn, isGuest]);

  const loadStocks = async () => {
    try {
      if (isGuest) {
        setStocks(guestStocks);
        return;
      }
      const list = await fetchStockList();
      setStocks(list);
    } catch (error) {
      console.error("주식 리스트 로드 실패", error);
    }
  };

  const loadUserData = async () => {
    try {
      if (isGuest) {
        setAsset(guestAsset);
        setHoldings([]);
        setTransactions([]);
        setInterests([]);
        return;
      }
      const [assetRes, holdingsRes, txRes, interestRes] = await Promise.all([
        fetchAsset(),
        fetchHoldings(),
        fetchTransactions(),
        fetchInterest(),
      ]);
      setAsset(assetRes);
      setHoldings(holdingsRes);
      setTransactions(txRes);
      setInterests(interestRes);
    } catch (error) {
      console.error("사용자 데이터 로드 실패", error);
    }
  };

  const handleLogin = async (payload) => {
    // 로그인 실패 시에는 전역 로딩을 켜지 않아 에러 메시지가 가려지지 않도록 한다.
    const res = await loginService(payload);
    if (!res?.accessToken || !res?.refreshToken) {
      throw new Error("로그인 응답에 토큰이 없습니다.");
    }
    setIsLoggedIn(true);
    setGameState(createDefaultGameState());
    // 로그인 성공 이후에만 전역 로딩 스피너를 잠깐 사용한다.
    setLoading(true);
    try {
      await startGame();
      await bootstrap();
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsGuest(true);
    setIsLoggedIn(true);
    setGameState(createDefaultGameState());
    setStocks(guestStocks);
    setAsset(guestAsset);
    setHoldings([]);
    setTransactions([]);
    setInterests([]);
    setLoading(false);
  };

  const handleLogout = () => {
    logoutService();
    setIsLoggedIn(false);
    setIsGuest(false);
    setGameState(createDefaultGameState());
    setStocks([]);
    setAsset(null);
    setHoldings([]);
    setTransactions([]);
    setInterests([]);
    setCurrentPage("dashboard");
    setSelectedStockId(null);
  };

  const resetGame = async () => {
    if (isGuest) {
      setGameState(createDefaultGameState());
      setGameResult(null);
      return;
    }
    setIsProcessing(true);
    try {
      await startGame();
      setGameState(createDefaultGameState());
      setGameResult(null);
      await loadStocks();
      await loadUserData();
      setCurrentPage("dashboard");
      setSelectedStockId(null);
    } catch (error) {
      console.error("게임 초기화 실패", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNextDay = async () => {
    if (isGuest) {
      // 게스트 모드는 진행 불가
      return;
    }
    setIsProcessing(true);
    try {
      await nextGameDay();
      let isGameFinished = false;
      setGameState((prev) => {
        const nextDay = prev.currentDayOffset + 1;
        const isGameOver = nextDay >= prev.maxGameDays;
        isGameFinished = isGameOver;
        return { ...prev, currentDayOffset: Math.min(nextDay, prev.maxGameDays), isGameOver };
      });
      if (isGameFinished) {
        const result = await fetchGameResult();
        setGameResult(result);
      }
      await loadStocks();
      await loadUserData();
    } catch (error) {
      console.error("다음 날 진행 실패", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinishGame = async () => {
    if (isGuest) {
      setGameState((prev) => ({ ...prev, isGameOver: true }));
      return;
    }
    try {
      await finishGame();
      const result = await fetchGameResult();
      setGameResult(result);
      setGameState((prev) => ({ ...prev, isGameOver: true }));
    } catch (error) {
      console.error("게임 종료 실패", error);
    }
  };

  const toggleWatchlist = async (stockId) => {
    try {
      if (isGuest) {
        setInterests((prev) => {
          const exists = prev.some((item) => item.stockId === stockId);
          if (exists) return prev.filter((i) => i.stockId !== stockId);
          const stock = stocks.find((s) => s.id === stockId);
          if (!stock) return prev;
          return [
            ...prev,
            {
              stockId,
              stockName: stock.stockName,
              stockTag: stock.stockTag,
              currentPrice: stock.currentPrice,
              changeRate: stock.changeRate,
            },
          ];
        });
        return;
      }
      const isWatching = interests.some((item) => item.stockId === stockId);
      if (isWatching) {
        await import("./api/api").then((m) => m.dislikeInterest(stockId));
      } else {
        await import("./api/api").then((m) => m.likeInterest(stockId));
      }
      await loadUserData();
    } catch (error) {
      console.error("관심 종목 토글 실패", error);
    }
  };

  const setViewStock = (stockId) => {
    setSelectedStockId(stockId);
    setCurrentPage("detail");
  };

  const handleQuitGame = () => setIsQuitModalOpen(true);

  const executeQuitGame = async () => {
    await handleFinishGame();
    setIsQuitModalOpen(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        초기화 중...
      </div>
    );

  if (!isLoggedIn) {
    return <AuthScreen onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
  }

  return (
    <Layout
      gameState={gameState}
      asset={asset}
      holdings={holdings}
      onNextDay={handleNextDay}
      onReset={resetGame}
      currentPage={currentPage}
      setPage={setCurrentPage}
      isProcessing={isProcessing}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      onQuitGame={handleQuitGame}
      onLogout={handleLogout}
      interests={interests}
    >
      {currentPage === "dashboard" && (
        <Dashboard
          stocks={stocks}
          setViewStock={setViewStock}
          toggleWatchlist={toggleWatchlist}
          isDarkMode={isDarkMode}
          interests={interests}
        />
      )}
      {currentPage === "detail" && (
        <StockDetail
          stockId={selectedStockId}
          onBack={() => setCurrentPage("dashboard")}
          isDarkMode={isDarkMode}
          toggleWatchlist={toggleWatchlist}
          interests={interests}
          isGuest={isGuest}
          onOrdered={async () => {
            await loadUserData();
            await loadStocks();
          }}
        />
      )}
      {currentPage === "mypage" && (
        <MyPage
          asset={asset}
          holdings={holdings}
          transactions={transactions}
          interests={interests}
          setViewStock={setViewStock}
          toggleWatchlist={toggleWatchlist}
          isDarkMode={isDarkMode}
        />
      )}

      <GameOverModal
        isGameOver={gameState.isGameOver}
        gameResult={gameResult}
        asset={asset}
        onReset={resetGame}
      />
      <ConfirmModal
        isOpen={isQuitModalOpen}
        onClose={() => setIsQuitModalOpen(false)}
        onConfirm={executeQuitGame}
        isDarkMode={isDarkMode}
      />
    </Layout>
  );
}
