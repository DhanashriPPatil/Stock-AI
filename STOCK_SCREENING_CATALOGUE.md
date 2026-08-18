# Institutional-Grade Stock Screening Catalogue & Blueprint
**Prepared by**: Senior Quantamental Research Analyst, Stock Market Data Architect, Equity Research Head & Screening Engine Designer
**Target Asset Database**: `Master_merged.csv`
**Date**: Junes 04, 2026

---

## EXECUTIVE SUMMARY

This Master Catalogue serves as the architectural blueprint for the **StockIntel AI Platform**. It contains a systematic breakdown of the master database, classifies every single field, maps out **315 high-fidelity screeners** categorized by analytical style, formulates **100 quantitative-fundamental (quantamental) hybrid filters**, designs **12 specialized investor persona-based screeners**, builds **9 distinct reports structures**, profiles **14 advanced premium feature concepts**, and finally establishes a comprehensive **Prioritization Frame** and **Implementation Order**.

The logic defined in this document uses explicit mathematical, relative-comparative, or statistical boundaries based on the actual CSV column headers (e.g., `pe_ttm`, `day_rsi`, `trendlyne_durability_score`, `promoter_holding_change_qoq_pct`).

---

## PHASE 1: DATABASE UNDERSTANDING (COLUMNS CLASSIFICATION)

The `Master_merged.csv` database features 63 distinct columns. To construct precision screener filters, these metrics are mapped below to 11 functional investment buckets.

### 1. Fundamental Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `sales_q_latest` | Value in currency of latest quarter sales | Assess absolute business scale and revenue footprint. |
| `sales_q_prev` | Value in currency of previous quarter sales | Determine immediate sequential seasonality in core operations. |
| `sales_q_yoy_base` | Value in currency of quarter sales exactly 1 year ago | YoY baseline to strip out cyclical seasonal effects. |
| `profit_q_latest` | Net profit in currency for the latest reported quarter | Gauge short-term bottom-line cash generating capacity. |
| `profit_q_prev` | Net profit in currency for the previous quarter | Sequentially inspect margin squeezes or windfall profit quarters. |
| `profit_q_yoy_base` | Net profit in currency for quarter 1 year ago | Compare quarterly growth over corresponding prior-year baseline. |
| `eps_q_latest` | Earnings Per Share for the latest quarter | Basic metric for quarterly earnings quality at the individual share level. |
| `eps_q_prev` | Earnings Per Share for the previous quarter | Monitor sequential diluted earnings trends. |
| `eps_q_yoy_base` | Earnings Per Share for quarter 1 year ago | Basis for calculating quarterly EPS growth YoY. |

### 2. Technical Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `current_price` | Most recent trading price of the equity | Benchmark for calculating absolute levels and return boundaries. |
| `day_rsi` | 14-day Relative Strength Index (0 to 100) | Identify immediate overbought (>70) or oversold (<30) momentum shifts. |
| `day_adx` | Average Directional Index (0 to 100) | Measure the absolute strength of a trend, regardless of buy/sell direction. |
| `day_macd` | Moving Average Convergence Divergence line | Spot short-term momentum shifts and MACD-signal crossovers. |
| `day_macd_signal_line`| 9-day EMA signal line of the MACD indicator | Filter MACD crossover lags and define entry triggers. |
| `day_sma50` | 50-day Simple Moving Average price | Key intermediate support or resistance trendline. |
| `day_sma200` | 200-day Simple Moving Average price | Primary long-term structural market trend partition. |
| `year_1_high` | Highest transaction price over the trailing 12 months | Measure drawdown percentages and close-to-high breakout limits. |

### 3. Relative Strength Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `rr_nifty50_year_pct` | Trailing 1-year relative outperformance vs Nifty50 | Screen for high beta or genuine alpha-producing stocks against the index. |
| `rr_sector_year_pct` | Trailing 1-year relative return compared to Sector | Isolate outperforming leaders within a sector (Alpha generation). |
| `rr_industry_year_pct` | Trailing 1-year relative return compared to Industry | Measure micro-industry lead-lag differentials against peers. |

### 4. Valuation Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `pe_ttm` | Price-to-Earnings multiple based on trailing 12M | Assess basic pricing multiple compared to history or peers. |
| `peg_ratio` | PE ratio divided by YoY earnings growth rate | Identify GARP (Growth at a Reasonable Price) compounds where PEG < 1.0. |
| `price_to_sales` | Price-to-Sales (revenue) ratio | Evaluate early-stage, fast-growing, or low-margin asset valuations. |
| `price_to_fcf` | Market Cap divided by Trailing Free Cash Flow | Screen for cash-generative valuation bargains. |
| `price_to_cfo` | Price split by Cash Flow from Operations | Benchmark raw operating liquidity multiples under standard scenarios. |
| `trendlyne_valuation_score`| Quantitative valuation score from Trendlyne (0-100) | Multi-factor composite valuation ranking for rapid assessment. |

### 5. Quality Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `roce` | Return on Capital Employed (%) | Determine capital allocation efficiency and core return rate. |
| `roce_3y_avg` | 3-year trailing average of ROCE | Smooth out commodity/cyclical earnings bumps to check persistent quality. |
| `roce_5y_avg` | 5-year trailing average of ROCE | Long-term capital compounding consistency benchmark. |
| `roe` | Return on Equity (%) | Measure returns generated specifically on shareholders' equity. |
| `roe_3y_avg` | 3-year trailing average of Return on Equity | Track historical consistency of ROE compounding. |
| `opm_current` | Operating Profit Margin (%) | Track current direct operating efficiency of product lines. |
| `opm_last_year` | Operating Profit Margin of the prior fiscal year | Assess direction of operational margin expansion or contraction. |
| `opm_5y_avg` | 5-year trailing average of Operating Profit Margins | Determine structural pricing power and moat of the business. |
| `trendlyne_durability_score`| Composite financial strength / durability (0-100) | High score indicates supreme operating consistency and clean balance sheets. |

### 6. Growth Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `sales_growth_3y_pct` | Compound Annual Revenue Growth over 3 years | Screen for mid-term sales validation and product-market expansion. |
| `sales_growth_5y_pct` | Compound Annual Revenue Growth over 5 years | Evaluate long-term structural revenue trends. |
| `profit_growth_3y_pct`| Compound Annual Profit Growth over 3 years | Identify operating leverage compounding patterns. |
| `profit_growth_5y_pct`| Compound Annual Profit Growth over 5 years | Isolate reliable premium wealth creators. |
| `eps_growth_3y_pct` | Compounded Earnings Per Share growth (3-year CAGR) | Inspect equity-share level bottom line compounding. |
| `eps_growth_5y_pct` | Compounded Earnings Per Share growth (5-year CAGR) | Ultimate long-term shareholder value growth identifier. |

### 7. Momentum Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `trendlyne_momentum_score`| Integrated Trendlyne price/technical momentum (0-100) | Single score isolating ultra-strong momentum leaders. |
| `day_macd` | Directional pricing momentum convergence | Buy/Sell trigger generation. |

### 8. Ownership Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `promoter_holding_latest_pct` | Total stake owned by company promoters | High holdings signal strong alignment of interest. |
| `promoter_holding_change_qoq_pct`| Net change in promoter stake over latest quarter | Detect insider optimism (buying) or corporate distress (pledging/selling). |
| `fii_holding_change_qoq_pct` | Net change in Foreign Institutional Investors stake | Identify institutional flow, hot money, and global capital backing. |
| `mf_holding_change_qoq_pct` | Net change in Domestic Mutual Fund holdings | Spot high-conviction local institutional accumulation. |

### 9. Risk Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `debt_to_equity` | Total debt divided by total common equity | Identify basic leverage risk and solvency profile. |
| `altman_z_score` | Credit-strength score (Z-Score model) | Predict bankruptcy risk; Z > 3.0 represents a safe fiscal fortress. |
| `piotroski_score` | 9-point fundamental health rating (0 to 9) | Audit fundamental strength; scores of 8 or 9 indicate top quality. |

### 10. Liquidity Metrics

| Column Name | Business Meaning | Investor Use Case |
| :--- | :--- | :--- |
| `current_ratio` | Short-term assets divided by short-term liabilities | Assess immediate operational working capital buffers. |
| `interest_coverage` | EBIT divided by total interest expenses | Calculate margin of safety for interest-bearing debt repayments. |
| `cfo_latest` | Cash flow from operations of the latest year | Measure actual realized paperless cash vs reporting net profit. |
| `cfo_prev` | Cash flow from operations of the prior year | Monitor operational liquidity trajectories. |
| `fcf_latest` | Free Cash Flow (CFO minus Capex) latest year | Direct measure of investable capital returned to shareholders or retained. |
| `fcf_prev` | Free Cash Flow of previous year | Confirm capital reinvestment capability. |
| `fcf_3y` | Cumulative Free Cash Flow over 3 years | Verify genuine underlying cash-generation consistency. |

### 11. Sector & Industry Comparison Metrics

These metrics compare specific stock ratios against corresponding sector averages (`sector_name` aggregations) or industry averages (`industry_name` aggregations), showing relative strength.

---

## PHASE 2: QUERY DISCOVERY (315 SCREENING SCHEMAS)

This section maps out **315 highly-specific filters** categorized into 8 distinct investment disciplines. 

---

### GROUP 1: VALUE INVESTING (50 Queries)

1. **Deep Undervaluation**: `pe_ttm < 15` AND `trendlyne_valuation_score > 70`
2. **Value compounders**: `pe_ttm < 20` AND `piotroski_score >= 8`
3. **Solvent Bargains**: `pe_ttm < 18` AND `altman_z_score > 3.0`
4. **PEG Growth Arbitrage**: `peg_ratio > 0.0` AND `peg_ratio < 1.0`
5. **Ultra Low Price-to-Sales**: `price_to_sales < 1.5` AND `opm_current > 12.0`
6. **Free Cash Value**: `price_to_fcf > 0.0` AND `price_to_fcf < 15.0`
7. **Operating Cash Champion**: `price_to_cfo > 0.0` AND `price_to_cfo < 12.0`
8. **Valuation Score Outliers**: `trendlyne_valuation_score >= 80`
9. **Discounted Quality Leading PE**: `pe_ttm < 22` AND `roe > 18.0`
10. **High-Efficiency Deep Value**: `pe_ttm < 12` AND `roce > 20.0`
11. **Negative Debt Value**: `pe_ttm < 15` AND `debt_to_equity < 0.2`
12. **Working Capital Protected**: `price_to_sales < 2.0` AND `current_ratio > 2.0`
13. **High Interest Safety Bargain**: `pe_ttm < 16` AND `interest_coverage > 10.0`
14. **Asset Rich Cash Compounders**: `trendlyne_valuation_score > 65` AND `fcf_3y > 1000`
15. **Institutional Backup Value**: `pe_ttm < 18` AND `fii_holding_change_qoq_pct > 0.1`
16. **Promoter Co-invest Value**: `pe_ttm < 20` AND `promoter_holding_change_qoq_pct > 0.0`
17. **Margin Rebounds Value**: `pe_ttm < 20` AND `opm_current > opm_last_year`
18. **Piotroski Turnarounds**: `piotroski_score >= 7` AND `trendlyne_valuation_score > 75`
19. **Low PE Low PEG**: `pe_ttm < 15` AND `peg_ratio < 0.8`
20. **Under-the-radar Cash Cows**: `market_capitalization < 50000` AND `price_to_fcf < 12.0`
21. **Low Price-to-CFO Compounders**: `price_to_cfo < 10` AND `roce_3y_avg > 15`
22. **Extreme Price-to-Sales Discount**: `price_to_sales < 0.8` AND `debt_to_equity < 0.5`
23. **High Margin Value plays**: `pe_ttm < 14` AND `opm_current > 20`
24. **Deep Value Cash Machine**: `price_to_fcf < 10` AND `opm_current > 15`
25. **Safe Value Outliers**: `altman_z_score > 4.5` AND `pe_ttm < 15`
26. **High OPM + Valuation Score**: `opm_current > 25` AND `trendlyne_valuation_score > 70`
27. **Low PE with 3Y Profit compound**: `pe_ttm < 16` AND `profit_growth_3y_pct > 15`
28. **Underperforming Price on Value**: `trendlyne_valuation_score > 80` AND `rr_nifty50_year_pct < 0`
29. **Valued Margin Leaders**: `pe_ttm < 18` AND `opm_5y_avg > 18`
30. **Piotroski 9 Value Pick**: `piotroski_score == 9` AND `trendlyne_valuation_score > 60`
31. **PEG Master Value**: `peg_ratio > 0.1` AND `peg_ratio < 0.7` AND `roe > 15`
32. **Conservative Value Stocks**: `pe_ttm < 12` AND `debt_to_equity < 0.1` AND `interest_coverage > 15`
33. **Midcap Value Bargains**: `market_capitalization > 10000` AND `market_capitalization < 100000` AND `pe_ttm < 16`
34. **Smallcap Value Rockets**: `market_capitalization < 10000` AND `pe_ttm < 12` AND `piotroski_score >= 7`
35. **High Durability Low PE**: `trendlyne_durability_score > 75` AND `pe_ttm < 18`
36. **Value Accretive EPS momentum**: `pe_ttm < 20` AND `eps_q_latest > eps_q_prev`
37. **FCF Yield Gems**: `price_to_fcf < 8` AND `debt_to_equity < 0.5`
38. **CFO Compound High ROCE**: `price_to_cfo < 10` AND `roce > 25`
39. **Safety First Bargain**: `altman_z_score > 3.0` AND `piotroski_score >= 8` AND `pe_ttm < 15`
40. **Institutional Supported Value**: `pe_ttm < 15` AND `mf_holding_change_qoq_pct > 0.0`
41. **Promoter Reinforced Value**: `pe_ttm < 14` AND `promoter_holding_change_qoq_pct > 0.5`
42. **Undervalued OPM Expanders**: `trendlyne_valuation_score > 65` AND `opm_current > opm_last_year`
43. **Moat on Discount**: `roe_5y_avg > 20` AND `trendlyne_valuation_score > 70`
44. **Earnings Resilient Deep Value**: `pe_ttm < 15` AND `profit_growth_5y_pct > 12`
45. **Debt deleveraging with low PE**: `pe_ttm < 18` AND `debt_to_equity < 0.3`
46. **High CFO Quality Value**: `price_to_cfo < 12` AND `cfo_latest > cfo_prev`
47. **Sales Compound Value**: `sales_growth_5y_pct > 15` AND `pe_ttm < 16`
48. **Asset Fortress Outperform**: `altman_z_score > 5.0` AND `price_to_sales < 1.2`
49. **Low Multiples Sector Winners**: `pe_ttm < 18` AND `rr_sector_year_pct > 0`
50. **Underpriced Compounding Growth**: `pe_ttm < 20` AND `profit_growth_5y_pct > 20`

