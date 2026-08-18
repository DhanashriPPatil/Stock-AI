import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Layers,
  Trash2,
  PieChart,
  Shield,
  Activity,
  Sliders,
  TrendingUp,
  Info
} from "lucide-react";
import StockTable from "../components/stocks/StockTable";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import {
  loadStockData,
  toggleWatchlist,
} from "../store/stockStore";
import { formatPrice, getRecommendation } from "../utils";

export const Watchlist = () => {
  const dispatch = useDispatch();
  const { stocks, loading, error, watchlist } = useSelector(
    (state) => state.stocks,
  );

  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(loadStockData());
    }
  }, [stocks, dispatch]);

  const watchlistStocks = useMemo(() => {
    return stocks.filter((s) => watchlist.includes(s.isin));
  }, [stocks, watchlist]);

  const watchlistStats = useMemo(() => {
    if (watchlistStocks.length === 0) return null;

    const count = watchlistStocks.length;

    // Average scores
    const avgMomentum = Math.round(
      watchlistStocks.reduce((sum, s) => sum + (s.trendlyne_momentum_score || 50), 0) / count
    );
    const avgDurability = Math.round(
      watchlistStocks.reduce((sum, s) => sum + (s.trendlyne_durability_score || 50), 0) / count
    );
    const avgValuation = Math.round(
      watchlistStocks.reduce((sum, s) => sum + (s.trendlyne_valuation_score || 50), 0) / count
    );

    // Sector distribution map
    const sectorMap = {};
    watchlistStocks.forEach((s) => {
      const secName = s.sector_name || "Unclassified";
      sectorMap[secName] = (sectorMap[secName] || 0) + 1;
    });

    const sectors = Object.entries(sectorMap)
      .map(([name, val]) => ({
        name,
        count: val,
        percentage: Math.round((val / count) * 100),
      }))
      .sort((a, b) => b.count - a.count);

    // Piotroski safety assessment
    const avgPiotroski = (
      watchlistStocks.reduce((sum, s) => sum + (s.piotroski_score || 0), 0) / count
    ).toFixed(1);

    // Recommendation count metrics
    let buyCount = 0;
    let sellCount = 0;
    let holdCount = 0;
    watchlistStocks.forEach((s) => {
      const rec = getRecommendation(s);
      if (rec === "BUY" || rec === "STRONG BUY") buyCount++;
      else if (rec === "SELL") sellCount++;
      else holdCount++;
    });

    return {
      avgMomentum,
      avgDurability,
      avgValuation,
      sectors,
      avgPiotroski,
      signals: { buyCount, sellCount, holdCount },
    };
  }, [watchlistStocks]);

  if (loading) {
    return <Loader message="Accessing favorites watchlist..." />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => dispatch(loadStockData())} />
    );
  }

  return (
    <div
      id="watchlist_page_container"
      className="space-y-6 select-none animate-fadeIn font-sans"
    >
      {/* Header section with back link */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 border border-dash-line bg-dash-card text-dash-ink hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-black font-display text-white uppercase flex items-center gap-2">
              <Star className="w-5 h-5 text-dash-warning fill-dash-warning animate-pulse" />
              Watchlist Core Terminal
            </h2>
            <p className="text-xs text-dash-ink mt-1">
              Track custom entries compiled from the momentum breakout grids or
              value shortlists.
            </p>
          </div>
        </div>
      </div>

      {watchlistStocks.length === 0 ? (
        /* Empty watchlist display */
        <div className="p-12 text-center border border-dash-line bg-dash-card rounded-2xl">
          <Layers className="w-9 h-9 text-dash-muted mx-auto mb-3 animate-pulse" />
          <h4 className="text-sm font-black font-mono text-white uppercase">
            Your Watchlist Is Empty
          </h4>
          <p className="text-xs text-dash-muted mt-2 max-w-sm mx-auto leading-relaxed">
            Pin equities from the Main Dashboard, Intraday Breakout lists, or
            category screeners using the star checkboxes.
          </p>
          <div className="mt-5">
            <Link
              to="/"
              className="py-2.5 px-5 bg-dash-primary hover:bg-dash-primary-dark text-dash-bg font-black text-[10.5px] uppercase tracking-widest rounded-lg transition-all inline-block font-mono"
            >
              BROWSE UNIVERSAL TRACKS
            </Link>
          </div>
        </div>
      ) : (
        /* Watched Stocks Table & Analytics cockpit */
        <div className="space-y-6">
          
          {/* Idea 2: Interactive Smart Watchlist Analytics Suite! */}
          {watchlistStats && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Avg DVM Quality Indicators */}
              <div className="glass-premium p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-dash-line pb-3">
                  <Sliders className="w-4 h-4 text-dash-primary" />
                  <span className="text-[11px] font-black tracking-wider text-white uppercase font-mono">
                    AVERAGE TUNING COEFFICIENTS
                  </span>
                </div>
                
                <div className="space-y-3 font-mono text-xs">
                  {/* Durability score indicator */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-dash-muted">Durability Rating (Quality)</span>
                      <span className="text-dash-success font-bold">{watchlistStats.avgDurability}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0a0f24] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-dash-success rounded-full transition-all duration-500"
                        style={{ width: `${watchlistStats.avgDurability}%` }}
                      />
                    </div>
                  </div>

                  {/* Valuation score indicator */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-dash-muted">Valuation Tuning (Price)</span>
                      <span className="text-[#fbbf24] font-bold">{watchlistStats.avgValuation}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0a0f24] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#fbbf24] rounded-full transition-all duration-500"
                        style={{ width: `${watchlistStats.avgValuation}%` }}
                      />
                    </div>
                  </div>

                  {/* Momentum score indicator */}
                  <div>
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="text-dash-muted">Momentum Impulse Factor</span>
                      <span className="text-dash-primary font-bold">{watchlistStats.avgMomentum}/100</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#0a0f24] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-dash-primary rounded-full transition-all duration-500"
                        style={{ width: `${watchlistStats.avgMomentum}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sector Diversification Weights */}
              <div className="glass-premium p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-dash-line pb-3">
                  <PieChart className="w-4 h-4 text-purple-400" />
                  <span className="text-[11px] font-black tracking-wider text-white uppercase font-mono">
                    DIVERSIFICATION SPECTRUM
                  </span>
                </div>
                
                <div className="space-y-2.5 max-h-[145px] overflow-y-auto pr-1">
                  {watchlistStats.sectors.slice(0, 3).map((item, i) => (
                    <div key={item.name} className="space-y-1 font-mono text-[11px]">
                      <div className="flex justify-between text-dash-muted">
                        <span className="truncate max-w-[170px] font-bold">{item.name}</span>
                        <span className="text-white font-bold">{item.percentage}% ({item.count} eq)</span>
                      </div>
                      <div className="h-1 bg-[#0a0f24] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            i === 0 ? "bg-purple-500" : i === 1 ? "bg-cyan-500" : "bg-teal-500"
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                  {watchlistStats.sectors.length > 3 && (
                    <div className="text-[10px] text-dash-ink font-mono italic text-center pt-1">
                      + {watchlistStats.sectors.length - 3} other sectors in asset mix
                    </div>
                  )}
                </div>
              </div>

              {/* Watchlist Pulse & Alerts Radar */}
              <div className="glass-premium p-5 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-dash-line pb-3">
                  <Activity className="w-4 h-4 text-[#fbbf24]" />
                  <span className="text-[11px] font-black tracking-wider text-white uppercase font-mono">
                    WATCHLIST SENTIMENT RADAR
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 font-mono">
                  <div className="bg-[#0f111a]/50 border border-dash-line/50 p-3 rounded-xl space-y-1">
                    <span className="text-[9px] text-dash-muted block">BULLISH NODES</span>
                    <span className="text-lg font-black text-dash-primary block">
                      {watchlistStats.signals.buyCount} <span className="text-xxs font-normal text-dash-muted">Buy/Stg</span>
                    </span>
                  </div>

                  <div className="bg-[#0f111a]/50 border border-dash-line/50 p-3 rounded-xl space-y-1">
                    <span className="text-[9px] text-dash-muted block">HOLD OR RED ZONE</span>
                    <span className="text-lg font-black text-rose-400 block">
                      {watchlistStats.signals.holdCount + watchlistStats.signals.sellCount} <span className="text-xxs font-normal text-dash-muted">Wait</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-[#00c2ff]/5 border border-[#00c2ff]/10 rounded-xl p-2.5 text-[10.5px] font-mono leading-relaxed text-dash-muted">
                  <Shield className="w-3.5 h-3.5 text-dash-primary shrink-0" />
                  <div>
                    Piotroski Quality Index is <strong className="text-white">{watchlistStats.avgPiotroski}/9</strong>. Perfect safety buffer.
                  </div>
                </div>
              </div>

            </div>
          )}

          <div className="flex justify-between items-center text-[10.5px] font-mono text-dash-muted pt-2">
            <span>TRACKING {watchlistStocks.length} ROOT NODE EQUITIES:</span>
            <span>STORE SYNC: SECURE</span>
          </div>

          <div className="border border-dash-line bg-dash-card rounded-2xl overflow-hidden">
            <StockTable stocks={watchlistStocks} />
          </div>

          {/* Quick grid view details with beautiful stats indicators */}
          <div className="pt-4 space-y-3">
            <span className="text-[10px] font-black font-mono text-dash-muted uppercase tracking-wider block">
              Watchlist Speed Index:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistStocks.map((stock) => {
                const rec = getRecommendation(stock);
                const isBullish = rec === "BUY" || rec === "STRONG BUY";
                return (
                  <div
                    key={stock.isin}
                    className="p-4 bg-dash-card border border-dash-line hover:border-dash-primary/30 rounded-xl flex items-center justify-between gap-4 transition-all duration-200"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/stocks/${stock.nse_code}`}
                          className="font-bold text-sm text-white hover:text-dash-primary transition-colors truncate"
                        >
                          {stock.nse_code}
                        </Link>
                        <span
                          className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded border ${
                            isBullish
                              ? "bg-dash-success/10 text-dash-success border-dash-success/20"
                              : "bg-dash-ink/20 text-dash-ink border-dash-line"
                          }`}
                        >
                          {rec}
                        </span>
                      </div>
                      <span className="text-[10px] text-dash-ink block truncate mt-1 leading-none">
                        {stock.stock_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-black text-white block leading-none">
                          {formatPrice(stock.current_price)}
                        </span>
                        <span className="text-[9px] text-[#00c2ff] block mt-1 leading-none font-bold">
                          MOM: {stock.trendlyne_momentum_score.toFixed(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => dispatch(toggleWatchlist(stock.isin))}
                        className="p-2 border border-dash-line bg-dash-bg hover:border-dash-danger hover:text-dash-danger transition-colors rounded-lg cursor-pointer text-dash-muted"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
