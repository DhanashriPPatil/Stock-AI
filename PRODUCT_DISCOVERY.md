# Stock Intelligence Platform Discovery & Product Architecture

Prepared by: **TrendEngineer Architect**
Date: **June 02, 2026**
Target Phase: **Phase 0 Assessment & Discovery**

---

## Deliverable 1: Database Inventory Report

The platform operates on a high-fidelity tabular stock database `Master_merged.csv`. This asset compiles both real-time market action and deep-dive historic fundamental ledgers for premium Indian equities (such as INFY, RELIANCE, HDFCBANK, TATAMOTORS, TITAN, SBIN, TCS, ITC, LT, ICICIBANK, etc.).

### Inventory Metrics
- **Source File**: `Master_merged.csv` (and companion `Master_merged.xlsx` upload targets)
- **Record Volume**: Multi-ticker premium equity universe covering top market capitalization leaders.
- **Column Count**: 63 discrete technical and fundamental parameters.
- **Data Integrity**: 100% type safety with fully populated values. Numeric formats are standard floats/integers, and identifier strings are clean standard NSE codes / ISINs.

---

## Deliverable 2: Column Classification Matrix

We have classified the 63 columns of our database into 10 key analytical sections to optimize querying, threshold screening, and AI reporting.

| Category | Columns Included | Data Types | Usage / Intent |
| :--- | :--- | :--- | :--- |
| **Identifiers** | `stock_name`, `nse_code`, `isin`, `sector_name`, `industry_name` | `STRING` | Entity identification and rendering. |
| **Price & Volume** | `current_price`, `market_capitalization`, `day_volume`, `week_volume_avg`, `month_volume_avg`, `year_1_high` | `FLOAT`, `INT` | Basic valuation sizing and liquidity profiles. |
| **Technical Indicators** | `day_rsi`, `day_adx`, `day_macd`, `day_macd_signal_line`, `day_sma50`, `day_sma200` | `FLOAT` | Dynamic trend direction, momentum levels, and key moving average crossovers. |
| **DVM Scoring Factors** | `trendlyne_momentum_score`, `trendlyne_durability_score`, `trendlyne_valuation_score` | `FLOAT` (0-100) | Core Trendlyne multi-factor scoring (Durability/Quality, Valuation, Momentum). |
| **CAGR Growth** | `sales_growth_3y_pct`, `sales_growth_5y_pct`, `profit_growth_3y_pct`, `profit_growth_5y_pct`, `eps_growth_3y_pct`, `eps_growth_5y_pct` | `FLOAT` | Long-term compounding growth trends. |
| **Quarterly Growth** | `sales_q_latest`, `sales_q_prev`, `sales_q_yoy_base`, `profit_q_latest`, `profit_q_prev`, `profit_q_yoy_base` | `FLOAT` | Dynamic near-term momentum and operating trajectory metrics. |
| **Rentability & Margins** | `roce`, `roce_3y_avg`, `roce_5y_avg`, `roe`, `roe_3y_avg`, `opm_current`, `opm_last_year`, `opm_5y_avg` | `FLOAT` (%) | Quality of earnings and raw operational efficiency ratios. |
| **Cash Flows** | `cfo_latest`, `cfo_prev`, `fcf_latest`, `fcf_prev`, `fcf_3y` | `FLOAT` | Cash flow generation safety checks and FCF compounding. |
| **Solvency & Safety** | `debt_to_equity`, `current_ratio`, `interest_coverage`, `altman_z_score`, `piotroski_score` | `FLOAT`, `INT` | Hard safety boundaries (Altman-Z, Piotroski) to filter out volatile companies or financial distress. |
| **Valuation Multiples** | `pe_ttm`, `peg_ratio`, `price_to_sales`, `price_to_fcf`, `price_to_cfo` | `FLOAT` | Relative value metrics to prevent overpaying for growth. |
| **Shareholdings** | `promoter_holding_latest_pct`, `promoter_holding_change_qoq_pct`, `fii_holding_change_qoq_pct`, `mf_holding_change_qoq_pct` | `FLOAT` | Institutional tracking and promoter confidence levels. |

---

## Deliverable 3: Feature Feasibility Assessment (Discovery Matrix)

Based on the feedback received from our discovery questionnaire, we have evaluated the roadmap feasibility and technical architectures.

### User Discovery Specifications
1. **Desired Output formats**: `PDF` reports.
2. **Current reports generated**: Manual / Unsure (ready for automated platform disruption).
3. **Custom filter rules**: None yet (rely on sensible quantitative defaults).
4. **Automated Scheduling**: `Yes` (enable real-time triggers and background compilation).

### Feasibility Matrix

| Feature Module | Feasibility | Effort | Technical Strategy |
| :--- | :--- | :--- | :--- |
| **Automated PDF Compiler** | **High** | Medium | Compile elegant, print-ready, high-fidelity layouts in client React and integrate PDF download pipelines (e.g. print style sheets + browser-driven exports). |
| **Multi-Factor Screener (DVM & Safety)** | **Extremely High** | Low | Perform client-side screening using Redux state. Implement responsive inputs for key metrics (RSI, Piotroski, PEG, promoter holdings). |
| **Dynamic Sector Rotations (RRG Chart)** | **Extremely High** | Low | Leverage `recharts` scatter chart mapping ratio versus momentum coordinates. |
| **Live Watchlist Persistence** | **High** | Low | Use local storage state synchronization to save selected stocks across client sessions. |
| **System Settings (Local Path / Drive Mapping)** | **High** | Medium | Done! Supported in server-side configuration mapping matching physical network disk letters (such as virtual virtual letter `H:` on Windows or `/Volumes/...` on Mac). |
| **Automated Scheduler Ingestion** | **High** | Medium | Implement simple interval workers or Cron triggers inside the Express server to auto-run pipeline files and notify clients on database updates. |

---

## Deliverable 4: Initial Product Opportunity Assessment

Our structural exploration of `Master_merged.csv` has uncovered several high-yield product opportunities. We propose implementing the **AI Quant Trading Workstation**, offering:

1. **Integrated Screener & DVM Filter**: Allow users to run live multi-factor filters (e.g. "Growth compounders" with Piotroski Score > 7, Debt-to-Equity < 0.5, and Sales Growth > 12%).
2. **Interactive Platform Discovery Tab**: A beautiful tab accessible in-app displaying column classification, database health, metrics distributions, and project opportunity matrices.
3. **Flexible Data Location Settings**: Users can work with default workspace assets, drag-and-drop folder uploads, or bind to mapped local directories and virtual Google Drive instances directly. This creates a powerful bridge between local scripts and web views.
4. **Automated AI Intelligence Reports**: Gemini-powered balanced, value, growth, or momentum deep-dives for any selected stock instantly from the dashboard.

---

### Phase 1 Path: Authorized Progression
By approving this assessment and confirming "**yes**", the platform will proceed to register the **Platform Discovery Workstation** inside the global routes, opening up full interactive discovery tools to the end user.
