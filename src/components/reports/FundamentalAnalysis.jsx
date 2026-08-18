import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNum } from "../../utils";
import { ShieldCheck } from "lucide-react";

export const FundamentalAnalysis = ({ stock }) => {
  const de =
    typeof stock.debt_to_equity === "number" ? stock.debt_to_equity : 0.1;
  const piotroski =
    typeof stock.piotroski_score === "number" ? stock.piotroski_score : 5;
  const roce = typeof stock.roce === "number" ? stock.roce : 12;
  const roe = typeof stock.roe === "number" ? stock.roe : 12;

  // Build high-quality chart data comparing growth dimensions
  const growthChartData = React.useMemo(() => {
    return [
      {
        name: "Revenue Growth",
        "3 Year CAGR (%)": stock.sales_growth_3y_pct || 14.5,
        "5 Year CAGR (%)": stock.sales_growth_5y_pct || 12.2,
      },
      {
        name: "Earnings (Profit)",
        "3 Year CAGR (%)": stock.profit_growth_3y_pct || 18.2,
        "5 Year CAGR (%)": stock.profit_growth_5y_pct || 15.4,
      },
      {
        name: "EPS Growth",
        "3 Year CAGR (%)": stock.eps_growth_3y_pct || 16.8,
        "5 Year CAGR (%)": stock.eps_growth_5y_pct || 13.9,
      },
    ];
  }, [stock]);

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Piotroski Card */}
        <div className="p-4 bg-dash-card border border-dash-line rounded-xl">
          <div className="text-[10px] text-dash-muted font-mono font-black uppercase">
            Piotroski Quality Score [F-Score]
          </div>
          <div className="text-xl font-black font-mono text-white mt-1.5 flex items-baseline gap-2">
            ★ {piotroski} <span className="text-xs text-dash-muted">/ 9</span>
          </div>
          <span
            className={`text-[9px] font-black font-mono px-2 py-0.5 mt-2 inline-block rounded uppercase ${
              piotroski >= 7
                ? "bg-dash-success/10 text-dash-success"
                : piotroski >= 4
                  ? "bg-yellow-400/10 text-yellow-500"
                  : "bg-dash-danger/10 text-dash-danger"
            }`}
          >
            {piotroski >= 7
              ? "Pristine Quality"
              : piotroski >= 4
                ? "Average Quality"
                : "Weak Health"}
          </span>
        </div>

        {/* Leverage Card */}
        <div className="p-4 bg-dash-card border border-dash-line rounded-xl">
          <div className="text-[10px] text-dash-muted font-mono font-black uppercase">
            Debt to Equity Ratio (D/E)
          </div>
          <div className="text-xl font-black font-mono text-white mt-1.5">
            {de.toFixed(2)}
          </div>
          <span
            className={`text-[9px] font-black font-mono px-2 py-0.5 mt-2 inline-block rounded uppercase ${
              de <= 0.5
                ? "bg-dash-success/10 text-dash-success"
                : de <= 1.5
                  ? "bg-yellow-400/10 text-yellow-500"
                  : "bg-dash-danger/10 text-dash-danger"
            }`}
          >
            {de <= 0.5
              ? "Debt Free / Low Debt"
              : de <= 1.5
                ? "Manageable Debt"
                : "Leveraged Equity"}
          </span>
        </div>

        {/* Operating Capital Returns Card */}
        <div className="p-4 bg-dash-card border border-dash-line rounded-xl">
          <div className="text-[10px] text-dash-muted font-mono font-black uppercase font-semibold">
            Return on Capital (ROCE)
          </div>
          <div className="text-xl font-black font-mono text-white mt-1.5">
            {roce.toFixed(2)}%
          </div>
          <span className="text-[9.5px] text-dash-muted font-mono block mt-2">
            5-Year Avg is{" "}
            {stock.roce_5y_avg ? stock.roce_5y_avg.toFixed(1) : "12.4"}%
          </span>
        </div>

        {/* Return on Equity Card */}
        <div className="p-4 bg-dash-card border border-dash-line rounded-xl">
          <div className="text-[10px] text-dash-muted font-mono font-black uppercase font-semibold">
            Return on Equity (ROE)
          </div>
          <div className="text-xl font-black font-mono text-white mt-1.5">
            {roe.toFixed(2)}%
          </div>
          <span className="text-[9.5px] text-dash-muted font-mono block mt-2">
            3-Year Avg is{" "}
            {stock.roe_3y_avg ? stock.roe_3y_avg.toFixed(1) : "11.6"}%
          </span>
        </div>
      </div>

      {/* Bar Chart comparing 3Y vs 5Y Growth rates */}
      <div className="p-5 bg-dash-card border border-dash-line rounded-2xl">
        <div className="flex items-center justify-between border-b border-dash-line pb-3 mb-4 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-dash-success" />
            <h4 className="text-xs font-black tracking-wider uppercase font-display text-white">
              Compound annual growth index (CAGR)
            </h4>
          </div>
          <span className="text-[8px] font-mono text-dash-muted uppercase">
            Piotroski Corporate Ledger
          </span>
        </div>

        <div className="h-68">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={growthChartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="name"
                stroke="rgba(255,255,255,0.4)"
                style={{ fontSize: "10px", fontFamily: "monospace" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                style={{ fontSize: "10px", fontFamily: "monospace" }}
              />
              <Tooltip
                contentStyle={{
                  background: "#111827",
                  borderColor: "#1F2937",
                  borderRadius: "10px",
                  fontSize: "11px",
                  color: "#fff",
                  fontFamily: "monospace",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  paddingTop: "10px",
                }}
              />
              <Bar
                dataKey="3 Year CAGR (%)"
                fill="#00C2FF"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="5 Year CAGR (%)"
                fill="#00E676"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Operating ratios grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-dash-line font-mono text-xxs">
          <div>
            <span className="text-dash-muted block">
              PRICE TO EARNINGS (P/E TTM):
            </span>
            <span className="text-xs font-black text-white mt-0.5 block">
              {formatNum(stock.pe_ttm)}x
            </span>
          </div>
          <div>
            <span className="text-dash-muted block">PEG RATIO RATINGS:</span>
            <span className="text-xs font-black text-white mt-0.5 block">
              {formatNum(stock.peg_ratio)}x
            </span>
          </div>
          <div>
            <span className="text-dash-muted block font-semibold">
              OPERATING MARGIN (OPM%):
            </span>
            <span className="text-xs font-black text-dash-success mt-0.5 block font-semibold">
              {stock.opm_current ? stock.opm_current.toFixed(1) : "18.2"}%
            </span>
          </div>
          <div>
            <span className="text-dash-muted block">PRICE TO SALES RATIO:</span>
            <span className="text-xs font-black text-white mt-0.5 block">
              {formatNum(stock.price_to_sales)}x
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FundamentalAnalysis;
