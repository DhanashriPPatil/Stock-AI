import React, { useState, useMemo, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { LayoutGrid, Table, ArrowLeft, Layers } from "lucide-react";
import StockTable from "../components/stocks/StockTable";
import StockCard from "../components/stocks/StockCard";
import StockFilters from "../components/stocks/StockFilters";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import { loadStockData } from "../store/stockStore";
import {
  filterSwiftStocks,
  filterLongTermStocks,
  filterShortTermStocks,
  filterIntradayStocks,
  getRiskLevel,
} from "../utils";

export const CategoryPage = () => {
  const { type } = useParams();
  const dispatch = useDispatch();
  const { stocks, loading, error } = useSelector((state) => state.stocks);

  // Layout preference state state
  const [viewMode, setViewMode] = useState("table");

  // Filter criteria states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("momentum_desc");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [minPiotroski, setMinPiotroski] = useState(0);
  const [screenerOpen, setScreenerOpen] = useState(false);

  // Native table sorting configuration state state
  const [sortConfig, setSortConfig] = useState({
    key: "trendlyne_momentum_score",
    direction: "desc",
  });

  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(loadStockData());
    }
  }, [stocks, dispatch]);

  const categoryMeta = useMemo(() => {
    const meta = {
      swift_stock: {
        title: "Swing Breakouts",
        sub: "Fast Momentum Breakouts",
        desc: "Momentum criteria requires High Trendlyne Speed ratings and healthy RSI indexes in trading ranges.",
        color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
        filter: filterSwiftStocks,
      },
      long_term: {
        title: "Long Term Core",
        sub: "Resilient Corporate Compounders",
        desc: "Durability-driven filter screening durable balance sheets with stable historical sales & earnings CAGR.",
        color: "text-emerald-400 border-emerald-400/20 bg-emerald-400/5",
        filter: filterLongTermStocks,
      },
      short_term: {
        title: "Short Term Run",
        sub: "Swing Trading / MACD Setups",
        desc: "Filters active momentum trend directions containing positive MACD crossovers and support structures.",
        color: "text-amber-400 border-amber-500/20 bg-amber-500/5",
        filter: filterShortTermStocks,
      },
      intraday: {
        title: "LT Opportunity",
        sub: "Volume Breakout Opportunities",
        desc: "Day criteria filtering assets displaying significant intraday volume spikes above trailing averages.",
        color: "text-rose-400 border-rose-400/20 bg-rose-400/5",
        filter: filterIntradayStocks,
      },
    };
    return meta[type] || meta.swift_stock;
  }, [type]);

  // Extract unique sectors lists for filtering dropdown list
  const sectorsList = useMemo(() => {
    const set = new Set();
    stocks.forEach((s) => {
      if (s.sector_name) set.add(s.sector_name);
    });
    return Array.from(set).sort();
  }, [stocks]);

  // Handle clear-all filter reset
  const handleClearFilters = () => {
    setSearchQuery("");
    setSectorFilter("all");
    setRiskFilter("all");
    setMinPiotroski(0);
  };

  // Perform filtering first, then sorting!
  const filteredAndSortedStocks = useMemo(() => {
    // 1. Initial category partition filter
    let list = categoryMeta.filter(stocks);

    // 2. Global search criteria (NSE Code & Company Name)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.stock_name.toLowerCase().includes(q) ||
          s.nse_code.toLowerCase().includes(q),
      );
    }

    // 3. Sector dropdown filter
    if (sectorFilter !== "all") {
      list = list.filter((s) => s.sector_name === sectorFilter);
    }

    // 4. Alt Risk Level filter
    if (riskFilter !== "all") {
      list = list.filter((s) => getRiskLevel(s).toLowerCase() === riskFilter);
    }

    // 5. Piotroski score filter
    if (minPiotroski > 0) {
      list = list.filter((s) => (s.piotroski_score || 0) >= minPiotroski);
    }

    // 6. Generic sort dropdown rules (or fall back to active table sort)
    if (sortConfig) {
      const { key, direction } = sortConfig;
      list = [...list].sort((a, b) => {
        const valA = a[key];
        const valB = b[key];
        if (valA === undefined) return 1;
        if (valB === undefined) return -1;
        if (typeof valA === "string" && typeof valB === "string") {
          return direction === "asc"
            ? valA.localeCompare(valB)
            : valB.localeCompare(valA);
        }
        return direction === "asc" ? valA - valB : valB - valA;
      });
    } else {
      // Sort box rules
      if (sortBy === "momentum_desc") {
        list = [...list].sort(
          (a, b) => b.trendlyne_momentum_score - a.trendlyne_momentum_score,
        );
      } else if (sortBy === "momentum_asc") {
        list = [...list].sort(
          (a, b) => a.trendlyne_momentum_score - b.trendlyne_momentum_score,
        );
      } else if (sortBy === "price_desc") {
        list = [...list].sort((a, b) => b.current_price - a.current_price);
      } else if (sortBy === "price_asc") {
        list = [...list].sort((a, b) => a.current_price - b.current_price);
      } else if (sortBy === "cap_desc") {
        list = [...list].sort(
          (a, b) => b.market_capitalization - a.market_capitalization,
        );
      } else if (sortBy === "volume_desc") {
        list = [...list].sort((a, b) => b.day_volume - a.day_volume);
      } else if (sortBy === "piotroski_desc") {
        list = [...list].sort(
          (a, b) => (b.piotroski_score || 0) - (a.piotroski_score || 0),
        );
      } else if (sortBy === "durability_desc") {
        list = [...list].sort(
          (a, b) => (b.trendlyne_durability_score || 0) - (a.trendlyne_durability_score || 0),
        );
      } else if (sortBy === "valuation_desc") {
        list = [...list].sort(
          (a, b) => (b.trendlyne_valuation_score || 0) - (a.trendlyne_valuation_score || 0),
        );
      } else if (sortBy === "roe_desc") {
        list = [...list].sort(
          (a, b) => (parseFloat(b.roe) || 0) - (parseFloat(a.roe) || 0),
        );
      } else if (sortBy === "pe_asc") {
        list = [...list].sort(
          (a, b) => {
            const peA = parseFloat(a.pe_ttm);
            const peB = parseFloat(b.pe_ttm);
            const valA = isNaN(peA) ? 999999 : peA;
            const valB = isNaN(peB) ? 999999 : peB;
            return valA - valB;
          }
        );
      }
    }

    return list;
  }, [
    categoryMeta,
    stocks,
    searchQuery,
    sectorFilter,
    riskFilter,
    minPiotroski,
    sortBy,
    sortConfig,
  ]);

  // Support table column sorting dispatches
  const handleTableColumnSort = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  if (loading) {
    return <Loader message="Filtering analytical portfolios..." />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => dispatch(loadStockData())} />
    );
  }

  return (
    <div id="category_page" className="space-y-6 select-none animate-fadeIn">
      {/* Back tracking layout links */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2.5">
          <Link
            to="/"
            className="p-2 border border-dash-line bg-dash-card text-dash-ink hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-black font-display text-white uppercase">
                {categoryMeta.title}
              </h2>
              <span
                className={`text-[8px] sm:text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 border rounded-full ${categoryMeta.color}`}
              >
                {categoryMeta.sub}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-dash-ink mt-1 max-w-2xl leading-relaxed">
              {categoryMeta.desc}
            </p>
          </div>
        </div>

        {/* Layout Preference toggles */}
        <div className="flex items-center gap-2 bg-dash-card p-1 border border-dash-line rounded-lg self-end sm:self-auto">
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded cursor-pointer transition-all ${
              viewMode === "table"
                ? "bg-dash-primary text-dash-bg"
                : "text-dash-ink hover:text-white"
            }`}
            title="Tabular Ledger View"
          >
            <Table className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded cursor-pointer transition-all ${
              viewMode === "grid"
                ? "bg-dash-primary text-dash-bg"
                : "text-dash-ink hover:text-white"
            }`}
            title="Screener Cards Grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Embedded stock filter controls */}
      <StockFilters
        screenerOpen={screenerOpen}
        setScreenerOpen={setScreenerOpen}
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
        sortBy={sortBy}
        onSortByChange={(val) => {
          setSortBy(val);
          setSortConfig(null); // release strict col-sort when sorting via dropdown triggers
        }}
        sectorFilter={sectorFilter}
        onSectorFilterChange={setSectorFilter}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        sectorsList={sectorsList}
        minPiotroski={minPiotroski}
        minPiotroskiChange={setMinPiotroski}
        onClearAll={handleClearFilters}
      />

      {/* Empty elements notification */}
      {filteredAndSortedStocks.length === 0 ? (
        <div className="p-12 text-center border border-dash-line bg-dash-card rounded-2xl">
          <Layers className="w-8 h-8 text-dash-muted mx-auto mb-3" />
          <h4 className="text-sm font-black font-mono text-white text-uppercase">
            No Matching Stock Rows Found
          </h4>
          <p className="text-xs text-dash-muted mt-1 max-w-md mx-auto">
            Try loosening down your custom screener filters, sector parameters,
            risk assessments, or expand the company name queries.
          </p>
          <button
            onClick={handleClearFilters}
            className="mt-4 py-2 px-5 bg-dash-primary hover:bg-dash-primary-dark text-dash-bg text-[10px] font-black uppercase tracking-widest rounded-lg transition-all cursor-pointer font-mono"
          >
            RESET ALL CRITERIA
          </button>
        </div>
      ) : (
        /* Stocks Render Frame list */
        <div>
          <div className="flex justify-between items-center text-[10px] font-mono text-dash-muted mb-2.5">
            <span>
              SHOWING {filteredAndSortedStocks.length} MATCHING PORTFOLIO
              ENTRIES:
            </span>
            <span>
              SORT:{" "}
              {sortConfig
                ? `${sortConfig.key.toUpperCase()} - ${sortConfig.direction.toUpperCase()}`
                : sortBy.toUpperCase()}
            </span>
          </div>

          <div className="transition-all duration-300">
            {viewMode === "table" ? (
              <StockTable
                stocks={filteredAndSortedStocks}
                onSort={handleTableColumnSort}
                sortKey={sortConfig?.key}
                sortDirection={sortConfig?.direction}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredAndSortedStocks.map((stock) => (
                  <StockCard key={stock.isin} stock={stock} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