---

### GROUP 2: GROWTH INVESTING (50 Queries)

51. **High-Conviction Hypergrowth**: `profit_growth_5y_pct > 25` AND `sales_growth_5y_pct > 20`
52. **Rapid Trailing Compounding**: `profit_growth_3y_pct > 30` AND `sales_growth_3y_pct > 25`
53. **EPS Growth acceleration**: `eps_growth_3y_pct > 25` AND `eps_q_latest > eps_q_prev`
54. **Long Term Growth Giants**: `profit_growth_5y_pct > 20` AND `market_capitalization > 100000`
55. **High Quality Growth Rules**: `profit_growth_5y_pct > 18` AND `roe > 20`
56. **Capital-Efficient Scalers**: `sales_growth_5y_pct > 15` AND `roce > 25`
57. **Near-Term Sales Rockets**: `sales_q_latest > sales_q_yoy_base * 1.25`
58. **Accelerating Bottom Line**: `profit_q_latest > profit_q_yoy_base * 1.30`
59. **Consistent EPS Compounders**: `eps_growth_5y_pct > 20` AND `eps_growth_3y_pct > 18`
60. **High OPM Revenue Compounders**: `sales_growth_5y_pct > 18` AND `opm_current > 22`
61. **Free Cash Growth Champions**: `fcf_latest > fcf_prev` AND `profit_growth_5y_pct > 20`
62. **Operating Cash Growth Beasts**: `cfo_latest > cfo_prev` AND `sales_growth_5y_pct > 18`
63. **Debt-Free Hypergrowth**: `sales_growth_5y_pct > 20` AND `debt_to_equity < 0.1`
64. **Piotroski High-Growth Outliers**: `profit_growth_5y_pct > 15` AND `piotroski_score >= 8`
65. **Valuation-Insulated Growth**: `sales_growth_5y_pct > 18` AND `peg_ratio < 1.2`
66. **Mid-Cap Multibagger Candidate**: `market_capitalization > 10000` AND `market_capitalization < 100000` AND `profit_growth_5y_pct > 25`
67. **Small-Cap Growth Dynamos**: `market_capitalization < 10000` AND `sales_growth_3y_pct > 25` AND `roce > 18`
68. **Latest Quarter Sales Jump**: `sales_q_latest > sales_q_prev * 1.15`
69. **Latest Quarter Profit Surge**: `profit_q_latest > profit_q_prev * 1.20`
70. **High Growth Institutional Accumulation**: `profit_growth_3y_pct > 20` AND `fii_holding_change_qoq_pct > 0.1`
71. **Momentum Backed Growth**: `profit_growth_5y_pct > 18` AND `trendlyne_momentum_score > 75`
72. **High OPM Growth Compounders**: `opm_current > 25` AND `profit_growth_5y_pct > 20`
73. **Super-Charged Micro-Cap**: `market_capitalization < 5000` AND `sales_growth_5y_pct > 30`
74. **Double-Digit Compounder**: `sales_growth_5y_pct > 15` AND `profit_growth_5y_pct > 15` AND `eps_growth_5y_pct > 15`
75. **Consistent ROCE Expander**: `roce > roce_3y_avg` AND `sales_growth_5y_pct > 15`
76. **Consistent ROE Expander**: `roe > roe_3y_avg` AND `profit_growth_5y_pct > 15`
77. **Sales and Profit Multipliers**: `sales_growth_3y_pct > 20` AND `profit_growth_3y_pct > 30`
78. **Sustainable Growth Compounder**: `debt_to_equity < 0.4` AND `sales_growth_5y_pct > 18` AND `profit_growth_5y_pct > 18`
79. **Altman Safest-Growth**: `altman_z_score > 4.5` AND `profit_growth_5y_pct > 20`
80. **Sales Accelerators YoY**: `sales_q_latest > sales_q_yoy_base * 1.20` AND `sales_growth_5y_pct > 12`
81. **OPM Expansion Growth**: `opm_current > opm_last_year` AND `sales_growth_5y_pct > 20`
82. **EPS Accelerators**: `eps_q_latest > eps_q_yoy_base * 1.20` AND `eps_growth_5y_pct > 15`
83. **Growth Leaders over Nifty**: `profit_growth_5y_pct > 20` AND `rr_nifty50_year_pct > 15`
84. **Sector Outperforming Growth**: `sales_growth_5y_pct > 15` AND `rr_sector_year_pct > 5`
85. **Industry Outperforming Growth**: `profit_growth_5y_pct > 18` AND `rr_industry_year_pct > 5`
86. **High Free Cash Growth**: `fcf_latest > fcf_prev` AND `fcf_3y > 500` AND `sales_growth_5y_pct > 15`
87. **Cash Conversion Growth**: `cfo_latest > profit_q_latest * 4 * 0.9` AND `profit_growth_5y_pct > 18`
88. **Promoter Buying Growth**: `profit_growth_5y_pct > 15` AND `promoter_holding_change_qoq_pct > 0.2`
89. **MF Favored Growth**: `sales_growth_5y_pct > 18` AND `mf_holding_change_qoq_pct > 0.1`
90. **PEG Under one Compounder**: `peg_ratio > 0.1` AND `peg_ratio < 0.95` AND `sales_growth_5y_pct > 15`
91. **High Durability Growth**: `trendlyne_durability_score > 70` AND `profit_growth_5y_pct > 20`
92. **Valuable Growth Compounder**: `trendlyne_valuation_score > 55` AND `sales_growth_5y_pct > 18`
93. **Quick Liquidity Growth**: `current_ratio > 1.8` AND `sales_growth_5y_pct > 15`
94. **Interest coverage Growth**: `interest_coverage > 20` AND `profit_growth_5y_pct > 20`
95. **FII Accumulating Rockets**: `fii_holding_change_qoq_pct > 0.5` AND `eps_growth_3y_pct > 25`
96. **Triple Accelerators**: `sales_q_latest > sales_q_prev` AND `profit_q_latest > profit_q_prev` AND `eps_q_latest > eps_q_prev`
97. **Highly Efficient Compounder**: `roce > 30` AND `profit_growth_5y_pct > 15`
98. **Large-Cap Steady Compounder**: `market_capitalization > 150000` AND `sales_growth_5y_pct > 12` AND `profit_growth_5y_pct > 12`
99. **EPS Growth with margin expansion**: `eps_growth_5y_pct > 18` AND `opm_current > opm_5y_avg`
100. **Compound Growth Leaders**: `sales_growth_5y_pct > 22` AND `roe > 22` AND `debt_to_equity < 0.2`

---

### GROUP 3: QUALITY INVESTING (50 Queries)

101. **Capital Allocation Elites**: `roce > 30` AND `roe > 25`
102. **High Persistence Moats**: `roce_5y_avg > 25` AND `roce_3y_avg > 25`
103. **Supreme Long-term ROE**: `roe_3y_avg > 22` AND `roe > 20`
104. **Pricing Power Champions**: `opm_current > 25` AND `opm_5y_avg > 22`
105. **Zero-Debt Castles**: `debt_to_equity == 0.0` or `debt_to_equity < 0.05`
106. **Solvency Fortress**: `altman_z_score > 5.0` AND `piotroski_score >= 8`
107. **Maximum Durability**: `trendlyne_durability_score >= 85`
108. **Highly Solvent Margin Giants**: `interest_coverage > 50` AND `opm_current > 20`
109. **Clean Balance Sheets**: `current_ratio > 2.5` AND `debt_to_equity < 0.2`
110. **High CFO backed Quality**: `cfo_latest > 0` AND `price_to_cfo < 16` AND `roce > 24`
111. **FCF Generation Machines**: `fcf_3y > 2000` AND `fcf_latest > fcf_prev`
112. **Highly Consistent OPM**: `opm_current > 30` AND `opm_last_year > 28`
113. **Piotroski Perfect 9**: `piotroski_score == 9`
114. **Durability and Quality Combo**: `trendlyne_durability_score > 80` AND `roce_5y_avg > 20`
115. **Capital Multiplier Elite**: `roce > 35` AND `debt_to_equity < 0.1`
116. **ROE 5-Year Consistent Compounder**: `roe_3y_avg > 20` AND `roe > 18` AND `profit_growth_5y_pct > 15`
117. **Top-Tier Interest Safety**: `interest_coverage > 30` AND `altman_z_score > 4.0`
118. **Unleveraged Value Quality**: `debt_to_equity < 0.1` AND `pe_ttm < 22` AND `roe > 18`
119. **Stable Margin Cash Flow**: `opm_current > 18` AND `cfo_latest > cfo_prev` AND `debt_to_equity < 0.4`
120. **Under-the-radar Moat Builders**: `market_capitalization < 40000` AND `roce > 28` AND `debt_to_equity < 0.1`
121. **High Free Cash Yield Quality**: `price_to_fcf < 18` AND `roce > 22` AND `debt_to_equity < 0.2`
122. **Zero-Debt Profit Compounds**: `debt_to_equity < 0.05` AND `profit_growth_5y_pct > 18`
123. **High Return Long Term Compounders**: `roce_5y_avg > 20` AND `sales_growth_5y_pct > 12`
124. **High Margin Sector Outperforming**: `opm_current > 24` AND `rr_sector_year_pct > 5`
125. **Solvent Industry Leaders**: `altman_z_score > 3.8` AND `rr_industry_year_pct > 5`
126. **High Capital Return Outliers**: `roce > 40`
127. **High Equity Return Outliers**: `roe > 30`
128. **Piotroski 8 zero debt**: `piotroski_score >= 8` AND `debt_to_equity < 0.05`
129. **High OPM stable compound**: `opm_current > 20` AND `opm_5y_avg > 20` AND `opm_last_year > 20`
130. **Maximum Cash Conversion**: `cfo_latest > profit_q_latest * 4 * 1.0` AND `debt_to_equity < 0.3`
131. **Large cap Blue chip quality**: `market_capitalization > 200000` AND `roe > 20` AND `roce > 25`
132. **High Durability with zero Debt**: `trendlyne_durability_score > 80` AND `debt_to_equity == 0.0`
133. **Consistent OPM Expanders**: `opm_current > opm_last_year` AND `opm_last_year > opm_5y_avg`
134. **FCF Accumulator Compounders**: `fcf_latest > fcf_prev` AND `fcf_prev > 0` AND `roce > 20`
135. **High Interest Protected Compound**: `interest_coverage > 100`
136. **Ultimate Quality Scorecard**: `trendlyne_durability_score > 75` AND `piotroski_score >= 8` AND `altman_z_score > 4.0`
137. **High Margin Compound Giants**: `opm_current > 35` AND `profit_growth_5y_pct > 12`
138. **Consistent Asset-light Compounders**: `roce > roce_5y_avg` AND `debt_to_equity < 0.1`
139. **Sales Accretive Quality Builders**: `roce > 22` AND `sales_growth_5y_pct > 15`
140. **Institutional Favorite Quality**: `roce > 25` AND `fii_holding_change_qoq_pct > 0.2`
141. **Insiders Retaining Quality**: `roe > 18` AND `promoter_holding_change_qoq_pct >= 0.0`
142. **High OPM low PE Quality**: `opm_current > 24` AND `pe_ttm < 20`
143. **Consistent ROE low PB Quality**: `roe > 20` AND `pe_ttm < 15` *(Note: PE can serve as proxy for valuation limits)*
144. **Earnings Consistent Quality**: `eps_growth_5y_pct > 16` AND `roce > 20`
145. **Solvent Cash Rich**: `current_ratio > 3.0` AND `fcf_3y > 1000`
146. **High Capital Return Mid-caps**: `market_capitalization > 15000` AND `market_capitalization < 80000` AND `roce > 28`
147. **Asset Fortress Small-caps**: `market_capitalization < 10000` AND `altman_z_score > 5.0` AND `debt_to_equity < 0.1`
148. **Ultra Stable Operating Income**: `opm_current > 18` AND `profit_growth_5y_pct > 14` AND `debt_to_equity < 0.2`
149. **Promoter Aligned Quality**: `promoter_holding_latest_pct > 55` AND `roce > 20`
150. **Excellent Capital Allocators**: `roce > 24` AND `roe > 20` AND `debt_to_equity < 0.15` AND `interest_coverage > 25`

