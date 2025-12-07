export const createDefaultGameState = () => ({
  currentDayOffset: 0,
  isGameOver: false,
  maxGameDays: 20,
  pastDays: 10,
});

export const normalizeStockSummary = (item) => ({
  id: item.id ?? item.stockId ?? item.stockName,
  stockName: item.stockName,
  stockTag: item.stockTag,
  currentPrice: item.currentPrice ?? 0,
  marketPrice: item.marketPrice ?? 0,
  changeRate: item.changeRate ?? 0,
  changeAmount: item.changeAmount ?? 0,
});

export const normalizeHolding = (item) => ({
  // 백엔드에서 stockId를 안 주므로 stockTag를 식별자로 사용
  stockId: item.stockId ?? item.stockTag ?? item.stockName,
  stockName: item.stockName,
  stockTag: item.stockTag,
  quantity: item.quantity,
  changeRate: item.changeRate,
  stockValuation: item.stockValuation,
});

export const normalizeInterest = (item) => ({
  stockId: item.stockId ?? item.id,
  stockName: item.stockName,
  stockTag: item.stockTag,
  currentPrice: item.currentPrice,
  changeRate: item.changeRate,
});

export const normalizeTransaction = (item) => ({
  date: item.date,
  stockName: item.stockName,
  stockTag: item.stockTag,
  type: item.type,
  quantity: item.quantity,
  totalAmount: item.totalAmount,
});
