import React from "react";
import { ShieldCheck, Scale } from "lucide-react";
import { getRiskLevel } from "../../utils";

export const RiskAnalysis = ({ stock }) => {
  const risk = getRiskLevel(stock);
  const altman = stock.altman_z_score || 3.12;
  const de = stock.debt_to_equity || 0.12;

  // Derive Altman Z-Score risk zone: Safe (> 2.99), Gray (1.81 - 2.99), Distress (< 1.81)
  const altmanZone =
    altman > 2.99 ? "Safe Zone" : altman > 1.81 ? "Gray Zone" : "Distress Zone";
  const altmanColor =
    altman > 2.99
      ? "text-dash-success bg-dash-success/10 border-dash-success/20"
      : altman > 1.81
        ? "text-yellow-400 bg-yellow-400/10 border-yellow-500/20"
        : "text-dash-danger bg-dash-danger/10 border-dash-danger/20";

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* 2 columns risk diagnostics report panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk meter score card */}
        <div className="p-6 bg-dash-card border border-dash-line rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-dash-line pb-3 mb-4 font-mono">
              <div className="flex items-center gap-2">
                <Scale className="w-4.5 h-4.5 text-dash-danger" />
                <h4 className="text-xs font-black tracking-wider uppercase font-display text-white">
                  System Risk Meter
                </h4>
              </div>
              <span className="text-[9px] font-mono text-dash-muted">
                DVM EVALUATION
              </span>
            </div>

            <p className="text-xs text-dash-ink leading-relaxed font-sans">
              Based on Altmans insolvent matrix, balance sheet leverages,
              promoters pledge ratios, and RSI deviations, the stock is
              categorized as:
            </p>

            <div className="mt-6 flex flex-col items-center">
              <div
                className={`text-2xl font-black font-mono tracking-widest px-8 py-3 rounded-xl border ${
                  risk === "LOW"
                    ? "bg-dash-success/10 text-dash-success border-dash-success/25 shadow-[0_0_20px_rgba(0,230,118,0.1)]"
                    : risk === "MEDIUM"
                      ? "bg-amber-400/10 text-amber-500 border-amber-500/25 shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                      : "bg-dash-danger/10 text-dash-danger border-dash-danger/25 shadow-[0_0_20px_rgba(255,77,79,0.1)]"
                }`}
              >
                {risk} RISK
              </div>

              {/* Graphical pointer gauge bars */}
              <div className="flex justify-between w-full max-w-sm mt-6 gap-2.5">
                <div
                  className={`h-2 flex-grow rounded-full transition-colors ${risk === "LOW" ? "bg-dash-success" : "bg-dash-line"}`}
                />
                <div
                  className={`h-2 flex-grow rounded-full transition-colors ${risk === "MEDIUM" ? "bg-amber-400" : "bg-dash-line"}`}
                />
                <div
                  className={`h-2 flex-grow rounded-full transition-colors ${risk === "HIGH" ? "bg-dash-danger" : "bg-dash-line"}`}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 text-[10px] text-dash-muted font-mono leading-relaxed border-t border-[rgba(255,255,255,0.04)] pt-3">
            Institutional analysts recommend locking{" "}
            {risk === "LOW"
              ? "up to 8%"
              : risk === "MEDIUM"
                ? "up to 4%"
                : "under 2%"}{" "}
            allocation in single high leverage lines.
          </div>
        </div>

        {/* Altman matrix details */}
        <div className="p-6 bg-dash-card border border-dash-line rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-dash-line pb-3 mb-4 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4.5 h-4.5 text-dash-primary" />
                <h4 className="text-xs font-black tracking-wider uppercase font-display text-white font-semibold">
                  Altman Z-Score Matrix
                </h4>
              </div>
              <span className="text-[9px] font-mono text-dash-muted font-semibold">
                INSOLVENCY PROFILER
              </span>
            </div>

            <p className="text-xs text-dash-ink leading-relaxed font-sans">
              The Altman Z-score utilizes 5 financial ratios evaluating
              liquidity, profitability, leverage, and activity to profile
              insolvency risk within a 2-year horizon.
            </p>

            <div className="mt-5 space-y-4">
              <div className="flex justify-between items-center bg-dash-bg p-3 border border-dash-line rounded-xl">
                <div>
                  <span className="text-[10px] text-dash-muted font-mono block font-semibold">
                    ALTMAN Z-SCORE:
                  </span>
                  <span className="text-base font-black font-mono text-white mt-0.5 block">
                    {altman.toFixed(2)}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-black font-mono px-2.5 py-1 rounded-lg border uppercase ${altmanColor}`}
                >
                  {altmanZone}
                </span>
              </div>

              <div className="text-[10px] font-mono text-dash-muted space-y-1 bg-dash-bg/50 p-3 rounded-lg border border-dash-line/50">
                <div className="flex justify-between">
                  <span className="font-bold">Safe Zone:</span>{" "}
                  <span className="text-dash-success">&gt; 2.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Gray Zone:</span>{" "}
                  <span className="text-yellow-400">1.81 - 2.99</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">Distress Zone:</span>{" "}
                  <span className="text-dash-danger">&lt; 1.81</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-dash-muted font-mono leading-relaxed border-t border-[rgba(255,255,255,0.04)] pt-3">
            Altman scores above 3.0 denote solid treasury cushions and
            negligible leverage stress.
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysis;