---

### GROUP 4: MOMENTUM INVESTING (50 Queries)

151. **High Speed Flyers**: `trendlyne_momentum_score >= 85`
152. **RSI Wave Riders**: `day_rsi > 65` AND `day_rsi < 75`
153. **Super-Momentum Outperformers**: `trendlyne_momentum_score > 80` AND `rr_nifty50_year_pct > 25`
154. **Strong Trend ADX Leaders**: `day_adx > 30` AND `trendlyne_momentum_score > 75`
155. **High Momentum Low Drag**: `trendlyne_momentum_score > 70` AND `day_rsi > 60`
156. **Moving Average Accelerators**: `current_price > day_sma50` AND `day_sma50 > day_sma200`
157. **High Speed Sector Leaders**: `trendlyne_momentum_score > 75` AND `rr_sector_year_pct > 15`
158. **High Speed Industry Leaders**: `trendlyne_momentum_score > 75` AND `rr_industry_year_pct > 15`
159. **Breakout Drawdown Buyers**: `current_price > year_1_high * 0.95` AND `trendlyne_momentum_score > 70`
160. **RSI Strength Accelerators**: `day_rsi > 70` AND `day_adx > 25`
161. **MACD Divergence Play**: `day_macd > day_macd_signal_line` AND `trendlyne_momentum_score > 65`
162. **Price Acceleration Above 50 Days**: `current_price > day_sma50 * 1.05` AND `day_rsi > 62`
163. **Volume-Backed Momentum Surge**: `trendlyne_momentum_score > 70` AND `day_volume > week_volume_avg`
164. **Hyper-Velocity Compounds**: `trendlyne_momentum_score > 80` AND `profit_growth_5y_pct > 20`
165. **RSI Rebounds**: `day_rsi > 50` AND `day_rsi < 60` AND `trendlyne_momentum_score > 70`
166. **Dynamic Trend-Followers**: `day_adx > 35` AND `current_price > day_sma50`
167. **Bullish MACD Cross Momentum**: `day_macd > day_macd_signal_line` AND `day_macd_signal_line > 0` AND `trendlyne_momentum_score > 75`
168. **Latest Quarter Earnings Rocket**: `trendlyne_momentum_score > 75` AND `profit_q_latest > profit_q_yoy_base * 1.25`
169. **Promoter Supported Momentum**: `trendlyne_momentum_score > 70` AND `promoter_holding_change_qoq_pct >= 0.0`
170. **FII Backed Momentum Play**: `trendlyne_momentum_score > 75` AND `fii_holding_change_qoq_pct > 0.2`
171. **MF Backed Momentum Play**: `trendlyne_momentum_score > 75` AND `mf_holding_change_qoq_pct > 0.2`
172. **High Momentum GARP**: `trendlyne_momentum_score > 75` AND `peg_ratio < 1.2`
173. **High Momentum Low-Debt**: `trendlyne_momentum_score > 80` AND `debt_to_equity < 0.2`
174. **Extreme Price Distance 200 SMA**: `current_price > day_sma200 * 1.25` AND `trendlyne_momentum_score > 80`
175. **Nifty-Beating Titans**: `rr_nifty50_year_pct > 30` AND `trendlyne_momentum_score > 80`
176. **RSI Crossover Alert**: `day_rsi > 68` AND `trendlyne_momentum_score > 70`
177. **ADX Strong Bullish**: `day_adx > 28` AND `day_rsi > 65` AND `current_price > day_sma50`
178. **Momentum with high ROCE**: `trendlyne_momentum_score > 75` AND `roce > 24`
179. **Momentum with high ROE**: `trendlyne_momentum_score > 75` AND `roe > 20`
180. **Sales Accelerating Momentum**: `trendlyne_momentum_score > 70` AND `sales_growth_3y_pct > 25`
181. **Earnings Accretive Momentum**: `trendlyne_momentum_score > 72` AND `eps_growth_3y_pct > 22`
182. **Consolidation Breakouts**: `trendlyne_momentum_score > 80` AND `day_volume > month_volume_avg * 1.5`
183. **Price Surge near 52W High**: `current_price > year_1_high * 0.98` AND `day_rsi > 68`
184. **Sector + Industry Strength**: `rr_sector_year_pct > 10` AND `rr_industry_year_pct > 10` AND `trendlyne_momentum_score > 70`
185. **Stable Margin Momentum**: `trendlyne_momentum_score > 75` AND `opm_current > 18`
186. **Piotroski High Momentum**: `trendlyne_momentum_score > 75` AND `piotroski_score >= 8`
187. **Altman Safe Momentum**: `trendlyne_momentum_score > 75` AND `altman_z_score > 4.2`
188. **Fast Cashflow Momentum**: `trendlyne_momentum_score > 75` AND `cfo_latest > cfo_prev`
189. **Free Cashflow Momentum Pro**: `trendlyne_momentum_score > 75` AND `fcf_latest > fcf_prev`
190. **Moderate Valuation Momentum**: `trendlyne_momentum_score > 78` AND `pe_ttm < 25`
191. **High Volume Movers**: `day_volume > week_volume_avg * 2.0` AND `trendlyne_momentum_score > 65`
192. **Promoter Accumulation Momentum**: `trendlyne_momentum_score > 65` AND `promoter_holding_change_qoq_pct > 0.5`
193. **Super Trend Following**: `day_adx > 40` AND `current_price > day_sma50` AND `day_sma50 > day_sma200`
194. **Intermediate Wave Pick**: `day_rsi > 58` AND `day_rsi < 65` AND `trendlyne_momentum_score > 75`
195. **High Value High Momentum**: `trendlyne_valuation_score > 60` AND `trendlyne_momentum_score > 75`
196. **Durability-Momentum Compound**: `trendlyne_durability_score > 70` AND `trendlyne_momentum_score > 75`
197. **Large-Cap Velocity Movers**: `market_capitalization > 120000` AND `trendlyne_momentum_score > 80`
198. **Small-Cap Hot Momentum**: `market_capitalization < 12000` AND `trendlyne_momentum_score > 85`
199. **FII + MF Dynamic Force**: `fii_holding_change_qoq_pct > 0.1` AND `mf_holding_change_qoq_pct > 0.1` AND `trendlyne_momentum_score > 70`
200. **Absolute Speed King**: `trendlyne_momentum_score >= 90` AND `day_rsi > 70`

---

### GROUP 5: TECHNICAL ANALYSIS (75 Queries)

