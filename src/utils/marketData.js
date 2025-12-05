// --- Seeded Random Generator for Deterministic Market Data ---
class SeededRandom {
  constructor(seed) {
    this.seed = seed;
  }
  next() {
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }
}

// --- Stock Information ---
export const STOCK_INFO = [
  { name: "엔비디아", ticker: "NVDA", basePrice: 130000 },
  { name: "애플", ticker: "AAPL", basePrice: 180000 },
  { name: "마이크로소프트", ticker: "MSFT", basePrice: 400000 },
  { name: "알파벳(구글)", ticker: "GOOGL", basePrice: 170000 },
  { name: "아마존", ticker: "AMZN", basePrice: 180000 },
  { name: "메타 플랫폼스", ticker: "META", basePrice: 470000 },
  { name: "브로드컴", ticker: "AVGO", basePrice: 160000 },
  { name: "테슬라", ticker: "TSLA", basePrice: 220000 },
  { name: "버크셔 해서웨이", ticker: "BRK.B", basePrice: 600000 },
  { name: "월마트", ticker: "WMT", basePrice: 60000 },
];

// --- Generate Market Data ---
export const generateMarketData = () => {
  const rng = new SeededRandom(12345);
  const stocks = {};

  STOCK_INFO.forEach((stockInfo, index) => {
    const id = `S${index + 1}`;
    const basePrice = stockInfo.basePrice;
    const volatility = 0.015 + rng.next() * 0.035;
    const prices = [basePrice];

    for (let day = 1; day < 365; day++) {
      const change = (rng.next() - 0.5) * 2 * volatility;
      const prevPrice = prices[day - 1];
      let newPrice = Math.floor(prevPrice * (1 + change));
      if (newPrice < 100) newPrice = 100;
      prices.push(newPrice);
    }

    stocks[id] = {
      id,
      name: stockInfo.name,
      ticker: stockInfo.ticker,
      prices,
      volatility,
    };
  });

  return stocks;
};

export const MARKET_DATA = generateMarketData();

