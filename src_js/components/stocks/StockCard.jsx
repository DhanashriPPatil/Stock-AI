import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import MiniChart from "./MiniChart";
import WatchlistButton from "./WatchlistButton";
import { formatPrice, getRecommendation } from "../../utils";

export const StockCard = ({ stock }) => {
  const rec = getRecommendation(stock);
  // Calculate a deterministic price change indicator based on trendlyne momentum score
  const pctChange = React.useMemo(() => {
    const scoreVal = stock.trendlyne_momentum_score || 50;
    // Maps 0-100 to about -5.0% to +8.0%
    return (
      (scoreVal - 45) * 0.15 + (parseInt(stock.isin.slice(-2), 16) % 10) * 0.05
    );
  }, [stock]);

  const isPositive = pctChange >= 0;
  const isAltmanSafe = (stock.altman_z_score || 3) > 2.9;

  return (
    <Link to={`/stocks/${stock.nse_code}`} className="block">
      <div className="bg-dash-card border border-dash-line hover:border-dash-primary/40 rounded-xl p-5 hover:bg-dash-surface-hover/30 transition-all duration-200 group relative select-none">
        {/* Watchlist anchor absolute position right top corner */}
        <div className="absolute top-4 right-4 z-10">
          <WatchlistButton isinCode={stock.isin} />
        </div>

        {/* Brand symbol & Title elements */}
        <div>
          <span className="text-[9px] font-black tracking-wider text-dash-muted uppercase font-mono bg-dash-bg px-2 py-0.5 rounded border border-dash-line">
            {stock.nse_code}
          </span>
          <h4 className="text-sm font-black font-display text-white mt-2 truncate max-w-44 leading-tight group-hover:text-dash-primary transition-colors">
            {stock.stock_name}
          </h4>
          <span className="text-[10px] text-dash-ink mt-1 block truncate">
            {stock.sector_name}
          </span>
        </div>

        {/* Middle graph representation Sparklines */}
        <div className="my-4 py-2 flex items-center justify-between border-y border-[rgba(255,255,255,0.04)]">
          <div>
            <span className="text-[10px] text-dash-muted font-mono block leading-none">
              CURRENT:
            </span>
            <span className="text-base font-black font-mono text-white mt-1 block truncate leading-none">
              {formatPrice(stock.current_price)}
            </span>
          </div>
          <div className="h-8 shrink-0 flex items-center">
            <MiniChart
              trendScore={stock.trendlyne_momentum_score}
              price={stock.current_price}
            />
          </div>
        </div>

        {/* Bottom ratings and triggers */}
        <div className="flex items-center justify-between mt-3 font-mono">
          <div className="flex items-center gap-1">
            {isPositive ? (
              <ArrowUpRight className="w-3.5 h-3.5 text-dash-success" />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5 text-dash-danger" />
            )}
            <span
              className={`text-xs font-extrabold ${isPositive ? "text-dash-success" : "text-dash-danger"}`}
            >
              {isPositive ? "+" : ""}
              {pctChange.toFixed(2)}%
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded ${
                rec === "STRONG BUY" || rec === "BUY"
                  ? "bg-dash-success/15 text-dash-success border border-dash-success/20"
                  : rec === "SELL" || rec === "OVERBOUGHT"
                    ? "bg-dash-danger/15 text-dash-danger border border-dash-danger/20"
                    : "bg-dash-line text-dash-ink border border-transparent"
              }`}
            >
              {rec}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;
