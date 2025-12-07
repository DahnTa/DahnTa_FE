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
  const [loadingMessage, setLoadingMessage] = useState("초기화 중...");
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

  useEffect(() => {
    if (!isLoggedIn || isGuest) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const run = async () => {
      try {
        setLoading(true);
        // 15초 카운트다운 대기
        await waitWithCountdown(15, "서버에서 데이터 준비 중...");
        if (cancelled) return;
        setLoadingMessage("시장 데이터 불러오는 중...");
        await bootstrapWithRetry(3, 3000);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();

    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, isGuest]);

  const loadStocks = async () => {
    try {
      if (isGuest) {
        setStocks(guestStocks);
        return;
      }
      const list = await fetchStockList();
      console.log("[loadStocks] 받아온 데이터:", list);
      console.log("[loadStocks] 데이터 개수:", list?.length || 0);
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

  // 딜레이 유틸
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // 재시도 로직이 포함된 bootstrap
  const bootstrapWithRetry = async (maxRetries = 3, delayMs = 2000) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setLoadingMessage(`시장 데이터 불러오는 중... (${attempt}/${maxRetries})`);
        console.log(`[Bootstrap] 시도 ${attempt}/${maxRetries}...`);
        // 순서 보장: 주식 리스트 이후 사용자 데이터
        await loadStocks();
        await loadUserData();
        console.log(`[Bootstrap] 성공!`);
        setLoadingMessage("준비 완료!");
        return true; // 성공
      } catch (error) {
        if (attempt < maxRetries) {
          setLoadingMessage(`데이터 준비 중... 잠시만 기다려주세요 (${attempt}/${maxRetries})`);
          console.log(`[Bootstrap] ${delayMs}ms 후 재시도...`);
          await delay(delayMs);
        } else {
          console.error(`[Bootstrap] 모든 시도 실패`);
          setLoadingMessage("데이터 로드 실패. 새로고침 해주세요.");
          return false;
        }
      }
    }
  };

  // 카운트다운과 함께 대기
  const waitWithCountdown = async (totalSeconds, messagePrefix) => {
    for (let remaining = totalSeconds; remaining > 0; remaining--) {
      setLoadingMessage(`${messagePrefix} (${remaining}초 남음)`);
      await delay(1000);
    }
  };

  const handleLogin = async (payload) => {
    // 로그인 실패 시에는 전역 로딩을 켜지 않아 에러 메시지가 가려지지 않도록 한다.
    const res = await loginService(payload);
    if (!res?.accessToken || !res?.refreshToken) {
      throw new Error("로그인 응답에 토큰이 없습니다.");
    }
    setLoading(true);
    setLoadingMessage("게임 세션 시작 중...");
    // 토큰 받은 직후 게임 세션 시작
    await startGame();
    // 게임 시작이 끝난 뒤 로그인 상태로 전환 → useEffect에서 15초 대기 후 /api/stock/ 호출
    setIsLoggedIn(true);
    setGameState(createDefaultGameState());
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
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-950 to-indigo-900/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* 로딩 컨텐츠 */}
        <div className="z-10 flex flex-col items-center gap-8">
          {/* 로고 */}
          <h1 className="text-5xl font-black tracking-tighter italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
            StockSim
          </h1>
          
          {/* 스피너 */}
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-indigo-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          
          {/* 로딩 메시지 */}
          <div className="text-center">
            <p className="text-lg text-slate-300 font-medium animate-pulse">
              {loadingMessage}
            </p>
            <p className="text-sm text-slate-500 mt-2">
              잠시만 기다려주세요
            </p>
          </div>
          
          {/* 프로그레스 바 (무한 애니메이션) */}
          <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500 rounded-full animate-loading-bar"
              style={{
                width: '40%',
                animation: 'loading-bar 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
        
        {/* CSS 애니메이션 */}
        <style>{`
          @keyframes loading-bar {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(150%); }
            100% { transform: translateX(-100%); }
          }
        `}</style>
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
          stocks={stocks}
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
