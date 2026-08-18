import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ShieldCheck,
  Zap,
  ChevronRight,
  LayoutDashboard,
  Star,
  BarChart3,
  PieChart,
  Sparkles,
  Globe,
  Building2,
} from "lucide-react";

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      path: "/category/swift_stock",
      label: "SWING BREAKOUTS",
      icon: Zap,
      color: "text-cyan-400",
    },
    {
      path: "/category/short_term",
      label: "SHORT TERM RUN",
      icon: BarChart3,
      color: "text-amber-400",
    },
    {
      path: "/category/long_term",
      label: "LONG TERM CORE",
      icon: ShieldCheck,
      color: "text-emerald-400",
    },
    {
      path: "/category/intraday",
      label: "LT OPPORTUNITY",
      icon: PieChart,
      color: "text-rose-400",
    },
  ];

  return (
    <aside
      id="sidebar_container"
      className="w-68 glass-sidebar flex flex-col shrink-0 select-none relative z-20"
    >
      {/* Brand Logo Wrapper */}
      <div className="h-20 px-6 border-b border-dash-line flex items-center justify-between">
        <div className="flex items-center gap-2.5 shrink-0 select-none">
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
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 px-3 space-y-2 overflow-y-auto">
        {/* Dashboard Link (a:nth-of-type(1)) */}
        <Link to="/" className="relative w-full block group mb-1">
          <div
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,255,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard
                className={`w-4 h-4 ${location.pathname === "/" ? "text-black" : "text-blue-400"} transition-transform group-hover:scale-105`}
              />
              <div>
                <div className="text-xs uppercase font-display tracking-wide font-bold">
                  Dashboard
                </div>
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
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/weekly-wealth"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,255,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-[#fbbf24] hover:border-[#fbbf24]/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Sparkles
                className={`w-4 h-4 ${location.pathname === "/weekly-wealth" ? "text-black" : "text-amber-400"} transition-transform group-hover:scale-105`}
              />
              <div>
                <div className="text-xs uppercase font-display tracking-wide font-bold">
                  Weekly Wealth
                </div>
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
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/world-economy"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,255,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-[#38bdf8] hover:border-[#38bdf8]/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Globe
                className={`w-4 h-4 ${location.pathname === "/world-economy" ? "text-black" : "text-sky-400"} transition-transform group-hover:rotate-12`}
              />
              <div>
                <div className="text-xs uppercase font-display tracking-wide font-bold">
                  World Economy
                </div>
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
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
              location.pathname === "/sector-update"
                ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,255,0.25)]"
                : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-[#a855f7] hover:border-[#a855f7]/20"
            }`}
          >
            <div className="flex items-center gap-3">
              <Building2
                className={`w-4 h-4 ${location.pathname === "/sector-update" ? "text-black" : "text-purple-400"} transition-transform group-hover:scale-105`}
              />
              <div>
                <div className="text-xs uppercase font-display tracking-wide font-bold">
                  Sector Update
                </div>
              </div>
            </div>
            <ChevronRight
              className={`w-3 h-3 shrink-0 ${location.pathname === "/sector-update" ? "text-black/60" : "opacity-40"}`}
            />
          </div>
        </Link>

        {/* Section Header */}
        <div className="text-[9px] font-black text-dash-muted px-3 pt-3 mb-2 font-mono uppercase tracking-widest">
          ACTIVE RESEARCH SHORTLISTS
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
                  isActive
                    ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,255,0.25)]"
                    : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${isActive ? "text-black" : item.color} transition-transform group-hover:scale-105`}
                  />
                  <div>
                    <div className="text-xs uppercase font-display tracking-wide font-bold">
                      {item.label}
                    </div>
                  </div>
                </div>
                <ChevronRight
                  className={`w-3 h-3 shrink-0 ${isActive ? "text-black/60" : "opacity-40"}`}
                />
              </div>
            </Link>
          );
        })}

        {/* Watchlist Quick Route Link */}
        <div className="pt-2">
          <Link to="/watchlist" className="relative w-full block group">
            <div
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer text-left border ${
                location.pathname === "/watchlist"
                  ? "bg-[#00c2ff] border-[#00c2ff] text-black font-black shadow-[0_4px_15px_rgba(0,194,220,0.25)]"
                  : "text-dash-muted border-transparent hover:border-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:text-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <Star
                  className={`w-4 h-4 ${location.pathname === "/watchlist" ? "text-black fill-black" : "text-dash-warning fill-dash-warning"}`}
                />
                <div>
                  <div className="text-xs uppercase font-display tracking-wide font-bold">
                    WATCHLIST
                  </div>
                </div>
              </div>
              <ChevronRight
                className={`w-3 h-3 shrink-0 ${location.pathname === "/watchlist" ? "text-black/60" : "opacity-40"}`}
              />
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
