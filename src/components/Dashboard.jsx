import React from "react";
import {
  Activity,
  Newspaper,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Heart,
} from "lucide-react";
import { formatNumber } from "../utils/formatters";
import { MARKET_DATA } from "../utils/marketData";

const Dashboard = ({
  gameState,
  setViewStock,
  toggleWatchlist,
  isDarkMode,
}) => {
  if (!gameState)
    return (
      <div className="p-8 text-center text-slate-500">데이터 로딩 중...</div>
    );

  const currentIdx = gameState.startDayIndex + gameState.currentDayOffset;
  const latestNews =
    gameState.newsFeed && gameState.newsFeed.length > 0
      ? gameState.newsFeed[0]
      : null;

  const theme = isDarkMode
    ? {
        newsBg: "bg-slate-900",
        newsBorder: "border-slate-800",
        cardBg: "bg-slate-900",
        cardBorder: "border-slate-800",
        textMain: "text-slate-100",
        textSub: "text-slate-500",
        divider: "border-slate-800",
        subText: "text-slate-300",
      }
    : {
        newsBg: "bg-white",
        newsBorder: "border-slate-300",
        cardBg: "bg-white",
        cardBorder: "border-slate-300",
        textMain: "text-slate-900",
        textSub: "text-slate-500",
        divider: "border-slate-200",
        subText: "text-slate-600",
      };

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto pb-24">
      {/* AI News Feed Banner */}
      {latestNews && (
        <div
          className={`mb-6 md:mb-10 ${theme.newsBg} border-l-4 border-blue-500 p-4 md:p-6 rounded-r-xl shadow-md relative overflow-hidden group transition-colors duration-300 border-t border-r border-b ${theme.newsBorder}`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Newspaper size={80} className="md:w-[120px] md:h-[120px]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded animate-pulse flex items-center gap-1">
                <Sparkles size={10} /> MARKET FLASH
              </span>
              <span
                className={`${theme.textSub} text-[10px] md:text-xs font-mono font-bold`}
              >
                DAY {latestNews.day}
              </span>
            </div>
            <h3
              className={`text-lg md:text-xl md:text-2xl font-bold ${theme.textMain} leading-tight`}
            >
              {latestNews.headline}
            </h3>
          </div>
        </div>
      )}

      <h2
        className={`text-xl md:text-2xl font-bold mb-4 md:mb-8 ${theme.textMain} flex items-center gap-2`}
      >
        <Activity className="text-blue-500" size={20} /> 시장 현황
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
        {Object.values(MARKET_DATA).map((stock) => {
          const currentPrice = stock.prices[currentIdx];
          const prevPrice = stock.prices[currentIdx - 1];
          const change = currentPrice - prevPrice;
          const changeRate = (change / prevPrice) * 100;
          const isUp = change >= 0;
          const isWatching = gameState.watchlist?.includes(stock.id);

          return (
            <div
              key={stock.id}
              onClick={() => setViewStock(stock.id)}
              className={`${theme.cardBg} p-5 md:p-6 rounded-2xl border ${theme.cardBorder} hover:border-blue-500/50 cursor-pointer transition-all hover:shadow-xl hover:shadow-blue-900/5 group relative flex flex-col justify-between`}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWatchlist(stock.id);
                }}
                className={`absolute top-5 right-5 p-2 rounded-full transition-all z-20 ${
                  isWatching
                    ? "text-pink-500 bg-pink-500/10 hover:bg-pink-500/20"
                    : `${
                        isDarkMode
                          ? "text-slate-600 bg-slate-800"
                          : "text-slate-300 bg-slate-100"
                      } hover:text-pink-400 hover:bg-opacity-80`
                }`}
              >
                <Heart size={18} fill={isWatching ? "currentColor" : "none"} />
              </button>

              <div className="mb-6 pr-8">
                <h3
                  className={`font-bold text-lg md:text-xl ${theme.textMain} group-hover:text-blue-500 transition-colors mb-1 truncate`}
                >
                  {stock.name}
                </h3>
                <p
                  className={`text-xs ${theme.textSub} font-mono font-bold tracking-wider`}
                >
                  {stock.ticker}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className={`text-xs ${theme.textSub} mb-1 font-medium`}>
                      현재가
                    </p>
                    <span
                      className={`text-xl md:text-2xl font-black font-mono ${theme.textMain}`}
                    >
                      {formatNumber(currentPrice)}
                    </span>
                  </div>
                  <div
                    className={`text-right ${
                      isUp ? "text-red-500" : "text-blue-500"
                    }`}
                  >
                    <div className="text-sm font-black flex items-center justify-end gap-1">
                      {isUp ? (
                        <TrendingUp size={16} />
                      ) : (
                        <TrendingDown size={16} />
                      )}
                      {Math.abs(changeRate).toFixed(2)}%
                    </div>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-2 gap-2 pt-4 border-t ${theme.divider}`}
                >
                  <div>
                    <p
                      className={`text-[10px] ${theme.textSub} uppercase font-bold`}
                    >
                      시가 (Open)
                    </p>
                    <p
                      className={`text-sm font-mono font-bold ${theme.subText}`}
                    >
                      {formatNumber(prevPrice)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-[10px] ${theme.textSub} uppercase font-bold`}
                    >
                      변동액 (Change)
                    </p>
                    <p
                      className={`text-sm font-mono font-bold ${
                        isUp ? "text-red-500" : "text-blue-500"
                      }`}
                    >
                      {isUp ? "+" : ""}
                      {formatNumber(change)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

