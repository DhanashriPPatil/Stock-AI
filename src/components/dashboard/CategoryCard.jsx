import React from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  ShieldCheck,
  Activity,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import { motion } from "motion/react";

export const CategoryCard = ({ id, name, description, count, avgMomentum }) => {
  const configs = {
    swift_stock: {
      gradient:
        "from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/15 hover:to-blue-500/15",
      border: "border-cyan-500/20 hover:border-cyan-500/40",
      pill: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      glow: "shadow-[0_0_20px_rgba(6,182,212,0.1)]",
      icon: Zap,
      iconColor: "text-cyan-400 fill-cyan-400/10",
      accent: "text-cyan-400",
      label: "Fast momentum breakout tracker",
    },
    long_term: {
      gradient:
        "from-green-500/10 to-emerald-500/10 hover:from-green-500/15 hover:to-emerald-500/15",
      border: "border-green-500/20 hover:border-green-500/40",
      pill: "bg-green-500/10 text-green-400 border-green-500/20",
      glow: "shadow-[0_0_20px_rgba(16,185,129,0.1)]",
      icon: ShieldCheck,
      iconColor: "text-green-400 fill-green-400/10",
      accent: "text-green-400",
      label: "Strong core financial compounder",
    },
    short_term: {
      gradient:
        "from-yellow-500/5 to-orange-500/5 hover:from-yellow-500/10 hover:to-orange-500/10",
      border: "border-amber-500/20 hover:border-amber-500/40",
      pill: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      glow: "shadow-[0_0_20px_rgba(245,158,11,0.1)]",
      icon: Activity,
      iconColor: "text-amber-400 fill-amber-400/10",
      accent: "text-amber-400",
      label: "Swing setup & MACD crossovers",
    },
    intraday: {
      gradient:
        "from-red-500/10 to-pink-500/10 hover:from-red-500/15 hover:to-pink-500/15",
      border: "border-rose-500/20 hover:border-rose-500/40",
      pill: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      glow: "shadow-[0_0_20px_rgba(244,63,94,0.1)]",
      icon: TrendingUp,
      iconColor: "text-rose-400 fill-rose-400/15",
      accent: "text-rose-400",
      label: "Volume breakdowns & hourly momentum",
    },
  }[id];

  const IconComponent = configs.icon;

  const dotColorClass =
    id === "swift_stock"
      ? "bg-cyan-400"
      : id === "long_term"
        ? "bg-emerald-400"
        : id === "short_term"
          ? "bg-amber-400"
          : "bg-rose-400";

  return (
    <Link to={`/category/${id}`} className="block">
      <motion.div
        whileHover={{ scale: 1.03, translateY: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className={`h-full border ${configs.border} bg-gradient-to-br ${configs.gradient} backdrop-blur-xl rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 ${configs.glow}`}
      >
        {/* Top visual section */}
        <div>
          <div className="flex items-start justify-between">
            <div
              className={`p-3 rounded-xl bg-dash-card border border-dash-line ${configs.accent}`}
            >
              <IconComponent className={`w-6 h-6 ${configs.iconColor}`} />
            </div>
            <span
              className={`text-[9px] font-bold font-mono px-2.5 py-1 rounded-full border ${configs.pill}`}
            >
              {count} Stock{count === 1 ? "" : "s"} Found
            </span>
          </div>

          <div className="mt-5">
            <h3 className="text-base font-black tracking-tight text-white font-display uppercase leading-none flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${dotColorClass}`} />
              {name}
            </h3>
            <p className="text-xs text-dash-ink mt-2 leading-relaxed min-h-10">
              {description}
            </p>
          </div>
        </div>

        {/* Foot Stats indicator */}
        <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-dash-muted font-mono block leading-none font-semibold">
              Avg Momentum
            </span>
            <span
              className={`text-base font-black font-mono mt-1 block ${configs.accent}`}
            >
              {avgMomentum.toFixed(1)}{" "}
              <span className="text-xxs text-dash-muted">pts</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white tracking-wider font-mono">
            View Screen
            <ChevronRight className={`w-4 h-4 ${configs.accent}`} />
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default CategoryCard;
