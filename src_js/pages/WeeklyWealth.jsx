import React, { useState } from "react";
import { motion } from "motion/react";
import {
  TrendingUp,
  TrendingDown,
  LineChart,
  BarChart3,
  Layers,
  Award,
  Zap,
  BookOpen,
  Sparkles,
  Compass,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ScatterChart,
  Scatter,
  LabelList,
} from "recharts";

export const WeeklyWealth = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Palette color mapping
  const colors = {
    primary: "#00c2ff",
    success: "#10b981",
    danger: "#f43f5e",
    warning: "#fbbf24",
    muted: "#94a3b8",
    ink: "#f1f5f9",
  };

  // --- DATA FROM THE PDF ---

  // Page 2: Nifty Outlook stats
  const niftyOutlook = {
    nifty: "24176",
    weeklyChg: "0.74%",
    trendStatus: "Uptrend",
    breadth: "Positive",
    momentum: "Positive",
    supports: ["23878", "23580", "22980"],
    resistances: ["24478", "24780", "25380"],
  };

  // Page 3: Trend Sector Rotation Data (for Relative Rotation Scatter Plot)
  // Maps sectors into 4 quadrants: Improving, Leading, Lagging, Weakening
  const sectorRotationData = [
    { name: "NSEMED", ratio: 102.5, momentum: 103.5, quadrant: "Leading" },
    { name: "NSENRG", ratio: 110.0, momentum: 103.2, quadrant: "Leading" },
    { name: "NSEHLTRUP", ratio: 105.0, momentum: 101.8, quadrant: "Leading" },
    { name: "NSEPHRM", ratio: 106.0, momentum: 101.5, quadrant: "Leading" },
    { name: "NSEFMCG", ratio: 99.5, momentum: 101.8, quadrant: "Improving" },
    { name: "NSECON", ratio: 99.7, momentum: 101.2, quadrant: "Improving" },
    { name: "NSEREAL", ratio: 95.0, momentum: 101.5, quadrant: "Improving" },
    { name: "NSEMD", ratio: 108.0, momentum: 100.8, quadrant: "Weakening" },
    { name: "NSEMET", ratio: 112.0, momentum: 100.5, quadrant: "Weakening" },
    { name: "NSEAUTO", ratio: 101.5, momentum: 99.5, quadrant: "Weakening" },
    { name: "OILGASP", ratio: 102.4, momentum: 99.3, quadrant: "Weakening" },
    { name: "NSEBANK", ratio: 100.0, momentum: 98.2, quadrant: "Lagging" },
    {
      name: "Nifty 50 Index",
      ratio: 100.0,
      momentum: 100.0,
      quadrant: "Anchor",
    },
  ];

  // Page 4: Market Breadth Historical records
  const marketBreadthData = {
    columns: [
      "Date",
      "10 DMA (Qty)",
      "20 DMA (Qty)",
      "50 DMA (Qty)",
      "200 DMA (Qty)",
      "10 DMA (%)",
      "20 DMA (%)",
      "50 DMA (%)",
      "200 DMA (%)",
    ],
    segments: [
      {
        name: "NIFTY 50",
        records: [
          {
            date: "8th May",
            d10_qty: 34,
            d20_qty: 37,
            d50_qty: 38,
            d200_qty: 25,
            d10_pct: 67,
            d20_pct: 73,
            d50_pct: 75,
            d200_pct: 49,
          },
          {
            date: "7th May",
            d10_qty: 34,
            d20_qty: 36,
            d50_qty: 39,
            d200_qty: 27,
            d10_pct: 67,
            d20_pct: 71,
            d50_pct: 76,
            d200_pct: 53,
          },
          {
            date: "6th May",
            d10_qty: 35,
            d20_qty: 39,
            d50_qty: 38,
            d200_qty: 26,
            d10_pct: 69,
            d20_pct: 76,
            d50_pct: 75,
            d200_pct: 51,
          },
          {
            date: "5th May",
            d10_qty: 23,
            d20_qty: 32,
            d50_qty: 30,
            d200_qty: 24,
            d10_pct: 45,
            d20_pct: 63,
            d50_pct: 59,
            d200_pct: 47,
          },
          {
            date: "4th May",
            d10_qty: 20,
            d20_qty: 32,
            d50_qty: 34,
            d200_qty: 24,
            d10_pct: 39,
            d20_pct: 63,
            d50_pct: 67,
            d200_pct: 47,
          },
        ],
      },
      {
        name: "NIFTY 100",
        records: [
          {
            date: "8th May",
            d10_qty: 62,
            d20_qty: 69,
            d50_qty: 71,
            d200_qty: 47,
            d10_pct: 62,
            d20_pct: 69,
            d50_pct: 71,
            d200_pct: 47,
          },
          {
            date: "7th May",
            d10_qty: 69,
            d20_qty: 73,
            d50_qty: 74,
            d200_qty: 49,
            d10_pct: 69,
            d20_pct: 73,
            d50_pct: 74,
            d200_pct: 49,
          },
          {
            date: "6th May",
            d10_qty: 66,
            d20_qty: 73,
            d50_qty: 70,
            d200_qty: 47,
            d10_pct: 66,
            d20_pct: 73,
            d50_pct: 70,
            d200_pct: 47,
          },
          {
            date: "5th May",
            d10_qty: 47,
            d20_qty: 60,
            d50_qty: 62,
            d200_qty: 45,
            d10_pct: 47,
            d20_pct: 60,
            d50_pct: 62,
            d200_pct: 45,
          },
          {
            date: "4th May",
            d10_qty: 38,
            d20_qty: 60,
            d50_qty: 61,
            d200_qty: 45,
            d10_pct: 38,
            d20_pct: 60,
            d50_pct: 61,
            d200_pct: 45,
          },
        ],
      },
      {
        name: "NIFTY 200",
        records: [
          {
            date: "8th May",
            d10_qty: 126,
            d20_qty: 141,
            d50_qty: 153,
            d200_qty: 108,
            d10_pct: 63,
            d20_pct: 71,
            d50_pct: 77,
            d200_pct: 54,
          },
          {
            date: "7th May",
            d10_qty: 139,
            d20_qty: 145,
            d50_qty: 156,
            d200_qty: 113,
            d10_pct: 70,
            d20_pct: 73,
            d50_pct: 78,
            d200_pct: 57,
          },
          {
            date: "6th May",
            d10_qty: 136,
            d20_qty: 150,
            d50_qty: 150,
            d200_qty: 107,
            d10_pct: 68,
            d20_pct: 75,
            d50_pct: 75,
            d200_pct: 54,
          },
          {
            date: "5th May",
            d10_qty: 96,
            d20_qty: 131,
            d50_qty: 135,
            d200_qty: 98,
            d10_pct: 48,
            d20_pct: 66,
            d50_pct: 68,
            d200_pct: 49,
          },
          {
            date: "4th May",
            d10_qty: 88,
            d20_qty: 135,
            d50_qty: 138,
            d200_qty: 96,
            d10_pct: 44,
            d20_pct: 68,
            d50_pct: 69,
            d200_pct: 48,
          },
        ],
      },
      {
        name: "NIFTY 500",
        records: [
          {
            date: "8th May",
            d10_qty: 355,
            d20_qty: 377,
            d50_qty: 419,
            d200_qty: 257,
            d10_pct: 71,
            d20_pct: 75,
            d50_pct: 84,
            d200_pct: 51,
          },
          {
            date: "7th May",
            d10_qty: 379,
            d20_qty: 400,
            d50_qty: 426,
            d200_qty: 261,
            d10_pct: 76,
            d20_pct: 80,
            d50_pct: 85,
            d200_pct: 52,
          },
          {
            date: "6th May",
            d10_qty: 365,
            d20_qty: 401,
            d50_qty: 418,
            d200_qty: 246,
            d10_pct: 73,
            d20_pct: 80,
            d50_pct: 83,
            d200_pct: 49,
          },
          {
            date: "5th May",
            d10_qty: 267,
            d20_qty: 357,
            d50_qty: 376,
            d200_qty: 224,
            d10_pct: 53,
            d20_pct: 71,
            d50_pct: 75,
            d200_pct: 45,
          },
          {
            date: "4th May",
            d10_qty: 270,
            d20_qty: 377,
            d50_qty: 384,
            d200_qty: 224,
            d10_pct: 53,
            d20_pct: 75,
            d50_pct: 77,
            d200_pct: 45,
          },
        ],
      },
    ],
  };

  // Page 5: Open Interest strike calculations
  const optionsOiData = [
    { strike: "23,650", calls: 1.2, puts: 8.4 },
    { strike: "23,750", calls: 1.5, puts: 11.2 },
    { strike: "23,850", calls: 2.1, puts: 18.5 },
    { strike: "23,950", calls: 3.4, puts: 26.2 },
    { strike: "24,050", calls: 4.8, puts: 38.4 },
    { strike: "24,150", calls: 6.5, puts: 45.1 },
    { strike: "24,250", calls: 12.8, puts: 35.6 },
    { strike: "24,350", calls: 28.5, puts: 15.2 },
    { strike: "24,450", calls: 58.6, puts: 8.5 },
    { strike: "24,550", calls: 86.4, puts: 4.1 },
    { strike: "24,650", calls: 45.2, puts: 1.8 },
  ];

  // Page 6: Sectoral performances bar data
  const bseSectorPerformance = [
    { sector: "AUTO", pct: 4.88 },
    { sector: "OIL & GAS", pct: -0.97 },
    { sector: "HEALTHCARE", pct: 4.3 },
    { sector: "POWER", pct: 1.58 },
    { sector: "REALTY", pct: 4.61 },
    { sector: "CAP GOODS", pct: 3.78 },
    { sector: "FMCG", pct: 0.57 },
    { sector: "BANKEX", pct: 1.05 },
    { sector: "METAL", pct: 1.3 },
    { sector: "IT", pct: 0.63 },
    { sector: "CD", pct: 2.46 },
  ];

  // Page 6: Top OI Weekly Changes
  const topOiGainers = [
    {
      scrip: "NUVAMA",
      price: 1598,
      lastPrice: 1324,
      priceChg: 21,
      oi: "1.68M",
      lastOi: "1.26M",
      oiChg: 33,
    },
    {
      scrip: "360ONE",
      price: 1124,
      lastPrice: 1039,
      priceChg: 8,
      oi: "5.32M",
      lastOi: "4.00M",
      oiChg: 33,
    },
    {
      scrip: "DRREDDY",
      price: 1292,
      lastPrice: 1321,
      priceChg: -2,
      oi: "19.93M",
      lastOi: "15.05M",
      oiChg: 32,
    },
    {
      scrip: "KPITTECH",
      price: 721,
      lastPrice: 762,
      priceChg: -5,
      oi: "7.90M",
      lastOi: "5.98M",
      oiChg: 32,
    },
    {
      scrip: "HDFCLIFE",
      price: 625,
      lastPrice: 590,
      priceChg: 6,
      oi: "50.65M",
      lastOi: "39.47M",
      oiChg: 28,
    },
  ];

  const topOiLosers = [
    {
      scrip: "BERGEPAINT",
      price: 381,
      lastPrice: 386,
      priceChg: -1,
      oi: "166.17M",
      lastOi: "203.60M",
      oiChg: -18,
    },
    {
      scrip: "INDIAMART",
      price: 363,
      lastPrice: 362,
      priceChg: 0,
      oi: "23.17M",
      lastOi: "27.15M",
      oiChg: -15,
    },
    {
      scrip: "APOLLOTYRE",
      price: 364,
      lastPrice: 348,
      priceChg: 5,
      oi: "38.19M",
      lastOi: "43.68M",
      oiChg: -13,
    },
    {
      scrip: "SHREECEM",
      price: 964,
      lastPrice: 902,
      priceChg: 7,
      oi: "12.22M",
      lastOi: "13.92M",
      oiChg: -12,
    },
    {
      scrip: "CYIENT",
      price: 5138,
      lastPrice: 4822,
      priceChg: 7,
      oi: "3.62M",
      lastOi: "4.12M",
      oiChg: -12,
    },
  ];

  // Page 7: Technical summary tables
  const domesticIndices = [
    { index: "Nifty 50", value: "24,181", prev: "23,998", chg: 0.8 },
    { index: "Nifty Next 50", value: "71,465", prev: "69,644", chg: 2.6 },
    { index: "Nifty 100", value: "25,168", prev: "24,896", chg: 1.1 },
    { index: "Nifty 500", value: "23,112", prev: "22,684", chg: 1.9 },
    { index: "Nifty MIDCAP 100", value: "61,873", prev: "59,785", chg: 3.5 },
    { index: "Nifty Smallcap 250", value: "17,436", prev: "16,731", chg: 4.2 },
    { index: "BSE SENSEX", value: "77,328", prev: "76,914", chg: 0.5 },
    { index: "BSE-100", value: "25,696", prev: "25,393", chg: 1.2 },
    { index: "BSE-200", value: "11,274", prev: "11,106", chg: 1.5 },
    { index: "BSE-500", value: "36,187", prev: "35,516", chg: 1.9 },
    { index: "India VIX", value: "17.0", prev: "18.0", chg: -7.0 },
  ];

  const worldIndices = [
    { index: "Nikkei Index", value: "62,714", prev: "59,444", chg: 5.5 },
    { index: "Hang Seng Index", value: "26,394", prev: "25,777", chg: 2.4 },
    { index: "Kospi Index", value: "7,498", prev: "6,599", chg: 13.6 },
    { index: "Shanghai SE", value: "4,180", prev: "4,112", chg: 1.6 },
    { index: "Strait Times Index", value: "4,923", prev: "4,923", chg: 0.0 },
    { index: "Dow Jones", value: "49,609", prev: "49,652", chg: -0.1 },
    { index: "NASDAQ", value: "26,247", prev: "24,892", chg: 5.4 },
    { index: "FTSE", value: "10,233", prev: "10,379", chg: -1.4 },
  ];

  const forexRates = [
    { currency: "US$ (Rs.)", value: "94.4", prev: "94.9", chg: -0.5 },
    { currency: "GBP (Rs.)", value: "128.6", prev: "128.9", chg: -0.2 },
    { currency: "Euro (Rs.)", value: "111.1", prev: "111.3", chg: -0.1 },
    { currency: "Yen (Rs.) 100 Units", value: "60.3", prev: "60.5", chg: -0.4 },
  ];

  const niftyTopGainers = [
    {
      scrip: "Mahindra & Mahindra Ltd.",
      value: "3,330",
      prev: "3,098",
      chg: 7.5,
    },
    { scrip: "Shriram Finance Ltd.", value: "1,008", prev: "937", chg: 7.5 },
    { scrip: "Bajaj Auto Ltd.", value: "10,712", prev: "9,992", chg: 7.2 },
    { scrip: "Asian Paints Ltd.", value: "2,600", prev: "2,444", chg: 6.4 },
    {
      scrip: "Grasim Industries Ltd.",
      value: "2,969",
      prev: "2,795",
      chg: 6.2,
    },
  ];

  const niftyTopLosers = [
    {
      scrip: "Oil And Natural Gas Ltd.",
      value: "1,268",
      prev: "1,361",
      chg: -6.8,
    },
    { scrip: "Coal India Ltd.", value: "937", prev: "989", chg: -5.2 },
    { scrip: "State Bank of India", value: "1,263", prev: "1,324", chg: -4.6 },
    {
      scrip: "Tata Consultancy Services Ltd.",
      value: "1,199",
      prev: "1,239",
      chg: -3.2,
    },
    { scrip: "Bharti Airtel Ltd.", value: "4,295", prev: "4,419", chg: -2.8 },
  ];

  const fiiActivity = [
    {
      date: "08-May-26",
      purchases: "15,083.5",
      sales: "19,194.1",
      net: "-4,110.6",
    },
    {
      date: "07-May-26",
      purchases: "17,998.0",
      sales: "18,338.8",
      net: "-340.9",
    },
    {
      date: "06-May-26",
      purchases: "14,459.2",
      sales: "20,294.1",
      net: "-5,834.9",
    },
    {
      date: "05-May-26",
      purchases: "10,392.9",
      sales: "14,014.5",
      net: "-3,621.6",
    },
    {
      date: "04-May-26",
      purchases: "19,660.5",
      sales: "16,824.9",
      net: "2,835.6",
    },
    { date: "MTD", purchases: "77,594.0", sales: "88,666.4", net: "-11,072.4" },
  ];

  const diiActivity = [
    {
      date: "08-May-26",
      purchases: "21,296.9",
      sales: "14,548.7",
      net: "6,748.1",
    },
    {
      date: "07-May-26",
      purchases: "17,032.1",
      sales: "16,591.0",
      net: "441.1",
    },
    {
      date: "06-May-26",
      purchases: "22,888.2",
      sales: "16,051.3",
      net: "6,836.9",
    },
    {
      date: "05-May-26",
      purchases: "16,234.3",
      sales: "13,631.7",
      net: "2,602.6",
    },
    {
      date: "04-May-26",
      purchases: "19,516.1",
      sales: "14,752.0",
      net: "4,764.2",
    },
    { date: "MTD", purchases: "96,967.5", sales: "75,574.7", net: "21,392.9" },
  ];

  // Page 8: Bharat Electronics Ltd. Detailed Analysis
  const belAnalysis = {
    technicalView: [
      "The stock is currently in a strong uptrend and has been forming healthy consolidations near the top. This sideways movement is creating a solid base, which is necessary for the stock to gather strength for its next leg up.",
      "A key observation on the daily chart is the recent 50 DMA undercut that occurred in April. The price briefly dipped below the 50-day average to shake out weak hands before quickly reclaiming the level, which is a classic bullish sign.",
      "Before the recent rally, the stock spent significant time in a consolidation between the 200 and 50 DMA. This range-bound activity acted as a major accumulation zone, providing the necessary liquidity for the current breakout.",
      "The area around ₹430 - ₹435 has emerged as a major liquidity zone. The stock has established firm pivot support in this region, and the DMA Cloud is currently acting as a dynamic floor for the price action.",
      "The MACD indicator is positioned in positive territory and is showing signs of a fresh bullish curve. This is well-supported by stable volumes, indicating that the 'big money' is still holding the stock and buying on minor dips.",
      "If the price breaks out and sustains above the current resistance levels, it can achieve a milestone target price of ₹476.",
      "A decisive close below ₹419 will negate the bullish technical setup view.",
    ],
    executionData: {
      target: "476",
      upside: "8.92%",
      buyRange: "437 - 440",
      stopLoss: "419",
      risk: "-4.12%",
      indicators: [
        { name: "10 MA", status: "FLAT" },
        { name: "20 MA", status: "FLAT" },
        { name: "50 MA", status: "FLAT" },
        { name: "RSI Mode", status: "BUY MODE" },
        { name: "MACD Mode", status: "BUY MODE" },
      ],
    },
    keyData: {
      nifty: "24176",
      range52W: "316 / 473",
      marketCapCr: "3,21,000",
      osSharesCr: "731",
      faceValue: "1.00",
    },
  };

  return (
    <div
      id="weekly_wealth_page"
      className="space-y-8 select-none font-sans pb-12"
    >
      {/* Editorial Title Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-premium rounded-2xl p-6 border-l-4 border-dash-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black tracking-widest bg-dash-primary/15 text-dash-primary uppercase">
              Weekly Research Digest
            </span>
            <span className="text-[10px] text-dash-muted font-mono font-bold">
              • Ingested 9th May 2026
            </span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-dash-primary animate-pulse" />
            WEEKLY WEALTH INTEL
          </h2>
          <p className="text-xs text-dash-muted">
            Institutional market analysis, RRG rotation charts, option chain
            dynamics, and premium stock breakouts.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-dash-bg/60 border border-dash-line rounded-xl px-4 py-3 font-mono text-[11px] h-fit">
          <div className="w-2.5 h-2.5 rounded-full bg-dash-success relative flex">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dash-success opacity-75"></span>
          </div>
          <div>
            <span className="text-dash-muted block text-[9px] font-black tracking-wider uppercase">
              CURRENT REPORT
            </span>
            <span className="text-white font-bold font-mono">
              STOXBOX ISSUE #352
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs Navigation Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dash-line pb-0.5">
        {[
          { id: "overview", label: "Executive Summary", icon: BookOpen },
          { id: "market-pulse", label: "Market Breadth & Pulse", icon: Layers },
          { id: "technicals", label: "Option Chain support", icon: LineChart },
          { id: "sectors", label: "Seclor Rotations & OI", icon: BarChart3 },
          { id: "indices", label: "Global Indices Activity", icon: Compass },
          { id: "featured", label: "Featured Breakout (BEL)", icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-0.5 cursor-pointer relative ${
                isSelected
                  ? "border-dash-primary text-white font-black"
                  : "border-transparent text-dash-muted hover:text-white hover:border-white/10"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${isSelected ? "text-dash-primary animate-pulse" : "text-dash-muted"}`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Active Tab Screen Renderers */}
      <div className="mt-4">
        {/* TAB 1: EXECUTIVE SUMMARY */}
        {activeTab === "overview" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6"
          >
            {/* Week Gone and Week Ahead Text */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-dash-line">
                  <span className="w-2.5 h-2.5 rounded bg-dash-danger" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                    WEEK GONE SUMMARY
                  </h3>
                </div>
                <p className="text-xs text-dash-ink leading-relaxed font-sans text-justify">
                  Indian equity markets ended the week on a positive note, with
                  the Sensex and Nifty posting modest gains. Sentiment was
                  supported by robust Q4 earnings from select autos, IT, real
                  estate, and renewable energy names, alongside improving
                  domestic macro indicators reflected in resilient manufacturing
                  and services PMI readings. However, performance was
                  stock-specific, with several large-cap counters witnessing
                  profit booking despite overall index strength. Global cues
                  remained mixed, with optimism around a potential US–Iran
                  understanding supporting risk appetite, while persistent
                  inflation pressures and elevated energy prices kept caution
                  intact. Despite intermittent volatility driven by geopolitical
                  developments and sectoral rotations, strong domestic
                  liquidity, healthy earnings momentum, and steady institutional
                  participation helped sustain the broader upward bias through
                  the week.
                </p>
              </div>

              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-dash-line">
                  <span className="w-2.5 h-2.5 rounded bg-[#fbbf24] animate-pulse" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                    WEEK AHEAD OUTLOOK
                  </h3>
                </div>
                <p className="text-xs text-dash-ink leading-relaxed font-sans text-justify">
                  Indian equities head into the next trading week with
                  heightened sensitivity to global macro and geopolitical
                  developments. Escalating tensions in West Asia continued to
                  keep energy markets volatile, with Brent crude remaining above
                  $100 per barrel, raising concerns around imported inflation,
                  currency stability and global growth. Domestically, India’s
                  manufacturing activity remained resilient, though growth
                  stayed near a four-year low, with the HSBC India Manufacturing
                  PMI rising marginally to 54.7 in April from 53.9 in March,
                  while war-driven fuel costs pushed input-price pressures to
                  their highest level since August 2022. Currency markets also
                  remained under pressure, with the Indian rupee weakening
                  toward record lows near 95.3 against the US dollar, reflecting
                  elevated crude prices and cautious foreign flows. Against this
                  backdrop of geopolitical uncertainty and rising cost
                  pressures, Indian equities may remain range-bound, with
                  investors closely tracking oil prices, inflation trends,
                  central-bank signals and quarterly earnings for near-term
                  direction.
                </p>
              </div>
            </div>

            {/* Outlook Indicator Summary Sidebar block */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-premium p-5 rounded-2xl space-y-4 border border-dash-line shadow-lg">
                <div className="text-xs font-black tracking-widest uppercase border-b border-dash-line pb-3 text-white flex items-center justify-between">
                  <span>Nifty Outlook</span>
                  <Award className="w-4 h-4 text-dash-primary" />
                </div>

                <div className="space-y-3.5">
                  <div className="bg-dash-bg/50 p-3 rounded-xl border border-dash-line flex justify-between items-center">
                    <span className="text-[10px] font-black text-dash-muted uppercase">
                      NIFTY 50 INDEX
                    </span>
                    <span className="text-xs font-black text-white font-mono">
                      {niftyOutlook.nifty}
                    </span>
                  </div>

                  <div className="bg-dash-bg/50 p-3 rounded-xl border border-dash-line flex justify-between items-center">
                    <span className="text-[10px] font-black text-dash-muted uppercase">
                      WEEKLY CHANGE
                    </span>
                    <span className="text-xs font-black text-dash-success font-mono">
                      {niftyOutlook.weeklyChg}
                    </span>
                  </div>

                  <div className="bg-dash-bg/50 p-3 rounded-xl border border-dash-line flex justify-between items-center">
                    <span className="text-[10px] font-black text-dash-muted uppercase">
                      TREND STATUS
                    </span>
                    <span className="text-xs font-extrabold text-dash-success uppercase tracking-wider">
                      {niftyOutlook.trendStatus}
                    </span>
                  </div>

                  <div className="bg-dash-bg/50 p-3 rounded-xl border border-dash-line flex justify-between items-center">
                    <span className="text-[10px] font-black text-dash-muted uppercase">
                      BREADTH
                    </span>
                    <span className="text-xs font-extrabold text-dash-success uppercase tracking-wider">
                      {niftyOutlook.breadth}
                    </span>
                  </div>

                  <div className="bg-dash-bg/50 p-3 rounded-xl border border-dash-line flex justify-between items-center">
                    <span className="text-[10px] font-black text-dash-muted uppercase">
                      MOMENTUM
                    </span>
                    <span className="text-xs font-extrabold text-[#10b981] uppercase tracking-wider">
                      {niftyOutlook.momentum}
                    </span>
                  </div>
                </div>

                {/* Supports levels */}
                <div className="space-y-2 pt-2 border-t border-dash-line">
                  <span className="text-[9px] font-black text-dash-muted font-mono uppercase tracking-widest block">
                    Pivot Support Floors
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {niftyOutlook.supports.map((sup, idx) => (
                      <div
                        key={idx}
                        className="bg-dash-bg/30 border border-dash-line rounded p-1.5 text-center font-mono text-[10px]"
                      >
                        <span className="text-[8px] text-dash-danger block uppercase font-bold">
                          S{idx + 1}
                        </span>
                        <span className="text-white font-bold">{sup}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resistance levels */}
                <div className="space-y-2 pt-2 border-t border-dash-line">
                  <span className="text-[9px] font-black text-dash-muted font-mono uppercase tracking-widest block">
                    Pivot Ceiling Targets
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {niftyOutlook.resistances.map((res, idx) => (
                      <div
                        key={idx}
                        className="bg-dash-bg/30 border border-dash-line rounded p-1.5 text-center font-mono text-[10px]"
                      >
                        <span className="text-[8px] text-dash-success block uppercase font-bold">
                          R{idx + 1}
                        </span>
                        <span className="text-white font-bold">{res}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: MARKET PULSE */}
        {activeTab === "market-pulse" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Relative Rotation Chart Section */}
            <div className="glass-premium p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-dash-line pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                    RELATIVE ROTATION GRAPH (MARKET TREND VECTOR)
                  </h3>
                </div>
                <span className="text-[8.5px] font-mono font-black py-0.5 px-2 bg-dash-primary/10 border border-dash-primary/20 text-dash-primary rounded uppercase">
                  JDK RS-Ratio vs Momentum
                </span>
              </div>

              {/* RRG Scatter plot representation */}
              <div className="h-96 w-full relative">
                {/* Visual grid quadrants background guides */}
                <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-10 pointer-events-none">
                  <div className="border-r border-b border-white flex items-end justify-start p-4">
                    <span className="text-[10px] font-black tracking-widest text-dash-danger font-mono uppercase">
                      Lagging Vector
                    </span>
                  </div>
                  <div className="border-b border-white flex items-end justify-end p-4">
                    <span className="text-[10px] font-black tracking-widest text-dash-warning font-mono uppercase">
                      Weakening Vector
                    </span>
                  </div>
                  <div className="border-r border-white flex items-start justify-start p-4">
                    <span className="text-[10px] font-black tracking-widest text-[#00c2ff] font-mono uppercase">
                      Improving Vector
                    </span>
                  </div>
                  <div className="flex items-start justify-end p-4">
                    <span className="text-[10px] font-black tracking-widest text-dash-success font-mono uppercase">
                      Leading Vector
                    </span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart
                    margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis
                      type="number"
                      dataKey="ratio"
                      name="RS-Ratio"
                      domain={[92, 114]}
                      stroke="#94a3b8"
                      fontSize={10}
                      label={{
                        value: "RS-Ratio (Relative Strength Strength)",
                        position: "insideBottom",
                        offset: -5,
                        fill: "#94a3b8",
                        fontSize: 10,
                      }}
                    />

                    <YAxis
                      type="number"
                      dataKey="momentum"
                      name="RS-Momentum"
                      domain={[94, 105]}
                      stroke="#94a3b8"
                      fontSize={10}
                      label={{
                        value: "RS-Momentum (Velocity Dynamics)",
                        angle: -90,
                        position: "insideLeft",
                        offset: 10,
                        fill: "#94a3b8",
                        fontSize: 10,
                      }}
                    />

                    <Tooltip
                      cursor={{
                        strokeDasharray: "3 3",
                        stroke: "rgba(0,194,255,0.3)",
                      }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="glass p-3 rounded-lg border border-white/10 font-mono text-[10px] space-y-1">
                              <p className="font-extrabold text-white text-xs">
                                {data.name}
                              </p>
                              <p className="text-dash-primary">
                                RS-Ratio:{" "}
                                <span className="text-white">{data.ratio}</span>
                              </p>
                              <p className="text-dash-primary">
                                Momentum:{" "}
                                <span className="text-white">
                                  {data.momentum}
                                </span>
                              </p>
                              <p className="text-dash-primary">
                                Sector Quadrant:{" "}
                                <span className="text-white px-1.5 py-0.5 rounded bg-white/10">
                                  {data.quadrant}
                                </span>
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />

                    <Scatter name="Sectors" data={sectorRotationData}>
                      {sectorRotationData.map((entry, index) => {
                        let fillVal = "#00c2ff"; // Improving
                        if (entry.quadrant === "Leading") fillVal = "#10b981";
                        if (entry.quadrant === "Lagging") fillVal = "#f43f5e";
                        if (entry.quadrant === "Weakening") fillVal = "#fbbf24";
                        if (entry.quadrant === "Anchor") fillVal = "#ffffff";
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={fillVal}
                            stroke={
                              entry.name === "Nifty 50 Index"
                                ? entry.name
                                : "transparent"
                            }
                            strokeWidth={
                              entry.name === "Nifty 50 Index" ? 2 : 0
                            }
                          />
                        );
                      })}
                      <LabelList
                        dataKey="name"
                        position="insideTopRight"
                        style={{
                          fill: "#f1f5f9",
                          fontSize: 9,
                          fontFamily: "monospace",
                        }}
                      />
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Market Breadth Historical Table DMAs */}
            <div className="glass-premium p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-dash-line pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                    MARKET BREADTH DEEP LEDGER
                  </h3>
                </div>
                <span className="text-[8.5px] font-mono font-black py-0.5 px-2 bg-dash-primary/10 border border-dash-primary/20 text-dash-primary rounded uppercase">
                  Active DMA Spacing Matrix
                </span>
              </div>

              <div className="space-y-6">
                {marketBreadthData.segments.map((segment, segIdx) => (
                  <div key={segIdx} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#00c2ff] font-sans tracking-wide">
                        {segment.name} INDEX
                      </span>
                      <span className="text-[9px] font-mono font-bold text-dash-muted">
                        DMA CALIBRATION SUMMARY
                      </span>
                    </div>

                    <div className="overflow-x-auto border border-dash-line rounded-xl">
                      <table className="w-full text-left font-mono text-[10px]">
                        <thead>
                          <tr className="bg-dash-bg border-b border-dash-line">
                            <th className="p-3 font-bold text-dash-muted uppercase tracking-widest">
                              Date
                            </th>
                            <th
                              className="p-3 font-bold text-dash-muted uppercase tracking-widest text-center"
                              colSpan={4}
                            >
                              NUMBER OF STOCKS TRADING ABOVE DMAs
                            </th>
                            <th
                              className="p-3 font-bold text-dash-muted uppercase tracking-widest text-center"
                              colSpan={4}
                            >
                              % OF STOCKS TRADING ABOVE DMAs
                            </th>
                          </tr>
                          <tr className="bg-ash-bg/50 border-b border-dash-line text-xxs border-white/[0.04]">
                            <th className="p-2 border-r border-[#334155]/20 font-bold text-dash-muted text-center"></th>
                            <th className="p-2 font-black text-rose-400 text-center">
                              10 DMA
                            </th>
                            <th className="p-2 font-black text-[#fbbf24] text-center">
                              20 DMA
                            </th>
                            <th className="p-2 font-black text-[#00c2ff] text-center">
                              50 DMA
                            </th>
                            <th className="p-2 border-r border-[#334155]/20 font-black text-emerald-400 text-center">
                              200 DMA
                            </th>
                            <th className="p-2 font-black text-rose-400 text-center">
                              10 DMA
                            </th>
                            <th className="p-2 font-black text-[#fbbf24] text-center">
                              20 DMA
                            </th>
                            <th className="p-2 font-black text-[#00c2ff] text-center">
                              50 DMA
                            </th>
                            <th className="p-2 font-black text-emerald-400 text-center">
                              200 DMA
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {segment.records.map((rec, rIdx) => (
                            <tr
                              key={rIdx}
                              className="border-b border-dash-line hover:bg-white/[0.02] transition-colors"
                            >
                              <td className="p-3 border-r border-[#334155]/20 font-bold text-white text-center">
                                {rec.date}
                              </td>
                              <td className="p-2 text-center text-white font-bold">
                                {rec.d10_qty}
                              </td>
                              <td className="p-2 text-center text-[#fbbf24] font-bold">
                                {rec.d20_qty}
                              </td>
                              <td className="p-2 text-center text-[#00c2ff] font-bold">
                                {rec.d50_qty}
                              </td>
                              <td className="p-2 border-r border-[#334155]/20 text-center text-emerald-400 font-bold">
                                {rec.d200_qty}
                              </td>
                              <td className="p-2 text-center text-[#f43f5e] font-black">
                                {rec.d10_pct}%
                              </td>
                              <td className="p-2 text-center text-[#fbbf24] font-black">
                                {rec.d20_pct}%
                              </td>
                              <td className="p-2 text-center text-[#00c2ff] font-black">
                                {rec.d50_pct}%
                              </td>
                              <td className="p-2 text-center text-emerald-400 font-black">
                                {rec.d200_pct}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: OPTION CHAIN AND TECHNICAL ANALYSIS */}
        {activeTab === "technicals" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Direct Option Pain strike price distribution Recharts bar chart */}
            <div className="lg:col-span-2 glass-premium p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-dash-line pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <LineChart className="w-5 h-5 text-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                    OPEN INTEREST DISTRIBUTION & PAIN LEVEL STRIKES
                  </h3>
                </div>
                <div className="text-[9px] font-mono text-dash-muted flex gap-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#00c2ff] rounded-full" /> CALLS
                    OI
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#f43f5e] rounded-full" /> PUTS
                    OI
                  </span>
                </div>
              </div>

              {/* Ticker stats */}
              <div className="grid grid-cols-3 gap-4 font-mono text-[11px] bg-dash-bg/60 p-3 rounded-xl border border-dash-line">
                <div>
                  <span className="text-[9px] text-dash-muted block">
                    SPOT PRICE
                  </span>
                  <span className="text-white font-bold">24,180.5</span>
                </div>
                <div>
                  <span className="text-[9px] text-dash-muted block">
                    CALLS OI SUMMARY
                  </span>
                  <span className="text-[#00c2ff] font-bold">15.81 Cr</span>
                </div>
                <div>
                  <span className="text-[9px] text-dash-muted block">
                    PUTS OI SUMMARY
                  </span>
                  <span className="text-[#f43f5e] font-bold">12.55 Cr</span>
                </div>
              </div>

              {/* Chart container */}
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={optionsOiData}
                    margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.04)"
                    />
                    <XAxis dataKey="strike" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={9} />
                    <Tooltip
                      contentStyle={{
                        background: "#070b19",
                        borderColor: "rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                      }}
                      labelClassName="text-white text-xs font-bold font-mono"
                      itemStyle={{ fontFamily: "monospace", fontSize: 10 }}
                    />

                    <Bar
                      dataKey="calls"
                      name="Calls OI (Qty Cr)"
                      fill="#00c2ff"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="puts"
                      name="Puts OI (Qty Cr)"
                      fill="#f43f5e"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Technical Overview Commentary column */}
            <div className="lg:col-span-1 glass-premium p-6 rounded-2xl space-y-4 max-h-[500px] overflow-y-auto">
              <div className="flex items-center gap-2 border-b border-dash-line pb-3">
                <Compass className="w-5 h-5 text-dash-primary animate-pulse" />
                <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                  INDEX TECHNICAL COMMENTARY
                </h3>
              </div>

              <div className="space-y-4 font-sans text-xs leading-relaxed text-dash-ink">
                <div>
                  <span className="text-[9px] font-mono font-black text-dash-primary uppercase tracking-wider block mb-1">
                    CONSOLIDATION CYCLE
                  </span>
                  <p className="text-justify bg-dash-bg/25 border border-dash-line/30 p-2.5 rounded-xl">
                    The Nifty 50 has transitioned into a healthy consolidation
                    phase this week, successfully digesting the overextended
                    momentum generated by the prior fortnight’s vertical
                    recovery. The index is currently navigating a shallow
                    retracement, finding institutional demand near established
                    support bases as it prepares for its next directional
                    impulse.
                  </p>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-black text-dash-primary uppercase tracking-wider block mb-1">
                    PULSE CHARTS INDICATIONS
                  </span>
                  <p className="text-justify bg-dash-bg/25 border border-dash-line/30 p-2.5 rounded-xl">
                    On the weekly chart, price action has resulted in a
                    small-bodied candle with an upper shadow, signaling a
                    temporary equilibrium. This structure effectively creates a
                    higher base above the critical 23,800-23,950 demand zone,
                    neutralizing the capitulation bias of early April.
                  </p>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-black text-[#fbbf24] uppercase tracking-wider block mb-1">
                    MOVING AVERAGES PINNING
                  </span>
                  <p className="text-justify bg-dash-bg/25 border border-dash-line/30 p-2.5 rounded-xl">
                    The index is currently sandwiched between two major
                    technical pivot zones. It faced sharp rejection at the
                    50-DMA, but is showing resilience by holding the dynamic
                    support of the short-term EMAs. The long-term 200-DMA, now
                    descending, remains the primary positional overhead target.
                  </p>
                </div>

                <div>
                  <span className="text-[9px] font-mono font-black text-[#10b981] uppercase tracking-wider block mb-1">
                    MOMENTUM & VOLUME
                  </span>
                  <p className="text-justify bg-dash-bg/25 border border-dash-line/30 p-2.5 rounded-xl">
                    The daily RSI has gracefully cooled from recent peaks to a
                    neutral reading of 52.40. This mean-reversion in momentum is
                    technically constructive, as it provides the index with
                    sufficient headroom to resume its upward trajectory without
                    immediate oscillators being overheated. A bullish crossover
                    on daily MACD remains active.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: SECTOR PERFORMANCE & OI */}
        {activeTab === "sectors" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* BSE Weekly Sectoral Performance Bar Chart */}
            <div className="glass-premium p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-dash-line pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                    BSE WEEKLY WEEK-ON-WEEK PERFORMANCE BY SECTOR
                  </h3>
                </div>
                <span className="text-[8.5px] font-mono font-black py-0.5 px-2 bg-dash-primary/10 border border-dash-primary/20 text-dash-primary rounded uppercase">
                  Value Growth Distribution %
                </span>
              </div>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bseSectorPerformance}
                    margin={{ top: 20, right: 30, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                    />
                    <XAxis dataKey="sector" stroke="#94a3b8" fontSize={9} />
                    <YAxis stroke="#94a3b8" fontSize={10} unit="%" />
                    <Tooltip
                      contentStyle={{
                        background: "#070b19",
                        borderColor: "rgba(255,255,255,0.08)",
                        borderRadius: "8px",
                      }}
                      labelClassName="text-white text-xs font-bold font-mono"
                      itemStyle={{ fontFamily: "monospace", fontSize: 10 }}
                    />

                    <Bar
                      dataKey="pct"
                      name="Weekly Change %"
                      radius={[4, 4, 0, 0]}
                    >
                      {bseSectorPerformance.map((entry, index) => {
                        const isNeg = entry.pct < 0;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isNeg ? "#f43f5e" : "#10b981"}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top OI Gainers vs Losers Side-by-Side Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Open Interest Weekly Gainers */}
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-dash-line">
                  <TrendingUp className="w-5 h-5 text-dash-success animate-bounce" />
                  <div>
                    <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                      TOP OPEN INTEREST GAINERS (WEEKLY REC)
                    </h3>
                    <p className="text-[10px] text-dash-muted font-mono mt-0.5">
                      Indicating aggressive strategic short additions/long
                      build-ups
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-dash-line rounded-xl">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="bg-ash-bg/50 border-b border-dash-line text-xxs">
                        <th className="p-3 font-bold text-dash-muted uppercase">
                          Scrip Name
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right">
                          Price (Rs.)
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right">
                          Weekly % Price
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right">
                          Open Interest
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right text-dash-primary">
                          OI Weekly % Chg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topOiGainers.map((gain, gIdx) => (
                        <tr
                          key={gIdx}
                          className="border-b border-dash-line hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-3 font-bold text-white uppercase">
                            {gain.scrip}
                          </td>
                          <td className="p-3 text-right font-bold text-[#f8fafc]">
                            {gain.price.toLocaleString("en-IN")}
                          </td>
                          <td
                            className={`p-3 text-right font-bold ${gain.priceChg >= 0 ? "text-dash-success" : "text-dash-danger"}`}
                          >
                            {gain.priceChg >= 0
                              ? `+${gain.priceChg}%`
                              : `${gain.priceChg}%`}
                          </td>
                          <td className="p-3 text-right text-dash-muted">
                            {gain.oi}
                          </td>
                          <td className="p-3 text-right text-dash-success font-black">
                            +{gain.oiChg}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Open Interest Weekly Losers */}
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-dash-line">
                  <TrendingDown className="w-5 h-5 text-dash-danger animate-bounce" />
                  <div>
                    <h3 className="text-xs font-black tracking-widest text-[#f8fafc]">
                      TOP OPEN INTEREST LOSERS (WEEKLY REC)
                    </h3>
                    <p className="text-[10px] text-dash-muted font-mono mt-0.5">
                      Indicating aggressive short coverings/long unwinding
                      patterns
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto border border-dash-line rounded-xl">
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className="bg-ash-bg/50 border-b border-dash-line text-xxs">
                        <th className="p-3 font-bold text-dash-muted uppercase">
                          Scrip Name
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right">
                          Price (Rs.)
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right">
                          Weekly % Price
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right">
                          Open Interest
                        </th>
                        <th className="p-3 font-bold text-dash-muted uppercase text-right text-dash-danger">
                          OI Weekly % Chg
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topOiLosers.map((lose, lIdx) => (
                        <tr
                          key={lIdx}
                          className="border-b border-dash-line hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-3 font-bold text-white uppercase">
                            {lose.scrip}
                          </td>
                          <td className="p-3 text-right font-bold text-[#f8fafc]">
                            {lose.price.toLocaleString("en-IN")}
                          </td>
                          <td
                            className={`p-3 text-right font-bold ${lose.priceChg >= 0 ? "text-dash-success" : "text-dash-danger"}`}
                          >
                            {lose.priceChg >= 0
                              ? `+${lose.priceChg}%`
                              : `${lose.priceChg}%`}
                          </td>
                          <td className="p-3 text-right text-dash-muted">
                            {lose.oi}
                          </td>
                          <td className="p-3 text-right text-dash-danger font-black">
                            {lose.oiChg}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: GLOBAL INDICES & MARKET SUMMARY */}
        {activeTab === "indices" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Rows indices tables */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Domestic indices column */}
              <div className="glass-premium p-5 rounded-2xl space-y-4 border border-dash-line">
                <span className="text-xs font-black tracking-widest text-[#00c2ff] font-sans block border-b border-dash-line pb-3 uppercase">
                  Domestic Equity Indices
                </span>
                <div className="space-y-2.5">
                  {domesticIndices.map((dom, domIdx) => (
                    <div
                      key={domIdx}
                      className="flex justify-between items-center text-xs font-mono p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl hover:border-dash-primary/30 transition-all"
                    >
                      <span className="font-bold text-white uppercase">
                        {dom.index}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[#f1f5f9]">
                          {dom.value}
                        </span>
                        <span
                          className={`text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded leading-none ${dom.chg >= 0 ? "bg-dash-success/15 text-dash-success" : "bg-dash-danger/15 text-dash-danger"}`}
                        >
                          {dom.chg >= 0 ? `+${dom.chg}%` : `${dom.chg}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* World indices column */}
              <div className="glass-premium p-5 rounded-2xl space-y-4 border border-dash-line">
                <span className="text-xs font-black tracking-widest text-[#fbbf24] font-sans block border-b border-dash-line pb-3 uppercase">
                  Global Market Indices
                </span>
                <div className="space-y-2.5">
                  {worldIndices.map((wor, worIdx) => (
                    <div
                      key={worIdx}
                      className="flex justify-between items-center text-xs font-mono p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl hover:border-[#fbbf24]/30 transition-all"
                    >
                      <span className="font-bold text-white uppercase">
                        {wor.index}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="font-extrabold text-[#f1f5f9]">
                          {wor.value}
                        </span>
                        <span
                          className={`text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded leading-none ${wor.chg >= 0 ? "bg-dash-success/15 text-dash-success" : "bg-dash-danger/15 text-dash-danger"}`}
                        >
                          {wor.chg >= 0 ? `+${wor.chg}%` : `${wor.chg}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forex exchange + Top short list summary */}
              <div className="space-y-6">
                {/* Forex board */}
                <div className="glass-premium p-5 rounded-2xl space-y-4 border border-dash-line">
                  <span className="text-xs font-black tracking-widest text-emerald-400 font-sans block border-b border-dash-line pb-3 uppercase">
                    Forex & Currencies
                  </span>
                  <div className="space-y-2.5">
                    {forexRates.map((fx, fxIdx) => (
                      <div
                        key={fxIdx}
                        className="flex justify-between items-center text-xs font-mono p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl hover:border-emerald-400/30 transition-all"
                      >
                        <span className="font-bold text-white uppercase">
                          {fx.currency}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-[#f1f5f9]">
                            {fx.value}
                          </span>
                          <span
                            className={`text-[10px] font-black tracking-wider px-1.5 py-0.5 rounded leading-none ${fx.chg >= 0 ? "bg-dash-success/15 text-dash-success" : "bg-dash-danger/15 text-dash-danger"}`}
                          >
                            {fx.chg >= 0 ? `+${fx.chg}%` : `${fx.chg}%`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Institutional Activity flow logs */}
                <div className="glass-premium p-5 rounded-2xl space-y-3.5 border border-dash-line">
                  <span className="text-xs font-black tracking-widest text-white font-sans block border-b border-dash-line pb-3 uppercase">
                    FII & DII In-and-Outflow (INR Cr.)
                  </span>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <span className="text-[10px] text-dash-success font-black font-mono block">
                        DII NET (Domestic)
                      </span>
                      <div className="bg-dash-bg/40 border border-dash-line p-2.5 rounded-lg text-center font-mono">
                        <span className="text-[9px] text-dash-muted block">
                          8th May Net Flow
                        </span>
                        <span className="text-sm font-black text-dash-success">
                          +6,748.1 Cr
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[10px] text-dash-danger font-black font-mono block">
                        FII NET (Foreign)
                      </span>
                      <div className="bg-dash-bg/40 border border-dash-line p-2.5 rounded-lg text-center font-mono">
                        <span className="text-[9px] text-dash-muted block">
                          8th May Net Flow
                        </span>
                        <span className="text-sm font-black text-dash-danger">
                          -4,110.6 Cr
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Gainers & Losers details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Nifty Top Gainers list */}
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <span className="text-xs font-black tracking-widest text-dash-success block border-b border-dash-line pb-3 uppercase">
                  Nifty Top Stock Gainers (Current Week)
                </span>
                <div className="overflow-x-auto border border-dash-line rounded-xl">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="bg-dash-bg border-b border-dash-line font-bold text-dash-muted">
                        <th className="p-3 uppercase">Scrip / Stock Name</th>
                        <th className="p-3 text-right uppercase">
                          Index Price (Rs.)
                        </th>
                        <th className="p-3 text-right uppercase text-dash-success">
                          Growth Wave
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {niftyTopGainers.map((tg, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-dash-line hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-3 font-bold text-white">
                            {tg.scrip}
                          </td>
                          <td className="p-3 text-right text-dash-muted font-bold">
                            {tg.value}
                          </td>
                          <td className="p-3 text-right text-dash-success font-black">
                            +{tg.chg}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Nifty Top Losers list */}
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <span className="text-xs font-black tracking-widest text-dash-danger block border-b border-dash-line pb-3 uppercase">
                  Nifty Top Stock Losers (Current Week)
                </span>
                <div className="overflow-x-auto border border-dash-line rounded-xl">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="bg-dash-bg border-b border-dash-line font-bold text-dash-muted">
                        <th className="p-3 uppercase">Scrip / Stock Name</th>
                        <th className="p-3 text-right uppercase">
                          Index Price (Rs.)
                        </th>
                        <th className="p-3 text-right uppercase text-dash-danger">
                          Decline Wave
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {niftyTopLosers.map((tl, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-dash-line hover:bg-white/[0.02] transition-colors"
                        >
                          <td className="p-3 font-bold text-white">
                            {tl.scrip}
                          </td>
                          <td className="p-3 text-right text-dash-muted font-bold">
                            {tl.value}
                          </td>
                          <td className="p-3 text-right text-dash-danger font-black">
                            {tl.chg}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 6: DETAILED BHARAT ELECTRONICS */}
        {activeTab === "featured" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start"
          >
            {/* Technical Viewpoints commentary block */}
            <div className="lg:col-span-3 space-y-6">
              <div className="glass-premium p-6 rounded-2xl space-y-5">
                <div className="flex items-center justify-between border-b border-dash-line pb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="p-2 bg-dash-primary/10 rounded-lg text-dash-primary border border-dash-primary/20">
                      <Zap className="w-5 h-5 animate-pulse" />
                    </span>
                    <div>
                      <h3 className="text-sm font-black tracking-wider text-white">
                        BHARAT ELECTRONICS LTD. (NSE: BEL)
                      </h3>
                      <p className="text-[10px] text-dash-muted font-mono mt-0.5">
                        High-Velocity Breakout Selection
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-black py-1 px-3 bg-dash-success/15 border border-dash-success/20 text-dash-success rounded uppercase">
                    ACTIVE STRONG BUY RECOMMENDATION
                  </span>
                </div>

                <div className="space-y-4">
                  <span className="text-xs font-black tracking-widest text-[#00c2ff] block font-sans uppercase">
                    EXECUTIVE TECHNICAL BRIEF
                  </span>
                  <div className="space-y-3">
                    {belAnalysis.technicalView.map((pt, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-3.5 bg-dash-bg/40 border-l-2 border-dash-primary rounded-r-xl flex gap-3 text-xs text-dash-ink"
                      >
                        <span className="text-dash-primary font-mono font-black select-none">
                          0{pIdx + 1}
                        </span>
                        <p className="leading-relaxed text-justify">{pt}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Execution parameters statistics cards */}
            <div className="lg:col-span-1 space-y-6">
              {/* Execution Data metrics */}
              <div className="glass-premium p-5 rounded-2xl border border-dash-line space-y-4">
                <span className="text-xs font-black tracking-widest text-white font-sans block border-b border-dash-line pb-3 uppercase">
                  Execution Metrics
                </span>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl">
                    <span className="text-[10px] font-mono text-dash-muted">
                      TARGET TARGET
                    </span>
                    <span className="font-mono font-black text-white">
                      ₹{belAnalysis.executionData.target}.00
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl">
                    <span className="text-[10px] font-mono text-dash-muted">
                      UPSIDE PROJECTION
                    </span>
                    <span className="font-mono font-black text-dash-success">
                      +{belAnalysis.executionData.upside}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl">
                    <span className="text-[10px] font-mono text-dash-muted">
                      STRONG BUY MARGIN
                    </span>
                    <span className="font-mono font-black text-[#fbbf24]">
                      {belAnalysis.executionData.buyRange}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl">
                    <span className="text-[10px] font-mono text-dash-muted">
                      STOP LOSS FLOOR
                    </span>
                    <span className="font-mono font-black text-dash-danger">
                      ₹{belAnalysis.executionData.stopLoss}.00
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-2.5 bg-dash-bg/50 border border-dash-line/40 rounded-xl">
                    <span className="text-[10px] font-mono text-dash-muted">
                      RISK/REWARD RATIO
                    </span>
                    <span className="font-mono font-black text-dash-danger">
                      {belAnalysis.executionData.risk}
                    </span>
                  </div>
                </div>
              </div>

              {/* Oscillator statuses */}
              <div className="glass-premium p-5 rounded-2xl border border-dash-line space-y-4">
                <span className="text-xs font-black tracking-widest text-[#00c2ff] font-sans block border-b border-dash-line pb-3 uppercase">
                  Technical Oscillators
                </span>

                <div className="space-y-2.5 text-xs">
                  {belAnalysis.executionData.indicators.map((ind, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center p-2 bg-dash-bg/40 border border-[#334155]/20 rounded-lg font-mono text-xxs"
                    >
                      <span className="text-dash-muted">{ind.name}</span>
                      <span
                        className={`font-black px-1.5 py-0.5 rounded leading-none ${ind.status.includes("BUY") ? "bg-dash-success/15 text-dash-success" : "bg-white/10 text-white"}`}
                      >
                        {ind.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key financial fundamentals */}
              <div className="glass-premium p-5 rounded-2xl border border-dash-line space-y-4">
                <span className="text-xs font-black tracking-widest text-[#fbbf24] font-sans block border-b border-dash-line pb-3 uppercase">
                  Stock Key Data
                </span>

                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-dash-muted text-[10px]">
                      Benchmark Nifty
                    </span>
                    <span className="text-white font-bold">
                      {belAnalysis.keyData.nifty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-dash-muted text-[10px]">
                      52-Week High/Low
                    </span>
                    <span className="text-white font-bold">
                      {belAnalysis.keyData.range52W}
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-dash-muted text-[10px]">
                      Market Cap (Rs Cr)
                    </span>
                    <span className="text-dash-success font-black">
                      {belAnalysis.keyData.marketCapCr} Cr
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-dash-muted text-[10px]">
                      O/S Shares (Cr)
                    </span>
                    <span className="text-white font-bold">
                      {belAnalysis.keyData.osSharesCr} Cr
                    </span>
                  </div>
                  <div className="flex justify-between items-center font-mono">
                    <span className="text-dash-muted text-[10px]">
                      Face Value (Rs.)
                    </span>
                    <span className="text-white font-bold">
                      ₹{belAnalysis.keyData.faceValue}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Corporate disclaimer banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-5 glass border border-white/[0.04] rounded-2xl space-y-2.5 font-sans"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.05] pb-2">
          <FileText className="w-4 h-4 text-dash-muted" />
          <span className="text-[10px] font-black tracking-wider text-dash-muted uppercase font-mono">
            SEC REGISTERED DISCLAIMER & COMPLIANCE APPENDIX
          </span>
        </div>
        <p className="text-[10px] text-dash-muted leading-relaxed text-justify">
          This report has been prepared by the research department of BP
          EQUITIES Pvt. Ltd, is for informational purposes only. This report is
          not construed as an offer to sell or the solicitation of an offer to
          buy or sell any security in any jurisdiction where such an offer or
          solicitation would be illegal. Analyst Certification: We analysts and
          the authors of this report, hereby certify that all of the views
          expressed in this research report accurately reflect our personal
          views about any and all of the subject issuer (s) or securities. No
          part of our compensation was, is, or will be directly or indirectly
          related to the specific recommendation (s) or view (s) in this report.
        </p>
      </motion.div>
    </div>
  );
};

export default WeeklyWealth;
