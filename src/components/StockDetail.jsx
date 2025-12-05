import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Sparkles,
  Loader2,
  Plus,
  Minus,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatKRW, formatNumber, formatCurrency } from "../utils/formatters";
import { MARKET_DATA } from "../utils/marketData";
import { AI_PERSONAS } from "../utils/aiPersonas";
import { getStoredAIAnalysis } from "../utils/aiTemplates";

const StockDetail = ({
  stockId,
  gameState,
  onBack,
  onOrder,
  isDarkMode,
  toggleWatchlist,
}) => {
  const [amount, setAmount] = useState(1);
  const [persona, setPersona] = useState("integrated");
  const [orderType, setOrderType] = useState("BUY");
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!stockId || !gameState) return null;

  const stock = MARKET_DATA[stockId];
  const currentIdx = gameState.startDayIndex + gameState.currentDayOffset;
  const currentPrice = stock.prices[currentIdx];
  const prevPrice = stock.prices[currentIdx - 1];
  const changeRate = ((currentPrice - prevPrice) / prevPrice) * 100;
  const isWatching = gameState.watchlist?.includes(stock.id);

  const theme = isDarkMode
    ? {
        cardBg: "bg-slate-900",
        cardBorder: "border-slate-800",
        textMain: "text-slate-100",
        textSub: "text-slate-400",
        inputBg: "bg-slate-950",
        inputBorder: "border-slate-700",
        chartGrid: "#1e293b",
        chartText: "#94a3b8",
        tooltipBg: "#0f172a",
        tooltipBorder: "#1e293b",
        tooltipText: "#f1f5f9",
        subCard: "bg-slate-800/50",
        btnBg: "bg-slate-800 hover:bg-slate-700",
        btnText: "text-slate-200",
      }
    : {
        cardBg: "bg-white",
        cardBorder: "border-slate-300",
        textMain: "text-slate-900",
        textSub: "text-slate-500",
        inputBg: "bg-slate-50",
        inputBorder: "border-slate-300",
        chartGrid: "#cbd5e1",
        chartText: "#64748b",
        tooltipBg: "#ffffff",
        tooltipBorder: "#cbd5e1",
        tooltipText: "#0f172a",
        subCard: "bg-slate-50",
        btnBg: "bg-slate-100 hover:bg-slate-200",
        btnText: "text-slate-800",
      };

  const chartData = stock.prices
    .slice(gameState.startDayIndex, currentIdx + 1)
    .map((price, idx) => ({
      day: idx + 1,
      price: price,
    }));

  const myStock = gameState.portfolio[stockId];
  const myQty = myStock ? myStock.quantity : 0;
  const myAvg = myStock ? myStock.avgPrice : 0;

  const maxAmount = orderType === "SELL" ? myQty : 9999;
  const totalOrderPrice = amount * currentPrice;
  const canBuy = gameState.balance >= totalOrderPrice;
  const canSell = myQty >= amount;

  const handleOrder = () => {
    if (orderType === "BUY" && !canBuy) return;
    if (orderType === "SELL" && !canSell) return;
    onOrder(stockId, orderType, amount, currentPrice);
    setAmount(1);
  };

  const cyclePersona = (dir) => {
    const keys = Object.keys(AI_PERSONAS);
    let idx = keys.indexOf(persona);
    if (dir === "next") idx = (idx + 1) % keys.length;
    else idx = (idx - 1 + keys.length) % keys.length;
    setPersona(keys[idx]);
    setAiAnalysis(null);
  };

  const CurrentPersona = AI_PERSONAS[persona];

  const handleDeepAnalysis = () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);

    // 사전 저장된 백엔드 분석을 가져오는 동작을 모사
    setTimeout(() => {
      const analysis = getStoredAIAnalysis(persona, stock.id, stock.name);
      setAiAnalysis(analysis);
      setIsAnalyzing(false);
    }, 800);
  };

  const incrementAmount = () =>
    setAmount((prev) => Math.min(prev + 1, maxAmount));
  const decrementAmount = () => setAmount((prev) => Math.max(1, prev - 1));

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto h-full flex flex-col pb-24">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className={`flex items-center ${theme.textSub} hover:${theme.textMain} w-fit transition-colors group`}
        >
          <ChevronLeft
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />{" "}
          리스트로 돌아가기
        </button>
        <button
          onClick={() => toggleWatchlist(stockId)}
          className={`p-2 rounded-full transition-all ${
            isWatching
              ? "text-pink-500 bg-pink-500/10 hover:bg-pink-500/20"
              : `${theme.textSub} ${theme.subCard} hover:text-pink-400 hover:bg-opacity-80`
          }`}
        >
          <Heart size={24} fill={isWatching ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        {/* Chart Section - Main Column */}
        <div className="flex-1 space-y-6">
          <div
            className={`${theme.cardBg} p-4 md:p-6 rounded-2xl border ${theme.cardBorder} shadow-sm min-h-[400px] md:min-h-[500px] flex flex-col`}
          >
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2
                  className={`text-2xl md:text-3xl font-black ${theme.textMain} flex items-center gap-3`}
                >
                  {stock.name}
                  <span
                    className={`text-base md:text-lg font-bold ${theme.textSub} ${theme.subCard} px-2 py-1 rounded`}
                  >
                    {stock.ticker}
                  </span>
                </h2>
                <div
                  className={`flex items-center gap-2 text-xl md:text-2xl font-mono font-bold mt-2 ${
                    changeRate >= 0 ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {formatKRW(currentPrice)}
                  <span
                    className={`text-sm font-bold px-2 py-1 rounded ${
                      changeRate >= 0
                        ? "bg-red-500/10 text-red-500"
                        : "bg-blue-500/10 text-blue-500"
                    }`}
                  >
                    {changeRate >= 0 ? "+" : ""}
                    {changeRate.toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px] md:min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={theme.chartGrid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="day"
                    stroke={theme.chartText}
                    tick={{ fill: theme.chartText, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
                    stroke={theme.chartText}
                    width={60}
                    tickFormatter={(val) => val.toLocaleString()}
                    tick={{ fill: theme.chartText, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.tooltipBg,
                      border: `1px solid ${theme.tooltipBorder}`,
                      borderRadius: "8px",
                      color: theme.tooltipText,
                    }}
                    itemStyle={{ color: theme.tooltipText }}
                    labelStyle={{
                      color: theme.chartText,
                      marginBottom: "0.5rem",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke={changeRate >= 0 ? "#ef4444" : "#3b82f6"}
                    strokeWidth={3}
                    dot={chartData.length === 1 ? { r: 4 } : false}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights & Deep Analysis */}
          <div
            className={`${theme.cardBg} p-4 md:p-6 rounded-2xl border ${theme.cardBorder} relative overflow-hidden transition-all shadow-sm`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              {CurrentPersona.icon}
            </div>
            <div className="flex justify-between items-center mb-6">
              <h3
                className={`font-bold text-lg flex items-center gap-2 ${theme.textMain}`}
              >
                <Sparkles size={18} className="text-purple-500" />
                AI Analyst
                <span
                  className={`text-xs font-normal ${theme.textSub} px-2 py-1 ${theme.subCard} rounded-full border ${theme.cardBorder}`}
                >
                  {CurrentPersona.name}
                </span>
              </h3>
              <div className={`flex gap-1 ${theme.subCard} p-1 rounded-lg`}>
                <button
                  onClick={() => cyclePersona("prev")}
                  className={`p-1.5 hover:${
                    isDarkMode ? "bg-slate-700" : "bg-slate-200"
                  } rounded ${theme.textSub} hover:${
                    theme.textMain
                  } transition-colors`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => cyclePersona("next")}
                  className={`p-1.5 hover:${
                    isDarkMode ? "bg-slate-700" : "bg-slate-200"
                  } rounded ${theme.textSub} hover:${
                    theme.textMain
                  } transition-colors`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className={`border-t ${theme.cardBorder} pt-4`}>
              {!aiAnalysis ? (
                <button
                  onClick={handleDeepAnalysis}
                  disabled={isAnalyzing}
                  className="w-full py-4 rounded-xl border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={18} /> 분석
                      중입니다...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} /> {CurrentPersona.name}에게 심층 분석
                      요청
                    </>
                  )}
                </button>
              ) : (
                <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-bottom-2">
                  <h4 className="font-bold text-indigo-500 mb-4 flex items-center gap-2 border-b border-indigo-500/20 pb-2">
                    <Sparkles size={16} /> 심층 분석 리포트
                  </h4>
                  <div
                    className={`text-sm ${
                      isDarkMode ? "text-slate-300" : "text-slate-700"
                    } whitespace-pre-wrap leading-relaxed space-y-2`}
                  >
                    {aiAnalysis}
                  </div>
                  <button
                    onClick={() => setAiAnalysis(null)}
                    className={`mt-4 text-xs ${theme.textSub} hover:${theme.textMain} underline`}
                  >
                    리포트 닫기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Panel - Right Column */}
        <div className="lg:w-[350px] space-y-6">
          <div
            className={`${theme.cardBg} p-6 rounded-2xl border ${theme.cardBorder} flex flex-col shadow-xl h-fit sticky top-24`}
          >
            <h3 className={`text-xl font-bold mb-6 ${theme.textMain}`}>
              주문하기
            </h3>

            <div className={`flex ${theme.subCard} p-1 rounded-xl mb-6`}>
              <button
                onClick={() => setOrderType("BUY")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                  orderType === "BUY"
                    ? "bg-red-500 text-white shadow-lg"
                    : `${theme.textSub} hover:${theme.textMain}`
                }`}
              >
                매수 (Buy)
              </button>
              <button
                onClick={() => setOrderType("SELL")}
                className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${
                  orderType === "SELL"
                    ? "bg-blue-500 text-white shadow-lg"
                    : `${theme.textSub} hover:${theme.textMain}`
                }`}
              >
                매도 (Sell)
              </button>
            </div>

            <div className="space-y-4 flex-1">
              <div className="flex justify-between text-sm">
                <span className={theme.textSub}>보유 수량</span>
                <span
                  className={`font-mono font-bold ${
                    isDarkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {myQty} 주
                </span>
              </div>
              {myQty > 0 && (
                <div className="flex justify-between text-sm">
                  <span className={theme.textSub}>평균 단가</span>
                  <span
                    className={`font-mono font-bold ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {formatCurrency(myAvg)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className={theme.textSub}>주문 가능 금액</span>
                <span
                  className={`font-mono font-bold ${
                    isDarkMode ? "text-slate-200" : "text-slate-800"
                  }`}
                >
                  {formatCurrency(gameState.balance)}
                </span>
              </div>

              <div className={`pt-6 border-t ${theme.cardBorder} mt-2`}>
                <label
                  className={`block text-xs font-bold ${theme.textSub} uppercase mb-2`}
                >
                  Quantity
                </label>
                <div
                  className={`flex items-center justify-between ${theme.inputBg} border ${theme.inputBorder} rounded-lg p-2 h-16`}
                >
                  <div className="flex-1 flex justify-center items-center h-full border-r border-slate-700/50">
                    <span
                      className={`font-mono text-2xl font-bold ${theme.textMain}`}
                    >
                      {amount}
                    </span>
                    <span className={`text-sm font-bold ${theme.textSub} ml-2`}>
                      주
                    </span>
                  </div>
                  <div className="flex flex-col h-full w-12 ml-2 gap-1">
                    <button
                      onClick={incrementAmount}
                      disabled={amount >= maxAmount}
                      className={`flex-1 flex items-center justify-center rounded ${theme.btnBg} ${theme.btnText} transition-colors disabled:opacity-50`}
                    >
                      <Plus size={16} />
                    </button>
                    <button
                      onClick={decrementAmount}
                      disabled={amount <= 1}
                      className={`flex-1 flex items-center justify-center rounded ${theme.btnBg} ${theme.btnText} transition-colors disabled:opacity-50`}
                    >
                      <Minus size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className={`font-bold ${theme.textSub}`}>
                  총 주문 금액
                </span>
                <span
                  className={`text-xl font-black font-mono ${
                    orderType === "BUY" ? "text-red-500" : "text-blue-500"
                  }`}
                >
                  {formatCurrency(totalOrderPrice)}
                </span>
              </div>

              <button
                onClick={handleOrder}
                disabled={
                  (orderType === "BUY" && !canBuy) ||
                  (orderType === "SELL" && !canSell)
                }
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  orderType === "BUY"
                    ? canBuy
                      ? "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20"
                      : "bg-slate-700 text-slate-500 cursor-not-allowed"
                    : canSell
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/20"
                    : "bg-slate-700 text-slate-500 cursor-not-allowed"
                }`}
              >
                {orderType === "BUY" ? "매수하기" : "매도하기"}
              </button>

              {!canBuy && orderType === "BUY" && (
                <p className="text-xs text-center text-red-500 font-bold mt-2">
                  잔액이 부족합니다.
                </p>
              )}
              {!canSell && orderType === "SELL" && (
                <p className="text-xs text-center text-blue-500 font-bold mt-2">
                  보유 수량이 부족합니다.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetail;