201. **RSI Entering Overbought Zone**: `day_rsi > 70`
202. **RSI Oversold Bounce candidates**: `day_rsi < 30`
203. **Classic Golden Cross**: `day_sma50 > day_sma200` AND `current_price > day_sma50`
204. **Price hovering near 200 SMA**: `current_price > day_sma200 * 0.98` AND `current_price < day_sma200 * 1.02`
205. **ADX Strong Directional Force**: `day_adx > 25`
206. **MACD Centerline Bullish Cross**: `day_macd > day_macd_signal_line` AND `day_macd > 0`
207. **Bullish crossover below zero**: `day_macd > day_macd_signal_line` AND `day_macd < 0`
208. **Price breakout near 1Y high**: `current_price > year_1_high * 0.97`
209. **RSI Consolidation Breakout**: `day_rsi > 55` AND `day_rsi < 62` AND `day_adx > 20`
210. **Bearish RSI Squeeze**: `day_rsi > 80`
211. **Super oversold capitulation**: `day_rsi < 20`
212. **Double Moving Average Support**: `current_price > day_sma50` AND `current_price > day_sma200`
213. **Price Acceleration (50MA vs 200MA)**: `day_sma50 > day_sma200 * 1.10`
214. **High ADX Trend Riding**: `day_adx > 40` AND `day_rsi > 60`
215. **Strong Trend Bearish Divergence**: `day_rsi > 75` AND `day_macd < day_macd_signal_line`
216. **Intermediate MACD Bullish Run**: `day_macd > day_macd_signal_line * 1.2`
217. **Fifty-Day MA Bounce Play**: `current_price > day_sma50 * 0.99` AND `current_price < day_sma50 * 1.015`
218. **Two-Hundred-Day MA Bounce Play**: `current_price > day_sma200 * 0.99` AND `current_price < day_sma200 * 1.015`
219. **RSI Momentum Breakout**: `day_rsi > 65` AND `day_rsi < 70` AND `day_volume > week_volume_avg`
220. **Golden Cross with volume**: `day_sma50 > day_sma200` AND `day_volume > month_volume_avg`
221. **MACD Divergence with volume**: `day_macd > day_macd_signal_line` AND `day_volume > week_volume_avg * 1.3`
222. **Overbought with ADX backing**: `day_rsi > 72` AND `day_adx > 30`
223. **High ADX Low RSI oversold**: `day_adx > 35` AND `day_rsi < 25`
224. **Volatile ATR/RSI Setup**: `day_rsi > 60` AND `day_volume > week_volume_avg * 1.5` *(Volume serves as volatility proxy)*
225. **Weekly volume spike technicals**: `day_volume > week_volume_avg * 2.0` AND `day_rsi > 55`
226. **Consolidated Price Squeeze**: `day_rsi > 48` AND `day_rsi < 52` AND `day_adx < 18`
227. **SMA 50 structural support**: `current_price >= day_sma50` AND `day_rsi > 50`
228. **RSI 60 crossover**: `day_rsi > 60` AND `day_rsi < 63`
229. **RSI 50 crossover**: `day_rsi > 50` AND `day_rsi < 53`
230. **Nifty-Driven Technical Leader**: `rr_nifty50_year_pct > 15` AND `day_rsi > 62`
231. **MACD Momentum Expansion**: `day_macd - day_macd_signal_line > 1.5`
232. **Price Acceleration from 200 SMA**: `current_price > day_sma200 * 1.15` AND `day_rsi < 65`
233. **50 SMA Accelerating upwards**: `day_sma50 > day_sma50 * 1.01` *(Trend indicator)*
234. **Price breakout above 50MA and 200MA**: `current_price > day_sma50` AND `current_price > day_sma200` AND `day_rsi > 55`
235. **Bullish crossover on volume spike**: `day_macd > day_macd_signal_line` AND `day_volume > month_volume_avg`
236. **ADX Entering Trend Zone**: `day_adx > 20` AND `day_adx < 24` AND `day_rsi > 55`
237. **High Momentum Bullish Setup**: `trendlyne_momentum_score > 80` AND `day_rsi > 65`
238. **RSI oversold buy-the-dip**: `day_rsi < 35` AND `trendlyne_durability_score > 70`
239. **RSI Neutral Strong Trend**: `day_rsi > 50` AND `day_rsi < 60` AND `day_adx > 25`
240. **Short term bullish crossover**: `day_macd > day_macd_signal_line` AND `current_price > day_sma50`
241. **Deep oversold quality bounce**: `day_rsi < 28` AND `roe > 20`
242. **MACD Trend confirmation**: `day_macd > 0` AND `day_macd_signal_line > 0` AND `day_rsi > 55`
243. **Distance to year-high breakout**: `current_price > year_1_high * 0.96` AND `day_volume > week_volume_avg`
244. **High Force ADX**: `day_adx > 45`
245. **Bullish crossover with zero-debt**: `day_macd > day_macd_signal_line` AND `debt_to_equity < 0.1`
246. **SMA 200 Secure baseline**: `current_price > day_sma200` AND `debt_to_equity < 0.4`
247. **RSI 65 Volume accumulation**: `day_rsi > 65` AND `day_volume > month_volume_avg * 1.3`
248. **Momentum indicator setup**: `trendlyne_momentum_score > 85` AND `day_rsi > 68`
249. **Oversold with high durability**: `day_rsi < 32` AND `trendlyne_durability_score > 75`
250. **50-Day MA slope bullish**: `current_price > day_sma50` AND `day_sma50 > day_sma200`
251. **RSI ranging breakout**: `day_rsi > 58` AND `day_rsi < 64` AND `day_volume > week_volume_avg`
252. **Bullish MACD in negative zone**: `day_macd > day_macd_signal_line` AND `day_macd_signal_line < -2.0`
253. **MACD expansion with RSI support**: `day_macd > day_macd_signal_line` AND `day_rsi >= 58`
254. **Sector + technical momentum**: `rr_sector_year_pct > 12` AND `day_rsi > 64`
255. **Industry + technical momentum**: `rr_industry_year_pct > 12` AND `day_rsi > 64`
256. **Golden cross sector winner**: `day_sma50 > day_sma200` AND `rr_sector_year_pct > 0`
257. **MACD Cross industry leader**: `day_macd > day_macd_signal_line` AND `rr_industry_year_pct > 5`
258. **High ADX high relative return**: `day_adx > 32` AND `rr_nifty50_year_pct > 20`
259. **Breakout candidate close to max**: `current_price > year_1_high * 0.98` AND `day_adx > 22`
260. **RSI 70 consolidation breakout**: `day_rsi >= 70` AND `day_volume > month_volume_avg * 1.5`
261. **52-week High Runner**: `current_price >= year_1_high`
262. **Trend Strength acceleration**: `day_adx > day_adx * 1.1` *(calculated rate increase)*
263. **High ADX bullish breakout**: `day_adx > 30` AND `current_price > day_sma50` AND `day_volume > week_volume_avg`
264. **Oversold turnaround play**: `day_rsi < 30` AND `day_macd > day_macd_signal_line`
265. **RSI 45 bounce back**: `day_rsi > 45` AND `day_rsi < 52` AND `day_rsi > day_rsi` *(increasing)*
266. **50 SMA structural filter**: `current_price > day_sma50` AND `current_price < day_sma50 * 1.03`
267. **200 SMA structural filter**: `current_price > day_sma200` AND `current_price < day_sma200 * 1.03`
268. **Bullish momentum with low standard debt**: `trendlyne_momentum_score > 70` AND `debt_to_equity < 0.5`
269. **Quality Technical Outliers**: `day_rsi > 62` AND `roce > 20`
270. **Value Technical Outliers**: `day_rsi < 40` AND `trendlyne_valuation_score > 65`
271. **Momentum Technical Outliers**: `trendlyne_momentum_score > 80` AND `day_rsi > 65`
272. **Crossover with high promoter backing**: `day_macd > day_macd_signal_line` AND `promoter_holding_latest_pct > 60`
273. **Crossover with local MF backing**: `day_macd > day_macd_signal_line` AND `mf_holding_change_qoq_pct > 0.1`
274. **Crossover with FII backing**: `day_macd > day_macd_signal_line` AND `fii_holding_change_qoq_pct > 0.1`
275. **Perfect Technical Balance**: `day_rsi > 58` AND `day_rsi < 68` AND `day_macd > day_macd_signal_line` AND `current_price > day_sma50`

---

### GROUP 6: VOLUME ANALYSIS (30 Queries)

276. **Massive Daily Spike**: `day_volume > week_volume_avg * 2.5`
277. **Sustained Weekly Volume Outperformance**: `week_volume_avg > month_volume_avg * 1.4`
278. **Institutional Accumulation Volume**: `day_volume > month_volume_avg * 2.0` AND `day_rsi > 55`
279. **Bearish Capitulation Volume**: `day_volume > month_volume_avg * 2.5` AND `day_rsi < 30`
280. **Quiet Before Breakout (Low Vol)**: `day_volume < month_volume_avg * 0.5` AND `day_rsi > 48` AND `day_rsi < 52`
281. **Moving Average Breakout with volume**: `current_price > day_sma50` AND `day_volume > week_volume_avg * 1.8`
282. **Two-Hundred SMA Overrun with Volume**: `current_price > day_sma200` AND `day_volume > week_volume_avg * 1.8`
283. **Volume backed 52W High**: `current_price > year_1_high * 0.98` AND `day_volume > month_volume_avg * 1.6`
284. **FII Buying with volume confirmation**: `day_volume > week_volume_avg * 1.3` AND `fii_holding_change_qoq_pct > 0.3`
285. **MF Buying with volume confirmation**: `day_volume > week_volume_avg * 1.3` AND `mf_holding_change_qoq_pct > 0.3`
286. **Promoter Buying with volume confirmation**: `day_volume > week_volume_avg * 1.2` AND `promoter_holding_change_qoq_pct > 0.5`
287. **Trend-Sustaining Volume**: `day_adx > 25` AND `day_rsi > 60` AND `day_volume > week_volume_avg`
288. **Low Vol Retracement Support**: `current_price > day_sma50` AND `current_price < day_sma50 * 1.02` AND `day_volume < week_volume_avg * 0.8`
289. **High Return High Volume**: `rr_nifty50_year_pct > 20` AND `day_volume > month_volume_avg * 1.2`
290. **Sector Leader Volume Play**: `rr_sector_year_pct > 10` AND `day_volume > week_volume_avg * 1.5`
291. **MACD Bullish Crossing with Volume**: `day_macd > day_macd_signal_line` AND `day_volume > week_volume_avg * 1.5`
292. **Micro-cap volume sudden interest**: `market_capitalization < 4000` AND `day_volume > month_volume_avg * 3.0`
293. **Mid-cap volume accumulation**: `market_capitalization > 15000` AND `market_capitalization < 70000` AND `day_volume > month_volume_avg * 1.8`
294. **Large-cap safe volume block**: `market_capitalization > 150000` AND `day_volume > week_volume_avg * 1.5`
295. **High Durability Volume Accrual**: `trendlyne_durability_score > 75` AND `day_volume > week_volume_avg * 1.4`
296. **Value buy with volume surge**: `trendlyne_valuation_score > 65` AND `day_volume > week_volume_avg * 1.6`
297. **RSI Over 65 Volume Pump**: `day_rsi >= 65` AND `day_volume > week_volume_avg * 1.8`
298. **Double Volume spike sequential**: `day_volume > week_volume_avg` AND `week_volume_avg > month_volume_avg`
299. **Profit Surges with volume**: `profit_q_latest > profit_q_yoy_base * 1.25` AND `day_volume > week_volume_avg * 1.5`
300. **Sales Breaks with volume**: `sales_q_latest > sales_q_yoy_base * 1.20` AND `day_volume > week_volume_avg * 1.5`
301. **Super Momentum with volume backing**: `trendlyne_momentum_score > 80` AND `day_volume > month_volume_avg * 1.5`
302. **Solvent Stock Volume Breakout**: `altman_z_score > 4.0` AND `day_volume > week_volume_avg * 1.7`
303. **Perfect Piotroski volume confirmation**: `piotroski_score >= 8` AND `day_volume > week_volume_avg * 1.5`
304. **RSI Oversold Volume Reversal**: `day_rsi < 30` AND `day_volume > week_volume_avg * 2.0`
305. **Apex volume accumulators**: `day_volume > month_volume_avg * 2.5` AND `current_price > day_sma50`

---

### GROUP 7: SHAREHOLDING & OWNERSHIP (30 Queries)

306. **Promoter Absolute Conviction**: `promoter_holding_latest_pct > 70`
307. **Promoter Quarterly Buying**: `promoter_holding_change_qoq_pct > 0.5`
308. **Foreign Institutional Buyers**: `fii_holding_change_qoq_pct > 0.8`
309. **Domestic Mutual Fund Accumulators**: `mf_holding_change_qoq_pct > 0.8`
310. **Dual Institutional Inflow**: `fii_holding_change_qoq_pct > 0.2` AND `mf_holding_change_qoq_pct > 0.2`
311. **Insider + Institutional Backing**: `promoter_holding_change_qoq_pct > 0.1` AND `fii_holding_change_qoq_pct > 0.1`
312. **Highly Held Institutional Fortress**: `fii_holding_change_qoq_pct > 1.0` *(relative proxy change)*
313. **Promoter buying during value stage**: `pe_ttm < 18` AND `promoter_holding_change_qoq_pct > 0.4`
314. **Insiders accumulating high ROCE**: `roce > 22` AND `promoter_holding_change_qoq_pct > 0.3`
315. **Institutions absorbing mid-cap supply**: `market_capitalization > 10000` AND `market_capitalization < 60000` AND `fii_holding_change_qoq_pct > 0.5`
316. **Institutions absorbing small-cap supply**: `market_capitalization < 10000` AND `mf_holding_change_qoq_pct > 0.5`
317. **Promoter buying breakout**: `promoter_holding_change_qoq_pct > 0.3` AND `current_price > day_sma50`
318. **High Durability with Promoter reinforcement**: `trendlyne_durability_score > 75` AND `promoter_holding_change_qoq_pct > 0.2`
319. **Value picks institutions love**: `trendlyne_valuation_score > 65` AND `fii_holding_change_qoq_pct > 0.3`
320. **Momentum picks institutions chase**: `trendlyne_momentum_score > 75` AND `fii_holding_change_qoq_pct > 0.5`
321. **Zero-debt combined purchases**: `debt_to_equity < 0.1` AND `promoter_holding_change_qoq_pct > 0.1` AND `mf_holding_change_qoq_pct > 0.1`
322. **Promoter holding expansion sequence**: `promoter_holding_change_qoq_pct > 1.0`
323. **Turnaround purchases by FIIs**: `fii_holding_change_qoq_pct > 0.6` AND `profit_q_latest > profit_q_prev`
324. **Top absolute alignment**: `promoter_holding_latest_pct > 60` AND `debt_to_equity < 0.3`
325. **FII aggressive short term accumulate**: `fii_holding_change_qoq_pct > 1.2`
326. **MF aggressive short term accumulate**: `mf_holding_change_qoq_pct > 1.2`
327. **Institutional sweep across sector**: `fii_holding_change_qoq_pct > 0.4` AND `rr_sector_year_pct > 0`
328. **Institutional sweep across industry**: `mf_holding_change_qoq_pct > 0.4` AND `rr_industry_year_pct > 0`
329. **Strong core holding and buy**: `promoter_holding_latest_pct > 55` AND `promoter_holding_change_qoq_pct > 0.1`
330. **Solvent Institutional favorites**: `altman_z_score > 4.0` AND `fii_holding_change_qoq_pct > 0.4`
331. **Piotroski elited heavily owned**: `piotroski_score >= 8` AND `promoter_holding_latest_pct > 50`
332. **Free Cashflow Compounders Insiders buy**: `fcf_latest > fcf_prev` AND `promoter_holding_change_qoq_pct > 0.2`
333. **Promoters reinforcing low PE**: `pe_ttm < 15` AND `promoter_holding_change_qoq_pct > 0.3`
334. **Mutual funds compounding growth**: `profit_growth_5y_pct > 20` AND `mf_holding_change_qoq_pct > 0.4`
335. **The Ultimate Alignment**: `promoter_holding_change_qoq_pct > 0.5` AND `fii_holding_change_qoq_pct > 0.5` AND `mf_holding_change_qoq_pct > 0.5`

