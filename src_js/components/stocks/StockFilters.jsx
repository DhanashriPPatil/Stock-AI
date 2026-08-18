import React from "react";
import { SlidersHorizontal, X } from "lucide-react";

export const StockFilters = ({
  onSearchChange,
  searchQuery,
  sortBy,
  onSortByChange,
  sectorFilter,
  onSectorFilterChange,
  riskFilter,
  onRiskFilterChange,
  minPiotroskiChange,
  minPiotroski,
  sectorsList,
  screenerOpen,
  setScreenerOpen,
  onClearAll,
}) => {
  return (
    <div className="space-y-4">
      {/* Top search and filter actions row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-dash-card p-4 rounded-xl border border-dash-line">
        {/* Sorting options selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <span className="text-[10px] font-black font-mono text-dash-muted uppercase tracking-wider shrink-0">
            SORT CRITERIA:
          </span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="bg-dash-bg text-xs font-mono font-bold text-white border border-dash-line px-3 py-2 w-full md:w-56 rounded-lg outline-none focus:border-dash-primary transition-all cursor-pointer"
          >
            <option value="momentum_desc">
              ⚡ MOMENTUM SCORE [High ➔ Low]
            </option>
            <option value="momentum_asc">⚡ MOMENTUM SCORE [Low ➔ High]</option>
            <option value="price_desc">₹ SHARE PRICE [High ➔ Low]</option>
            <option value="price_asc">₹ SHARE PRICE [Low ➔ High]</option>
            <option value="cap_desc">🏢 CAPITALIZATION [High ➔ Low]</option>
            <option value="volume_desc">📊 DAY VOLUME [High ➔ Low]</option>
            <option value="piotroski_desc">
              ✅ PIOTROSKI F-SCORE [Max ➔ Min]
            </option>
          </select>
        </div>

        {/* Screening toggle configurations */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={() => setScreenerOpen(!screenerOpen)}
            className={`flex items-center gap-2 py-2 px-4 border rounded-lg hover:text-white transition-all text-xs font-bold font-mono cursor-pointer ${
              screenerOpen
                ? "border-dash-primary bg-dash-primary/10 text-dash-primary"
                : "border-dash-line text-dash-ink hover:border-dash-muted bg-dash-surface"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            ADVANCED SCREENER
          </button>

          {(sectorFilter !== "all" ||
            riskFilter !== "all" ||
            minPiotroski > 0 ||
            searchQuery !== "") && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 py-2 px-3 border border-dash-danger/30 text-dash-danger hover:bg-dash-danger hover:text-dash-bg bg-dash-surface rounded-lg transition-all text-xs font-mono font-bold cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              CLEAR ALL
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters card list */}
      {screenerOpen && (
        <div className="bg-dash-card border border-dash-line p-5 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-5 animate-slideDown">
          {/* Sector selection dropdown */}
          <div>
            <label className="text-[10px] font-black font-mono text-dash-muted uppercase tracking-wider block mb-2">
              SECTOR CLASSIFICATION:
            </label>
            <select
              value={sectorFilter}
              onChange={(e) => onSectorFilterChange(e.target.value)}
              className="bg-dash-bg text-xs font-mono font-bold text-white border border-dash-line px-3 py-2 w-full rounded-lg outline-none focus:border-dash-primary transition-all cursor-pointer"
            >
              <option value="all">ALL SECTORS</option>
              {sectorsList.map((sec) => (
                <option key={sec} value={sec}>
                  {sec.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Level selection dropdown */}
          <div>
            <label className="text-[10px] font-black font-mono text-dash-muted uppercase tracking-wider block mb-2">
              RISK ASSESSMENT:
            </label>
            <select
              value={riskFilter}
              onChange={(e) => onRiskFilterChange(e.target.value)}
              className="bg-dash-bg text-xs font-mono font-bold text-white border border-dash-line px-3 py-2 w-full rounded-lg outline-none focus:border-dash-primary transition-all cursor-pointer"
            >
              <option value="all">ALL RISK LEVELS</option>
              <option value="low">LOW RISK (PE & DE STABLE)</option>
              <option value="medium">MEDIUM RISK (STANDARD)</option>
              <option value="high">HIGH RISK (HIGH LEVERAGE / MACD)</option>
            </select>
          </div>

          {/* Piotroski Scores filter slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-black font-mono text-dash-muted uppercase tracking-wider block">
                MIN PIOTROSKI F-SCORE:
              </label>
              <span className="text-xs font-black font-mono text-dash-primary bg-dash-primary/10 px-2 py-0.5 rounded">
                ★ {minPiotroski} / 9
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="9"
              step="1"
              value={minPiotroski}
              onChange={(e) => minPiotroskiChange(parseInt(e.target.value))}
              className="w-full h-1.5 bg-dash-bg border border-dash-line rounded-lg appearance-none cursor-pointer accent-dash-primary"
            />

            <div className="flex justify-between items-center text-[9px] text-dash-muted font-mono mt-1">
              <span>0 (Weak quality)</span>
              <span>9 (Pristine)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockFilters;
