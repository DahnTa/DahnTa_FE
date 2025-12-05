import React from "react";
import { User, Activity, Heart } from "lucide-react";
import { formatNumber, formatCurrency } from "../utils/formatters";
import { MARKET_DATA } from "../utils/marketData";

const MyPage = ({ gameState, setViewStock, toggleWatchlist, isDarkMode }) => {
  if (!gameState) return null;

  const sortedTransactions = [...gameState.transactions].sort(
    (a, b) => b.day - a.day || b.timestamp - a.timestamp
  );

  const theme = isDarkMode
    ? {
        cardBg: "bg-slate-900",
        cardBorder: "border-slate-800",
        tableHeaderBg: "bg-slate-950/50",
        tableHeader: "text-slate-500",
        tableRowHover: "hover:bg-slate-800/50",
        divider: "divide-slate-800",
        tableCellBorder: "border-slate-800",
        textMain: "text-slate-200",
        textSub: "text-slate-400",
        subCard: "bg-slate-900/50",
        iconColor: "text-slate-600 hover:text-pink-400",
        iconBg: "bg-slate-800",
      }
    : {
        cardBg: "bg-white",
        cardBorder: "border-slate-300",
        tableHeaderBg: "bg-slate-50",
        tableHeader: "text-slate-500",
        tableRowHover: "hover:bg-slate-50",
        divider: "divide-slate-300",
        tableCellBorder: "border-slate-300",
        textMain: "text-slate-900",
        textSub: "text-slate-500",
        subCard: "bg-slate-50",
        iconColor: "text-slate-400 hover:text-pink-500",
        iconBg: "bg-slate-100",
      };

  return (
    <div className="p-4 md:p-10 max-w-[1600px] mx-auto pb-24 h-full flex flex-col">
      <h2
        className={`text-xl md:text-2xl font-bold ${
          isDarkMode ? "text-slate-100" : "text-slate-900"
        } mb-6 md:mb-8 flex items-center gap-2`}
      >
        <User className="text-purple-500" /> 마이 페이지
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch flex-1 overflow-hidden">
        {/* Transaction History (Left) */}
        <div
          className={`${theme.cardBg} rounded-2xl border ${theme.cardBorder} h-full shadow-lg flex flex-col overflow-hidden`}
        >
          <div
            className={`p-5 border-b ${theme.cardBorder} flex items-center gap-2 ${theme.subCard}`}
          >
            <Activity size={20} className="text-blue-500" />
            <h3 className={`font-bold text-lg ${theme.textMain}`}>거래 내역</h3>
          </div>
          <div className="overflow-auto flex-1 scrollbar-hide">
            <table className="w-full text-xs md:text-sm text-center table-auto border-collapse">
              <thead
                className={`${theme.tableHeader} ${theme.tableHeaderBg} uppercase text-[10px] md:text-[11px] font-bold tracking-wider sticky top-0 z-10`}
              >
                <tr>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder} border-b ${theme.tableCellBorder}`}
                  >
                    날짜
                  </th>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder} border-b ${theme.tableCellBorder}`}
                  >
                    종목
                  </th>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder} border-b ${theme.tableCellBorder}`}
                  >
                    유형
                  </th>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder} border-b ${theme.tableCellBorder}`}
                  >
                    수량
                  </th>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-b ${theme.tableCellBorder}`}
                  >
                    총액
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme.divider}`}>
                {sortedTransactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className={`px-6 py-12 text-center ${theme.textSub} border-r ${theme.tableCellBorder} last:border-r-0`}
                    >
                      거래 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  sortedTransactions.map((tx, idx) => (
                    <tr
                      key={idx}
                      className={`${theme.tableRowHover} transition-colors`}
                    >
                      <td
                        className={`px-2 md:px-4 py-3 md:py-4 font-mono font-bold ${theme.textSub} whitespace-nowrap border-r ${theme.tableCellBorder}`}
                      >
                        DAY {tx.day}
                      </td>
                      <td
                        className={`px-2 md:px-4 py-3 md:py-4 border-r ${theme.tableCellBorder}`}
                      >
                        <span
                          className={`font-bold ${theme.textMain} block whitespace-nowrap`}
                        >
                          {MARKET_DATA[tx.stockId].name}
                        </span>
                        <span
                          className={`text-[10px] ${theme.textSub} font-bold tracking-wider hidden sm:inline`}
                        >
                          {MARKET_DATA[tx.stockId].ticker}
                        </span>
                      </td>
                      <td
                        className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder}`}
                      >
                        <span
                          className={`inline-block px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[10px] md:text-xs font-bold border ${
                            tx.type === "BUY"
                              ? "bg-red-500/10 border-red-500/20 text-red-500"
                              : "bg-blue-500/10 border-blue-500/20 text-blue-500"
                          }`}
                        >
                          {tx.type === "BUY" ? "매수" : "매도"}
                        </span>
                      </td>
                      <td
                        className={`px-2 md:px-4 py-3 md:py-4 font-mono ${theme.textSub} whitespace-nowrap border-r ${theme.tableCellBorder}`}
                      >
                        {tx.quantity}
                      </td>
                      <td
                        className={`px-2 md:px-4 py-3 md:py-4 font-mono font-bold ${theme.textMain} whitespace-nowrap`}
                      >
                        {formatCurrency(tx.price * tx.quantity)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Watchlist (Right) */}
        <div
          className={`${theme.cardBg} rounded-2xl border ${theme.cardBorder} overflow-hidden h-full shadow-lg flex flex-col`}
        >
          <div
            className={`p-5 border-b ${theme.cardBorder} flex items-center gap-2 ${theme.subCard}`}
          >
            <Heart size={20} className="text-pink-500" />
            <h3 className={`font-bold text-lg ${theme.textMain}`}>
              관심 종목 ({gameState.watchlist.length})
            </h3>
          </div>
          <div className={`overflow-auto flex-1 scrollbar-hide`}>
            <table className="w-full text-xs md:text-sm text-center table-auto border-collapse">
              <thead
                className={`${theme.tableHeader} ${theme.tableHeaderBg} uppercase text-[10px] md:text-[11px] font-bold tracking-wider sticky top-0 z-10`}
              >
                <tr>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder} border-b ${theme.tableCellBorder}`}
                  >
                    종목
                  </th>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder} border-b ${theme.tableCellBorder}`}
                  >
                    현재가
                  </th>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-r ${theme.tableCellBorder} border-b ${theme.tableCellBorder}`}
                  >
                    등락률
                  </th>
                  <th
                    className={`px-2 md:px-4 py-3 md:py-4 whitespace-nowrap border-b ${theme.tableCellBorder}`}
                  >
                    관리
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${theme.divider}`}>
                {gameState.watchlist.length === 0 ? (
                  <tr>
                    <td
                      colSpan="4"
                      className={`px-6 py-12 text-center ${theme.textSub}`}
                    >
                      관심 종목이 없습니다.
                    </td>
                  </tr>
                ) : (
                  gameState.watchlist.map((sid) => {
                    const stock = MARKET_DATA[sid];
                    const currentIdx =
                      gameState.startDayIndex + gameState.currentDayOffset;
                    const price = stock.prices[currentIdx];
                    const change =
                      ((price - stock.prices[currentIdx - 1]) /
                        stock.prices[currentIdx - 1]) *
                      100;
                    return (
                      <tr
                        key={sid}
                        className={`${theme.tableRowHover} transition-colors group cursor-pointer`}
                        onClick={() => setViewStock(sid)}
                      >
                        <td
                          className={`px-2 md:px-4 py-3 md:py-4 border-r ${theme.tableCellBorder}`}
                        >
                          <span
                            className={`font-bold ${theme.textMain} block whitespace-nowrap group-hover:text-blue-500 transition-colors`}
                          >
                            {stock.name}
                          </span>
                          <span
                            className={`text-[10px] ${theme.textSub} font-bold tracking-wider hidden sm:inline`}
                          >
                            {stock.ticker}
                          </span>
                        </td>
                        <td
                          className={`px-2 md:px-4 py-3 md:py-4 font-mono font-bold ${theme.textMain} border-r ${theme.tableCellBorder} whitespace-nowrap`}
                        >
                          {formatCurrency(price)}
                        </td>
                        <td
                          className={`px-2 md:px-4 py-3 md:py-4 font-bold border-r ${
                            theme.tableCellBorder
                          } whitespace-nowrap ${
                            change >= 0 ? "text-red-500" : "text-blue-500"
                          }`}
                        >
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(2)}%
                        </td>
                        <td className="px-2 md:px-4 py-3 md:py-4 whitespace-nowrap">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(sid);
                            }}
                            className={`p-2 rounded-full text-pink-500 bg-pink-500/10 hover:bg-pink-500/20 hover:text-pink-400 transition-all border border-pink-500/20`}
                            title="관심 종목 해제"
                          >
                            <Heart size={16} fill="currentColor" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;

