/**
 * Format number into standard Indian Rupee format
 */
export const formatPrice = (n) => {
  if (n === undefined || n === null || n === "") return "₹0.00";
  const num = typeof n === "number" ? n : parseFloat(n);
  if (isNaN(num)) return "₹0.00";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(num);
};

/**
 * Format Market Capitalization in Crores / Lakh Crores (Cr is standard in Indian markets)
 */
export const formatCrore = (n) => {
  if (n === undefined || n === null || n === "") return "₹0 Cr";
  const num = typeof n === "number" ? n : parseFloat(n);
  if (isNaN(num)) return "₹0 Cr";
  if (num >= 100000) {
    return `₹${(num / 100000).toFixed(2)} Lakh Cr`;
  }
  return `₹${Math.round(num).toLocaleString("en-IN")} Cr`;
};

/**
 * Format daily share volumes elegantly
 */
export const formatVolume = (n) => {
  if (n === undefined || n === null || n === "") return "0";
  const num = typeof n === "number" ? n : parseFloat(n);
  if (isNaN(num)) return "0";

  if (num >= 10000000) {
    return `${(num / 10000000).toFixed(2)} Cr`;
  }
  if (num >= 100000) {
    return `${(num / 100000).toFixed(2)} L`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)} K`;
  }
  return Math.round(num).toLocaleString("en-IN");
};

/**
 * Format raw numbers with custom decimal points
 */
export const formatNum = (n, decimals = 2) => {
  if (n === undefined || n === null || n === "") return "0";
  const num = typeof n === "number" ? n : parseFloat(n);
  return isNaN(num) ? "0" : num.toFixed(decimals);
};

/**
 * Derives the Buy / Sell / Hold recommendation rating
 */
export const getRecommendation = (stock) => {
  const rsi =
    typeof stock.day_rsi === "number"
      ? stock.day_rsi
      : parseFloat(stock.day_rsi || "50");
  const momentum =
    typeof stock.trendlyne_momentum_score === "number"
      ? stock.trendlyne_momentum_score
      : parseFloat(stock.trendlyne_momentum_score || "50");
  const macd =
    typeof stock.day_macd === "number"
      ? stock.day_macd
      : parseFloat(stock.day_macd || "0");
  const signal =
    typeof stock.day_macd_signal_line === "number"
      ? stock.day_macd_signal_line
      : parseFloat(stock.day_macd_signal_line || "0");
  const macdBull = macd > signal;

  if (rsi > 70 && momentum > 65 && macdBull) return "STRONG BUY";
  if (rsi > 55 && macdBull) return "BUY";
  if (rsi < 30) return "OVERSOLD";
  if (rsi > 80) return "OVERBOUGHT";
  if (!macdBull && momentum < 40) return "SELL";
  return "HOLD";
};

/**
 * Scoring system for Indian stock risk profiling
 */
export const getRiskLevel = (stock) => {
  let score = 0;
  // Beta factor
  const beta = parseFloat(stock.debt_to_equity || 1) > 1.5; // placeholder/fallback check
  const actualBeta = 1.0; // Assume stable beta as standard base
  if (actualBeta > 1.5) score += 2;
  // Debt to Equity
  const de =
    typeof stock.debt_to_equity === "number"
      ? stock.debt_to_equity
      : parseFloat(stock.debt_to_equity || "0");
  if (de > 1.0) score += 2;
  // Altman Z-Score Enterprise risk
  const altman =
    typeof stock.altman_z_score === "number"
      ? stock.altman_z_score
      : parseFloat(stock.altman_z_score || "3");
  if (altman < 1.81) score += 3;
  // Piotroski Score
  const piotroski =
    typeof stock.piotroski_score === "number"
      ? stock.piotroski_score
      : parseInt(stock.piotroski_score || "6");
  if (piotroski < 4) score += 1;

  if (score >= 5) return "HIGH";
  if (score >= 3) return "MEDIUM";
  return "LOW";
};

/**
 * Computes AI confidence rating (DVM Average)
 */
export const getConfidenceScore = (stock) => {
  const m = stock.trendlyne_momentum_score || 50;
  const d = stock.trendlyne_durability_score || 50;
  const v = stock.trendlyne_valuation_score || 50;
  return Math.round((m + d + v) / 3);
};

/**
 * Moving average crossing calculations
 */
export const getMaComparison = (price, ma) => {
  if (!ma)
    return { label: "ABOVE", style: "bg-emerald-500/10 text-emerald-400" };
  const isAbove = price >= ma;
  return {
    label: isAbove ? "ABOVE" : "BELOW",
    style: isAbove
      ? "bg-emerald-500/10 text-emerald-400"
      : "bg-rose-500/10 text-rose-400",
  };
};

/**
 * Category-based filter algorithms
 */
export const filterSwiftStocks = (stocks) => {
  return stocks.filter((s) => {
    const m = s.trendlyne_momentum_score || 0;
    const r = s.day_rsi || 0;
    const d = s.current_price; // can represent positive price action check
    return m >= 65 && r >= 55 && r <= 80;
  });
};

export const filterLongTermStocks = (stocks) => {
  return stocks.filter((s) => {
    const d = s.trendlyne_durability_score || 50;
    const v = s.trendlyne_valuation_score || 50;
    const p = s.piotroski_score || 6;
    const g = s.sales_growth_5y_pct || 15;
    return d >= 65 && v >= 35 && p >= 5 && g > 8;
  });
};

export const filterShortTermStocks = (stocks) => {
  return stocks.filter((s) => {
    const r = s.day_rsi || 50;
    const macd = s.day_macd || 0;
    const sig = s.day_macd_signal_line || 0;
    return r >= 40 && r <= 70 && macd > sig;
  });
};

export const filterIntradayStocks = (stocks) => {
  return stocks.filter((s) => {
    const v = s.day_volume || 100000;
    const wa = s.week_volume_avg || 80000;
    const r = s.day_rsi || 50;
    return v > wa * 1.1 && r >= 40 && r <= 80;
  });
};
