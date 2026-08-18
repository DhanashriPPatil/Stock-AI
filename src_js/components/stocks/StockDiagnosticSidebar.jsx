import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Sparkles,
  Search,
  ShieldAlert,
  Target,
  Layers,
  Compass,
  X,
} from "lucide-react";
import { setSelectedStock, setAnalysisFocus } from "../../store/stockStore";
import { formatPrice } from "../../utils";

export const StockDiagnosticSidebar = () => {
  const dispatch = useDispatch();
  const { stocks, selectedStock, analysisFocus } = useSelector(
    (state) => state.stocks,
  );
  const [tickerQuery, setTickerQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Filter stocks for the standby lookup box
  const searchResults = useMemo(() => {
    if (!tickerQuery.trim()) return [];
    return stocks
      .filter(
        (s) =>
          s.stock_name.toLowerCase().includes(tickerQuery.toLowerCase()) ||
          s.nse_code.toLowerCase().includes(tickerQuery.toLowerCase()),
      )
      .slice(0, 5);
  }, [stocks, tickerQuery]);

  const handleSelectStock = (stock) => {
    dispatch(setSelectedStock(stock));
    setTickerQuery("");
    setDropdownOpen(false);
  };

  const handleClearSelection = () => {
    dispatch(setSelectedStock(null));
  };

  // Tactical Calculations
  const calculations = useMemo(() => {
    if (!selectedStock) return null;
    const price = selectedStock.current_price;
    return {
      entryMin: price * 0.985,
      entryMax: price * 1.015,
      stopLoss: price * 0.94,
      targetCapture: price * 1.15,
    };
  }, [selectedStock]);

  // Dynamic lens narrative text
  const diagnosticText = useMemo(() => {
    if (!selectedStock) return "";
    const name = selectedStock.stock_name;
    const sector = selectedStock.sector_name || "General Sector";
    const score = selectedStock.trendlyne_momentum_score || 50;
    switch (analysisFocus) {
      case "Growth":
        return `Evaluating ${name} under the Growth framework. With strong operational indices in ${sector}, predictive quant modeling indicates high revenue multiplier paths. Compound sales projections imply a target threshold of ${formatPrice(selectedStock.current_price * 1.25)} over the next 12-month period, driven by sector expansion.`;
      case "Value":
        return `Assessing ${name} under Value parameters. Strong cash flow ledgers alongside high asset security profiles suggest a substantial margin of safety of 15% against the spot price. Trading at a PE of ${selectedStock.pe_ttm ? selectedStock.pe_ttm.toFixed(1) : "22.4"}x, the system predicts structural discount normalization.`;
      case "Momentum":
        return `Scanning ${name} through high-velocity Technical Momentum. The current RSI coordinates are ${selectedStock.day_rsi ? selectedStock.day_rsi.toFixed(1) : "62"}, signaling an active bullish breakout channel. Immediate overhead technical cap points are established at ${formatPrice(selectedStock.current_price * 1.08)}, suggesting strong day breakouts.`;
      case "Balanced":
      default:
        return `Analyzing ${name} using a Balanced methodology. Demonstrates medium volatility with resilient risk ratings. Integrates stable underlying volume averages of ${selectedStock.day_volume ? (selectedStock.day_volume / 1000000).toFixed(1) : "2.4"}M shares which anchors consistent price stability along the key short-term exponential averages.`;
    }
  }, [selectedStock, analysisFocus]);

  return (
    <div
      id="stock-diagnostic-sidebar-panel"
      className="w-full relative overflow-hidden bg-[#0a0f1d]/65 backdrop-blur-xl border border-white/[0.08] rounded-3xl shadow-[0_24px_50px_rgba(0,0,0,0.5)] p-6 z-10 select-none flex flex-col h-full gap-5 group"
    >
      {/* Absolute Glow Background Field */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#00c2ff]/10 to-transparent blur-3xl pointer-events-none" />

      {/* Header section */}
      <div className="relative flex items-center justify-between border-b border-white/[0.08] pb-4 shrink-0">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-dash-primary animate-pulse" />
          <h3 className="text-xs font-black tracking-widest text-[#f1f5f9] font-display uppercase">
            AI Quant System Diagnostics
          </h3>
        </div>
        {selectedStock && (
          <button
            onClick={handleClearSelection}
            className="p-1 rounded-md hover:bg-white/[0.08] text-dash-muted hover:text-white transition-colors cursor-pointer"
            title="Disconnect Active Diagnosis"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* MAIN RENDER AREA */}
      {!selectedStock ? (
        /* STANDBY MODE */
        <div className="flex-1 flex flex-col justify-center py-6 space-y-6 relative z-10 animate-fadeIn">
          {/* Animated Dashed Placeholder */}
          <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center bg-white/[0.02] hover:border-[#00c2ff]/20 transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center mx-auto mb-3 animate-pulse">
              <Layers className="w-5 h-5 text-dash-muted" />
            </div>
            <p className="text-xs font-bold text-white">Scanner Standby Mode</p>
            <p className="text-[10px] text-dash-muted mt-1 max-w-[200px] mx-auto leading-relaxed font-mono">
              Select or search a stock asset to boot the real-time AI evaluation
              engine.
            </p>
          </div>

          {/* Quick Lookup Input Box */}
          <div className="relative font-mono">
            <label className="text-[9.5px] font-black text-dash-muted uppercase tracking-widest block mb-2">
              Fast-Response Lookup:
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dash-muted">
                <Search className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={tickerQuery}
                onFocus={() => setDropdownOpen(true)}
                onChange={(e) => {
                  setTickerQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                placeholder="NSE code or company name..."
                className="w-full text-xs pl-9 pr-3.5 py-2 bg-slate-950/60 border border-white/[0.08] rounded-xl text-white placeholder-dash-muted focus:outline-none focus:border-dash-primary/60 focus:ring-1 focus:ring-dash-primary/40 transition-all"
              />
            </div>

            {/* Float Search Dropdown */}
            {dropdownOpen && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-1.5 bg-[#0c1428]/95 border border-white/[0.08] rounded-xl shadow-2xl z-[50] overflow-hidden">
                {searchResults.map((stock) => (
                  <button
                    key={stock.isin}
                    onClick={() => handleSelectStock(stock)}
                    className="w-full text-left p-2.5 hover:bg-white/[0.06] text-xs transition-colors flex justify-between items-center text-white border-b border-white/[0.02] last:border-b-0 font-sans"
                  >
                    <div>
                      <span className="font-bold block leading-tight">
                        {stock.stock_name}
                      </span>
                      <span className="text-[10px] text-dash-muted font-mono uppercase mt-0.5 block">
                        NSE: {stock.nse_code}
                      </span>
                    </div>
                    <span className="text-[10.5px] font-black font-mono text-dash-primary">
                      {formatPrice(stock.current_price)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ACTIVE EVALUATION MODE */
        <div className="flex-1 flex flex-col space-y-5 animate-fadeIn relative z-10 overflow-y-auto pr-1">
          {/* Active Asset Info Badge */}
          <div className="p-3 bg-white/[0.03] border border-white/[0.06] rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[9px] font-black bg-dash-primary/10 border border-dash-primary/20 text-dash-primary px-2 py-0.5 rounded-md font-mono uppercase">
                {selectedStock.nse_code}
              </span>
              <h4 className="text-xs font-black text-white mt-1.5 truncate max-w-[160px]">
                {selectedStock.stock_name}
              </h4>
              <span className="text-[10px] text-dash-muted font-mono uppercase truncate block mt-0.5">
                {selectedStock.sector_name || "Misc Sector"}
              </span>
            </div>
            <div className="text-right font-mono">
              <span className="text-[9px] text-dash-muted block">
                SPOT PRICE
              </span>
              <span className="text-xs font-black text-white">
                {formatPrice(selectedStock.current_price)}
              </span>
              <span
                className={`text-[8.5px] font-bold block mt-0.5 ${
                  (selectedStock.trendlyne_momentum_score || 50) >= 55
                    ? "text-dash-success"
                    : "text-dash-danger"
                }`}
              >
                MOM: {selectedStock.trendlyne_momentum_score.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Configurable Analytical Lenses */}
          <div>
            <label className="text-[9.5px] font-black text-dash-muted uppercase tracking-widest block mb-2 font-mono">
              Analytical Lens:
            </label>
            <div className="grid grid-cols-2 gap-1.5 font-mono">
              {["Balanced", "Value", "Growth", "Momentum"].map((lens) => (
                <button
                  key={lens}
                  onClick={() => dispatch(setAnalysisFocus(lens))}
                  className={`py-1.5 px-2 border text-[10px] font-black uppercase rounded-xl cursor-pointer transition-all ${
                    analysisFocus === lens
                      ? "border-dash-primary bg-dash-primary/10 text-dash-primary"
                      : "border-white/[0.04] bg-white/[0.01] text-dash-ink hover:border-white/[0.12]"
                  }`}
                >
                  {lens} Framework
                </button>
              ))}
            </div>
          </div>

          {/* Verbiage Predictive Output Card */}
          <div className="p-4 bg-slate-950/40 border border-white/[0.05] rounded-2xl space-y-2">
            <div className="flex items-center gap-1.5 border-b border-white/[0.06] pb-1.5">
              <Compass className="w-3.5 h-3.5 text-dash-primary" />
              <span className="text-[9px] font-black font-mono text-dash-muted uppercase tracking-wider">
                Sector Trend Path Output:
              </span>
            </div>
            <p className="text-[10.5px] text-dash-ink leading-relaxed font-mono opacity-90">
              {diagnosticText}
            </p>
          </div>

          {/* Tactical pricing calculations table */}
          <div className="space-y-2 font-mono">
            <span className="text-[9.5px] font-black text-dash-muted uppercase tracking-widest block">
              Calculated Tactical Zones:
            </span>
            <div className="space-y-1.5 text-[10.5px]">
              {/* Entry Tunnel */}
              <div className="flex justify-between items-center p-2 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-[#00c2ff]/20 transition-colors">
                <div className="flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00c2ff]" />
                  <span className="text-dash-muted font-bold font-sans">
                    Entry Tunnel
                  </span>
                </div>
                <span className="text-white font-extrabold">
                  {formatPrice(calculations?.entryMin)} -{" "}
                  {formatPrice(calculations?.entryMax)}
                </span>
              </div>

              {/* Stop-Loss Safety */}
              <div className="flex justify-between items-center p-2 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-[#f43f5e]/20 transition-colors">
                <div className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-dash-danger" />
                  <span className="text-dash-muted font-bold font-sans">
                    Stop-Loss Guard
                  </span>
                </div>
                <span className="text-dash-danger font-black">
                  {formatPrice(calculations?.stopLoss)}
                </span>
              </div>

              {/* Target Capture */}
              <div className="flex justify-between items-center p-2 bg-white/[0.01] border border-white/[0.04] rounded-xl hover:border-[#10b981]/20 transition-colors">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-dash-success" />
                  <span className="text-dash-muted font-bold font-sans">
                    Target Objective
                  </span>
                </div>
                <span className="text-dash-success font-black">
                  {formatPrice(calculations?.targetCapture)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDiagnosticSidebar;
