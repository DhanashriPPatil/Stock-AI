import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { formatPrice } from "../../utils";

export const StockTicker = () => {
  const stocks = useSelector((state) => state.stocks.stocks) || [];
  const watchlist = useSelector((state) => state.stocks.watchlist) || [];

  const tickerStocks = React.useMemo(() => {
    if (stocks.length === 0) return [];
    // Select a mix of highly active and notable stocks
    return [...stocks]
      .sort((a, b) => b.trendlyne_momentum_score - a.trendlyne_momentum_score)
      .slice(0, 15);
  }, [stocks]);

  if (tickerStocks.length === 0) {
    return (
      <div className="h-9 w-full bg-[#070b19] border-b border-dash-line flex items-center justify-center text-[10px] font-mono text-dash-muted">
        <span className="animate-pulse">LOADING REAL-TIME TICKER STREAM...</span>
      </div>
    );
  }

  // Triple the array to ensure completely seamless scrolling with translate3d(-33.33%)
  const scrollingItems = [...tickerStocks, ...tickerStocks, ...tickerStocks];

  return (
    <div className="h-9 w-full bg-[#070b19]/90 border-b border-dash-line flex items-center overflow-hidden select-none relative z-40 backdrop-blur-sm">
      {/* Absolute Left Label tag */}
      <div className="absolute left-0 top-0 bottom-0 px-2.5 bg-[#0a0f24] hover:bg-dash-primary/10 border-r border-dash-line flex items-center gap-1.5 z-50 text-[9px] font-mono font-black text-dash-primary tracking-widest uppercase transition-colors shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-dash-primary animate-ping" />
        LIVE TRACKS
      </div>

      {/* Marquee scroll container */}
      <div className="pl-[85px] w-full overflow-hidden flex items-center h-full">
        <div className="animate-ticker-marquee flex items-center h-full py-1">
          {scrollingItems.map((stock, i) => {
            const isBullish = stock.trendlyne_momentum_score >= 60 || (stock.day_rsi || 50) > 50;
            const isWatching = watchlist.includes(stock.isin);

            return (
              <Link
                key={`${stock.isin}-${i}`}
                to={`/stocks/${stock.nse_code}`}
                className="flex items-center gap-2 px-4 border-r border-dash-line/40 hover:bg-white/[0.04] transition-all h-full text-xxs font-mono shrink-0 cursor-pointer text-dash-muted hover:text-white"
              >
                {/* Watch indicator */}
                {isWatching && <Star className="w-2.5 h-2.5 text-dash-warning fill-dash-warning animate-pulse shrink-0" />}

                {/* Stock code */}
                <span className="font-bold text-white tracking-wide uppercase">
                  {stock.nse_code}
                </span>

                {/* Price */}
                <span className="font-medium text-white/90">
                  {formatPrice(stock.current_price)}
                </span>

                {/* Sentiment Badge / Delta indicator */}
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    isBullish ? "text-dash-success text-[10px]" : "text-dash-danger text-[10px]"
                  }`}
                >
                  {isBullish ? (
                    <TrendingUp className="w-2.5 h-2.5" />
                  ) : (
                    <TrendingDown className="w-2.5 h-2.5" />
                  )}
                  {stock.trendlyne_momentum_score.toFixed(0)}
                </span>
                
                {/* Small Sector Hint */}
                <span className="text-[9px] text-dash-muted/70 lowercase tracking-normal italic max-w-[80px] truncate">
                  ({stock.sector_name})
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StockTicker;
