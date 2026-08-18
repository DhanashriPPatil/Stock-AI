import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Globe,
  FileText,
  DollarSign,
  Activity,
  AlertTriangle,
  Layers,
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
} from "recharts";
import { fetchParsedReport } from "../api/stockApi";

export const WorldEconomy = () => {
  const [activeTab, setActiveTab] = useState("summary");
  const [pdfData, setPdfData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetchParsedReport("world_economy");
        if (res.exists) {
          setPdfData(res.data);
        }
      } catch (e) {
        console.error("Failed loading parsed world economy report:", e);
      }
    };
    fetchData();
  }, []);

  // Palette color mapping
  const colors = {
    primary: "#00c2ff",
    success: "#10b981",
    danger: "#f43f5e",
    warning: "#fbbf24",
    muted: "#94a3b8",
    ink: "#f1f5f9",
  };

  // Macro Metrics data for visual callouts
  const defaultMacroIndicators = [
    {
      label: "WPI Inflation (Apr 2026)",
      value: "8.3%",
      change: "+4.4% vs Mar",
      type: "up",
    },
    {
      label: "Fuel & Power Inflation",
      value: "24.7%",
      change: "42-Month High",
      type: "up",
    },
    {
      label: "Core WPI Inflation",
      value: "5.0%",
      change: "43-Month High",
      type: "up",
    },
    {
      label: "USD / INR Exchange",
      value: "95.66",
      change: "+0.04% Weakening",
      type: "up",
    },
  ];

  // Capital Flow data
  const defaultCapitalFlows = [
    {
      segment: "FII Spot Cash (Daily)",
      val: -4703.15,
      text: "-₹4,703.15 Cr",
      color: colors.danger,
    },
    {
      segment: "FII Spot Cash (MTD)",
      val: -26172.45,
      text: "-₹26,172.45 Cr",
      color: colors.danger,
    },
    {
      segment: "DII Spot Cash (Daily)",
      val: 5869.05,
      text: "+₹5,869.05 Cr",
      color: colors.success,
    },
    {
      segment: "DII Spot Cash (MTD)",
      val: 41191.87,
      text: "+₹41,191.87 Cr",
      color: colors.success,
    },
  ];

  // Sector Performance Data on May 14, 2026 (Nifty Indices)
  const defaultSectorIndexData = [
    { sector: "Nifty Metal", change: 3.18, color: colors.success },
    { sector: "Consumer Dur", change: 1.67, color: colors.success },
    { sector: "Oil & Gas", change: 1.28, color: colors.success },
    { sector: "Nifty Energy", change: 0.7, color: colors.success },
    { sector: "Nifty IT", change: -1.13, color: colors.danger },
    { sector: "Nifty Auto", change: -0.97, color: colors.danger },
  ];

  // Nifty Support and Resistance Zones
  const defaultIndexZones = {
    spot: "23,412.60",
    future: "23,462.40",
    pcr: "0.96",
    volatility: "19.35 (VIX)",
    resistance: ["23,500", "23,800"],
    support: ["23,150", "22,500"],
    breadth20DMA: "16 / 50 Stocks (32%)",
  };

  const macroIndicators = pdfData?.macroIndicators || defaultMacroIndicators;
  const capitalFlows = pdfData?.capitalFlows || defaultCapitalFlows;
  const sectorIndexData = pdfData?.sectorIndexData || defaultSectorIndexData;
  const indexZones = pdfData?.indexZones || defaultIndexZones;

  return (
    <div
      id="world_economy_page"
      className="space-y-8 select-none font-sans pb-12"
    >
      {/* Page Header Editorial Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-premium rounded-2xl p-6 border-l-4 border-dash-primary flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black tracking-widest bg-dash-primary/15 text-dash-primary uppercase">
              Global Economic Outlook
            </span>
            <span className="text-[10px] text-dash-muted font-mono font-bold font-mono">
              • Summarized May 14, 2026
            </span>
          </div>
          <h2 className="text-2xl font-black font-display tracking-tight text-white flex items-center gap-2">
            <Globe className="w-6 h-6 text-dash-primary animate-spin-slow" />
            WORLD ECONOMY & MARKET INTEL
          </h2>
          <p className="text-xs text-dash-muted">
            Academic synthesis of global inflation indices, geopolitical supply
             bottlenecks, and multi-sector equity performance.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-dash-bg/60 border border-dash-line rounded-xl px-4 py-3 font-mono text-[11px] h-fit">
          <div className="w-2.5 h-2.5 rounded-full bg-dash-danger relative flex">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dash-danger opacity-75"></span>
          </div>
          <div>
            <span className="text-dash-muted block text-[9px] font-black tracking-wider uppercase">
              MACRO SITUATION
            </span>
            <span className="text-white font-bold font-mono">
              CORE INFLATION SPIKE
            </span>
          </div>
        </div>
      </motion.div>

      {/* Visual Macro KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        {macroIndicators.map((ind, i) => (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            key={i}
            className="glass bg-dash-surface/40 p-4 rounded-xl border border-white/[0.04] flex items-center justify-between"
          >
            <div>
              <span className="text-[10px] text-dash-muted block uppercase tracking-wider font-bold mb-1 font-mono">
                {ind.label}
              </span>
              <span className="text-xl font-mono font-black text-white">
                {ind.value}
              </span>
            </div>
            <div className="bg-dash-danger/10 border border-dash-danger/20 text-dash-danger text-[10px] font-mono px-2 py-0.5 rounded">
              {ind.change}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dash-line pb-0.5 font-mono">
        {[
          { id: "summary", label: "Executive Synthesis", icon: FileText },
          {
            id: "macro",
            label: "Geopolitical & Inflation Factors",
            icon: AlertTriangle,
          },
          { id: "sectors", label: "Sector-Wise Performance", icon: Layers },
          { id: "flows", label: "Institutional Flows", icon: DollarSign },
          {
            id: "technicals",
            label: "Technical Outlook & Zones",
            icon: Activity,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-display text-xs font-bold uppercase tracking-wider transition-all border-b-2 -mb-0.5 cursor-pointer ${
                isSelected
                  ? "border-dash-primary text-white font-black"
                  : "border-transparent text-dash-muted hover:text-white hover:border-white/10"
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 ${isSelected ? "text-dash-primary" : "text-dash-muted"}`}
              />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Screen Core */}
      <div className="mt-4">
        {/* TAB 1: EXECUTIVE SYNTHESIS */}
        {activeTab === "summary" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn"
          >
            {/* Professional Research summary block */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-dash-line">
                  <span className="w-2 h-2 rounded bg-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc] uppercase font-mono">
                    WPI Inflation & Market Environment
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-dash-ink leading-relaxed font-sans text-justify">
                  <p>
                    A close examination of recent financial data reveals
                    significant structural stress across global and domestic
                    markets. Headline Wholesale Price Index (WPI) inflation
                    recently climbed to a multi-year height of 8.3 percent in
                    April 2026, marking an aggressive rise from the 0.9 percent
                    rate recorded in the prior year. This sharp acceleration is
                    primarily attributable to severe escalations in fuel and
                    power costs, alongside rising inputs within the
                    manufacturing sector. Crucially, the core inflation index
                    rose to a 43-month peak of 5.0 percent, indicating that
                    price pressures have transcended volatile commodity blocks
                    and established a broader footprint in the general economy.
                    This inflationary trend has emerged against a backdrop of
                    depreciating currency and elevated import costs.
                  </p>
                  <p>
                    While agricultural and core foodgrains commodities provided
                    some counterbalance—with foodgrain inflation remaining weak
                    at -1.0 percent due to ongoing pulse deflation—pressures in
                    other perishables like vegetables, alongside dairy and
                    poultry segments, continue to push upward on the aggregate
                    index. Internationally, the divergence is clear; major
                    grains and wheat display upward pricing momentum of 12.6
                    percent, driven by shifting global logistics patterns.
                  </p>
                </div>
              </div>

              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-dash-line font-mono">
                  <span className="w-2 h-2 rounded bg-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-white uppercase">
                    Geopolitics & Sectoral Outlines
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-dash-ink leading-relaxed font-sans text-justify">
                  <p>
                    Widespread geopolitical risk remains the central bottleneck
                    for raw material corridors. Headwinds arising from the
                    US-Iran military conflict have severely impacted energy
                    markets, pushing international crude prices upward by nearly
                    54.2 percent on a year-on-year basis. Supply chains are
                    encountering logistics friction in the Persian Gulf and near
                    the critical Strait of Hormuz passage, raising general
                    commodity prices.
                  </p>
                  <p>
                    This has resulted in dual outcomes across key sectors.
                    Upstream energy producers benefit from domestic oil royalty
                    rationalizations introduced to encourage local exploration,
                    while petchem processors experience margin pressure as key
                    feedstocks like naphtha experience steep pricing spikes.
                    Manufacturing sectors, such as automobiles, report strong
                    demand and healthy volume expansion but endure severe gross
                    margin compression as raw material expenses increase. In
                    addition, pharmaceuticals and consumer sectors are managing
                    elevated cost structures through selective price increases
                    and operational optimization.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar quick insights */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glassbg bg-dash-surface-dark/80 p-5 rounded-2xl border border-dash-line/70 space-y-4">
                <div className="text-xs font-black tracking-widest uppercase border-b border-dash-line pb-3 text-white flex items-center justify-between font-mono">
                  <span>Core Takeaways</span>
                  <Globe className="w-4 h-4 text-dash-primary" />
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <div className="p-3 bg-dash-bg/40 rounded-xl border border-white/[0.02] space-y-1">
                    <span className="text-[10px] text-dash-danger font-mono font-bold block uppercase">
                      • Geopolitical Stress
                    </span>
                    <p className="text-dash-ink text-[11px] leading-relaxed">
                      Active conflict in West Asia continues to constrain
                      feedstock availability, threatening extended margin
                      contractions.
                    </p>
                  </div>

                  <div className="p-3 bg-dash-bg/40 rounded-xl border border-white/[0.02] space-y-1">
                    <span className="text-[10px] text-dash-warning font-mono font-bold block uppercase font-mono">
                      • Core WPI Push
                    </span>
                    <p className="text-dash-ink text-[11px] leading-relaxed font-sans">
                      At a 43-month high of 5.0%, core WPI indicates that
                      structural inflation has embedded itself within production
                      lines.
                    </p>
                  </div>

                  <div className="p-3 bg-dash-bg/40 rounded-xl border border-white/[0.02] space-y-1 font-mono">
                    <span className="text-[10px] text-dash-success font-bold block uppercase">
                      • Currency Stress
                    </span>
                    <p className="text-dash-ink text-[11px] leading-relaxed font-sans">
                      The Indian rupee weakened toward record lows near 95.80,
                      intensifying the price drag on imported raw materials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: GEOPOLITICAL & INFLATION FACTORS */}
        {activeTab === "macro" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 animate-fadeIn"
          >
            <div className="glass-premium p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-dash-line pb-3 font-mono">
                <h3 className="text-xs font-black tracking-widest text-[#f8fafc] uppercase">
                  Geopolitical Shockwaves Analysis
                </h3>
                <span className="text-[9px] bg-dash-danger/10 text-dash-danger px-2 py-0.5 border border-dash-danger/20 rounded font-black uppercase">
                  Strait of Hormuz Bottleneck
                </span>
              </div>

              <div className="space-y-4 text-xs text-dash-ink leading-relaxed font-sans text-justify">
                <p>
                  The US-Iran geopolitical conflict has produced a substantial
                  supply shock in global petrochemical feedstocks like ethylene,
                  naphtha, and methanol, pushing international energy indices
                  higher. Because 60 to 70 percent of Asian Naphtha used in
                  petrochemical operations is routed through the Strait of
                  Hormuz, transport routes have experienced high volatility.
                  Shortages in petrochemical feedstocks have forced Asian
                  cracker utilization rates down from 80 percent to nearly 60
                  percent.
                </p>
                <p>
                  The logistics crisis has compromised transport reliability, as
                  industrial feedstocks are deprioritized behind essential
                  commodities like crude oil and natural gas. Even under
                  conditions of immediate geopolitical normalization, shipping
                  backlogs and container bottlenecks are estimated to require
                  over 275 days to resume stable operations, pointing to
                  prolonged market disruption. This environment is forcing
                  multi-national firms to diversify input channels and redesign
                  supply chain architecture to improve basic resilience.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-premium p-5 rounded-xl space-y-3 font-mono">
                <span className="text-[10px] text-dash-danger font-black uppercase tracking-wider block">
                  WPI Sector Inflation Distribution
                </span>
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "WPI Headline",
                          rate: 8.3,
                          fill: colors.danger,
                        },
                        {
                          name: "Fuel & Power",
                          rate: 24.7,
                          fill: colors.danger,
                        },
                        { name: "Core WPI", rate: 5.0, fill: colors.warning },
                        {
                          name: "Manufactured",
                          rate: 4.6,
                          fill: colors.warning,
                        },
                        { name: "Foodgrain", rate: -1.0, fill: colors.success },
                      ]}
                      margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="rgba(255,255,255,0.03)"
                      />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} />
                      <YAxis stroke="#94a3b8" fontSize={9} unit="%" />
                      <Tooltip
                        contentStyle={{
                          background: "#0c152b",
                          borderColor: "rgba(255,255,255,0.06)",
                        }}
                      />
                      <Bar dataKey="rate" fill="#f43f5e" radius={[4, 4, 0, 0]}>
                        {[
                          { fill: colors.danger },
                          { fill: colors.danger },
                          { fill: colors.warning },
                          { fill: colors.warning },
                          { fill: colors.success },
                        ].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-premium p-5 rounded-xl space-y-3 text-xs text-dash-ink">
                <span className="text-[10px] text-dash-primary font-mono font-black uppercase tracking-wider block">
                  Monetary & Rupee Drag
                </span>
                <p className="text-justify leading-relaxed font-sans">
                  Concurrently, currency volatility has intensified the import
                  drag. A weakening Indian rupee—which recently touched historic
                  lows of 95.66 to 95.80 against the US dollar—has directly
                  escalated landed expenses for industrial materials. Despite
                  stable domestic liquidity and steady investment indices,
                  persistent inflation pressures at the wholesale level are
                  expected to sustain upside pressures on subsequent retail
                  consumer metrics.
                </p>
                <div className="bg-dash-bg/50 border border-dash-line p-3 rounded-lg font-mono text-[10px] space-y-1.5 text-dash-muted">
                  <div className="flex justify-between">
                    <span className="font-bold font-sans">BRENT CRUDE OILS:</span>
                    <span className="text-white font-bold">
                      $105.77 / BBL (+0.13%)
                    </span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="font-bold">USD/INR SPOT RATE:</span>
                    <span className="text-white font-bold font-mono">
                      95.66 (+0.04%)
                    </span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span className="font-bold">SILVER FUTURES YIELD:</span>
                    <span className="text-dash-success font-bold font-mono">
                      87.95 (+4.41% weekly)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: SECTOR-WISE PERFORMANCE */}
        {activeTab === "sectors" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 animate-fadeIn"
          >
            {/* Sector Indices Bar Chart */}
            <div className="glass-premium p-6 rounded-2xl space-y-4 font-mono">
              <div className="flex items-center justify-between border-b border-dash-line pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-white uppercase">
                    Sector Ledger Performance (Daily change)
                  </h3>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={sectorIndexData}
                    margin={{ top: 10, right: 30, left: -25, bottom: 5 }}
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

                    <Bar dataKey="change" fill="#10b981" radius={[4, 4, 0, 0]}>
                      {sectorIndexData.map((entry, index) => {
                        const isNeg = entry.change < 0;
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={isNeg ? colors.danger : colors.success}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Analysis by Sector Block */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="glass-premium p-5 rounded-2xl space-y-3 font-mono">
                <span className="text-[10px] text-dash-primary font-black uppercase tracking-wider block">
                  Automobiles & Manufacturing
                </span>
                <p className="text-xs text-dash-ink leading-relaxed text-justify font-sans">
                  TVS Motors reported robust top-line growth with volume sales
                  expanding 28 percent YoY and overall revenue rising 34
                  percent. This expansion indicates strong consumer momentum.
                  However, high commodity cost inflation (averaging 3 to 5
                  percent) alongside logistical blockages compressed operating
                  margins, resulting in a 161 bps contraction in gross margins.
                </p>
              </div>

              <div className="glass-premium p-5 rounded-2xl space-y-3 font-mono">
                <span className="text-[10px] text-dash-primary font-black uppercase tracking-wider block">
                  Pharmaceuticals core
                </span>
                <p className="text-xs text-dash-ink leading-relaxed text-justify font-sans">
                  In-line performance was observed within pharmaceuticals. Dr
                  Reddy’s Labs achieved stable adusted margins of 50-55 percent
                  despite price hurdles. Cipla posted mixed performance, with a
                  26 percent decline in US segment revenues offset by resilient
                  domestic chronic treatment sales, which rose 15 percent,
                  establishing strong local support.
                </p>
              </div>

              <div className="glass-premium p-5 rounded-2xl space-y-3 font-mono">
                <span className="text-[10px] text-[#fbbf24] font-black uppercase tracking-wider block font-mono">
                  Refining & Upstream Oil
                </span>
                <p className="text-xs text-dash-ink leading-relaxed text-justify font-sans">
                  HPCL outperformed typical refining expectations, achieving
                  gross refining margins of USD 14.5 per barrel. Upstream
                  providers ONGC and Oil India are positioned to profit from
                  government royalty rationalizations, with onshore oil
                  royalties cut to 10 percent from 16.66, directly improving
                  overall reserve viability.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: INSTITUTIONAL FLOWS */}
        {activeTab === "flows" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 animate-fadeIn"
          >
            <div className="glass bg-dash-surface-dark border border-white/[0.04] p-6 rounded-2xl space-y-4 font-mono">
              <div className="flex items-center gap-2 pb-2 border-b border-dash-line">
                <DollarSign className="w-5 h-5 text-dash-primary" />
                <h3 className="text-xs font-black tracking-widest text-[#f8fafc] uppercase">
                  Institutional Capital Matrix
                </h3>
              </div>

              <p className="text-xs text-dash-ink leading-relaxed text-justify font-sans">
                Heavy capital rotation is visible across equity segments.
                Foreign Institutional Investors (FIIs) recorded severe outflows,
                registering a net daily exit of -₹4,703.15 Crores in cash
                markets, which pushed current Month-to-Date (MTD) cumulative
                outflows to -₹26,172.45 Crores. Concurrently, Domestic
                Institutional Investors (DIIs) acted as a primary
                counter-balancing stabilizing anchor, deploying a daily net
                absorption of +₹5,869.05 Crores, and elevating their MTD
                cumulative inflows to a substantial +₹41,191.87 Crores. This
                major domestic support prevented broader market capitulation.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-premium p-5 rounded-xl space-y-4">
                <span className="text-[10px] text-dash-danger font-mono font-black uppercase tracking-wider block font-mono">
                  Outflows vs Inflows Breakdown
                </span>
                <div className="space-y-3.5">
                  {capitalFlows.map((flow, idx) => (
                    <div
                      key={idx}
                      className="bg-dash-bg/40 border border-white/[0.02] p-3 rounded-lg flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-dash-muted uppercase font-sans">
                        {flow.segment}
                      </span>
                      <span
                        className="text-xs font-black text-right font-mono"
                        style={{ color: flow.color }}
                      >
                        {flow.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-premium p-5 rounded-xl space-y-4 text-xs text-dash-ink font-mono">
                <span className="text-[10px] text-dash-warning font-black uppercase tracking-wider block">
                  FII Derivatives Activity
                </span>
                <p className="text-justify leading-relaxed font-sans">
                  In FII derivatives accounts, notable hedged positioning was
                  recorded on May 13, 2026. FIIs reduced Risk exposures inside
                  Index Options by selling -₹5,752.22 Crores, while showing
                  modest risk additions inside Stock Futures with positive
                  cumulative purchases of +₹2,079.17 Crores. This suggests a
                  transition toward defensive stock-specific strategies.
                </p>
                <div className="p-3 bg-dash-bg/50 border border-dash-line rounded-lg font-mono text-[10px] space-y-1 text-dash-muted">
                  <div className="flex justify-between font-sans">
                    <span>INDEX FUTURES:</span>
                    <span className="text-rose-400 font-bold font-mono">
                      -₹127.58 Cr
                    </span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span>INDEX OPTIONS:</span>
                    <span className="text-rose-400 font-bold font-mono">
                      -₹5,752.22 Cr
                    </span>
                  </div>
                  <div className="flex justify-between font-sans">
                    <span>STOCK FUTURES:</span>
                    <span className="text-dash-success font-bold font-mono">
                      +₹2,079.17 Cr
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: TECHNICAL OUTLOOK & ZONES */}
        {activeTab === "technicals" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fadeIn"
          >
            <div className="lg:col-span-2 glass-premium p-6 rounded-2xl space-y-4 font-mono">
              <div className="flex items-center gap-2 pb-2 border-b border-dash-line">
                <Activity className="w-5 h-5 text-dash-primary animate-pulse" />
                <h3 className="text-xs font-black tracking-widest text-[#f8fafc] uppercase">
                  Index Technical Assessment
                </h3>
              </div>

              <div className="space-y-4 text-xs text-dash-ink leading-relaxed font-sans text-justify">
                <p>
                  Broad equity indexes showed a minor positive correction, with
                  the daily Nifty 50 close settling at 23,412.60 (+0.14%) and
                  Nifty Futures trading at 23,462.40. The overall market
                  sentiment retains a highly cautious stance as represented by
                  the daily India VIX volatility metric creeping upward to
                  19.35.
                </p>
                <p>
                  Broad market breadth indications continue to register below
                  optimal configurations. Specifically, within the Nifty 50
                  index, only 16 out of 50 stocks (32%) are currently trading
                  above their 20 Day Simple Moving Average (DSMA). Similarly,
                  within the broader Nifty 500 universe, only 192 out of 500
                  stocks are maintaining positions above their 20 DSMA,
                  indicating concentrated index heavyweight support rather than
                  broad-based institutional buying.
                </p>
              </div>
            </div>

            {/* Support/Resistance Zones column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-premium p-5 rounded-2xl border border-dash-line shadow-lg space-y-4 font-mono">
                <span className="text-[10px] text-dash-primary font-black uppercase tracking-wider block pb-2 border-b border-dash-line">
                  Index Assessment Limits
                </span>

                <div className="space-y-3.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-dash-muted uppercase font-bold text-[10px] font-sans">
                      PCR (Open Interest)
                    </span>
                    <span className="font-mono font-black text-white">
                      {indexZones.pcr}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-dash-muted uppercase font-bold text-[10px] font-sans">
                      Index Volatility VIX
                    </span>
                    <span className="font-mono font-black text-rose-400">
                      {indexZones.volatility}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-dash-muted uppercase font-bold text-[10px] font-sans">
                      NIFTY Breadth (20 DSMA)
                    </span>
                    <span className="font-mono font-black text-yellow-400">
                      {indexZones.breadth20DMA}
                    </span>
                  </div>
                </div>

                {/* Supports */}
                <div className="space-y-2 pt-2 border-t border-dash-line">
                  <span className="text-[9px] font-black text-dash-muted uppercase tracking-widest block font-mono">
                    Consolidated Supports
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {indexZones.support.map((val, idx) => (
                      <div
                        key={idx}
                        className="bg-dash-bg/30 border border-dash-line rounded p-2 text-center"
                      >
                        <span className="text-[8px] text-dash-danger font-black block">
                          S{idx + 1} ZONE
                        </span>
                        <span className="text-white font-black font-mono text-sm">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resistance */}
                <div className="space-y-2 pt-2 border-t border-dash-line">
                  <span className="text-[9px] font-black text-dash-muted uppercase tracking-widest block font-mono">
                    Overhead Resistances
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {indexZones.resistance.map((val, idx) => (
                      <div
                        key={idx}
                        className="bg-dash-bg/30 border border-dash-line rounded p-2 text-center"
                      >
                        <span className="text-[8px] text-dash-success font-black block">
                          R{idx + 1} TARGET
                        </span>
                        <span className="text-white font-black font-mono text-sm">
                          {val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default WorldEconomy;
