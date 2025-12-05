import React, { useState } from "react";
import {
  PieChart,
  Briefcase,
  PlayCircle,
  RefreshCw,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { formatKRW, formatNumber } from "../utils/formatters";
import { MARKET_DATA } from "../utils/marketData";
import Header from "./Header";

const Layout = ({
  children,
  gameState,
  onNextDay,
  onReset,
  currentPage,
  setPage,
  isProcessing,
  isDarkMode,
  toggleTheme,
  onQuitGame,
  onLogout,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const theme = isDarkMode
    ? {
        bg: "bg-slate-950",
        sidebarBg: "bg-slate-900",
        sidebarBorder: "border-slate-800",
        textMain: "text-slate-100",
        textSub: "text-slate-400",
        cardBg: "bg-gradient-to-br from-slate-800 to-slate-900",
        cardBorder: "border-slate-700/50",
        subCardBg: "bg-slate-800/50",
        buttonDisabled: "disabled:bg-slate-800 disabled:text-slate-600",
        mobileToggleBg: "bg-blue-600",
        mobileToggleText: "text-white",
      }
    : {
        bg: "bg-slate-50",
        sidebarBg: "bg-white",
        sidebarBorder: "border-slate-300",
        textMain: "text-slate-900",
        textSub: "text-slate-500",
        cardBg: "bg-gradient-to-br from-white to-slate-50",
        cardBorder: "border-slate-300",
        subCardBg: "bg-slate-100",
        buttonDisabled: "disabled:bg-slate-200 disabled:text-slate-400",
        mobileToggleBg: "bg-blue-600",
        mobileToggleText: "text-white",
      };

  const calculateAssets = () => {
    if (!gameState) return { total: 0, profit: 0, profitRate: 0 };
    let stockValue = 0;
    Object.entries(gameState.portfolio).forEach(([sid, data]) => {
      const currentPrice =
        MARKET_DATA[sid].prices[
          gameState.startDayIndex + gameState.currentDayOffset
        ];
      stockValue += data.quantity * currentPrice;
    });
    const total = gameState.balance + stockValue;
    const initial = 10000000;
    const profit = total - initial;
    const profitRate = (profit / initial) * 100;
    return { total, profit, profitRate, cash: gameState.balance, stockValue };
  };

  const assets = calculateAssets();

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.textMain} font-sans selection:bg-blue-500 selection:text-white flex flex-col transition-colors duration-300`}
    >
      <Header
        currentPage={currentPage}
        setPage={setPage}
        gameState={gameState}
        onLogout={onLogout}
        onQuitGame={onQuitGame}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <div className="flex flex-1 pt-16 overflow-hidden">
        {/* Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto h-[calc(100vh-4rem)] relative ${theme.bg} order-2 md:order-1 scrollbar-hide`}
        >
          {children}
        </main>

        {/* Sidebar */}
        <aside
          className={`fixed md:sticky top-16 h-[calc(100vh-4rem)] w-full md:w-80 ${
            theme.sidebarBg
          } border-l ${
            theme.sidebarBorder
          } flex flex-col transition-transform duration-300 z-40 order-1 md:order-2 ${
            isSidebarOpen
              ? "translate-x-0"
              : "translate-x-full md:translate-x-0"
          } right-0 shadow-2xl`}
        >
          <div
            className={`p-4 border-b ${theme.sidebarBorder} backdrop-blur flex justify-between items-center md:hidden`}
          >
            <span className="font-bold">내 계좌 현황</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={theme.textSub}
            >
              <ChevronRight />
            </button>
          </div>

          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Mobile Navigation */}
            <div
              className={`md:hidden space-y-2 mb-6 border-b ${theme.sidebarBorder} pb-6`}
            >
              <button
                onClick={() => {
                  setPage("dashboard");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-3 rounded ${
                  currentPage === "dashboard"
                    ? "bg-blue-50 text-blue-600"
                    : theme.textSub
                }`}
              >
                홈
              </button>
              <button
                onClick={() => {
                  setPage("mypage");
                  setIsSidebarOpen(false);
                }}
                className={`w-full text-left p-3 rounded ${
                  currentPage === "mypage"
                    ? "bg-blue-50 text-blue-600"
                    : theme.textSub
                }`}
              >
                마이페이지
              </button>
            </div>

            {gameState && (
              <div className="space-y-6">
                <div>
                  <h3
                    className={`text-xs font-bold ${theme.textSub} uppercase tracking-wider mb-3 flex items-center gap-2`}
                  >
                    <PieChart size={14} className="text-blue-500" /> 자산 현황
                  </h3>
                  <div
                    className={`${theme.cardBg} p-5 rounded-2xl border ${theme.cardBorder} shadow-sm`}
                  >
                    <p className={`${theme.textSub} text-xs font-medium mb-1`}>
                      총 평가 자산
                    </p>
                    <p
                      className={`text-3xl font-black font-mono tracking-tight ${
                        assets.profit >= 0 ? "text-red-500" : "text-blue-500"
                      }`}
                    >
                      {formatKRW(assets.total)}
                    </p>
                    <div
                      className={`flex justify-between text-sm mt-3 pt-3 border-t ${theme.cardBorder}`}
                    >
                      <span
                        className={`${
                          assets.profit >= 0 ? "text-red-500" : "text-blue-500"
                        } font-bold ${
                          isDarkMode ? "bg-slate-950/50" : "bg-slate-200/50"
                        } px-2 py-1 rounded`}
                      >
                        {assets.profit >= 0 ? "+" : ""}
                        {assets.profitRate.toFixed(2)}%
                      </span>
                      <span
                        className={`${theme.textSub} text-xs flex items-center`}
                      >
                        {assets.profit > 0 ? "+" : ""}
                        {formatNumber(assets.profit)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div
                    className={`${theme.subCardBg} p-3 rounded-xl border ${theme.cardBorder}`}
                  >
                    <p
                      className={`${theme.textSub} text-[10px] font-bold uppercase mb-1`}
                    >
                      보유 현금
                    </p>
                    <p
                      className={`font-mono text-sm font-bold ${theme.textMain}`}
                    >
                      {formatNumber(assets.cash)}
                    </p>
                  </div>
                  <div
                    className={`${theme.subCardBg} p-3 rounded-xl border ${theme.cardBorder}`}
                  >
                    <p
                      className={`${theme.textSub} text-[10px] font-bold uppercase mb-1`}
                    >
                      주식 평가금
                    </p>
                    <p
                      className={`font-mono text-sm font-bold ${theme.textMain}`}
                    >
                      {formatNumber(assets.stockValue)}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <h3
                    className={`text-xs font-bold ${theme.textSub} uppercase tracking-wider mb-3 flex items-center gap-2`}
                  >
                    <Briefcase size={14} className="text-indigo-500" /> 보유 종목
                  </h3>
                  {Object.keys(gameState.portfolio).length === 0 ? (
                    <div
                      className={`text-xs ${theme.textSub} text-center py-8 ${theme.subCardBg} rounded-xl border ${theme.cardBorder} border-dashed`}
                    >
                      보유 중인 주식이 없습니다.
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {Object.entries(gameState.portfolio).map(
                        ([sid, data]) => {
                          const stock = MARKET_DATA[sid];
                          const currPrice =
                            stock.prices[
                              gameState.startDayIndex +
                                gameState.currentDayOffset
                            ];
                          const ret =
                            ((currPrice - data.avgPrice) / data.avgPrice) * 100;
                          return (
                            <li
                              key={sid}
                              className={`flex justify-between items-center text-sm ${theme.subCardBg} p-3 rounded-lg border ${theme.cardBorder} hover:border-blue-400 transition-colors`}
                            >
                              <div className="overflow-hidden">
                                <span
                                  className={`block truncate font-bold ${theme.textMain} text-sm`}
                                >
                                  {stock.name}
                                </span>
                                <span
                                  className={`text-[10px] ${theme.textSub} font-mono font-bold tracking-wider`}
                                >
                                  {stock.ticker} · {data.quantity}주
                                </span>
                              </div>
                              <div className="text-right">
                                <span
                                  className={`block font-bold text-xs ${
                                    ret >= 0 ? "text-red-500" : "text-blue-500"
                                  }`}
                                >
                                  {ret.toFixed(1)}%
                                </span>
                                <span
                                  className={`text-xs ${theme.textSub} font-mono`}
                                >
                                  {formatNumber(currPrice * data.quantity)}
                                </span>
                              </div>
                            </li>
                          );
                        }
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div
            className={`p-4 border-t ${theme.sidebarBorder} ${theme.sidebarBg}`}
          >
            {gameState && !gameState.isGameOver && (
              <button
                onClick={onNextDay}
                disabled={isProcessing}
                className={`w-full bg-blue-600 hover:bg-blue-500 ${theme.buttonDisabled} text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20 group`}
              >
                {isProcessing ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <PlayCircle
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                )}
                <span className="text-lg">다음 날 진행</span>
              </button>
            )}

            {gameState && gameState.isGameOver && (
              <button
                onClick={onReset}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold py-4 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/20"
              >
                <RefreshCw size={20} />
                <span className="text-lg">새 게임 시작</span>
              </button>
            )}
          </div>
        </aside>

        {/* Mobile Toggle */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`md:hidden fixed bottom-6 right-6 ${theme.mobileToggleBg} ${theme.mobileToggleText} p-4 rounded-full shadow-xl z-50 hover:bg-blue-500 transition-colors`}
        >
          {isSidebarOpen ? <ChevronRight size={24} /> : <Briefcase size={24} />}
        </button>
      </div>
    </div>
  );
};

export default Layout;

