// --- Formatters ---
export const formatKRW = (val) =>
  new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW" }).format(val);

export const formatNumber = (val) => new Intl.NumberFormat("ko-KR").format(val);

export const formatCurrency = formatKRW;