---

### GROUP 8: RISK ANALYSIS (34 Queries)

336. **Ultimate Solvent Fortresses**: `altman_z_score > 5.0` AND `debt_to_equity < 0.1`
337. **High Piotroski Safety**: `piotroski_score >= 8` AND `debt_to_equity < 0.3`
338. **Exceptional Current Ratio**: `current_ratio > 3.0` AND `debt_to_equity < 0.2`
339. **Interest Coverage Elites**: `interest_coverage > 40` AND `debt_to_equity < 0.3`
340. **Deleveraged Balance Sheet**: `debt_to_equity < 0.15` AND `current_ratio > 2.0`
341. **Deep Safety Core Value**: `altman_z_score > 4.0` AND `piotroski_score >= 7` AND `pe_ttm < 18`
342. **High Cash Buffers**: `cfo_latest > 0` AND `current_ratio > 2.2`
343. **Moat-Protected Safety**: `roce > 22` AND `debt_to_equity < 0.1`
344. **Earnings Resilient Fortress**: `profit_growth_5y_pct > 15` AND `altman_z_score > 4.5`
345. **Promoter Vested Safety**: `promoter_holding_latest_pct > 65` AND `altman_z_score > 3.5`
346. **Solvent Mid-Caps**: `market_capitalization > 15000` AND `market_capitalization < 80000` AND `altman_z_score > 4.0`
347. **Solvent Small-Caps**: `market_capitalization < 10000` AND `altman_z_score > 4.5` AND `debt_to_equity < 0.1`
348. **Low RSI Oversold Fortress**: `day_rsi < 35` AND `altman_z_score > 4.8`
349. **Extremely Low Leverage Compounders**: `debt_to_equity < 0.05` AND `sales_growth_5y_pct > 12`
350. **High Interest coverage growth**: `interest_coverage > 25` AND `profit_growth_5y_pct > 18`
351. **FCF Accumulator Fortress**: `fcf_3y > 1500` AND `debt_to_equity < 0.2`
352. **Valuable Solvent Picks**: `trendlyne_valuation_score > 60` AND `altman_z_score > 3.8`
353. **High Durability Low Risk**: `trendlyne_durability_score > 80` AND `debt_to_equity < 0.2`
354. **Conservative OPM Margin of Safety**: `opm_5y_avg > 20` AND `debt_to_equity < 0.1`
355. **Stable Margin Deleveraged**: `opm_current > opm_last_year` AND `debt_to_equity < 0.2`
356. **Secure Working Capital**: `current_ratio > 2.5` AND `interest_coverage > 15`
357. **No-Debt Institutional Favorites**: `debt_to_equity == 0.0` AND `fii_holding_change_qoq_pct > 0.1`
358. **Low Volatility Technical Base**: `current_price > day_sma200` AND `day_adx < 20` AND `debt_to_equity < 0.3`
359. **Deep solvent crossover trend**: `day_macd > day_macd_signal_line` AND `altman_z_score > 4.2`
360. **High Piotroski Crossover setup**: `day_macd > day_macd_signal_line` AND `piotroski_score >= 8`
361. **Safe Promoter Backed compounder**: `promoter_holding_latest_pct > 55` AND `debt_to_equity < 0.2` AND `piotroski_score >= 7`
362. **Robust Free Cash Multipliers**: `price_to_fcf < 15` AND `altman_z_score > 4.2`
363. **Zero debt compound growth**: `debt_to_equity < 0.02` AND `eps_growth_5y_pct > 15`
364. **Institutional Shielded Mid-cap**: `market_capitalization > 12000` AND `fii_holding_change_qoq_pct > 0.2` AND `altman_z_score > 3.5`
365. **Moated Zero-Debt Growth**: `roce_5y_avg > 25` AND `debt_to_equity == 0.0` AND `sales_growth_5y_pct > 15`
366. **Protected OPM Compounder**: `opm_5y_avg > 25` AND `interest_coverage > 30` AND `debt_to_equity < 0.15`
367. **Altman Superfortress Sector outperformer**: `altman_z_score > 5.5` AND `rr_sector_year_pct > 0`
368. **Altman Superfortress Industry outperformer**: `altman_z_score > 5.5` AND `rr_industry_year_pct > 0`
369. **Ultimate Risk Protection Screen**: `debt_to_equity < 0.1` AND `current_ratio > 2.5` AND `interest_coverage > 35` AND `altman_z_score > 5.0` AND `piotroski_score >= 8`

---

## PHASE 3: QUANTAMENTAL SCHEMAS (100 HYBRID FILTERS)

Quantamental filters combine structural accounting data (e.g., margins, return rates, solvency) with technical and market structures.

### Quantamental Matrix (Queries 1-100)

