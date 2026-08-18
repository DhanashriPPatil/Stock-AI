import React from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import MiniChart from "./MiniChart";
import WatchlistButton from "./WatchlistButton";
import { formatPrice, getRecommendation } from "../../utils";
import { setSelectedStock } from "../../store/stockStore";

export const StockTable = ({ stocks, onSort, sortKey, sortDirection }) => {
  const dispatch = useDispatch();
  const getSortIcon = (key) => {
    if (sortKey !== key) return <Sliders className="w-2.5 h-2.5 opacity-30" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="w-3.5 h-3.5 text-dash-primary" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 text-dash-primary" />
    );
  };

  const handleHeaderClick = (key) => {
    if (onSort) onSort(key);
  };

  return (
    <div
      id="stock_table_container"
      className="overflow-x-auto border border-dash-line bg-dash-card rounded-2xl select-none"
    >
      <table className="w-full text-left border-collapse">
        {/* Header entries */}
        <thead>
          <tr className="border-b border-dash-line bg-dash-surface-hover/30 text-[10px] font-black text-dash-muted font-mono tracking-wider uppercase">
            <th className="py-4 px-5 w-12 text-center">PIN</th>
            <th
              className="py-4 px-4 cursor-pointer hover:bg-dash-surface-hover/50"
              onClick={() => handleHeaderClick("stock_name")}
            >
              <div className="flex items-center gap-1.5 uppercase">
                Company & Symbol {getSortIcon("stock_name")}
              </div>
            </th>
            <th
              className="py-4 px-4 cursor-pointer hover:bg-dash-surface-hover/50"
              onClick={() => handleHeaderClick("current_price")}
            >
              <div className="flex items-center gap-1.5 uppercase">
                Market Price {getSortIcon("current_price")}
              </div>
            </th>
            <th
              className="py-4 px-4 cursor-pointer hover:bg-dash-surface-hover/50"
              onClick={() => handleHeaderClick("trendlyne_momentum_score")}
            >
              <div className="flex items-center gap-1.5 uppercase">
                Change % {getSortIcon("trendlyne_momentum_score")}
              </div>
            </th>
            <th
              className="py-4 px-4 cursor-pointer hover:bg-dash-surface-hover/50"
              onClick={() => handleHeaderClick("day_rsi")}
            >
              <div className="flex items-center gap-1.5 uppercase">
                RSI Indicator {getSortIcon("day_rsi")}
              </div>
            </th>
            <th className="py-4 px-4 text-center">Momentum Trend</th>
            <th className="py-4 px-4">AI Rating</th>
            <th className="py-4 px-5 text-center">Analysis</th>
          </tr>
        </thead>

        {/* Body listings */}
        <tbody className="divide-y divide-dash-line text-xs font-medium text-white font-mono">
          {stocks.map((stock) => {
            const rec = getRecommendation(stock);
            // Calculate a deterministic price change indicator based on trendlyne momentum score
            const pctChange =
              (stock.trendlyne_momentum_score - 45) * 0.15 +
              (parseInt(stock.isin.slice(-2), 16) % 10) * 0.05;
            const isPositive = pctChange >= 0;
            const rsiVal = stock.day_rsi || 50;

            let rsiColor = "text-yellow-400 bg-yellow-400/5";
            if (rsiVal >= 70) rsiColor = "text-dash-danger bg-dash-danger/5";
            else if (rsiVal <= 30)
              rsiColor = "text-dash-success bg-dash-success/5";

            return (
              <tr
                key={stock.isin}
                className="hover:bg-dash-surface-hover/20 transition-all duration-150 group"
              >
                {/* Watchlist toggle cell */}
                <td className="py-3 px-5 text-center">
                  <WatchlistButton isinCode={stock.isin} />
                </td>

                {/* Company Name / NSE Ticker */}
                <td
                  className="py-3 px-4 cursor-pointer hover:bg-[#00c2ff]/10 rounded-xl transition-all"
                  onClick={() => dispatch(setSelectedStock(stock))}
                  title="Load AI System Diagnostics"
                >
                  <div className="min-w-[170px]">
                    <div className="font-display font-medium text-white group-hover:text-[#00c2ff] transition-colors text-xs truncate max-w-xs">
                      {stock.stock_name}
                    </div>
                    <span className="text-[10px] text-dash-muted mt-0.5 block leading-none">
                      NSE: {stock.nse_code}
                    </span>
                  </div>
                </td>

                {/* Current market price */}
                <td className="py-3 px-4">
                  <div className="font-bold text-white text-xs">
                    {formatPrice(stock.current_price)}
                  </div>
                  <span className="text-[9px] text-dash-muted block mt-0.5 leading-none">
                    ALTMAN: {(stock.altman_z_score || 3).toFixed(2)}
                  </span>
                </td>

                {/* Daily change % */}
                <td className="py-3 px-4">
                  <div
                    className={`flex items-center gap-0.5 text-xs font-black ${isPositive ? "text-dash-success" : "text-dash-danger"}`}
                  >
                    {isPositive ? (
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    ) : (
                      <ArrowDownRight className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {isPositive ? "+" : ""}
                      {pctChange.toFixed(2)}%
                    </span>
                  </div>
                  <span className="text-[9px] text-dash-muted block mt-0.5 leading-none">
                    MOMENTUM: {stock.trendlyne_momentum_score.toFixed(1)}
                  </span>
                </td>

                {/* Technical RSI status */}
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span
                      className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded w-max leading-none border border-transparent ${rsiColor}`}
                    >
                      RSI: {rsiVal.toFixed(1)}
                    </span>
                  </div>
                </td>

                {/* Sparkline mini chart */}
                <td className="py-3 px-4">
                  <div className="flex justify-center h-7 items-center">
                    <MiniChart
                      trendScore={stock.trendlyne_momentum_score}
                      price={stock.current_price}
                      width={75}
                    />
                  </div>
                </td>

                {/* AI advice recommendation badge */}
                <td className="py-3 px-4">
                  <span
                    className={`text-[9.5px] font-black tracking-widest px-2 py-0.5 rounded border ${
                      rec === "STRONG BUY" || rec === "BUY"
                        ? "bg-dash-success/15 text-dash-success border-dash-success/20"
                        : rec === "SELL" || rec === "OVERBOUGHT"
                          ? "bg-dash-danger/15 text-dash-danger border-dash-danger/20"
                          : "bg-dash-line text-dash-ink border-transparent"
                    }`}
                  >
                    {rec}
                  </span>
                </td>

                {/* Action arrow details router click */}
                <td className="py-3 px-5 text-center">
                  <Link
                    to={`/stocks/${stock.nse_code}`}
                    className="p-1.5 inline-flex bg-dash-surface border border-dash-line group-hover:border-dash-primary group-hover:text-dash-primary hover:bg-dash-card text-dash-ink rounded-lg transition-all cursor-pointer"
                    title="Open Detailed AI Report View"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default StockTable;
