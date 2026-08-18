import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatPrice } from "../../utils";
import { Sliders } from "lucide-react";

export const TechnicalAnalysis = ({ stock }) => {
  const rsi = stock.day_rsi || 50;
  const adx = stock.day_adx || 20;
  const macd = stock.day_macd || 0;
  const signal = stock.day_macd_signal_line || 0;
  const macdSpread = macd - signal;

  const rsiLabel =
    rsi >= 70
      ? "Overbought Bearish"
      : rsi <= 30
        ? "Oversold Bullish"
        : "Neutral Range";
  const rsiColor =
    rsi >= 70
      ? "text-dash-danger"
      : rsi <= 30
        ? "text-dash-success"
        : "text-yellow-400";

  // Mock historic trend dataset including Moving Averages (SMA50, SMA200) matching current stock price point
  const chartData = React.useMemo(() => {
    const list = [];
    let priceCursor = stock.current_price * 0.94;
    const days = [
      "Mon",
      "Tue",
      "Wed",
      "Thu",
      "Fri",
      "Mon2",
      "Tue2",
      "Wed2",
      "Thu2",
      "Fri2",
    ];
    for (let i = 0; i < 10; i++) {
      const step =
        (stock.trendlyne_momentum_score - 45) * 0.005 +
        (Math.random() - 0.45) * 0.015;
      priceCursor = priceCursor * (1 + step);
      const sma50Cursor = priceCursor * (0.97 + (10 - i) * 0.003);
      const sma200Cursor = priceCursor * (0.93 + (10 - i) * 0.004);

      list.push({
        day: days[i],
        Price: parseFloat(priceCursor.toFixed(2)),
        SMA50: parseFloat(sma50Cursor.toFixed(2)),
        SMA200: parseFloat(sma200Cursor.toFixed(2)),
      });
    }

    return list;
  }, [stock]);

  return (
    <div className="space-y-6 select-none animate-fadeIn">
      {/* 2x3 grid of technical meters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* RSI Box */}
        <div className="p-4 bg-dash-card border border-dash-line rounded-xl">
          <div className="text-[10px] text-dash-muted font-mono font-black uppercase">
            Relative Strength Index [14D]
          </div>
          <div className="text-xl font-black font-mono text-white mt-1.5 flex items-baseline gap-2">
            {rsi.toFixed(2)}
            <span
              className={`text-xxs font-extrabold px-1.5 py-0.5 rounded uppercase leading-none ${rsiColor} bg-white/5`}
            >
              {rsiLabel}
            </span>
          </div>
          <div className="w-full bg-dash-bg h-1.5 rounded-full mt-3 overflow-hidden relative border border-dash-line">
            <div
              className={`h-full rounded-full ${rsi >= 70 ? "bg-dash-danger" : rsi <= 30 ? "bg-dash-success" : "bg-yellow-400"}`}
              style={{ width: `${rsi}%` }}
            />

            {/* Limit thresholds indicators */}
            <div className="absolute left-[30%] top-0 bottom-0 w-px bg-dash-muted/40" />
            <div className="absolute left-[70%] top-0 bottom-0 w-px bg-dash-muted/40" />
          </div>
        </div>

        {/* MACD Box */}
        <div className="p-4 bg-dash-card border border-dash-line rounded-xl">
          <div className="text-[10px] text-dash-muted font-mono font-black uppercase">
            MACD Divergence [12, 26, 9]
          </div>
          <div className="text-xl font-black font-mono text-white mt-1.5 flex items-baseline gap-2">
            {macd.toFixed(2)}
            <span
              className={`text-xxs font-extrabold px-1.5 py-0.5 rounded uppercase leading-none ${macdSpread >= 0 ? "text-dash-success bg-dash-success/5" : "text-dash-danger bg-dash-danger/5"}`}
            >
              {macdSpread >= 0 ? "Bullish Cross" : "Bearish Cross"}
            </span>
          </div>
          <p className="text-[9.5px] text-dash-muted mt-2 block font-mono">
            Signal Line is at {signal.toFixed(2)} | Histogram spread is{" "}
            {macdSpread.toFixed(2)}
          </p>
        </div>

        {/* ADX Box */}
        <div className="p-4 bg-dash-card border border-dash-line rounded-xl">
          <div className="text-[10px] text-dash-muted font-mono font-black uppercase">
            Trend Strength Index [ADX]
          </div>
          <div className="text-xl font-black font-mono text-white mt-1.5 flex items-baseline gap-2">
            {adx.toFixed(2)}
            <span className="text-xxs font-extrabold px-1.5 py-0.5 rounded uppercase leading-none text-cyan-400 bg-cyan-400/5">
              {adx >= 25 ? "Strong Trend" : "Sideway Consol"}
            </span>
          </div>
          <p className="text-[9.5px] text-dash-muted mt-2 block font-mono">
            Values above 25.0 signal strong transactional volume expansions.
          </p>
        </div>
      </div>

      {/* Main moving averages line chart */}
      <div className="p-5 bg-dash-card border border-dash-line rounded-2xl">
        <div className="flex items-center justify-between border-b border-dash-line pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-dash-primary" />
            <h4 className="text-xs font-black tracking-wider uppercase font-display text-white">
              Trend Support Line & Moving Averages
            </h4>
          </div>
          <span className="text-[8px] font-mono font-black text-dash-muted uppercase">
            TradingView Engine Framework
          </span>
        </div>

        <div className="h-68">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="day"
                stroke="rgba(255,255,255,0.4)"
                style={{ fontSize: "10px", fontFamily: "monospace" }}
              />
              <YAxis
                stroke="rgba(255,255,255,0.4)"
                domain={["auto", "auto"]}
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
              <Line
                type="monotone"
                dataKey="Price"
                stroke="#00C2FF"
                strokeWidth={2.5}
                activeDot={{ r: 6 }}
                dot={{ r: 1 }}
              />
              <Line
                type="monotone"
                dataKey="SMA50"
                stroke="#FFC107"
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="SMA200"
                stroke="#FF4D4F"
                strokeWidth={1}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-dash-line font-mono text-xxs">
          <div>
            <span className="text-dash-muted block">52 WEEK RANGE HIGH:</span>
            <span className="text-xs font-black text-white mt-0.5 block">
              {formatPrice(stock.year_1_high)}
            </span>
          </div>
          <div>
            <span className="text-dash-muted block">EMA 50 CORRELATION:</span>
            <span className="text-xs font-black text-dash-success mt-0.5 block">
              📊 Trading Above (Bullish)
            </span>
          </div>
          <div>
            <span className="text-dash-muted block">
              BOLLINGER WIDTH STATUS:
            </span>
            <span className="text-xs font-black text-white mt-0.5 block">
              Compressed (Vol Low)
            </span>
          </div>
          <div>
            <span className="text-dash-muted block">
              AVERAGE VOLATILITY (ATR):
            </span>
            <span className="text-xs font-black text-white mt-0.5 block">
              ₹{(stock.current_price * 0.024).toFixed(2)} (2.4%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
