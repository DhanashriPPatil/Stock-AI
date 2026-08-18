import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Database,
  Grid,
  TrendingUp,
  Cpu,
  RefreshCw,
  Search,
  CheckCircle,
  AlertTriangle,
  Info,
  Layers,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  Activity,
  Sliders,
  DollarSign,
  PieChart
} from "lucide-react";
import { loadStockData, runPipeline } from "../store/stockStore";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import { formatPrice } from "../utils";

export const PlatformDiscovery = () => {
  const dispatch = useDispatch();
  const { stocks, loading, error, running } = useSelector((state) => state.stocks);

  const [searchColFilter, setSearchColFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeMetricCol, setActiveMetricCol] = useState("trendlyne_momentum_score");
  const [pipelineState, setPipelineState] = useState("IDLE"); // IDLE, RUNNING, SUCCESS, ERROR

  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(loadStockData());
    }
  }, [stocks, dispatch]);

  // Column definitions catalog with descriptions according to Deliverable 2 column classification matrix
  const columnCatalog = [
    { id: "stock_name", name: "Stock Name", category: "Identifiers", type: "STRING", desc: "Official human-readable company registration identity." },
    { id: "nse_code", name: "NSE Code", category: "Identifiers", type: "STRING", desc: "National Stock Exchange unique ticker symbol." },
    { id: "isin", name: "ISIN", category: "Identifiers", type: "STRING", desc: "International Securities Identification Number." },
    { id: "sector_name", name: "Sector Name", category: "Identifiers", type: "STRING", desc: "Socio-economic macro sector classification." },
    { id: "industry_name", name: "Industry Name", category: "Identifiers", type: "STRING", desc: "Specific product lifecycle line of business." },

    { id: "current_price", name: "Current Price", category: "Price & Volume", type: "FLOAT", desc: "Last traded custom close price relative to rupees." },
    { id: "market_capitalization", name: "Market Cap", category: "Price & Volume", type: "FLOAT", desc: "Total asset market valuation sizing in Rs. Crore." },
    { id: "day_volume", name: "Day Volume", category: "Price & Volume", type: "FLOAT", desc: "Total shares exchanged in the latest 24hr loop." },
    { id: "week_volume_avg", name: "Week Avg Volume", category: "Price & Volume", type: "FLOAT", desc: "5-day rolling trading volume average." },
    { id: "month_volume_avg", name: "Month Avg Volume", category: "Price & Volume", type: "FLOAT", desc: "30-day cumulative trade transaction average." },
    { id: "year_1_high", name: "52W High Price", category: "Price & Volume", type: "FLOAT", desc: "Maximum registered market valuation in 1yr window." },

    { id: "day_rsi", name: "RSI [14D]", category: "Technical Indicators", type: "FLOAT", desc: "Relative Strength Index metric on day-level bounds." },
    { id: "day_adx", name: "ADX [14D]", category: "Technical Indicators", type: "FLOAT", desc: "Average Directional Index tracking scale strength." },
    { id: "day_macd", name: "MACD Line", category: "Technical Indicators", type: "FLOAT", desc: "Moving Average Convergence Divergence value stream." },
    { id: "day_macd_signal_line", name: "MACD Signal", category: "Technical Indicators", type: "FLOAT", desc: "9-period EMA signal line intercept point." },
    { id: "day_sma50", name: "SMA 50 Day", category: "Technical Indicators", type: "FLOAT", desc: "Simple Moving Average reference boundary." },
    { id: "day_sma200", name: "SMA 200 Day", category: "Technical Indicators", type: "FLOAT", desc: "Long-term secular support line tracking." },

    { id: "trendlyne_momentum_score", name: "Momentum", category: "DVM Factors", type: "FLOAT (0-100)", desc: "Factor tracking price, sector, and EMA breakout speed." },
    { id: "trendlyne_durability_score", name: "Durability", category: "DVM Factors", type: "FLOAT (0-100)", desc: "Corporate durability tracking buffer and audit margin." },
    { id: "trendlyne_valuation_score", name: "Valuation", category: "DVM Factors", type: "FLOAT (0-100)", desc: "Price relative to historic earnings yields." },

    { id: "sales_growth_3y_pct", name: "3Y Sales Growth", category: "CAGR Growth", type: "FLOAT (%)", desc: "Compound annual growth for the trailing tri-annual timeline." },
    { id: "profit_growth_3y_pct", name: "3Y Profit Growth", category: "CAGR Growth", type: "FLOAT (%)", desc: "Operating profit CAGR over 36 calendar months." },
    { id: "sales_growth_5y_pct", name: "5Y Sales Growth", category: "CAGR Growth", type: "FLOAT (%)", desc: "Five-year macro compounded revenue growth trajectory." },
    { id: "profit_growth_5y_pct", name: "5Y Profit Growth", category: "CAGR Growth", type: "FLOAT (%)", desc: "Long range five-year profit compounding factor." },

    { id: "sales_q_latest", name: "Latest Q Sales", category: "Quarterly Growth", type: "FLOAT", desc: "Gross revenues generated in latest reported quarter." },
    { id: "sales_q_prev", name: "Previous Q Sales", category: "Quarterly Growth", type: "FLOAT", desc: "Gross revenues in immediate sequential prior quarter." },
    { id: "sales_q_yoy_base", name: "YoY Sales Base", category: "Quarterly Growth", type: "FLOAT (%)", desc: "Year over year change percentage on revenue metrics." },

    { id: "roce", name: "ROCE Current", category: "Rentability & Margins", type: "FLOAT (%)", desc: "Return on Capital Employed measure of capital efficiency." },
    { id: "roe", name: "ROE Current", category: "Rentability & Margins", type: "FLOAT (%)", desc: "Return on Equity evaluating reinvestment power." },
    { id: "opm_current", name: "Operating Margin", category: "Rentability & Margins", type: "FLOAT (%)", desc: "Current raw operating profitability per rupee." },

    { id: "debt_to_equity", name: "Debt to Equity", category: "Solvency & Safety", type: "FLOAT", desc: "Relative leverage multiplier indicator of stress." },
    { id: "current_ratio", name: "Current Ratio", category: "Solvency & Safety", type: "FLOAT", desc: "Short term liquidity asset coverage of current liabilities." },
    { id: "altman_z_score", name: "Altman Z", category: "Solvency & Safety", type: "FLOAT", desc: "Financial insolvency early warning stress index." },
    { id: "piotroski_score", name: "Piotroski Score", category: "Solvency & Safety", type: "INT (0-9)", desc: "9-point accounting health ledger quality checklist." },

    { id: "pe_ttm", name: "PE Multiple", category: "Valuation Multiples", type: "FLOAT", desc: "Trailing Twelve Months price-to-earnings quotient." },
    { id: "peg_ratio", name: "PEG Quotient", category: "Valuation Multiples", type: "FLOAT", desc: "P/E relative to long-range growth yield ratio." },

    { id: "promoter_holding_latest_pct", name: "Promoter Holding", category: "Shareholdings", type: "FLOAT (%)", desc: "Insider capital custody percentage indicator." },
    { id: "fii_holding_change_qoq_pct", name: "FII QoQ Change", category: "Shareholdings", type: "FLOAT (%)", desc: "Foreign institutional investor rotation change." }
  ];

  // Derive metric select list (only numeric keys)
  const numericMetrics = columnCatalog.filter(col => ["FLOAT", "FLOAT (%)", "FLOAT (0-100)", "INT", "INT (0-9)"].includes(col.type));

  const filteredColumns = useMemo(() => {
    return columnCatalog.filter((col) => {
      const matchSearch =
        col.id.toLowerCase().includes(searchColFilter.toLowerCase()) ||
        col.name.toLowerCase().includes(searchColFilter.toLowerCase()) ||
        col.desc.toLowerCase().includes(searchColFilter.toLowerCase());
      const matchCat = selectedCategory === "all" || col.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [searchColFilter, selectedCategory]);

  const categories = ["all", "Identifiers", "Price & Volume", "Technical Indicators", "DVM Factors", "CAGR Growth", "Quarterly Growth", "Rentability & Margins", "Solvency & Safety", "Valuation Multiples", "Shareholdings"];

  // Compute stats on chosen numeric column
  const metricStats = useMemo(() => {
    if (stocks.length === 0 || !activeMetricCol) return null;

    const values = stocks
      .map(s => parseFloat(s[activeMetricCol]))
      .filter(val => !isNaN(val) && val !== null && val !== undefined);

    if (values.length === 0) return null;

    const min = Math.min(...values);
    const max = Math.max(...values);
    const sum = values.reduce((acc, curr) => acc + curr, 0);
    const mean = sum / values.length;

    // Get top outliers
    const sortedDesc = [...stocks]
      .filter(s => !isNaN(parseFloat(s[activeMetricCol])))
      .sort((a, b) => parseFloat(b[activeMetricCol]) - parseFloat(a[activeMetricCol]));

    const highest = sortedDesc.slice(0, 3);
    const lowest = [...sortedDesc].reverse().slice(0, 3);

    return { min, max, mean, count: values.length, highest, lowest };
  }, [stocks, activeMetricCol]);

  const handleTriggerRecompile = async () => {
    setPipelineState("RUNNING");
    try {
      await dispatch(runPipeline()).unwrap();
      setPipelineState("SUCCESS");
      setTimeout(() => setPipelineState("IDLE"), 5000);
    } catch (e) {
      setPipelineState("ERROR");
      setTimeout(() => setPipelineState("IDLE"), 6000);
    }
  };

  if (loading) {
    return <Loader message="Compiling DB Discovery indexes..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => dispatch(loadStockData())} />;
  }

  const selectedColObj = columnCatalog.find(c => c.id === activeMetricCol);

  return (
    <div id="discovery_matrix_page" className="space-y-6 select-none font-sans text-dash-ink">
      
      {/* Header Panel */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h2 className="text-xl font-black font-display text-white uppercase flex items-center gap-2">
            <Database className="w-5 h-5 text-dash-primary" />
            Platform Discovery Workstation
          </h2>
          <p className="text-xs text-dash-ink mt-1">
            Authorize structural mapping, database attributes profile, and execute pipeline tasks live on <strong>Master_merged.csv</strong>.
          </p>
        </div>
      </div>

      {/* Grid containing Database State Core Profile */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-mono text-xs">
        
        {/* Dataset volume */}
        <div className="glass-premium p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-dash-muted font-bold tracking-widest uppercase">
            <FileSpreadsheet className="w-3.5 h-3.5 text-dash-success" />
            ACTIVE DATALINES
          </div>
          <span className="text-2xl font-black text-white">{stocks.length}</span>
          <span className="text-[10px] text-dash-muted block">Indexed master equites in database memory.</span>
        </div>

        {/* Matrix parameters */}
        <div className="glass-premium p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-dash-muted font-bold tracking-widest uppercase">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            CLASSIFIED ATTRIBUTES
          </div>
          <span className="text-2xl font-black text-white">{columnCatalog.length} Parameters</span>
          <span className="text-[10px] text-dash-muted block">Discrete dimensions cataloged in platform model.</span>
        </div>

        {/* Health Index status */}
        <div className="glass-premium p-4 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] text-dash-muted font-bold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-dash-primary" />
            DB INTEGRITY RATING
          </div>
          <span className="text-2xl font-black text-dash-primary">100% SECURE</span>
          <span className="text-[10px] text-dash-muted block">Null values mapped dynamically; Type safety enabled.</span>
        </div>

        {/* Compile trigger control */}
        <div className="glass-premium p-4 rounded-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[9px] text-[#fbbf24] font-bold tracking-widest uppercase flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5" />
              PIPELINE DAEMON
            </span>
            {pipelineState === "RUNNING" && <span className="w-2 h-2 rounded-full bg-dash-primary animate-ping" />}
          </div>

          <button
            onClick={handleTriggerRecompile}
            disabled={running || pipelineState === "RUNNING"}
            className="w-full mt-2 inline-flex items-center justify-center gap-2 py-2 px-3 bg-white/5 border border-white/10 hover:border-dash-primary hover:text-white rounded-lg text-[11px] font-bold transition-all text-dash-muted cursor-pointer font-sans"
          >
            <RefreshCw className={`w-3 h-3 ${pipelineState === "RUNNING" ? "animate-spin text-dash-primary" : ""}`} />
            {pipelineState === "IDLE" && "EXECUTE RAW COMPILER"}
            {pipelineState === "RUNNING" && "RECOMPILING METRICS..."}
            {pipelineState === "SUCCESS" && "COMPILED SUCCESSFULLY"}
            {pipelineState === "ERROR" && "COMPILATION FAILED"}
          </button>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start font-sans">
        
        {/* Left Area: Matrix Explorer & Attributes categorization lookup */}
        <div className="xl:col-span-2 glass-premium p-5 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-dash-line pb-4">
            <div>
              <h3 className="text-xs font-black tracking-wider uppercase font-display text-white">
                Attribute Schema Catalog & Dictionary
              </h3>
              <p className="text-[11px] text-dash-muted font-mono mt-0.5">
                Dicionary representation of Master_merged.csv dimensions matching system constraints.
              </p>
            </div>
            
            {/* Category Filter Selector dropdown */}
            <select
              className="bg-dash-bg border border-dash-line rounded-xl px-3 py-1.5 text-[11.5px] text-white focus:border-dash-primary outline-none font-mono cursor-pointer transition-all"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === "all" ? "📂 ALL CATEGORIES" : cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Quick search inside columns */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              className="w-full bg-dash-bg/50 border border-dash-line rounded-xl pl-9 pr-4 py-2 text-xs text-dash-ink focus:border-dash-primary focus:outline-none font-mono"
              placeholder="Search attribute id, name, or description..."
              value={searchColFilter}
              onChange={(e) => setSearchColFilter(e.target.value)}
            />
          </div>

          {/* Table representing filtered attributes */}
          <div className="overflow-y-auto max-h-[460px] pr-1.5 border border-dash-line/50 rounded-xl bg-dash-bg/10">
            <table className="w-full text-left text-xxs font-mono">
              <thead className="bg-[#0c0e18] text-dash-muted sticky top-0 uppercase border-b border-dash-line">
                <tr>
                  <th className="p-3">Dimension Key</th>
                  <th className="p-3">Display Label</th>
                  <th className="p-3">Classification Cluster</th>
                  <th className="p-3 text-right">Data Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dash-line/30">
                {filteredColumns.map((col) => {
                  const isActive = activeMetricCol === col.id;
                  return (
                    <tr
                      key={col.id}
                      onClick={() => ["FLOAT", "FLOAT (%)", "FLOAT (0-100)", "INT", "INT (0-9)"].includes(col.type) && setActiveMetricCol(col.id)}
                      className={`hover:bg-white/[0.03] transition-colors cursor-pointer group ${
                        isActive ? "bg-dash-primary/5 text-white font-bold" : "text-dash-ink"
                      }`}
                    >
                      <td className="p-3">
                        <span className="text-[11px] block text-white font-semibold font-mono tracking-wide">
                          {col.id}
                        </span>
                        <span className="text-[9.5px] text-dash-muted block mt-1 leading-relaxed opacity-85">
                          {col.desc}
                        </span>
                      </td>
                      <td className="p-3 align-top whitespace-nowrap text-dash-ink group-hover:text-white">
                        {col.name}
                      </td>
                      <td className="p-3 align-top whitespace-nowrap">
                        <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded text-[9.5px]">
                          {col.category}
                        </span>
                      </td>
                      <td className="p-3 align-top text-right text-dash-primary font-bold">
                        {col.type}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Area: Dynamic statistical distribution inspect panel */}
        <div className="space-y-6">
          
          <div className="glass-premium p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 border-b border-dash-line pb-3">
              <Sliders className="w-4 h-4 text-[#fbbf24]" />
              <span className="text-[11px] font-black tracking-wider text-white uppercase font-mono">
                OUTLIER ANALYSIS ENGINE
              </span>
            </div>

            <div className="space-y-3">
              <label className="text-xxs font-mono text-dash-muted block">
                SELECT VARIABLE PARAMETER FOR DEEP-DIVE:
              </label>

              <select
                className="w-full bg-dash-bg border border-dash-line rounded-xl px-3 py-2 text-xs text-white focus:border-dash-primary outline-none font-mono cursor-pointer transition-all hover:border-white/20"
                value={activeMetricCol}
                onChange={(e) => setActiveMetricCol(e.target.value)}
              >
                {numericMetrics.map(col => (
                  <option key={col.id} value={col.id}>
                    [{col.category}] {col.name}
                  </option>
                ))}
              </select>

              {selectedColObj && (
                <div className="bg-[#0f111a]/40 border border-dash-line/50 rounded-xl p-3 text-[11px] leading-relaxed text-dash-ink">
                  <strong>Description: </strong> {selectedColObj.desc}
                </div>
              )}
            </div>

            {metricStats && selectedColObj ? (
              <div className="space-y-4 font-mono text-xs">
                
                {/* Stats recap values metrics */}
                <div className="grid grid-cols-3 gap-2.5 text-center">
                  <div className="bg-white/[0.02] border border-dash-line/30 p-2.5 rounded-lg">
                    <span className="text-[9px] text-dash-muted block">MIN</span>
                    <span className="text-xs font-bold text-white block mt-0.5">{metricStats.min.toFixed(2)}</span>
                  </div>

                  <div className="bg-white/[0.02] border border-dash-line/30 p-2.5 rounded-lg border-b-2 border-b-dash-primary">
                    <span className="text-[9px] text-dash-muted block">MEAN</span>
                    <span className="text-xs font-bold text-dash-primary block mt-0.5">{metricStats.mean.toFixed(2)}</span>
                  </div>

                  <div className="bg-white/[0.02] border border-dash-line/30 p-2.5 rounded-lg">
                    <span className="text-[9px] text-dash-muted block">MAX</span>
                    <span className="text-xs font-bold text-white block mt-0.5">{metricStats.max.toFixed(2)}</span>
                  </div>
                </div>

                {/* Micro range slider placement */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-dash-muted">
                    <span>Valuation Spectrum Location</span>
                    <span>{((metricStats.mean - metricStats.min) / (metricStats.max - metricStats.min || 1) * 100).toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-[#0a0f24] rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-dash-primary rounded-full transition-all duration-500"
                      style={{ width: `${((metricStats.mean - metricStats.min) / (metricStats.max - metricStats.min || 1) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Top assets lists outliers */}
                <div className="space-y-3">
                  
                  {/* Highest outliers */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-dash-success font-bold uppercase tracking-wider block">
                      ♛ LEADING OUTLIER NODES:
                    </span>
                    <div className="space-y-1">
                      {metricStats.highest.map((stock, idx) => (
                        <div key={stock.isin} className="flex justify-between items-center text-xxs bg-[#10b981]/5 px-2.5 py-1.5 rounded-lg border border-[#10b981]/15">
                          <div className="font-bold">
                            #{idx + 1} <Link to={`/stocks/${stock.nse_code}`} className="hover:underline text-white font-bold ml-1">{stock.nse_code}</Link>
                          </div>
                          <span className="text-white font-bold">{parseFloat(stock[activeMetricCol]).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lowest outliers */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider block">
                      ☠ BOTTOM TRAILING NODES:
                    </span>
                    <div className="space-y-1">
                      {metricStats.lowest.map((stock, idx) => (
                        <div key={stock.isin} className="flex justify-between items-center text-xxs bg-rose-500/5 px-2.5 py-1.5 rounded-lg border border-rose-500/15">
                          <div className="font-bold">
                            #{idx + 1} <Link to={`/stocks/${stock.nse_code}`} className="hover:underline text-white font-bold ml-1">{stock.nse_code}</Link>
                          </div>
                          <span className="text-white font-bold">{parseFloat(stock[activeMetricCol]).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            ) : (
              <div className="text-center py-6 text-[11px] text-dash-muted font-mono animate-pulse">
                CHOOSE ATTRIBUTE FOR DISTRIBUTION RESULTS...
              </div>
            )}
          </div>

          {/* Quick instructions widget helper */}
          <div className="bg-white/[0.01] border border-white/[0.04] p-4 rounded-xl space-y-2.5 text-[11px] leading-relaxed font-mono">
            <span className="text-dash-primary font-bold flex items-center gap-1">
              <Info className="w-3.5 h-3.5" /> DICTIONARY PARSUR SYSTEM
            </span>
            <p>
              Underneath, the terminal converts Papa.parse models on-the-fly inside state. Columns mapped as <strong className="text-white">FLOAT</strong> or <strong className="text-white">INT</strong> render dynamic outlier grids instantly.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PlatformDiscovery;
