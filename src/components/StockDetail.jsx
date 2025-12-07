import React, { useEffect, useState } from "react";
import {
  ChevronLeft,
  Heart,
  Loader2,
  Plus,
  Minus,
  TrendingUp,
  TrendingDown,
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
import { formatCurrency } from "../utils/formatters";
import {
  fetchStockDetail,
  fetchStockReddit,
  fetchStockCompany,
  fetchStockNews,
  fetchStockTotal,
  fetchOrderDetail,
  buyStock,
  sellStock,
} from "../api/api";

const StockDetail = ({
  stockId,
  onBack,
  isDarkMode,
  toggleWatchlist,
  interests,
  onOrdered,
}) => {
  const [detail, setDetail] = useState(null);
  const [orderMeta, setOrderMeta] = useState(null);
  const [reddit, setReddit] = useState(null);
  const [company, setCompany] = useState(null);
  const [news, setNews] = useState(null);
  const [total, setTotal] = useState(null);
  const [amount, setAmount] = useState(1);
  const [orderType, setOrderType] = useState("BUY");
  const [loading, setLoading] = useState(false);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState("");

  const isWatching = interests?.some((item) => item.stockId === stockId);

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

  const loadData = async () => {
    if (!stockId) return;
    setLoading(true);
    setError("");
    try {
      const [detailRes, orderRes, redditRes, companyRes, newsRes, totalRes] =
        await Promise.all([
          fetchStockDetail(stockId),
          fetchOrderDetail(stockId),
          fetchStockReddit(stockId),
          fetchStockCompany(stockId),
          fetchStockNews(stockId),
          fetchStockTotal(stockId),
        ]);
      setDetail(detailRes);
      setOrderMeta(orderRes);
      setReddit(redditRes);
      setCompany(companyRes);
      setNews(newsRes);
      setTotal(totalRes);
    } catch (err) {
      const msg = err?.data?.message || err?.message || "데이터를 불러오지 못했습니다.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [stockId]);

  if (!stockId) return null;

  // 백엔드 응답: [{ marketPrice: number }] 또는 [number] 형식 모두 지원
  const rawMarketPrices = detail?.marketPrices || [];
  const marketPrices = rawMarketPrices.map((item) =>
    typeof item === "object" ? item.marketPrice : item
  );
  const historyDays = 10;
  const chartData = marketPrices.map((price, idx) => {
    const relative = idx - historyDays + 1;
    return {
      day: relative,
      label: relative <= 0 ? `D${relative}` : `D+${relative}`,
      price,
    };
  });

  const currentPrice = detail?.currentPrice || 0;
  const prevPrice = marketPrices.length > 0 ? marketPrices[Math.max(marketPrices.length - 2, 0)] : currentPrice;
  const changeRate = prevPrice ? ((currentPrice - prevPrice) / prevPrice) * 100 : 0;

  const myQty = orderMeta?.quantity || 0;
  const availableOrderAmount = orderMeta?.availableOrderAmount || 0;
  const maxAmount = orderType === "SELL" ? myQty : 999999;
  const totalOrderPrice = amount * currentPrice;
  const canBuy = orderType === "BUY" ? availableOrderAmount >= totalOrderPrice : true;
  const canSell = orderType === "SELL" ? myQty >= amount : true;

  const handleOrder = async () => {
    if (!detail) return;
    setOrdering(true);
    setError("");
    try {
      if (orderType === "BUY") {
        await buyStock(stockId, { quantity: amount });
      } else {
        await sellStock(stockId, { quantity: amount });
      }
      setAmount(1);
      await loadData();
      if (onOrdered) await onOrdered();
    } catch (err) {
      const msg = err?.data?.message || err?.message || "주문에 실패했습니다.";
      setError(msg);
    } finally {
      setOrdering(false);
    }
  };

  const renderInfoCard = (title, content) => (
    <div className={`${theme.cardBg} p-4 rounded-2xl border ${theme.cardBorder} space-y-2`}>
      <h4 className={`text-sm font-bold ${theme.textMain}`}>{title}</h4>
      <p className={`text-sm whitespace-pre-wrap ${theme.textSub}`}>
        {content || "데이터가 없습니다."}
      </p>
    </div>
  );

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

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-slate-400 gap-2">
          <Loader2 className="animate-spin" size={20} /> 불러오는 중...
        </div>
      ) : error ? (
        <div className="flex-1 text-center text-red-400">{error}</div>
      ) : !detail ? (
        <div className="flex-1 text-center text-slate-400">데이터가 없습니다.</div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 items-stretch">
          <div className="flex-1 space-y-6">
            <div
              className={`${theme.cardBg} p-4 md:p-6 rounded-2xl border ${theme.cardBorder} shadow-sm min-h-[400px] md:min-h-[500px] flex flex-col`}
            >
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h2
                    className={`text-2xl md:text-3xl font-black ${theme.textMain} flex items-center gap-3`}
                  >
                    {detail.stockName}
                    <span
                      className={`text-base md:text-lg font-bold ${theme.textSub} ${theme.subCard} px-2 py-1 rounded`}
                    >
                      {detail.stockTag}
                    </span>
                  </h2>
                  <div
                    className={`flex items-center gap-2 text-xl md:text-2xl font-mono font-bold mt-2 ${
                      changeRate >= 0 ? "text-red-500" : "text-blue-500"
                    }`}
                  >
                    {formatCurrency(currentPrice)}
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
                      dataKey="label"
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
                      labelFormatter={(val) => val}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInfoCard("Reddit", reddit?.content)}
              {renderInfoCard("뉴스", news?.content)}
              {renderInfoCard("재무제표", company?.content)}
              {renderInfoCard("종합 분석", total?.analyze || total?.content)}
            </div>
          </div>

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
                <div className="flex justify-between text-sm">
                  <span className={theme.textSub}>주문 가능 금액</span>
                  <span
                    className={`font-mono font-bold ${
                      isDarkMode ? "text-slate-200" : "text-slate-800"
                    }`}
                  >
                    {formatCurrency(availableOrderAmount)}
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
                        onClick={() => setAmount((prev) => Math.min(prev + 1, maxAmount))}
                        disabled={amount >= maxAmount}
                        className={`flex-1 flex items-center justify-center rounded ${theme.btnBg} ${theme.btnText} transition-colors disabled:opacity-50`}
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => setAmount((prev) => Math.max(1, prev - 1))}
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
                    ordering ||
                    (orderType === "BUY" && !canBuy) ||
                    (orderType === "SELL" && !canSell) ||
                    amount <= 0
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
                  {ordering ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={18} /> 처리 중...
                    </span>
                  ) : orderType === "BUY" ? (
                    "매수하기"
                  ) : (
                    "매도하기"
                  )}
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
                {error && (
                  <p className="text-xs text-center text-red-400 font-bold mt-2">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetail;
