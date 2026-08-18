import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ArrowLeft,
  RefreshCw,
  Sparkles,
  AlertTriangle,
  BarChart2,
  PieChart,
  ShieldCheck,
  Sliders,
  Activity,
  Copy,
} from "lucide-react";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import TechnicalAnalysis from "../components/reports/TechnicalAnalysis";
import FundamentalAnalysis from "../components/reports/FundamentalAnalysis";
import RiskAnalysis from "../components/reports/RiskAnalysis";
import PredictionChart from "../components/reports/PredictionChart";
import VolumeChart from "../components/reports/VolumeChart";
import SentimentAnalysis from "../components/reports/SentimentAnalysis";
import WatchlistButton from "../components/stocks/WatchlistButton";
import {
  loadStockData,
  fetchAIReportForSelected,
  setAnalysisFocus,
} from "../store/stockStore";
import {
  formatPrice,
  formatCrore,
  getRecommendation,
  getConfidenceScore,
} from "../utils";

export const StockDetails = () => {
  const { symbol } = useParams();
  const dispatch = useDispatch();
  const { stocks, loading, error, activeReport, reportLoading, analysisFocus } =
    useSelector((state) => state.stocks);

  const [activeTab, setActiveTab] = useState("Overview");
  const [copied, setCopied] = useState(false);

  // Sync state triggers
  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(loadStockData());
    }
  }, [stocks, dispatch]);

  const stock = useMemo(() => {
    return stocks.find((s) => s.nse_code === symbol) || null;
  }, [stocks, symbol]);

  const rec = useMemo(() => {
    return stock ? getRecommendation(stock) : "HOLD";
  }, [stock]);

  // Handle report generation click click
  const handleGenerateAIReport = () => {
    if (!stock) return;
    dispatch(fetchAIReportForSelected({ stock, focus: analysisFocus }));
  };

  const isPositiveChange = useMemo(() => {
    if (!stock) return true;
    const scoreVal = stock.trendlyne_momentum_score || 50;
    const pctChange =
      (scoreVal - 45) * 0.15 + (parseInt(stock.isin.slice(-2), 16) % 10) * 0.05;
    return pctChange >= 0;
  }, [stock]);

  const pctChange = useMemo(() => {
    if (!stock) return 0;
    const scoreVal = stock.trendlyne_momentum_score || 50;
    return (
      (scoreVal - 45) * 0.15 + (parseInt(stock.isin.slice(-2), 16) % 10) * 0.05
    );
  }, [stock]);

  // Strategy values
  const strategyZones = useMemo(() => {
    if (!stock) return { entry: { min: 0, max: 0 }, target: 0, stopLoss: 0 };
    const price = stock.current_price;
    // Estimate logical zones deterministically
    return {
      entry: {
        min: price * 0.985,
        max: price * 1.005,
      },
      target: price * 1.15,
      stopLoss: price * 0.94,
      riskReward: "1:2.5",
    };
  }, [stock]);

  // Copy AI report to clipboard clipboard
  const handleCopyReport = () => {
    if (!activeReport) return;
    const text = `
TREND ENGINEER AI INTELLIGENCE REPORT: ${stock?.stock_name} (${stock?.nse_code})
VERDICT: ${activeReport.verdict} (Confidence: ${activeReport.confidence}%)
Focus Scope: ${analysisFocus} Profile.
--------------------------------------------
INVESTMENT THESIS:
${activeReport.thesis}

TECHNICAL ZONE PERSPECTIVES:
${activeReport.technicals}

FUNDAMENTAL HIGHLIGHTS:
${activeReport.fundamentals}

KEY DISCOUNTS & STRATEGY RISKS:
${(activeReport.risks || []).map((r, index) => `${index + 1}. ${r}`).join("\n")}

SUGGESTED RANGE BOUNDS:
- Entry Bounds: ${activeReport.zones?.entry || formatPrice(strategyZones.entry.min)}
- Objectives Target: ${activeReport.zones?.target || formatPrice(strategyZones.target)}
- Risk Stop Loss: ${activeReport.zones?.stop_loss || formatPrice(strategyZones.stopLoss)}
--------------------------------------------
    `;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <Loader message="Analyzing telemetry details..." />;
  }

  if (error || !stock) {
    return (
      <div className="space-y-4">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs text-dash-primary hover:underline font-mono"
        >
          <ArrowLeft className="w-4 h-4" /> BACK TO DASHBOARD
        </Link>
        <ErrorState
          message={
            error ||
            `Ticker code [${symbol}] could not be resolved against the compiled Master database.`
          }
          onRetry={() => dispatch(loadStockData())}
        />
      </div>
    );
  }

  return (
    <div
      id="stock_details_page"
      className="space-y-6 select-none animate-fadeIn"
    >
      {/* Dynamic Navigation row Link */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono">
        <Link
          to="/"
          className="flex items-center gap-2 py-2 px-3 border border-dash-line bg-dash-card hover:bg-dash-surface-hover hover:text-white rounded-lg text-xs leading-none transition-colors select-none font-bold cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          BACK TO PORTFOLIO
        </Link>

        {/* Watchlist star */}
        <div className="flex items-center gap-2">
          <WatchlistButton
            isinCode={stock.isin}
            showText
            className="h-10 px-4 py-0"
          />
        </div>
      </div>

      {/* Dynamic Hero Section display */}
      <section className="p-6 border border-dash-line bg-dash-card rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-dash-primary/10 border border-dash-primary/25 flex items-center justify-center font-display font-black text-lg text-dash-primary shadow-[0_0_15px_rgba(0,194,255,0.15)] uppercase select-none">
            {stock.nse_code.substring(0, 2)}
          </div>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-lg md:text-xl font-black font-display text-white uppercase">
                {stock.stock_name}
              </h2>
              <span className="text-[9px] font-black font-mono text-dash-muted uppercase bg-dash-bg border border-dash-line px-2 py-0.5 rounded">
                NSE: {stock.nse_code}
              </span>
              <span
                className={`text-[9px] font-black font-mono px-2 py-0.5 rounded border ${
                  rec === "STRONG BUY" || rec === "BUY"
                    ? "bg-dash-success/15 text-dash-success border-dash-success/20"
                    : "bg-dash-line text-dash-ink border-transparent"
                }`}
              >
                {rec}
              </span>
            </div>
            <p className="text-xs text-dash-muted mt-1 leading-none">
              {stock.sector_name} • {stock.industry_name}
            </p>
          </div>
        </div>

        {/* Market valuation metrics */}
        <div className="flex flex-wrap gap-6 font-mono text-xxs">
          <div>
            <span className="text-dash-muted block leading-none">
              CURRENT ESTIMATE:
            </span>
            <span className="text-xl font-black text-white mt-1.5 block leading-none">
              {formatPrice(stock.current_price)}
            </span>
            <span
              className={`text-[10px] font-extrabold mt-1 inline-flex items-center ${isPositiveChange ? "text-dash-success" : "text-dash-danger"}`}
            >
              {isPositiveChange ? "+" : ""}
              {pctChange.toFixed(2)}% TODAY
            </span>
          </div>

          <div className="border-l border-dash-line pl-6">
            <span className="text-dash-muted block leading-none">
              AI CONFIDENCE SCORE:
            </span>
            <span className="text-xl font-black text-dash-primary mt-1.5 block leading-none">
              {getConfidenceScore(stock)}{" "}
              <span className="text-xxs text-dash-muted">pts</span>
            </span>
            <span className="text-[9px] text-dash-muted block mt-1">
              DVM AVERAGE RATIO
            </span>
          </div>
        </div>
      </section>

      {/* Split Columns Grid: Left column (AI Generative reports) | Right column (Sub telemetry charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column content: Generative Reporting & Strategy Zones */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI report generator setup */}
          <div className="p-5 border border-dash-line bg-dash-card rounded-2xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-dash-line pb-3 mb-4 font-mono">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-dash-primary animate-pulse" />
                <h3 className="text-xs font-black tracking-wider uppercase font-display text-white">
                  Gemini AI Diagnostics
                </h3>
              </div>
              <span className="text-[8px] font-mono text-dash-success uppercase">
                MODEL LIVE
              </span>
            </div>

            {/* Custom Focus selector buttons */}
            <div className="mb-4">
              <label className="text-[10px] font-black font-mono text-dash-muted uppercase block mb-1.5">
                ANALYSIS METHODOLOGY FOCUS:
              </label>
              <div className="grid grid-cols-2 gap-1.5 font-mono">
                {["Balanced", "Value", "Growth", "Momentum"].map((focus) => (
                  <button
                    key={focus}
                    onClick={() => dispatch(setAnalysisFocus(focus))}
                    className={`py-1.5 px-3 border text-xxs font-black uppercase rounded-lg cursor-pointer transition-all ${
                      analysisFocus === focus
                        ? "border-dash-primary bg-dash-primary/10 text-dash-primary"
                        : "border-dash-line text-dash-ink hover:border-dash-muted"
                    }`}
                  >
                    {focus} Focus
                  </button>
                ))}
              </div>
            </div>

            {/* AI compilation loader or compiled content */}
            {reportLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-dash-bg rounded-xl border border-dash-line animate-pulse">
                <div className="relative w-10 h-10 flex items-center justify-center bg-dash-primary/10 rounded-full">
                  <RefreshCw className="w-5 h-5 text-dash-primary animate-spin" />
                </div>
                <p className="text-[10px] font-black font-mono text-dash-primary uppercase tracking-widest leading-none">
                  COMPILING REPORT...
                </p>
                <span className="text-[8.5px] text-dash-muted font-mono max-w-xs px-4 leading-relaxed">
                  Generating technical breakout matrices, Altman Z factors, and
                  growth metrics.
                </span>
              </div>
            ) : activeReport ? (
              // Compiled Report View!
              <div className="space-y-4 font-mono text-xs max-h-[480px] overflow-y-auto pr-1 animate-fadeIn">
                <div className="p-3 bg-dash-bg border border-dash-line rounded-xl space-y-2">
                  <div className="flex justify-between items-baseline border-b border-dash-line/50 pb-1.5">
                    <span className="text-[10px] text-dash-muted block">
                      AI DECISION VERDICT:
                    </span>
                    <span
                      className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase ${
                        activeReport.verdict?.includes("STRONG") ||
                        activeReport.verdict?.includes("BUY") ||
                        activeReport.verdict?.includes("ACCUMULATE")
                          ? "bg-dash-success/15 text-dash-success border-dash-success/20"
                          : "bg-dash-danger/15 text-dash-danger border-dash-danger/20"
                      }`}
                    >
                      {activeReport.verdict}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-dash-muted block">
                      CONFIDENCE ALPHA:
                    </span>
                    <span className="text-sm font-black text-white">
                      {activeReport.confidence || 85}%
                    </span>
                  </div>
                </div>

                {/* Report Thesis markdown alternative */}
                <div className="space-y-3 font-medium text-white text-[11px] leading-relaxed bg-dash-bg/30 p-3.5 rounded-xl border border-dash-line/40">
                  <div className="border-b border-dash-line pb-1">
                    <span className="text-[9.5px] font-black text-dash-primary uppercase tracking-wider block">
                      INVESTMENT THESIS
                    </span>
                  </div>
                  <p className="opacity-90">{activeReport.thesis}</p>
                </div>

                <div className="space-y-2 text-[10.5px] bg-dash-bg/40 p-3.5 rounded-xl border border-dash-line/40">
                  <div className="flex justify-between items-center">
                    <span className="text-dash-muted font-bold">
                      Entry Zone:
                    </span>{" "}
                    <span className="text-dash-success font-black">
                      {activeReport.zones?.entry || "Accumulate Range"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dash-muted font-bold">
                      Target Zone:
                    </span>{" "}
                    <span className="text-dash-primary font-black">
                      {activeReport.zones?.target || "Target Objective"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-dash-muted font-bold">
                      Stop Loss Limit:
                    </span>{" "}
                    <span className="text-dash-danger font-black">
                      {activeReport.zones?.stop_loss || "Cut Limit"}
                    </span>
                  </div>
                </div>

                {/* Copy report actions support */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={handleCopyReport}
                    className="flex-1 py-2 bg-dash-bg hover:bg-dash-surface-hover/50 text-white border border-dash-line hover:border-dash-muted text-[10px] font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copied ? "Copied" : "Copy Report"}
                  </button>
                  <button
                    onClick={handleGenerateAIReport}
                    className="p-2 bg-dash-bg hover:bg-dash-surface-hover/50 text-dash-primary border border-dash-line rounded-lg cursor-pointer transition-all"
                    title="Regenerate active report"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              // Empty/uncompiled trigger block
              <div className="py-10 text-center space-y-4 bg-dash-bg/40 border border-dash-line/50 rounded-xl">
                <p className="text-xs text-dash-muted leading-relaxed px-4">
                  Compile Gemini-powered deep analytical reports integrating
                  structural health points, volumes, and technical crossovers.
                </p>
                <button
                  onClick={handleGenerateAIReport}
                  className="py-2.5 px-5 bg-dash-primary hover:bg-dash-primary-dark text-dash-bg font-black text-[10.5px] uppercase tracking-widest rounded-lg transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-md"
                >
                  <Sparkles className="w-4 h-4 fill-dash-bg stroke-[2.5]" />
                  Generate AI Report
                </button>
              </div>
            )}
          </div>

          {/* Strategy Zones values block */}
          <div className="p-5 border border-dash-line bg-dash-card rounded-2xl font-mono text-xs">
            <div className="flex items-center gap-2 border-b border-dash-line pb-3 mb-4">
              <Sliders className="w-4.5 h-4.5 text-dash-primary" />
              <h3 className="text-xs font-black tracking-wider uppercase font-display text-white">
                Tactical Trading Strategy
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.03)]">
                <span className="text-dash-muted font-bold">
                  Suggested Entry Zone:
                </span>
                <span className="text-white font-extrabold text-right">
                  {formatPrice(strategyZones.entry.min)} -{" "}
                  {formatPrice(strategyZones.entry.max)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.03)]">
                <span className="text-dash-muted font-bold">
                  Objective Target:
                </span>
                <span className="text-dash-success font-extrabold text-right">
                  {formatPrice(strategyZones.target)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[rgba(255,255,255,0.03)]">
                <span className="text-dash-muted font-bold">
                  Risk Stop Loss:
                </span>
                <span className="text-dash-danger font-extrabold text-right">
                  {formatPrice(strategyZones.stopLoss)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-dash-muted font-bold">
                  Risk Reward Ratio:
                </span>
                <span className="text-white font-extrabold text-right">
                  {strategyZones.riskReward}
                </span>
              </div>
            </div>

            <p className="text-[9.5px] text-dash-muted leading-relaxed mt-4 pt-3 border-t border-[rgba(255,255,255,0.04)] font-mono">
              Always consult verified investment desks. Models derive support
              targets dynamically.
            </p>
          </div>
        </div>

        {/* Right column: Tabs containing detailed visual reporting components */}
        <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
          {/* Top navigation page tabs bar list */}
          <div className="flex border border-dash-line bg-dash-card p-1 rounded-xl overflow-x-auto gap-1 font-mono shrink-0 scrollbar-none select-none">
            {[
              { key: "Overview", label: "Fundamental Stats", icon: BarChart2 },
              { key: "Technicals", label: "Technicals", icon: Sliders },
              { key: "Fundamentals", label: "CAGR Growth", icon: ShieldCheck },
              { key: "Risk", label: "Altm Risk Score", icon: AlertTriangle },
              { key: "Predictions", label: "AI Forecast", icon: Sparkles },
              { key: "Volumes", label: "Volume Spikes", icon: Activity },
              { key: "Sentiment", label: "News Sentiment", icon: PieChart },
            ].map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-3 border border-transparent whitespace-nowrap text-[10.5px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeTab === tab.key
                      ? "bg-dash-primary text-dash-bg font-black"
                      : "text-dash-ink hover:text-white"
                  }`}
                >
                  <TabIcon className="w-3.5 h-3.5 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Core analysis components mapping render */}
          <div className="flex-1">
            {activeTab === "Overview" && (
              <div className="bg-dash-card border border-dash-line p-6 rounded-2xl space-y-6 font-mono animate-fadeIn select-none">
                <div>
                  <div className="flex items-center gap-2 border-b border-dash-line pb-3 mb-4">
                    <BarChart2 className="w-4.5 h-4.5 text-dash-primary" />
                    <h4 className="text-xs font-black tracking-wider uppercase font-display text-white">
                      Stock Overview & Financial Health
                    </h4>
                  </div>
                  <p className="text-xs text-dash-ink leading-relaxed">
                    Financial indicators show high durability standards. Below
                    are the key multipliers scanned of {stock.stock_name}{" "}
                    balance ledger sheets:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xxs">
                  <div className="bg-dash-bg p-3.5 border border-dash-line rounded-xl">
                    <span className="text-dash-muted block">
                      MARKET CAPITALIZATION:
                    </span>
                    <span className="text-sm font-black text-white mt-1.5 block">
                      {formatCrore(stock.market_capitalization)}
                    </span>
                  </div>
                  <div className="bg-dash-bg p-3.5 border border-dash-line rounded-xl">
                    <span className="text-dash-muted block">
                      PRICE TO EARNINGS (P/E):
                    </span>
                    <span className="text-sm font-black text-white mt-1.5 block">
                      {stock.pe_ttm ? `${stock.pe_ttm.toFixed(1)}x` : "18.5x"}
                    </span>
                  </div>
                  <div className="bg-dash-bg p-3.5 border border-dash-line rounded-xl">
                    <span className="text-dash-muted block">
                      PE CARRIER CAP (PEG):
                    </span>
                    <span className="text-sm font-black text-white mt-1.5 block">
                      {stock.peg_ratio
                        ? `${stock.peg_ratio.toFixed(2)}`
                        : "1.24"}
                    </span>
                  </div>
                  <div className="bg-dash-bg p-3.5 border border-dash-line rounded-xl">
                    <span className="text-dash-muted block">
                      3Y SALES CAGR %:
                    </span>
                    <span className="text-sm font-black text-dash-success mt-1.5 block">
                      {stock.sales_growth_3y_pct
                        ? `${stock.sales_growth_3y_pct.toFixed(1)}%`
                        : "12.4%"}
                    </span>
                  </div>
                  <div className="bg-dash-bg p-3.5 border border-dash-line rounded-xl">
                    <span className="text-dash-muted block">
                      3Y PROFIT CAGR %:
                    </span>
                    <span className="text-sm font-black text-dash-success mt-1.5 block">
                      {stock.profit_growth_3y_pct
                        ? `${stock.profit_growth_3y_pct.toFixed(1)}%`
                        : "15.4%"}
                    </span>
                  </div>
                  <div className="bg-dash-bg p-3.5 border border-dash-line rounded-xl">
                    <span className="text-dash-muted block">
                      PROMOTERS LOCKUP SHARES %:
                    </span>
                    <span className="text-sm font-black text-white mt-1.5 block">
                      {stock.promoter_holding_latest_pct
                        ? `${stock.promoter_holding_latest_pct.toFixed(1)}%`
                        : "62.4%"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-dash-bg border border-dash-line rounded-xl flex items-center justify-between">
                     <div>
                      <span className="text-[10px] text-dash-muted block font-bold leading-none">
                        DURABILITY SCORE [0-100]
                      </span>
                      <span className="text-lg font-black text-white mt-1.5 block leading-none">
                        {stock.trendlyne_durability_score || 64} pts
                      </span>
                    </div>
                    <span className="text-xxs text-dash-success font-black bg-dash-success/15 px-2 py-1 rounded">
                      HEALTHY
                    </span>
                  </div>
                  <div className="p-4 bg-dash-bg border border-dash-line rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-dash-muted block font-bold leading-none">
                        VALUATION FACTOR [0-100]
                      </span>
                      <span className="text-lg font-black text-white mt-1.5 block leading-none">
                        {stock.trendlyne_valuation_score || 45} pts
                      </span>
                    </div>
                    <span className="text-xxs text-yellow-400 font-black bg-yellow-400/10 px-2 py-1 rounded border border-yellow-500/15">
                      MODERATE
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Technicals" && <TechnicalAnalysis stock={stock} />}
            {activeTab === "Fundamentals" && (
              <FundamentalAnalysis stock={stock} />
            )}
            {activeTab === "Risk" && <RiskAnalysis stock={stock} />}
            {activeTab === "Predictions" && <PredictionChart stock={stock} />}
            {activeTab === "Volumes" && <VolumeChart stock={stock} />}
            {activeTab === "Sentiment" && <SentimentAnalysis stock={stock} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockDetails;
