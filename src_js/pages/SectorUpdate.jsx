import React, { useState } from "react";
import { motion } from "motion/react";
import {
  Building2,
  FileText,
  Cpu,
  Coins,
  Sparkles,
  AlertOctagon,
  HardHat,
  Database,
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
  ReferenceLine,
} from "recharts";

export const SectorUpdate = () => {
  const [activeTab, setActiveTab] = useState("summary");

  const colors = {
    primary: "#00c2ff",
    success: "#10b981",
    danger: "#f43f5e",
    warning: "#fbbf24",
    muted: "#94a3b8",
    accent: "#a855f7",
    ink: "#f1f5f9",
  };

  // Commodity Weekly changes on May 11, 2026
  const commodityPriceData = [
    { label: "Tin ($/t)", rate: 9.9, value: "$53,869", type: "Non-Ferrous" },
    { label: "Copper ($/t)", rate: 4.7, value: "$13,515", type: "Non-Ferrous" },
    { label: "Zinc ($/t)", rate: 1.7, value: "$3,417", type: "Non-Ferrous" },
    { label: "Indian HRC (₹/t)", rate: 1.6, value: "₹58,700", type: "Ferrous" },
    { label: "Lead ($/t)", rate: 1.2, value: "$1,966", type: "Non-Ferrous" },
    {
      label: "Chinese HRC (₹/t)",
      rate: 1.0,
      value: "₹48,389",
      type: "Ferrous",
    },
    {
      label: "Aluminium ($/t)",
      rate: 0.9,
      value: "$3,563",
      type: "Non-Ferrous",
    },
    { label: "Coking Coal ($/t)", rate: 0.6, value: "$181", type: "Ferrous" },
    { label: "Iron Ore Odisha", rate: -0.6, value: "₹7,700", type: "Ferrous" },
    {
      label: "Natural Gas ($/MMBtu)",
      rate: -1.9,
      value: "$2.80",
      type: "Energy",
    },
    { label: "Billet Raipur", rate: -3.7, value: "₹40,550", type: "Ferrous" },
    { label: "Brent Crude ($/bbl)", rate: -7.8, value: "$105", type: "Energy" },
  ];

  // IT Coverage List
  const itCompanies = [
    {
      name: "Coforge",
      rating: "BUY",
      target: "2,020",
      cmp: "1,169",
      potential: "72.8%",
    },
    {
      name: "Persistent Systems",
      rating: "BUY",
      target: "6,400",
      cmp: "5,330",
      potential: "20.1%",
    },
    {
      name: "Tech Mahindra",
      rating: "BUY",
      target: "1,660",
      cmp: "1,463",
      potential: "13.5%",
    },
    {
      name: "Infosys",
      rating: "BUY",
      target: "1,570",
      cmp: "1,241",
      potential: "26.5%",
    },
    {
      name: "Latent View Analytics",
      rating: "BUY",
      target: "450",
      cmp: "261.2",
      potential: "72.3%",
    },
    {
      name: "Fractal Analytics",
      rating: "HOLD",
      target: "1,040",
      cmp: "1,034",
      potential: "0.6%",
    },
  ];

  return (
    <div
      id="sector_update_page"
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
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono font-black tracking-widest bg-purple-500/15 text-purple-400 border border-purple-400/20 uppercase">
              Sector Research Panel
            </span>
            <span className="text-[10px] text-dash-muted font-mono font-bold">
              • Updated Mid-May 2026
            </span>
          </div>
          <h2 className="text-2xl font-display font-black tracking-tight text-white flex items-center gap-2 uppercase">
            <Building2 className="w-6 h-6 text-dash-primary" />
            Sector Updates & Commodity Ledger
          </h2>
          <p className="text-xs text-dash-muted">
            Formal intelligence assessments covering heavy metal supply
            corridors, ferrous raw pricing, and IT decision science shifts.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-dash-bg/60 border border-dash-line rounded-xl px-4 py-3 font-mono text-[11px] h-fit">
          <div className="w-2.5 h-2.5 rounded-full bg-dash-warning relative flex">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-dash-warning opacity-75"></span>
          </div>
          <div>
            <span className="text-dash-muted block text-[9px] font-mono font-black tracking-wider uppercase">
              SECTOR COVERAGE
            </span>
            <span className="text-white font-bold font-mono">
              CORE STRUCTURAL TRANSITIONS
            </span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dash-line pb-0.5">
        {[
          { id: "summary", label: "Executive Synthesis", icon: FileText },
          { id: "commodities", label: "Metals & Industrial Raw", icon: Coins },
          { id: "tech", label: "IT & Next-Gen Analytics", icon: Cpu },
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

      {/* Main Tab Content Panels */}
      <div className="mt-4">
        {/* TAB 1: EXECUTIVE SYNTHESIS */}
        {activeTab === "summary" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              {/* Primary Report Content */}
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-dash-line pb-2.5">
                  <span className="w-2 h-2 rounded bg-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc] uppercase font-mono">
                    Commodity Performance & Geopolitical Headwinds
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-dash-ink leading-relaxed font-sans text-justify">
                  <p>
                    A thematic evaluation of current primary resource markets
                    highlights a period of significant supply-side tightening.
                    Industrial non-ferrous metals are seeing substantial price
                    support, led by significant WoW gains across major smelting
                    categories. Weekly figures indicate that tin prices climbed
                    near 9.9 percent to reach $53,869 per tonne, and copper
                    registered an impressive 4.7 percent advance settling near
                    $13,515 per tonne. These upward movements are primarily
                    driven by severe disruption risks at major international
                    choke points, particularly concerns centered around extended
                    closures adjacent to the Strait of Hormuz.
                  </p>
                  <p>
                    Similarly, the global aluminium market continues to operate
                    under structural strain resulting from severe capacity
                    shortages in the Middle East, with estimated production
                    deficits reaching 3 to 3.5 million tonnes for calendar year
                    2026. This physical tightness is underscored by severe
                    backwardation inside London Metal Exchange (LME) spot
                    curves, which reached multi-decade highs of $94 per tonne.
                  </p>
                  <p>
                    Conversely, energy resources have experienced a period of
                    moderate decompression. Brent crude contracts recorded a
                    notable weekly decline of 7.8 percent, returning toward $105
                    per barrel as speculative positions adjusted on hopes of
                    regional de-escalation. Natural gas followed a similar
                    downward trajectory, declining 1.9 percent to $2.8 per MMBtu
                    on warming transition forecasts for May.
                  </p>
                  <p>
                    Within ferrous sectors, Indian domestic Hot Rolled Coil
                    (HRC) indices gained 1.6 percent WoW to ₹58,700 per tonne,
                    bolstered by expected delivery constraints ahead of
                    scheduled processing maintenance closures. China saw a
                    parallel 1.0 percent price increase as mills re-opened,
                    while intermediate materials such as billets saw temporary
                    consolidation, slipping 3.7 percent WoW in Raipur to ₹40,550
                    per tonne.
                  </p>
                </div>
              </div>

              {/* IT Sector Assessment */}
              <div className="glass-premium p-6 rounded-2xl space-y-4">
                <div className="flex items-center gap-2 border-b border-dash-line pb-2.5">
                  <span className="w-2 h-2 rounded bg-purple-400" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc] uppercase font-mono">
                    Technology Engagements & Decision Architectures
                  </h3>
                </div>

                <div className="space-y-4 text-xs text-dash-ink leading-relaxed font-sans text-justify">
                  <p>
                    The enterprise consulting landscape is undergoing a
                    structural transition toward active decisioning
                    architectures. Traditional client engagements are shifting
                    from passive business intelligence reporting toward
                    integrated models that embed analytics directly into
                    operational systems. High-end complex activities—including
                    decision governance, risk tiering, and joint stakeholder
                    accountability—are now the primary drivers of enterprise
                    value.
                  </p>
                  <p>
                    This evolution has catalyzed a clear split in services.
                    Low-end data engineering functions are facing rapid
                    commoditization, which is leading companies to scale more
                    sophisticated offerings. Advanced decision sciences and
                    sophisticated modeling frameworks are gaining traction as
                    high-margin differentiators. Platforms that offer continuous
                    service as software (CSaaS) are building highly sticky
                    client relationships and creating institutional dependencies
                    that are insulated from simple headcount cost pressures.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar with summaries */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass bg-dash-surface-dark border border-dash-line p-5 rounded-2xl space-y-4">
                <div className="text-xs font-black tracking-widest uppercase border-b border-dash-line pb-3 text-white flex items-center justify-between">
                  <span>Research Highlights</span>
                  <Sparkles className="w-4 h-4 text-dash-primary" />
                </div>

                <div className="space-y-3.5 text-xs">
                  <div className="p-3 bg-dash-bg/30 border border-white/[0.02] rounded-xl space-y-1">
                    <span className="text-[10px] text-dash-success font-mono font-bold block uppercase">
                      • Met-Coal & Carbon Inputs
                    </span>
                    <p className="text-dash-ink text-[11px] leading-relaxed">
                      Coking coal added 0.6% WoW to $181/t, impacted by
                      supply-side slowdowns and mining delays in major
                      Australian basins.
                    </p>
                  </div>

                  <div className="p-3 bg-dash-bg/30 border border-white/[0.02] rounded-xl space-y-1">
                    <span className="text-[10px] text-dash-warning font-mono font-bold block uppercase">
                      • Alumina Surplus Buffer
                    </span>
                    <p className="text-dash-ink text-[11px] leading-relaxed">
                      An expected ~5mt alumina surplus in CY26 is keeping input
                      raw prices weak (~$300/t), supporting high operating
                      margins for smelting firms.
                    </p>
                  </div>

                  <div className="p-3 bg-dash-bg/30 border border-white/[0.02] rounded-xl space-y-1">
                    <span className="text-[10px] text-purple-400 font-mono font-bold block uppercase">
                      • Decision Science Pivot
                    </span>
                    <p className="text-dash-ink text-[11px] leading-relaxed">
                      Enterprise leaders are prioritizing premium decision
                      modeling lines (accounting for over 80% of top-tier agency
                      revenues) over basic data fabric maintenance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: METALS & INDUSTRIAL RAW */}
        {activeTab === "commodities" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Metals/Energies Performance Chart */}
            <div className="glass-premium p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-dash-line pb-4 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-5 h-5 text-dash-primary" />
                  <h3 className="text-xs font-black tracking-widest text-white uppercase font-mono">
                    Commodity Index Ledger WoW Progression (%)
                  </h3>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={commodityPriceData}
                    margin={{ top: 10, right: 30, left: -25, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.03)"
                    />
                    <XAxis
                      dataKey="label"
                      stroke="#94a3b8"
                      fontSize={9}
                      interval={0}
                      angle={-15}
                      textAnchor="end"
                      height={50}
                    />
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

                    <ReferenceLine y={0} stroke="#94a3b8" />
                    <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                      {commodityPriceData.map((entry, index) => {
                        const isNeg = entry.rate < 0;
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

            {/* In-depth details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-premium p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-dash-line">
                  <HardHat className="w-5 h-5 text-dash-primary" />
                  <span className="text-xs font-black tracking-widest text-white uppercase font-mono">
                    Middle-East Smelter Disruptions
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-dash-ink">
                  <p className="text-justify leading-relaxed">
                    The supply shock is expected to extend well into CY27 due to
                    extensive offline capacity across key Middle Eastern
                    smelters. Damaged infrastructure cannot easily be
                    normalized, resulting in sustained market tightness even if
                    immediate geopolitical tensions subside.
                  </p>
                  <div className="space-y-2 bg-dash-bg/40 border border-dash-line p-3 rounded-lg font-mono text-[10px] text-dash-muted">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">
                        EGA AL TAWEELAH:
                      </span>
                      <span className="text-rose-400 font-bold">
                        100% SHUT (1.6MTPA Offline)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-white">
                        ALBA BAHRAIN:
                      </span>
                      <span className="text-rose-400 font-semibold">
                        ~30% Capacity Operating
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-white">
                        QATALUM SMELTER:
                      </span>
                      <span className="text-yellow-400 font-semibold">
                        ~60% Capacity (Alumina Risks)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-premium p-6 rounded-xl space-y-4">
                <div className="flex items-center gap-2 pb-2.5 border-b border-dash-line">
                  <AlertOctagon className="w-5 h-5 text-dash-danger" />
                  <span className="text-xs font-black tracking-widest text-white uppercase font-mono">
                    Steel Mills Assessment
                  </span>
                </div>

                <div className="space-y-3.5 text-xs text-dash-ink">
                  <p className="text-justify leading-relaxed">
                    Indian steelmakers announced substantial price increases for
                    May deliveries, aiming to offset expected maintenance
                    shutdowns that will reduce short-term supply. Similarly,
                    Chinese mills re-opened post holiday sessions facing
                    elevated raw pricing, while iron ore and billets saw
                    selective demand-side cooling.
                  </p>
                  <div className="space-y-2 bg-dash-bg/40 border border-dash-line p-3 rounded-lg font-mono text-[10px] text-dash-muted">
                    <div className="flex justify-between">
                      <span className="font-bold text-white">
                        INDIAN HRC INDEX:
                      </span>
                      <span className="text-emerald-400 font-bold">
                        ₹58,700/t (+1.6% WoW)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-white">
                        BILLET EX-RAIPUR:
                      </span>
                      <span className="text-rose-400 font-bold">
                        ₹40,550/t (-3.7% WoW)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold text-white">
                        HRC-PATRA SPREAD:
                      </span>
                      <span className="text-emerald-400 font-semibold">
                        ₹13,900/t (+44% Premium)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: IT & DATA ANALYTICS */}
        {activeTab === "tech" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-premium p-6 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-dash-line pb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xs font-black tracking-widest text-[#f8fafc] uppercase font-mono">
                    IT & Decision Sciences Landscape
                  </h3>
                </div>
                <span className="text-[9px] font-mono bg-purple-500/10 text-purple-400 px-2 py-0.5 border border-purple-400/20 rounded font-black uppercase">
                  Analytics Overweight
                </span>
              </div>

              <div className="space-y-4 text-xs text-dash-ink leading-relaxed font-sans text-justify">
                <p>
                  Primary structural changes across data analytics are marked by
                  a pivot away from isolated project-oriented deployments toward
                  long-horizon integrated decision-support frameworks. Standard
                  data engineering pipelines—previously considered major growth
                  engines—are increasingly treated as commoditized support
                  layers, now contributing less than 17% to leading agency
                  consulting revenue models.
                </p>
                <p>
                  Instead, organizations are centering their investments inside
                  higher-tier segments: Data Sciences (representing 40-45% of
                  core mixes) and Decision Sciences (representing 38-43%). By
                  coupling advanced analytics with decision accountability and
                  platform-led models (CSaaS), vendors are achieving deeper
                  client stickiness and stronger multi-year customer lifetime
                  values.
                </p>
              </div>
            </div>

            {/* Coverage Grid */}
            <div className="space-y-3">
              <span className="text-[10px] text-dash-muted font-mono font-black uppercase tracking-widest block px-1">
                Research Analyst Coverage Universe
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {itCompanies.map((comp, idx) => (
                  <div
                    key={idx}
                    className="glass-premium p-4 rounded-xl border border-white/[0.04] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-white">
                        {comp.name}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[8px] font-mono font-black ${
                          comp.rating === "BUY"
                            ? "bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
                            : "bg-yellow-400/10 text-yellow-400 border border-yellow-400/20"
                        }`}
                      >
                        {comp.rating}
                      </span>
                    </div>

                    <div className="space-y-1.5 font-mono text-[10px] text-dash-muted">
                      <div className="flex justify-between">
                        <span>Current price:</span>
                        <span className="text-white font-bold">
                          ₹{comp.cmp}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Target price:</span>
                        <span className="text-white font-bold">
                          ₹{comp.target}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Implied Potential:</span>
                        <span className="text-dash-success font-black">
                          {comp.potential}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SectorUpdate;
