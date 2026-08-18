import React, { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowUpRight,
  RefreshCw,
  TrendingUp,
  Sparkles,
  Globe,
  Building2,
} from "lucide-react";
import CategoryCard from "../components/dashboard/CategoryCard";
import MarketIndicator from "../components/dashboard/MarketIndicator";
import NotificationPanel from "../components/dashboard/NotificationPanel";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import StockDiagnosticSidebar from "../components/stocks/StockDiagnosticSidebar";
import { loadStockData } from "../store/stockStore";
import {
  filterSwiftStocks,
  filterLongTermStocks,
  filterShortTermStocks,
  filterIntradayStocks,
  formatPrice,
  getRecommendation,
} from "../utils";
import { Link } from "react-router-dom";
import { motion } from "motion/react";

export const Dashboard = () => {
  const dispatch = useDispatch();
  const { stocks, loading, error, watchlist } = useSelector(
    (state) => state.stocks,
  );

  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(loadStockData());
    }
  }, [stocks, dispatch]);

  const categoryStats = useMemo(() => {
    if (stocks.length === 0) {
      return {
        swift: { count: 0, avgMomentum: 0 },
        longTerm: { count: 0, avgMomentum: 0 },
        shortTerm: { count: 0, avgMomentum: 0 },
        intraday: { count: 0, avgMomentum: 0 },
      };
    }

    const swiftList = filterSwiftStocks(stocks);
    const longTermList = filterLongTermStocks(stocks);
    const shortTermList = filterShortTermStocks(stocks);
    const intradayList = filterIntradayStocks(stocks);

    const calcAvgMomentum = (arr) => {
      if (arr.length === 0) return 0;
      const sum = arr.reduce(
        (acc, curr) => acc + (curr.trendlyne_momentum_score || 50),
        0,
      );
      return sum / arr.length;
    };

    return {
      swift: {
        count: swiftList.length,
        avgMomentum: calcAvgMomentum(swiftList),
      },
      longTerm: {
        count: longTermList.length,
        avgMomentum: calcAvgMomentum(longTermList),
      },
      shortTerm: {
        count: shortTermList.length,
        avgMomentum: calcAvgMomentum(shortTermList),
      },
      intraday: {
        count: intradayList.length,
        avgMomentum: calcAvgMomentum(intradayList),
      },
    };
  }, [stocks]);

  const breakoutLeaders = useMemo(() => {
    return [...stocks]
      .sort((a, b) => b.trendlyne_momentum_score - a.trendlyne_momentum_score)
      .slice(0, 5);
  }, [stocks]);

  if (loading) {
    return <Loader message="Analyzing Stock Market Index..." />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => dispatch(loadStockData())} />
    );
  }

  const gridContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const gridItem = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 25 },
    },
  };

  return (
    <div id="dashboard_page" className="space-y-8 select-none">
      {/* Brand Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-white uppercase">
            AI Quant Trading Terminal
          </h2>
          <p className="text-xs text-dash-ink mt-1">
            Real-time DVM ratings, momentum screening, and Gemini-powered stock
            intelligence reports.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(loadStockData())}
            className="flex items-center gap-2 py-2 px-4 glass hover:border-dash-primary hover:text-white transition-all text-xs font-mono font-bold rounded-lg cursor-pointer shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5 text-dash-primary" />
            Refresh Tickers
          </button>
        </div>
      </motion.div>

      {/* Featured Weekly Wealth Intel Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="relative bg-gradient-to-r from-teal-500/10 via-dash-primary/10 to-transparent border-l-4 border-l-[#00c2ff] border-y-dash-primary/20 border-r-dash-primary/20 hover:border-dash-primary/40 rounded-2xl p-3.5 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 transition-all overflow-hidden group shadow-[0_0_20px_rgba(0,194,255,0.02)]"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-dash-primary/15 border border-dash-primary/30 flex items-center justify-center text-dash-primary shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 animate-pulse text-[#fbbf24]" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono font-black text-[#fbbf24] bg-[#fbbf24]/10 border border-[#fbbf24]/20 py-0.5 px-2 rounded-full tracking-wider">
                Featured Report
              </span>
              <span className="text-[9px] font-mono font-black text-[#00c2ff] bg-[#00c2ff]/10 border border-[#00c2ff]/20 py-0.5 px-2 rounded-full tracking-wider">
                🔬 QUANT ANALYSIS
              </span>
              <span className="text-[9px] font-mono text-dash-muted">
                ISSUE #352 • 9TH MAY, 2026
              </span>
            </div>
            <h3 className="text-xs md:text-sm font-black text-white font-display tracking-wide uppercase">
              Weekly Wealth Intel: Outperformance Indices & Breakouts
            </h3>
            <p className="text-[11px] text-dash-muted max-w-2xl leading-relaxed">
              Explore professional market assessments from Stoxbox: Rotation grids, market breadth DMA trends, and option chains.
              <span className="text-[10px] text-amber-400/85 italic ml-2 font-mono">
                💡 DMA = Daily Moving Average.
              </span>
            </p>
          </div>
        </div>
        <Link
          to="/weekly-wealth"
          className="text-xxs font-black font-mono tracking-widest bg-dash-primary text-black py-2 px-3.5 rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_4px_15px_rgba(0,194,255,0.25)] flex items-center gap-1.5 shrink-0 uppercase self-end md:self-center cursor-pointer"
        >
          Explore <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
        </Link>
      </motion.div>

      {/* Featured World Economy & Market Intel Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative bg-gradient-to-r from-blue-500/10 via-dash-primary/10 to-transparent border border-dash-primary/20 hover:border-dash-primary/40 rounded-2xl p-3.5 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 transition-all overflow-hidden group shadow-[0_0_20px_rgba(0,194,225,0.02)]"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-dash-primary/15 border border-dash-primary/30 flex items-center justify-center text-dash-primary shrink-0 group-hover:scale-105 transition-transform">
            <Globe className="w-5 h-5 text-sky-400 rotate-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono font-black text-sky-400 bg-sky-400/10 border border-sky-400/20 py-0.5 px-2 rounded-full tracking-wider">
                World Economic Intel
              </span>
              <span className="text-[9px] font-mono font-black text-[#00c2ff] bg-[#00c2ff]/10 border border-[#00c2ff]/20 py-0.5 px-2 rounded-full tracking-wider">
                📊 MACRO ANALYSIS
              </span>
              <span className="text-[9px] font-mono text-dash-muted">
                EDITION v3.5 • 14TH MAY, 2026
              </span>
            </div>
            <h3 className="text-xs md:text-sm font-black text-white font-display tracking-wide uppercase">
              Global Inflation Shockwaves, Energy Corridors & Sector Impacts
            </h3>
            <p className="text-[11px] text-dash-muted max-w-2xl leading-relaxed">
              Explore Academic, Research-Style Summaries of global commodity changes: US-Iran choke-points and WPI adjustments.
              <span className="text-[10px] text-sky-400/85 italic ml-2 font-mono">
                💡 WPI = Wholesale Price Index.
              </span>
            </p>
          </div>
        </div>
        <Link
          to="/world-economy"
          className="text-xxs font-black font-mono tracking-widest bg-dash-primary text-black py-2 px-3.5 rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_4px_15px_rgba(0,194,255,0.25)] flex items-center gap-1.5 shrink-0 uppercase self-end md:self-center cursor-pointer"
        >
          Analyze <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
        </Link>
      </motion.div>

      {/* Featured Sector Intel & Commodity Update Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="relative bg-gradient-to-r from-purple-500/10 via-dash-primary/10 to-transparent border border-dash-primary/20 hover:border-dash-primary/40 rounded-2xl p-3.5 md:p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3.5 transition-all overflow-hidden group shadow-[0_0_20px_rgba(0,194,225,0.02)]"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-dash-primary/15 border border-dash-primary/30 flex items-center justify-center text-dash-primary shrink-0 group-hover:scale-105 transition-transform">
            <Building2 className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[9px] font-mono font-black text-purple-400 bg-purple-500/10 border border-purple-400/20 py-0.5 px-2 rounded-full tracking-wider">
                Sector & Commodity Intel
              </span>
              <span className="text-[9px] font-mono font-black text-[#00c2ff] bg-[#00c2ff]/10 border border-[#00c2ff]/20 py-0.5 px-2 rounded-full tracking-wider">
                📈 BI-LATERAL ANALYSIS
              </span>
              <span className="text-[9px] font-mono text-dash-muted">
                UPDATED MID-MAY 2026
              </span>
            </div>
            <h3 className="text-xs md:text-sm font-black text-white font-display tracking-wide uppercase">
              Heavy Metal Supply Choke Points & Advanced IT Decision Sciences
            </h3>
            <p className="text-[11px] text-dash-muted max-w-2xl leading-relaxed">
              Analyze physical metal tightness inside LME backwardation curves, smelter outages, and premium bounds.
              <span className="text-[10px] text-purple-400/85 italic ml-2 font-mono">
                💡 LME = London Metal Exchange.
              </span>
            </p>
          </div>
        </div>
        <Link
          to="/sector-update"
          className="text-xxs font-black font-mono tracking-widest bg-dash-primary text-black py-2 px-3.5 rounded-xl hover:bg-white hover:text-black transition-all shadow-[0_4px_15px_rgba(0,194,225,0.25)] flex items-center gap-1.5 shrink-0 uppercase self-end md:self-center cursor-pointer"
        >
          Analyze <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
        </Link>
      </motion.div>

      {/* Grid: 2x2 Categories Grid */}
      <motion.section
        variants={gridContainer}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={gridItem}>
          <CategoryCard
            id="swift_stock"
            name="Swing Breakouts"
            description="High-velocity momentum stocks breaking through technical caps."
            count={categoryStats.swift.count}
            avgMomentum={categoryStats.swift.avgMomentum}
          />
        </motion.div>

        <motion.div variants={gridItem}>
          <CategoryCard
            id="long_term"
            name="Long Term Core"
            description="High-durability wealth compounders with immaculate balance sheet ledgers."
            count={categoryStats.longTerm.count}
            avgMomentum={categoryStats.longTerm.avgMomentum}
          />
        </motion.div>

        <motion.div variants={gridItem}>
          <CategoryCard
            id="short_term"
            name="Short Term Run"
            description="Strategic swing candidates displaying strong buy MACD crossovers."
            count={categoryStats.shortTerm.count}
            avgMomentum={categoryStats.shortTerm.avgMomentum}
          />
        </motion.div>

        <motion.div variants={gridItem}>
          <CategoryCard
            id="intraday"
            name="LT Opportunity"
            description="Volume-breakout selections displaying aggressive daily transactional spikes."
            count={categoryStats.intraday.count}
            avgMomentum={categoryStats.intraday.avgMomentum}
          />
        </motion.div>
      </motion.section>

      {/* Grid containing primary dashboard content and the diagnostics sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        <div className="xl:col-span-3 space-y-8">
          {/* Secondary Row: Market Sentiment gauge + System notifications */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
            <MarketIndicator />
            <NotificationPanel />
          </section>

          {/* Breakout leaders list footer details */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="p-5 glass-premium rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-dash-line pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <TrendingUp className="w-4.5 h-4.5 text-dash-primary animate-pulse" />
                <h3 className="text-xs font-black tracking-wider uppercase font-display text-white mt-0.5">
                  Breakout Momentum Leaders
                </h3>
              </div>
              <span className="text-[9px] font-mono font-extrabold text-dash-primary">
                NSE REAL-TIME ACCUMULATIONS
              </span>
            </div>

            {stocks.length === 0 ? (
              <div className="py-6 text-center text-xs text-dash-muted font-mono">
                CALIBRATING METRIC INDICES...
              </div>
            ) : (
              <div className="space-y-3.5">
                {breakoutLeaders.map((stock, i) => {
                  const rec = getRecommendation(stock);
                  const isFav = watchlist.includes(stock.isin);
                  return (
                    <div
                      key={stock.isin}
                      className="p-3.5 bg-dash-bg/40 hover:bg-dash-surface-hover/30 border border-dash-line rounded-xl flex flex-wrap items-center justify-between gap-4 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3.5 min-w-[200px]">
                        <span className="w-6 h-6 rounded bg-dash-primary/10 border border-dash-primary/20 flex items-center justify-center font-mono font-black text-xxs text-dash-primary">
                          0{i + 1}
                        </span>
                        <div>
                          <Link
                            to={`/stocks/${stock.nse_code}`}
                            className="font-bold text-white text-xs hover:text-dash-primary transition-colors font-sans"
                          >
                            {stock.stock_name}
                          </Link>
                          <span className="text-[10px] text-dash-muted block font-mono mt-0.5">
                            NSE: {stock.nse_code}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 font-mono text-xxs">
                        <div>
                          <span className="text-dash-muted block leading-none">
                            PE Ratio
                          </span>
                          <span className="text-xs font-semibold text-white mt-1 block">
                            {stock.pe_ttm ? stock.pe_ttm.toFixed(1) : "24"}x
                          </span>
                        </div>
                        <div>
                          <span className="text-dash-muted block leading-none">
                            RSI [14D]
                          </span>
                          <span className="text-xs font-semibold text-white mt-1 block">
                            {stock.day_rsi ? stock.day_rsi.toFixed(1) : "50"}
                          </span>
                        </div>
                        <div>
                          <span className="text-dash-muted block leading-none">
                            MOMENTUM
                          </span>
                          <span className="text-sm font-black text-dash-primary mt-1 block">
                            {stock.trendlyne_momentum_score.toFixed(1)}
                          </span>
                        </div>
                        <div className="hidden sm:block">
                          <span className="text-dash-muted block leading-none">
                            PRICE
                          </span>
                          <span className="text-xs font-bold text-white mt-1 block">
                            {formatPrice(stock.current_price)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9.5px] font-black font-mono tracking-wider px-2 py-0.5 rounded ${
                            rec === "STRONG BUY" || rec === "BUY"
                              ? "bg-dash-success/15 text-dash-success border-dash-success/20 shadow-[0_0_10px_rgba(16,185,129,0.08)]"
                              : "bg-dash-line text-dash-ink"
                          }`}
                        >
                          {rec}
                        </span>
                        <Link
                          to={`/stocks/${stock.nse_code}`}
                          className="text-[10px] font-black font-mono uppercase tracking-widest text-[#00c2ff] hover:underline cursor-pointer"
                        >
                          ANALYZE →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.section>
        </div>

        {/* Sidebar Panel Column */}
        <div className="xl:col-span-1 w-full h-full xl:sticky xl:top-6">
          <StockDiagnosticSidebar />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