| ID | Query Name | Logic | Investor Type | Risk Level | Holding Period |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Quality Speedster | `roce > 25` AND `trendlyne_momentum_score > 80` | Growth/Momentum | Medium | 1-3 Months |
| **2** | Value Crossover | `pe_ttm < 15` AND `day_macd > day_macd_signal_line` | Value/Contrarian | Medium | 3-6 Months |
| **3** | Accelerated Compounder | `profit_growth_5y_pct > 20` AND `day_rsi > 60` | Aggressive Growth | Med-High | 6-12 Months |
| **4** | Moated Breakout | `roce_3y_avg > 22` AND `current_price > year_1_high * 0.95` | Quality/Trend | Medium | 3-6 Months |
| **5** | Zero-Debt Rider | `debt_to_equity < 0.1` AND `day_rsi > 62` AND `day_adx > 25` | Momentum | Low-Med | 2-4 Months |
| **6** | Cheap Volume Accumulator | `pe_ttm < 18` AND `day_volume > week_volume_avg * 1.8` | Deep Value | Medium | 3-9 Months |
| **7** | Safe Speed Merchant | `altman_z_score > 4.5` AND `trendlyne_momentum_score > 82` | Core Growth | Low-Med | 3-6 Months |
| **8** | FII Backed Breakout | `fii_holding_change_qoq_pct > 0.5` AND `day_rsi > 65` | Institutional Follower | Medium | 1-3 Months |
| **9** | Promoters Buying Trend | `promoter_holding_change_qoq_pct > 0.5` AND `day_rsi > 55` | Insider Tracking | Medium | 6-12 Months |
| **10** | High Margin Momentum | `opm_current > 24` AND `trendlyne_momentum_score > 75` | Alpha Seekers | Medium | 3-6 Months |
| **11** | PEG-Technical Arbitrage | `peg_ratio < 1.0` AND `day_rsi > 58` AND `current_price > day_sma50` | GARP Trader | Low-Med | 4-8 Months |
| **12** | Piotroski Flying Fortress | `piotroski_score >= 8` AND `day_rsi > 62` AND `day_adx > 22` | Core Growth | Low | 6-12 Months |
| **13** | Cheap Cash Flow Crossover | `price_to_fcf < 14` AND `day_macd > day_macd_signal_line` | Cash Yield Value | Low-Med | 6-12 Months |
| **14** | Sales-Powered Rocket | `sales_growth_5y_pct > 18` AND `trendlyne_momentum_score > 80` | Hyper Growth | Med-High | 3-6 Months |
| **15** | Underpriced Leader Trend | `trendlyne_valuation_score > 65` AND `day_rsi > 55` AND `day_adx > 20` | Core Value | Low-Med | 6-12 Months |
| **16** | Consolidated Quality Base | `roce > 20` AND `day_rsi > 48` AND `day_rsi < 54` AND `day_adx < 18` | Patient Quality | Low | 3-6 Months |
| **17** | Double Cross Compounder | `profit_growth_3y_pct > 20` AND `day_sma50 > day_sma200` AND `day_macd > day_macd_signal_line` | Technical Core | Medium | 4-6 Months |
| **18** | High Margin Volume Spike | `opm_current > 20` AND `day_volume > month_volume_avg * 2.0` | Breakout Trader | High | 1-2 Months |
| **19** | Cash Flow Fortress Trend | `cfo_latest > cfo_prev` AND `day_rsi > 58` AND `debt_to_equity < 0.2` | Quality Growth | Low | 6-12 Months |
| **20** | Cheap OPM Expander | `pe_ttm < 16` AND `opm_current > opm_last_year` AND `day_rsi > 55` | Value Growth | Low-Med | 6-12 Months |
| **21** | Small-Cap Dynamic Force | `market_capitalization < 8000` AND `trendlyne_momentum_score > 85` AND `piotroski_score >= 7` | Small-cap Alpha | High | 3-6 Months |
| **22** | Mid-Cap Compounding Core | `market_capitalization > 12000` AND `market_capitalization < 80000` AND `trendlyne_durability_score > 75` AND `day_rsi > 58` | Swing Trader | Medium | 3-6 Months |
| **23** | Mega-Cap Velocity | `market_capitalization > 200000` AND `trendlyne_momentum_score > 80` AND `roce > 20` | Large-cap Allocator | Low | 6-12 Months |
| **24** | FCF Spiker | `fcf_latest > fcf_prev * 1.2` AND `day_volume > week_volume_avg` | Fundamental Value | Medium | 3-6 Months |
| **25** | High-Return Volume Wave | `rr_nifty50_year_pct > 25` AND `day_volume > month_volume_avg * 1.5` | Trend Follower | Medium | 1-3 Months |
| **26** | Zero-Debt Turnaround | `debt_to_equity < 0.05` AND `profit_q_latest > profit_q_yoy_base` AND `day_rsi > 52` | Special Situations | Low-Med | 6-12 Months |
| **27** | High-Held RSI Rider | `promoter_holding_latest_pct > 60` AND `day_rsi > 68` | Long Term Focus | Medium | 3-6 Months |
| **28** | Double Institutional Surge | `fii_holding_change_qoq_pct > 0.3` AND `mf_holding_change_qoq_pct > 0.3` AND `day_rsi > 55` | Institutional Follower | Low-Med | 6-12 Months |
| **29** | Stable OPM Safe Speed | `opm_5y_avg > 22` AND `trendlyne_momentum_score > 78` AND `debt_to_equity < 0.3` | Balanced Compounding | Low-Med | 6-12 Months |
| **30** | Value Squeeze | `pe_ttm < 15` AND `day_rsi > 52` AND `day_rsi < 58` AND `day_volume > week_volume_avg * 1.2` | Value Trader | Medium | 3-6 Months |
| **31** | High Yield Breakout | `price_to_fcf < 12` AND `current_price > day_sma50` AND `day_volume > week_volume_avg` | Value Compounding | Medium | 6-12 Months |
| **32** | Moated High Trend | `roce_5y_avg > 25` AND `trendlyne_momentum_score > 82` | Moat Seeker | Low-Med | 6-12 Months |
| **33** | Zero Debt SMA200 Bounce | `debt_to_equity < 0.1` AND `current_price > day_sma200 * 0.99` AND `current_price < day_sma200 * 1.02` | Swing/Systematic | Low | 1-2 Months |
| **34** | EPS Growth Speed King | `eps_growth_5y_pct > 22` AND `trendlyne_momentum_score > 85` | High Velocity Growth | High | 2-4 Months |
| **35** | High Durability Crossover | `trendlyne_durability_score > 80` AND `day_macd > day_macd_signal_line` | Quality Systematic | Low | 3-6 Months |
| **36** | OPM Expansion Volume Spike | `opm_current > opm_last_year` AND `day_volume > week_volume_avg * 2.0` | Catalyst Trader | High | 1-2 Months |
| **37** | Piotroski 9 Speed Demon | `piotroski_score == 9` AND `trendlyne_momentum_score > 80` | High Conviction Quality | Low-Med | 6-12 Months |
| **38** | Cheap Compounding Crossover | `pe_ttm < 18` AND `profit_growth_5y_pct > 15` AND `day_macd > day_macd_signal_line` | Core GARP | Low-Med | 6-12 Months |
| **39** | Sector Leader Technical Wave| `rr_sector_year_pct > 12` AND `day_rsi > 64` AND `day_adx > 22` | Sector Momentum | Medium | 2-5 Months |
| **40** | Industry Outperformer Multi | `rr_industry_year_pct > 10` AND `roce > 18` AND `day_rsi > 60` | Industry Momentum | Medium | 3-6 Months |
| **41** | Safe Asset Wave | `altman_z_score > 4.5` AND `current_price > day_sma50` AND `day_volume > week_volume_avg` | Core Safe Growth | Low | 4-8 Months |
| **42** | Cash Flow Multiplying Breakout| `cfo_latest > cfo_prev` AND `current_price > year_1_high * 0.94` AND `day_rsi > 60` | High Grade Swing | Medium | 3-6 Months |
| **43** | Unleveraged Margin Surge | `debt_to_equity < 0.15` AND `opm_current > opm_last_year` AND `day_rsi > 58` | Operational Margin | Low-Med | 6-12 Months |
| **44** | Promoter buying with MACD cross | `promoter_holding_change_qoq_pct > 0.3` AND `day_macd > day_macd_signal_line` | Insider Tracking | Medium | 4-8 Months |
| **45** | Mutual Fund Momentum Base | `mf_holding_change_qoq_pct > 0.5` AND `trendlyne_momentum_score > 75` | Institutional Follower | Low-Med | 3-6 Months |
| **46** | Under-the-radar Solvency | `market_capitalization < 15000` AND `altman_z_score > 4.5` AND `day_rsi > 55` | Microcap Safe | Medium | 6-12 Months |
| **47** | Cheap EPS Rocket | `pe_ttm < 14` AND `eps_growth_3y_pct > 20` AND `day_rsi > 58` | Core Value Growth | Low-Med | 6-12 Months |
| **48** | Double Velocity Growth | `sales_growth_5y_pct > 18` AND `profit_growth_5y_pct > 18` AND `trendlyne_momentum_score > 80` | Hyper growth | High | 3-6 Months |
| **49** | Premium Quality Breakout | `roce_5y_avg > 30` AND `current_price > year_1_high * 0.96` AND `day_volume > week_volume_avg` | Moat Breakout | Low-Med | 3-6 Months |
| **50** | Piotroski 8 MACD Bull | `piotroski_score >= 8` AND `day_macd > day_macd_signal_line` AND `debt_to_equity < 0.3` | Core Alpha | Low | 6-12 Months |
| **51** | Value Accelerating High OPM | `pe_ttm < 16` AND `opm_current > 24` AND `day_rsi > 60` | OPM Value | Low-Med | 6-12 Months |
| **52** | FII Accumulating Moat | `fii_holding_change_qoq_pct > 0.4` AND `roce_3y_avg > 25` AND `day_rsi > 55` | Quality Institutional | Low-Med | 6-12 Months |
| **53** | Promoter Buying Moat | `promoter_holding_change_qoq_pct > 0.4` AND `roce_3y_avg > 22` AND `day_rsi > 55` | Quality Insider | Low-Med | 6-12 Months |
| **54** | Zero-debt ROE Speed | `debt_to_equity < 0.05` AND `roe > 22` AND `trendlyne_momentum_score > 78` | Zero Debt Growth | Low | 6-12 Months |
| **55** | Safe Growth Momentum Combo | `altman_z_score > 3.8` AND `profit_growth_5y_pct > 18` AND `trendlyne_momentum_score > 78` | Safe Compounder | Low-Med | 6-12 Months |
| **56** | Cheap FCF Turnaround | `price_to_fcf < 12` AND `profit_q_latest > profit_q_yoy_base` AND `day_macd > day_macd_signal_line` | Special Valuations | Medium | 6-12 Months |
| **57** | Dynamic Large-Cap Quality | `market_capitalization > 150000` AND `roce_5y_avg > 22` AND `day_rsi > 60` | Institutional Core | Low | 6-12 Months |
| **58** | Quality Growth Small-Cap | `market_capitalization < 12000` AND `roce > 22` AND `profit_growth_5y_pct > 20` AND `day_rsi > 58` | Small-cap Moat | High | 6-12 Months |
| **59** | EPS Compounder SMA50 support | `eps_growth_5y_pct > 18` AND `current_price > day_sma50` AND `current_price < day_sma50 * 1.02` | Swing/Long-Term | Low-Med | 3-6 Months |
| **60** | Extreme Trend Compounder | `day_adx > 32` AND `day_rsi > 62` AND `profit_growth_5y_pct > 15` AND `debt_to_equity < 0.2` | Core Trend | Low-Med | 4-10 Months |
| **61** | Piotroski 8 Valuation Edge | `piotroski_score >= 8` AND `trendlyne_valuation_score > 65` AND `day_rsi > 52` | Safe Value | Low | 6-12 Months |
| **62** | High Cash Flow Value Trigger | `price_to_cfo < 10` AND `day_macd > day_macd_signal_line` AND `debt_to_equity < 0.3` | Cash Value | Low-Med | 6-12 Months |
| **63** | Promoter buying zero-debt MA | `promoter_holding_change_qoq_pct > 0.2` AND `debt_to_equity < 0.05` AND `current_price > day_sma50` | Safe Insider | Low | 6-12 Months |
| **64** | OPM Expansion Breakout Play | `opm_current > opm_last_year` AND `current_price > year_1_high * 0.95` AND `day_volume > week_volume_avg` | High OPM Swing | High | 2-4 Months |
| **65** | FII Aggressive Momentum | `fii_holding_change_qoq_pct > 0.8` AND `trendlyne_momentum_score > 82` | Institutional Velocity | High | 2-4 Months |
| **66** | Mutual Fund Aggressive Break | `mf_holding_change_qoq_pct > 0.8` AND `current_price > day_sma50` AND `day_volume > week_volume_avg` | Mutual Fund Swing | Medium | 3-6 Months |
| **67** | High-Held Safe Compounder | `promoter_holding_latest_pct > 60` AND `altman_z_score > 4.0` AND `day_rsi > 55` | Conservative Growth | Low | 6-12 Months |
| **68** | Sustainable Growth Rocket | `sales_growth_5y_pct > 16` AND `opm_current > 18` AND `trendlyne_momentum_score > 80` | Hyper business | Medium | 3-6 Months |
| **69** | Capital Efficient Breakout | `roce > 28` AND `roe > 22` AND `current_price > year_1_high * 0.96` AND `day_volume > month_volume_avg` | Moat Breakout | Low-Med | 3-6 Months |
| **70** | Piotroski Perfect 9 MACD Cross| `piotroski_score == 9` AND `day_macd > day_macd_signal_line` AND `debt_to_equity < 0.2` | Core Institutional | Low | 6-13 Months |
| **71** | Cheap OPM Master | `pe_ttm < 15` AND `opm_5y_avg > 25` AND `day_rsi > 52` | Classic Value | Low-Med | 6-12 Months |
| **72** | Zero-debt FCF Golden Cross | `debt_to_equity < 0.05` AND `fcf_latest > fcf_prev` AND `day_sma50 > day_sma200` | Safe Compounding | Low | 6-12 Months |
| **73** | Nifty Beater Moat Leader | `rr_nifty50_year_pct > 25` AND `roce > 24` AND `trendlyne_momentum_score > 80` | Alpha Core | Medium | 6-12 Months |
| **74** | Industry-Level Speedster | `rr_industry_year_pct > 12` AND `trendlyne_momentum_score > 80` AND `debt_to_equity < 0.2` | Industry Momentum | Medium | 2-5 Months |
| **75** | Sector-Level Speedster | `rr_sector_year_pct > 12` AND `trendlyne_momentum_score > 80` AND `debt_to_equity < 0.2` | Sector Momentum | Medium | 2-5 Months |
| **76** | Fast EPS Compounder ADX trend| `eps_growth_5y_pct > 18` AND `day_adx > 26` AND `current_price > day_sma50` | Growth trend | Low-Med | 4-10 Months |
| **77** | Cheap Growth Volume Master | `pe_ttm < 18` AND `sales_growth_5y_pct > 15` AND `day_volume > week_volume_avg * 1.5` | GARP Volume | Medium | 3-8 Months |
| **78** | Double Sales-Profit jump MACD | `sales_q_latest > sales_q_prev` AND `profit_q_latest > profit_q_prev` AND `day_macd > day_macd_signal_line` | Earnings Momentum | Medium | 3-6 Months |
| **79** | Promoter-backed Trend Force | `promoter_holding_change_qoq_pct > 0.2` AND `day_adx > 28` AND `day_rsi > 60` | Insider Momentum | Medium | 3-6 Months |
| **80** | FII + MF Aggressive Sweep | `fii_holding_change_qoq_pct > 0.3` AND `mf_holding_change_qoq_pct > 0.3` AND `current_price > day_sma50` AND `day_volume > week_volume_avg` | Institutional Swing | Med-High | 3-6 Months |
| **81** | Zero Debt High Capital return | `debt_to_equity < 0.05` AND `roce_5y_avg > 30` AND `day_rsi > 58` | Pure Moat | Low | 6-12 Months |
| **82** | Safe Large Cap Momentum | `market_capitalization > 180000` AND `altman_z_score > 4.0` AND `trendlyne_momentum_score > 75` | Large cap Safe | Low | 6-12 Months |
| **83** | Capital return Small Cap Speed| `market_capitalization < 10000` AND `roce > 25` AND `trendlyne_momentum_score > 82` | Small cap Velocity | High | 3-6 Months |
| **84** | Balanced Multiple High OPM | `price_to_sales < 1.8` AND `opm_current > 18` AND `day_rsi > 58` AND `day_adx > 22` | Core Balanced | Low-Med | 6-12 Months |
| **85** | CFO Growth zero debt cross | `cfo_latest > cfo_prev` AND `debt_to_equity < 0.05` AND `day_macd > day_macd_signal_line` | Clean Cash flow | Low | 6-12 Months |
| **86** | Piotroski 8 cheap cash flow | `piotroski_score >= 8` AND `price_to_fcf < 14` AND `day_rsi > 52` | Pure Core Value | Low | 6-12 Months |
| **87** | High Margin Nifty Outperformer| `opm_current > 22` AND `rr_nifty50_year_pct > 20` AND `day_rsi > 60` | Outperforming leader | Medium | 4-10 Months |
| **88** | FII Support Zero debt | `fii_holding_change_qoq_pct > 0.2` AND `debt_to_equity < 0.05` AND `day_rsi > 55` | Unleveraged Support | Low | 6-12 Months |
| **89** | Promoter Support Zero debt | `promoter_holding_change_qoq_pct > 0.2` AND `debt_to_equity < 0.05` AND `day_rsi > 55` | Unleveraged Insider | Low | 6-12 Months |
| **90** | Highly held FCF Golden cross | `promoter_holding_latest_pct > 55` AND `fcf_latest > fcf_prev` AND `day_sma50 > day_sma200` | Safe Insider Cross | Low | 6-12 Months |
| **91** | High Durability OPM expansion | `trendlyne_durability_score > 75` AND `opm_current > opm_last_year` AND `day_rsi > 58` | Stable Margin Growth | Low | 6-12 Months |
| **92** | Dynamic Growth Sector Leader | `profit_growth_5y_pct > 18` AND `rr_sector_year_pct > 8` AND `trendlyne_momentum_score > 78` | Sector Alpha | Medium | 4-10 Months |
| **93** | Dynamic Growth Industry Leader| `profit_growth_5y_pct > 18` AND `rr_industry_year_pct > 8` AND `trendlyne_momentum_score > 78` | Industry Alpha | Medium | 4-10 Months |
| **94** | PEG Breakout volume booster | `peg_ratio < 1.0` AND `current_price > day_sma50` AND `day_volume > week_volume_avg * 1.5` | GARP Core Swing | Medium | 3-6 Months |
| **95** | Cheap EPS compound volume spike| `pe_ttm < 18` AND `eps_growth_5y_pct > 18` AND `day_volume > week_volume_avg * 1.7` | Value Growth Swing | Medium | 3-6 Months |
| **96** | Zero debt OPM expansion cross | `debt_to_equity < 0.05` AND `opm_current > opm_last_year` AND `day_macd > day_macd_signal_line` | Pure Profit Margin | Low | 6-12 Months |
| **97** | Piotroski 8 Interest support | `piotroski_score >= 8` AND `interest_coverage > 30` AND `day_rsi > 56` | Secure Cash Flow | Low | 6-12 Months |
| **98** | High Capital Return Nifty beat | `roce > 28` AND `rr_nifty50_year_pct > 22` AND `day_rsi > 60` | High Alpha Moat | Medium | 6-12 Months |
| **99** | Asset fortress high momentum | `altman_z_score > 4.5` AND `trendlyne_momentum_score > 80` AND `debt_to_equity < 0.2` | Core Safe Velocity | Low-Med | 3-6 Months |
| **100** | Platinum Alpha Composite | `roce > 25` AND `profit_growth_5y_pct > 20` AND `altman_z_score > 4.0` AND `trendlyne_momentum_score > 80` AND `day_rsi > 60` AND `debt_to_equity < 0.2` | institutional Elite | Low-Med | 6-12 Months |

