import React from "react";
import { useSelector } from "react-redux";
import { RefreshCw } from "lucide-react";
import { motion } from "motion/react";

export const MarketIndicator = () => {
  const stocks = useSelector((state) => state.stocks.stocks);

  const stats = React.useMemo(() => {
    if (stocks.length === 0)
      return {
        bullishPercentage: 0,
        avgRsi: 50,
        avgMomentum: 50,
        marketSentiment: "BALANCED",
      };

    let bullishCount = 0;
    let rsiSum = 0;
    let momentumSum = 0;

    stocks.forEach((stock) => {
      const isBullish =
        stock.day_rsi > 50 || stock.trendlyne_momentum_score > 60;
      if (isBullish) bullishCount++;
      rsiSum += stock.day_rsi || 50;
      momentumSum += stock.trendlyne_momentum_score || 50;
    });

    const bullishPercentage = (bullishCount / stocks.length) * 100;
    const avgRsi = rsiSum / stocks.length;
    const avgMomentum = momentumSum / stocks.length;

    let marketSentiment = "CONSOLIDATION";
    if (bullishPercentage > 65) marketSentiment = "STRONG BULLISH";
    else if (bullishPercentage > 50) marketSentiment = "MILDLY BULLISH";
    else if (bullishPercentage < 35) marketSentiment = "BEARISH OVEREXTENSION";
    else if (bullishPercentage < 50) marketSentiment = "MILDLY BEARISH";

    return {
      bullishPercentage,
      avgRsi,
      avgMomentum,
      marketSentiment,
    };
  }, [stocks]);

  if (stocks.length === 0) {
    return (
      <div className="p-4 glass border border-dash-line rounded-2xl flex items-center justify-center font-mono text-xs">
        <RefreshCw className="w-4 h-4 animate-spin text-dash-primary mr-2" />
        AGGREGATING SECTOR METRICS...
      </div>
    );
  }

  const isPositive = stats.bullishPercentage >= 50;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="p-5 glass-premium rounded-2xl flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black tracking-widest text-dash-muted uppercase font-mono">
            AI Market Sentiment
          </span>
          <span
            className={`text-[9px] font-bold font-mono uppercase px-2 py-0.5 rounded ${
              isPositive
                ? "bg-dash-success/15 text-dash-success border border-dash-success/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                : "bg-dash-danger/15 text-dash-danger border border-dash-danger/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]"
            }`}
          >
            {stats.marketSentiment}
          </span>
        </div>

        {/* Big percentage counter */}
        <div className="mt-4 flex items-baseline gap-2">
          <span className="text-3xl font-black font-mono tracking-tight text-white">
            {stats.bullishPercentage.toFixed(1)}%
          </span>
          <span className="text-xxs text-dash-ink font-mono font-bold uppercase leading-none font-semibold">
            Bullish Equity Bias
          </span>
        </div>

        {/* Visual progress bar bar */}
        <div className="w-full bg-dash-bg border border-dash-line h-2.5 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              isPositive ? "bg-dash-success" : "bg-dash-danger"
            }`}
            style={{ width: `${stats.bullishPercentage}%` }}
          />
        </div>
      </div>

      {/* Grid of underlying averages */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-dash-line font-mono text-xxs">
        <div>
          <span className="text-dash-muted block font-semibold">AVG DAY-RSI:</span>
          <span className="text-xs font-black text-white mt-0.5 block">
            {stats.avgRsi.toFixed(1)}
          </span>
        </div>
        <div>
          <span className="text-dash-muted block font-semibold">AVG MOMENTUM:</span>
          <span className="text-xs font-black text-white mt-0.5 block">
            {stats.avgMomentum.toFixed(1)} pts
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketIndicator;
