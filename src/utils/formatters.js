// --- Formatters ---
export const formatKRW = (val) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);

export const formatNumber = (val) => new Intl.NumberFormat("en-US").format(val);

export const formatCurrency = formatKRW;