---

## PHASE 4: INVESTOR PERSONA SCREENS

Detailed structural schemas tailored to institutional and retail investment styles.

### 1. Warren Buffett Style (Moated Value Compounders)
* **Screening Logic**:
  `roce_5y_avg >= 22` AND `debt_to_equity < 0.3` AND `trendlyne_durability_score >= 75` AND `pe_ttm <= 22` AND `fcf_3y > 1000`
* **Relevant Columns**: `roce_5y_avg`, `debt_to_equity`, `trendlyne_durability_score`, `pe_ttm`, `fcf_3y`
* **Why It Works**: Focuses on long-term compounders with high returns on capital, strong balance sheets (low debt), high cash-generation abilities, and reasonable purchase prices.

### 2. Peter Lynch Style (Value Growth at Reasonable Price)
* **Screening Logic**:
  `sales_growth_5y_pct >= 15` AND `profit_growth_5y_pct >= 15` AND `peg_ratio > 0.1` AND `peg_ratio <= 1.0` AND `pe_ttm < 25` AND `debt_to_equity < 0.4`
* **Relevant Columns**: `sales_growth_5y_pct`, `profit_growth_5y_pct`, `peg_ratio`, `pe_ttm`, `debt_to_equity`
* **Why It Works**: Identifies growth companies trading at reasonable valuations relative to their core earnings capability, preventing multiple over-expansion risk.

### 3. Philip Fisher Style (Emerging Moat & Long Term Growth)
* **Screening Logic**:
  `sales_growth_5y_pct >= 18` AND `opm_current > opm_5y_avg` AND `roce > 20` AND `promoter_holding_latest_pct > 50` AND `debt_to_equity < 0.2`
* **Relevant Columns**: `sales_growth_5y_pct`, `opm_current`, `opm_5y_avg`, `roce`, `promoter_holding_latest_pct`
* **Why It Works**: Highlights high-growth companies with expanding margins (operating efficiency), aligned management interests, and capital-efficient business models.

### 4. Charlie Munger Style (High Quality at Any Price and compounders)
* **Screening Logic**:
  `roce_5y_avg >= 28` AND `roe_3y_avg >= 24` AND `debt_to_equity < 0.15` AND `altman_z_score > 4.5` AND `trendlyne_durability_score >= 80`
* **Relevant Columns**: `roce_5y_avg`, `roe_3y_avg`, `debt_to_equity`, `altman_z_score`, `trendlyne_durability_score`
* **Why It Works**: Focuses on absolute financial strength. High returns on capital and a clean balance sheet minimize business risk.

### 5. Growth Investor (Pure Hyper-Compounding Sales & Profit)
* **Screening Logic**:
  `profit_growth_3y_pct >= 22` AND `sales_growth_3y_pct >= 18` AND `eps_growth_3y_pct >= 18` AND `trendlyne_momentum_score >= 70`
* **Relevant Columns**: `profit_growth_3y_pct`, `sales_growth_3y_pct`, `eps_growth_3y_pct`, `trendlyne_momentum_score`
* **Why It Works**: Targets companies experiencing structural demand-driven top-line and bottom-line scaling.

### 6. Value Investor (Asset-backed Cash Generation deep discount)
* **Screening Logic**:
  `pe_ttm < 15` AND `price_to_sales < 1.2` AND `price_to_fcf < 12` AND `trendlyne_valuation_score >= 70` AND `piotroski_score >= 7`
* **Relevant Columns**: `pe_ttm`, `price_to_sales`, `price_to_fcf`, `trendlyne_valuation_score`, `piotroski_score`
* **Why It Works**: Offers a margin of safety by purchasing solid businesses with strong balance sheet security at a discount.

### 7. Momentum Trader (High Velocity Trends)
* **Screening Logic**:
  `trendlyne_momentum_score >= 85` AND `day_rsi >= 65` AND `day_rsi <= 75` AND `current_price > day_sma50` AND `day_sma50 > day_sma200`
* **Relevant Columns**: `trendlyne_momentum_score`, `day_rsi`, `current_price`, `day_sma50`, `day_sma200`
* **Why It Works**: Aligns with existing strong trends by filtering for high momentum scores, supportive moving average channels, and positive relative returns.

### 8. Swing Trader (Channel/Breakout Bounce Setup)
* **Screening Logic**:
  `current_price >= day_sma50 * 0.98` AND `current_price <= day_sma50 * 1.03` AND `day_rsi >= 48` AND `day_rsi <= 58` AND `day_volume > month_volume_avg`
* **Relevant Columns**: `current_price`, `day_sma50`, `day_rsi`, `day_volume`, `month_volume_avg`
* **Why It Works**: Locates stocks pulling back toward intermediate support levels (mean reversion), showing early volume interest for a breakout.

### 9. Positional Trader (Medium-Term Structural Trend Rider)
* **Screening Logic**:
  `day_sma50 > day_sma200` AND `current_price > day_sma50 * 1.02` AND `day_adx >= 24` AND `profit_growth_5y_pct > 12`
* **Relevant Columns**: `day_sma50`, `day_sma200`, `current_price`, `day_adx`, `profit_growth_5y_pct`
* **Why It Works**: Captures medium-term structural trends backed by positive earnings profiles and high directional strength.

### 10. Long Term Investor (Decade-Compounding Quality Fortresses)
* **Screening Logic**:
  `roce_5y_avg >= 20` AND `profit_growth_5y_pct >= 14` AND `altman_z_score >= 4.0` AND `piotroski_score >= 8` AND `promoter_holding_latest_pct > 50`
* **Relevant Columns**: `roce_5y_avg`, `profit_growth_5y_pct`, `altman_z_score`, `piotroski_score`, `promoter_holding_latest_pct`
* **Why It Works**: Ensures business safety over long holding periods through consistent returns, low default risk, and high insider alignment.

### 11. Conservative Investor (Capital Protection Defensives)
* **Screening Logic**:
  `debt_to_equity < 0.1` AND `current_ratio >= 2.0` AND `interest_coverage >= 20` AND `altman_z_score >= 4.5` AND `pe_ttm < 18`
* **Relevant Columns**: `debt_to_equity`, `current_ratio`, `interest_coverage`, `altman_z_score`, `pe_ttm`
* **Why It Works**: Limits downside risk by prioritizing solid working capital buffers, low leverage, high interest coverage, and reasonable valuations.

### 12. Aggressive Investor (Hyper-Growth Small/Mid-Caps with momentum)
* **Screening Logic**:
  `profit_growth_3y_pct >= 25` AND `sales_growth_3y_pct >= 20` AND `trendlyne_momentum_score >= 78` AND `day_rsi > 60` AND `market_capitalization < 60000`
* **Relevant Columns**: `profit_growth_3y_pct`, `sales_growth_3y_pct`, `trendlyne_momentum_score`, `day_rsi`, `market_capitalization`
* **Why It Works**: Capitalizes on smaller-cap, high-beta momentum leaders with accelerating operational profiles.

---

## PHASE 5: REPORT GENERATION METRIC PIPELINES

This section profiles automated report scheduling queries, including ranking and delivery priorities.

```
       [Master Data Intake: CSV / Live Feeds]
                         │
                         ▼
        [Platform Database Aggregation Core]
          │              │               │
          ▼              ▼               ▼
    ┌───────────┐  ┌───────────┐   ┌───────────┐
    │Daily Core │  │Weekly Core│   │Monthly/Qtr│
    │  Signals  │  │  Trends   │   │ Deep Dive │
    └─────┬─────┘  └─────┬─────┘   └─────┬─────┘
          │              │               │
          └──────────────┼───────────────┘
                         ▼
             [Report Generation Pipeline]
                         │
                         ▼
               [High-Fidelity UI / PDF]
```

### 1. Daily Bulletins: "Intraday Momentum Alerts"
* **Query Logic**: `day_volume > month_volume_avg * 2.0` AND `day_rsi > 68` AND `day_macd > day_macd_signal_line`
* **Ranking Logic**: Sort by `(day_volume / month_volume_avg)` descending.
* **Priority Score**: **10 / 10** (Time-critical breakout setups).

### 2. Daily Bulletins: "Mean-Reversion Oversold Setup"
* **Query Logic**: `day_rsi < 30` AND `trendlyne_durability_score > 70` AND `debt_to_equity < 0.5`
* **Ranking Logic**: Sort by `day_rsi` ascending.
* **Priority Score**: **9 / 10** (High-quality contrarian buys).

### 3. Weekly Reports: "High Conviction Screener"
* **Query Logic**: `trendlyne_momentum_score > 80` AND `current_price > day_sma50` AND `day_volume > week_volume_avg * 1.5`
* **Ranking Logic**: Sort by `trendlyne_momentum_score` descending.
* **Priority Score**: **8 / 10** (Strategic weekly momentum setups).

### 4. Weekly Reports: "Solvency fortress updates"
* **Query Logic**: `altman_z_score > 4.5` AND `piotroski_score >= 8` AND `roce > 20`
* **Ranking Logic**: Sort by `altman_z_score` descending.
* **Priority Score**: **7 / 10** (Consistent portfolio safety check).

### 5. Monthly Reports: "Institutional Alignment Report"
* **Query Logic**: `(fii_holding_change_qoq_pct + mf_holding_change_qoq_pct) > 1.0` AND `roce > 18`
* **Ranking Logic**: Sort by combined institutional change descending.
* **Priority Score**: **8.5 / 10** (Tracks smart money flows).

### 6. Quarterly Reports: "Core Earnings Jump Series"
* **Query Logic**: `profit_q_latest > profit_q_yoy_base * 1.25` AND `sales_q_latest > sales_q_yoy_base * 1.20` AND `opm_current > opm_last_year`
* **Ranking Logic**: Sort by YoY profit growth descending.
* **Priority Score**: **9.5 / 10** (Catalyzes fundamental portfolio updates).

### 7. Sector Reports: "Sector Rotational Strength"
* **Query Logic**: Group by `sector_name` where `rr_sector_year_pct > 0` AND count of stocks with `trendlyne_momentum_score > 75` is high.
* **Ranking Logic**: Sort by Sector average `rr_sector_year_pct` descending.
* **Priority Score**: **8 / 10** (Informs high-level asset allocation).

### 8. Industry Reports: "High Return Niche Industries"
* **Query Logic**: Group by `industry_name` where average `roce_3y_avg > 25` and average debt is minimal.
* **Ranking Logic**: Sort by average industry ROCE descending.
* **Priority Score**: **7.5 / 10** (Identifies high-moat industry niches).

### 9. Watchlist Reports: "Dynamic Watchlist Trigger"
* **Query Logic**: Cross-reference selected custom tickers against `current_price` crossing above `day_sma50` or RSI crossing above 60.
* **Ranking Logic**: Match users' watchlists. Sort by magnitude of trigger variable.
* **Priority Score**: **10 / 10** (Crucial personalized retention driver).

---

## PHASE 6: PREMIUM INTELLIGENCE FEATURES

Premium features leverage complex multi-factor rules and composite ranking scores to highlight high-conviction investment ideas.

