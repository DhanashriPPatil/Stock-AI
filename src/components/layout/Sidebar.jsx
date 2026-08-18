import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Zap,
  ChevronRight,
  LayoutDashboard,
  Star,
  BarChart3,
  PieChart,
  Sparkles,
  Globe,
  Building2,
  ShieldCheck,
  Database,
  X,
} from "lucide-react";
import {
  filterSwiftStocks,
  filterLongTermStocks,
  filterShortTermStocks,
  filterIntradayStocks,
} from "../../utils";

export const Sidebar = ({ onOpenPdfIngestor, sidebarOpen, onCloseSidebar }) => {
  const location = useLocation();
  const { stocks, watchlist } = useSelector((state) => state.stocks);

  const swiftCount = useMemo(() => (stocks.length ? filterSwiftStocks(stocks).length : 0), [stocks]);
  const shortCount = useMemo(() => (stocks.length ? filterShortTermStocks(stocks).length : 0), [stocks]);
  const longCount = useMemo(() => (stocks.length ? filterLongTermStocks(stocks).length : 0), [stocks]);
  const intradayCount = useMemo(() => (stocks.length ? filterIntradayStocks(stocks).length : 0), [stocks]);

  const menuItems = [
    {
      path: "/category/swift_stock",
      label: "Swing Breakouts",
      count: swiftCount,
      icon: Zap,
      color: "text-cyan-400",
      dotColor: "bg-cyan-400",
    },
    {
      path: "/category/short_term",
      label: "Short Term Run",
      count: shortCount,
      icon: BarChart3,
      color: "text-amber-400",
      dotColor: "bg-amber-400",
    },
    {
      path: "/category/long_term",
      label: "Long Term Core",
      count: longCount,
      icon: ShieldCheck,
      color: "text-emerald-400",
      dotColor: "bg-emerald-400",
    },
    {
      path: "/category/intraday",
      label: "LT Opportunity",
      count: intradayCount,
      icon: PieChart,
      color: "text-rose-400",
      dotColor: "bg-rose-400",
    },
  ];

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
          onClick={onCloseSidebar}
        />
      )}

      <aside
        id="sidebar_container"
        className={`fixed inset-y-0 left-0 w-68 glass-sidebar flex flex-col shrink-0 select-none z-50 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Logo Wrapper */}
        <div className="h-20 px-6 border-b border-dash-line flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 shrink-0 select-none min-w-0">
          <div className="w-9 h-9 aspect-square flex items-center justify-center shrink-0">
            <svg
              className="w-8.5 h-8.5"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Grid connecting lines */}
              <line
                x1="8"
                y1="8"
                x2="8"
                y2="32"
                stroke="#475569"
                strokeWidth="1"
              />
              <line
                x1="20"
                y1="20"
                x2="20"
                y2="32"
                stroke="#475569"
                strokeWidth="1"
              />
              <line
                x1="32"
                y1="20"
                x2="32"
                y2="32"
                stroke="#475569"
                strokeWidth="1"
              />

              <line
                x1="8"
                y1="8"
                x2="20"
                y2="8"
                stroke="#475569"
                strokeWidth="1"
              />
              <line
                x1="8"
                y1="20"
                x2="16"
                y2="20"
                stroke="#475569"
                strokeWidth="1"
              />
              <line
                x1="26"
                y1="20"
                x2="32"
                y2="20"
                stroke="#475569"
                strokeWidth="1"
              />
              <line
                x1="8"
                y1="32"
                x2="32"
                y2="32"
                stroke="#475569"
                strokeWidth="1"
              />

              {/* Grid Nodes (Interactive/Connected points) */}
              <circle
                cx="8"
                cy="8"
                r="1.75"
                fill="#050814"
                stroke="#f1f5f9"
                strokeWidth="1.25"
              />
              <circle
                cx="20"
                cy="8"
                r="1.75"
                fill="#050814"
                stroke="#f1f5f9"
                strokeWidth="1.25"
              />
              <circle
                cx="8"
                cy="20"
                r="1.75"
                fill="#050814"
                stroke="#f1f5f9"
                strokeWidth="1.25"
              />
              <circle
                cx="32"
                cy="20"
                r="1.75"
                fill="#050814"
                stroke="#f1f5f9"
                strokeWidth="1.25"
              />
              <circle
                cx="8"
                cy="32"
                r="1.75"
                fill="#050814"
                stroke="#f1f5f9"
                strokeWidth="1.25"
              />
              <circle
                cx="20"
                cy="32"
                r="1.75"
                fill="#050814"
                stroke="#f1f5f9"
                strokeWidth="1.25"
              />
              <circle
                cx="32"
                cy="32"
                r="1.75"
                fill="#050814"
                stroke="#f1f5f9"
                strokeWidth="1.25"
              />

              {/* Trend Arrow Line (Vibrant Blue) */}
              <path
                d="M6 34 L18 18 L22 23 L34 8"
                stroke="#00c2ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M28 8 H34 V14"
                stroke="#00c2ff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex flex-col justify-center min-w-0">
            <h1 className="text-[15.5px] font-extrabold tracking-tight font-display text-white leading-none whitespace-nowrap">
              Trend
            </h1>
            <span className="text-[10.5px] font-bold tracking-wide text-dash-primary font-sans leading-none block mt-0.5 whitespace-nowrap">
              Engineer
            </span>
          </div>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={onCloseSidebar}
          className="lg:hidden p-1.5 rounded-lg border border-dash-line text-dash-muted hover:text-white hover:border-white/20 transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
        {/* Main Group Header */}
        <div className="text-[10px] font-bold text-dash-muted px-3.5 pt-2 mb-2 font-mono uppercase tracking-wider">
          Main Research
        </div>

        {/* Dashboard Link (a:nth-of-type(1)) */}
        <Link to="/" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,255,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard
                className={`w-4 h-4 ${location.pathname === "/" ? "text-black" : "text-blue-400"} transition-transform group-hover:scale-105`}
              />
              <div className="text-xs font-display tracking-wide font-semibold">
                Dashboard
              </div>
            </div>
            <ChevronRight
              className={`w-3 h-3 shrink-0 ${location.pathname === "/" ? "text-black/60" : "opacity-40"}`}
            />
          </div>
        </Link>

        {/* Weekly Wealth Report Link */}
        <Link to="/weekly-wealth" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/weekly-wealth"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,225,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-[#fbbf24] hover:border-[#fbbf24]/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles
                className={`w-4 h-4 ${location.pathname === "/weekly-wealth" ? "text-black" : "text-amber-400"} transition-transform group-hover:scale-105`}
              />
              <div className="text-xs font-display tracking-wide font-semibold">
                Weekly Wealth
              </div>
            </div>
            <ChevronRight
              className={`w-3 h-3 shrink-0 ${location.pathname === "/weekly-wealth" ? "text-black/60" : "opacity-40"}`}
            />
          </div>
        </Link>

        {/* World Economy Link */}
        <Link to="/world-economy" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/world-economy"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,225,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-[#38bdf8] hover:border-[#38bdf8]/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe
                className={`w-4 h-4 ${location.pathname === "/world-economy" ? "text-black" : "text-sky-400"} transition-transform group-hover:rotate-12`}
              />
              <div className="text-xs font-display tracking-wide font-semibold">
                World Economy
              </div>
            </div>
            <ChevronRight
              className={`w-3 h-3 shrink-0 ${location.pathname === "/world-economy" ? "text-black/60" : "opacity-40"}`}
            />
          </div>
        </Link>

        {/* Sector Update Link */}
        <Link to="/sector-update" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/sector-update"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,225,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-[#a855f7] hover:border-[#a855f7]/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2
                className={`w-4 h-4 ${location.pathname === "/sector-update" ? "text-black" : "text-purple-400"} transition-transform group-hover:scale-105`}
              />
              <div className="text-xs font-display tracking-wide font-semibold">
                Sector Update
              </div>
            </div>
            <ChevronRight
              className={`w-3 h-3 shrink-0 ${location.pathname === "/sector-update" ? "text-black/60" : "opacity-40"}`}
            />
          </div>
        </Link>

        {/* Product Discovery Link */}
        <Link to="/discovery" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/discovery"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,225,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-pink-400 hover:border-pink-400/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Database
                className={`w-4 h-4 ${location.pathname === "/discovery" ? "text-black" : "text-pink-400"} transition-transform group-hover:scale-105`}
              />
              <div className="text-xs font-display tracking-wide font-semibold">
                Screener & Discovery
              </div>
            </div>
            <ChevronRight
              className={`w-3 h-3 shrink-0 ${location.pathname === "/discovery" ? "text-black/60" : "opacity-40"}`}
            />
          </div>
        </Link>

        {/* Watchlist Quick Route Link */}
        <Link to="/watchlist" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/watchlist"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,220,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Star
                className={`w-4 h-4 ${location.pathname === "/watchlist" ? "text-black fill-black" : "text-dash-warning fill-dash-warning"}`}
              />
              <div className="text-xs font-display tracking-wide font-semibold">
                Watchlist
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold leading-none select-none ${
                location.pathname === "/watchlist" ? "bg-black/25 text-black" : "bg-white/10 text-dash-muted"
              }`}>
                {watchlist.length}
              </span>
              <ChevronRight
                className={`w-3 h-3 shrink-0 ${location.pathname === "/watchlist" ? "text-black/60" : "opacity-40"}`}
              />
            </div>
          </div>
        </Link>

        {/* Active Shortlists Section Header */}
        <div className="text-[10px] font-bold text-dash-muted px-3.5 pt-4 mb-2 font-mono uppercase tracking-wider">
          Research Shortlists
        </div>

        {/* Mapped Categories Category Links (a:nth-of-type(2) to a:nth-of-type(5)) */}
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative w-full block group mb-1"
            >
              <div
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
                  isActive
                    ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,255,0.25)]"
                    : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-black" : item.color} transition-transform group-hover:scale-105`}
                  />
                  <div className="text-xs font-display tracking-wide font-semibold">
                    {item.label}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold leading-none select-none ${
                    isActive ? "bg-black/25 text-black" : "bg-white/10 text-dash-muted"
                  }`}>
                    {item.count}
                  </span>
                  <ChevronRight
                    className={`w-3 h-3 shrink-0 ${isActive ? "text-black/60" : "opacity-40"}`}
                  />
                </div>
              </div>
            </Link>
          );
        })}

        {/* System Administration controls */}
        <div className="text-[10px] font-bold text-dash-muted px-3.5 pt-6 mb-2 font-mono uppercase tracking-wider">
          System Settings
        </div>

        {/* Platform Discovery Workstation Link */}
        <Link to="/platform-discovery" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/platform-discovery"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,225,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <Database
                className={`w-4 h-4 ${location.pathname === "/platform-discovery" ? "text-black" : "text-dash-primary"} transition-transform group-hover:scale-105`}
              />
              <div className="text-xs font-display tracking-wide font-bold uppercase">
                Platform Discovery
              </div>
            </div>
            <ChevronRight
              className={`w-3 h-3 shrink-0 ${location.pathname === "/platform-discovery" ? "text-black/60" : "opacity-40"}`}
            />
          </div>
        </Link>

        {/* AI PDF Ingestor Trigger */}
        <button
          type="button"
          onClick={onOpenPdfIngestor}
          className="w-full relative block group mb-1 text-left cursor-pointer"
        >
          <div className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all duration-200 border border-transparent text-dash-muted hover:border-[#00c2ff]/30 hover:bg-[#00c2ff]/5 hover:text-[#00c2ff]">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-cyan-400 transition-transform group-hover:scale-115" />
              <div className="text-xs font-display tracking-wide font-bold uppercase">
                AI PDF Ingestor
              </div>
            </div>
            <ChevronRight className="w-3 h-3 text-dash-muted/40" />
          </div>
        </button>
      </nav>
    </aside>
  </>
);
};

export default Sidebar;