### 1. Hidden Gems
* **Business Logic**: Identifies under-analyzed mid/small-cap companies with low market capitalizations, minimal institutional clutter, safe financial structures, and high efficiency ratios.
* **Required Columns**: `market_capitalization`, `roce`, `debt_to_equity`, `trendlyne_valuation_score`, `piotroski_score`, `altman_z_score`
* **Formula / Rank Criteria**:
  $$\text{Score} = (0.3 \times \text{roce}) + (20 \times \text{piotroski\_score}) + (10 \times \text{altman\_z\_score}) - (0.01 \times \text{market\_capitalization})$$
* **Confidence Factors**: High if `fii_holding_change_qoq_pct >= 0` and `debt_to_equity < 0.1`.

### 2. Turnaround Stocks
* **Business Logic**: Flags companies rebounding from operational struggles. Indindicated by a strong latest quarter, positive sequential growth, expanding operating margins, and defensive credit profiles.
* **Required Columns**: `profit_q_latest`, `profit_q_prev`, `opm_current`, `opm_last_year`, `altman_z_score`, `day_macd`
* **Formula / Rank Criteria**:
  $$\text{Score} = \left(\frac{\text{profit\_q\_latest}}{\text{profit\_q\_prev}} \times 100\right) + \left(\text{opm\_current} - \text{opm\_last\_year}\right) + (20 \times \text{altman\_z\_score})$$
* **Confidence Factors**: Verified if `day_macd > day_macd_signal_line` and `piotroski_score >= 6`.

### 3. Emerging Leaders
* **Business Logic**: Spots high-growth companies that are outperforming their industry averages and expanding their market footprints.
* **Required Columns**: `sales_growth_3y_pct`, `profit_growth_3y_pct`, `rr_industry_year_pct`, `roce`, `debt_to_equity`
* **Formula / Rank Criteria**:
  $$\text{Score} = (0.4 \times \text{sales\_growth\_3y\_pct}) + (0.3 \times \text{profit\_growth\_3y\_pct}) + (2.0 \times \text{rr\_industry\_year\_pct})$$
* **Confidence Factors**: High if standard `debt_to_equity < 0.2` and return rates are rising sequentially.

### 4. QARP (Quality at a Reasonable Price)
* **Business Logic**: Balances high capital returns and stable business models with conservative multiples (PEG and PE ratio ceilings).
* **Required Columns**: `roce`, `roe`, `pe_ttm`, `peg_ratio`, `altman_z_score`
* **Formula / Rank Criteria**:
  $$\text{Score} = \frac{\text{roce} + \text{roe} + (10 \times \text{altman\_z\_score})}{\text{pe\_ttm} \times (1 + \text{peg\_ratio})}$$
* **Confidence Factors**: High if `peg_ratio > 0.1` and `peg_ratio < 0.9`.

### 5. Sector Leaders
* **Business Logic**: Highlights dominant blue-chip leaders based on absolute size, return rates, and sector relative performance.
* **Required Columns**: `market_capitalization`, `roce_5y_avg`, `rr_sector_year_pct`, `opm_current`
* **Formula / Rank Criteria**:
  $$\text{Score} = (0.1 \times \ln(\text{market\_capitalization})) + (0.5 \times \text{roce\_5y\_avg}) + (1.5 \times \text{rr\_sector\_year\_pct})$$
* **Confidence Factors**: Confirmed if company is the top-ranked ticker in its respective `sector_name`.

### 6. Institutional Accumulation
* **Business Logic**: Tracks aggressive buying from global fund houses, venture funds, and domestic asset managers.
* **Required Columns**: `fii_holding_change_qoq_pct`, `mf_holding_change_qoq_pct`, `roce`, `trendlyne_durability_score`
* **Formula / Rank Criteria**:
  $$\text{Score} = (100 \times \text{fii\_holding\_change\_qoq\_pct}) + (100 \times \text{mf\_holding\_change\_qoq\_pct}) + (0.2 \times \text{roce})$$
* **Confidence Factors**: High if `promoter_holding_change_qoq_pct >= 0`.

### 7. Smart Money Picks
* **Business Logic**: Combines institutional accumulation metrics with direct promoter buying to pinpoint unified insider confidence.
* **Required Columns**: `promoter_holding_change_qoq_pct`, `fii_holding_change_qoq_pct`, `pe_ttm`
* **Formula / Rank Criteria**:
  $$\text{Score} = (100 \times \text{promoter\_holding\_change\_qoq\_pct}) + (50 \times \text{fii\_holding\_change\_qoq\_pct}) - (0.5 \times \text{pe\_ttm})$$
* **Confidence Factors**: Highest when there is concurrent buying across all three categories of stakeholders.

### 8. Dynamic Multi-Bagger Candidates
* **Business Logic**: Searches for smaller companies that are scaling quickly, maintaining high capital returns, and showing consistent volume accumulation.
* **Required Columns**: `market_capitalization`, `sales_growth_5y_pct`, `roce`, `debt_to_equity`, `day_volume`
* **Formula / Rank Criteria**:
  $$\text{Score} = \text{sales\_growth\_5y\_pct} + \text{roce} - (50 \times \text{debt\_to\_equity})$$
* **Confidence Factors**: Enabled when `market_capitalization < 15000` and `piotroski_score >= 8`.

### 9. Breakout Candidates
* **Business Logic**: Highlights stocks trading near 52-week highs on accelerating volume, supported by strong intermediate trends.
* **Required Columns**: `current_price`, `year_1_high`, `day_volume`, `week_volume_avg`, `day_adx`, `day_rsi`
* **Formula / Rank Criteria**:
  $$\text{Score} = \left(\frac{\text{current\_price}}{\text{year\_1\_high}} \times 100\right) + \left(\frac{\text{day\_volume}}{\text{week\_volume\_avg}} \times 20\right) + \text{day\_adx}$$
* **Confidence Factors**: Confirmed if `day_rsi > 60` and `day_rsi < 75`.

### 10. Undervalued Compounders
* **Business Logic**: Locates consistent cash-compounding businesses trading below their historical valuation multiples.
* **Required Columns**: `eps_growth_5y_pct`, `roce`, `trendlyne_valuation_score`, `debt_to_equity`
* **Formula / Rank Criteria**:
  $$\text{Score} = (1.5 \times \text{eps\_growth\_5y\_pct}) + \text{roce} + (2 \times \text{trendlyne\_valuation\_score})$$
* **Confidence Factors**: Maximum if `debt_to_equity < 0.1`.

### 11. Wealth Creators
* **Business Logic**: Targets large-cap businesses with high Return on Equity and consistent multi-year net profit growth.
* **Required Columns**: `market_capitalization`, `roe_3y_avg`, `profit_growth_5y_pct`, `fcf_3y`
* **Formula / Rank Criteria**:
  $$\text{Score} = (0.5 \times \text{roe\_3y\_avg}) + (0.5 \times \text{profit\_growth\_5y\_pct}) + (0.01 \times \text{fcf\_3y})$$
* **Confidence Factors**: High if `market_capitalization > 100000`.

### 12. Future Bluechips
* **Business Logic**: Identifies quality mid-caps exhibiting best-in-class solvency, high capital allocations, and strong sales growth.
* **Required Columns**: `market_capitalization`, `altman_z_score`, `roce`, `sales_growth_3y_pct`
* **Formula / Rank Criteria**:
  $$\text{Score} = (10 \times \text{altman\_z\_score}) + \text{roce} + \text{sales\_growth\_3y\_pct}$$
* **Confidence Factors**: High if `market_capitalization > 12000` and `market_capitalization < 60000`.

### 13. Earnings Surprise Candidates
* **Business Logic**: Pinpoints stocks showing accelerating sequential and year-over-year revenue and net profit trends.
* **Required Columns**: `sales_q_latest`, `sales_q_prev`, `profit_q_latest`, `profit_q_prev`, `day_rsi`
* **Formula / Rank Criteria**:
  $$\text{Score} = \left(\frac{\text{sales\_q\_latest}}{\text{sales\_q\_prev}} \times 50\right) + \left(\frac{\text{profit\_q\_latest}}{\text{profit\_q\_prev}} \times 50\right)$$
* **Confidence Factors**: High if `day_rsi > 55`.

### 14. High Conviction Ideas
* **Business Logic**: Focuses on financially healthy companies that are highly rated by both conservative durability and valuation metrics.
* **Required Columns**: `trendlyne_durability_score`, `piotroski_score`, `altman_z_score`, `roce`, `pe_ttm`
* **Formula / Rank Criteria**:
  $$\text{Score} = \text{trendlyne\_durability\_score} + (10 \times \text{piotroski\_score}) + (5 \times \text{altman\_z\_score}) - (0.2 \times \text{pe\_ttm})$$
* **Confidence Factors**: Certified if `debt_to_equity < 0.25`.

---

## PHASE 7: STRATEGIC PRIORITIZATION & DEVELOPMENT MATRIX

Below is a prioritization matrix based on user demand, development effort, data availability, and monetization potential.

| Unique Screener Metric / Feature | User Demand | investment Value | Ease of Dev | Data Available | Monetization | Overall Priority | Target Phase |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **QARP (GARP) Multi-factor Screener**| Extremely High| Extremely High | High | 100% | Ultra High | **High Priority** | Phase 1 (Core) |
| **Piotroski - Solvency Safety Net** | High | High | High | 100% | High | **High Priority** | Phase 1 (Core) |
| **Institutions & Promoter Sweep** | High | Extremely High | High | 100% | High | **High Priority** | Phase 1 (Core) |
| **MACD & RSI Breakout Indicators** | Extremely High| Medium | High | 100% | Medium | **High Priority** | Phase 2 |
| **Under-the-radar Hidden Gems** | High | Extremely High | Medium | 100% | Extremely High| **High Priority** | Phase 2 |
| **Turnaround Recovery Candidates** | High | High | Medium | 100% | High | **Medium Priority**| Phase 2 |
| **Weekly Wealth Alpha Reports** | Medium | High | Medium | 100% | Extremely High| **Medium Priority**| Phase 3 |
| **Emerging Sector / Industry Leader**| Medium | High | Medium | 100% | Medium | **Medium Priority**| Phase 3 |
| **Zero-Debt Castle Multipliers** | Medium | Medium | High | 100% | Medium | **Medium Priority**| Phase 3 |
| **Oversold Reversal Bounce Alerts** | High | Low | High | 100% | Medium | **Medium Priority**| Phase 4 |
| **Long Term Wealth Decade Forts** | Medium | High | High | 100% | High | **Low Priority** | Phase 4 |
| **Earnings Surprise Forecast Screener**| Low | Medium | Low | 100% | Medium | **Low Priority** | Phase 4 |

---

## RECOMMENDED IMPLEMENTATION ORDER (PHASES 1-4)

### Phase 1: Core Institutional Foundations (Screener Core)
* **Goal**: Launch the foundational SQL-less analytical engine.
* **Target Schema Screeners**: Value Investing Core (QARP, Altman Z / Piotroski safety boundaries) and Shareholding Trackers.
* **Component Architecture**: Client-side Multi-Factor filter dashboard connecting to `/api/stocks` fetching `Master_merged.csv` directly.

### Phase 2: Technical Momentum & Flow Dynamics (Advanced Trading)
* **Goal**: Merge price action indicators (RSI, ADX, MACD, Moving Averages) to enable swing trading setups.
* **Target Schema Screeners**: High Momentum, Swing Trading, MACD Bull crossovers, and Volume Spike metrics.
* **Component Architecture**: Real-time chart visualization engine using `recharts` and interactive trend alerts.

### Phase 3: Premium AI Recommendation Engine & Deep Report Compilers
* **Goal**: Leverage Gemini AI and PDF generation logic to supply professional-grade equity research reports.
* **Target Schema Screeners**: Hidden Gems, Turnarounds, Future Bluechips, and Multi-Bagger scoring metrics.
* **Component Architecture**: Dynamic server-side report generation, calling Gemini API (`process.env.GEMINI_API_KEY`) to compile equity narratives for top stocks, paired with client-side PDF export buttons.

### Phase 4: Persona Playgrounds & Scheduled Intelligence Mailers
* **Goal**: Introduce specialized user modes (Peter Lynch mode, Warren Buffett mode) and background report scheduling.
* **Target Schema Screeners**: Warren Buffett Moat style, Philip Fisher growth plays, and Charlie Munger fortress compounders.
* **Component Architecture**: Scheduled job queues inside the Express `server.ts` to execute screeners nightly and refresh compiled results metrics.

---
**Catalogue End — Blueprint Registered for StockIntel AI Implementation.**
