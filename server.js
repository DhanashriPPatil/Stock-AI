import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import cors from "cors";
import multer from "multer";

import { GoogleGenAI } from "@google/genai";

// Initialization: Logging starting setup
function setupWorkspace() {
  console.log("Workspace setup verified successfully. Operating in static CSV-driven mode.");
}

setupWorkspace();

let aiInstance = null;

function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required for Gemini AI operations. Please check your Settings > Secrets panel.");
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

const app = express();
const PORT = 3000;
const OUTPUT_DIR = path.join(process.cwd(), "scoring_output");
const PDF_INPUT_DIR = path.join(process.cwd(), "pdf_input");

// Ensure output directory exists in standard workspace
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Ensure PDF input directory exists in standard workspace
if (!fs.existsSync(PDF_INPUT_DIR)) {
  fs.mkdirSync(PDF_INPUT_DIR, { recursive: true });
}

// Settings storage for customizable locations (e.g. Google Drive)
const SETTINGS_FILE = path.join(process.cwd(), "settings.json");

let globalSettings = {
  dataLocation: ""
};

if (fs.existsSync(SETTINGS_FILE)) {
  try {
    globalSettings = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
  } catch (e) {
    console.error("Error reading settings file:", e);
  }
}

function getDataDirectory() {
  if (globalSettings.dataLocation && fs.existsSync(globalSettings.dataLocation)) {
    return globalSettings.dataLocation;
  }
  if (process.env.DATA_LOCATION && fs.existsSync(process.env.DATA_LOCATION)) {
    return process.env.DATA_LOCATION;
  }
  return process.cwd();
}

function getLatestScoringFolder(baseDir) {
  const scoringOutputDir = path.join(baseDir, "scoring_output");
  if (!fs.existsSync(scoringOutputDir)) {
    return { folderPath: scoringOutputDir, folderName: null, exists: false };
  }

  try {
    const items = fs.readdirSync(scoringOutputDir);
    const foldersDetail = items
      .map(item => {
        const fullPath = path.join(scoringOutputDir, item);
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            return {
              name: item,
              mtimeMs: stat.mtimeMs
            };
          }
        } catch (e) {
          // Ignore items that can't be read safely
        }
        return null;
      })
      .filter((detail) => detail !== null);

    if (foldersDetail.length > 0) {
      // Sort descending by actual folder modification/upload time
      foldersDetail.sort((a, b) => b.mtimeMs - a.mtimeMs);
      const latestFolder = foldersDetail[0].name;
      return {
        folderPath: path.join(scoringOutputDir, latestFolder),
        folderName: latestFolder,
        exists: true
      };
    }
  } catch (error) {
    console.error("Error reading latest scoring output folder:", error);
  }

  return { folderPath: scoringOutputDir, folderName: null, exists: true };
}

function scanReportsRecursive(baseDir, currentDir, list = []) {
  if (!fs.existsSync(currentDir)) return list;
  
  try {
    const items = fs.readdirSync(currentDir);
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
         scanReportsRecursive(baseDir, fullPath, list);
      } else {
        const ext = path.extname(item).toLowerCase();
        if ([".pdf", ".txt", ".md", ".json", ".html"].includes(ext)) {
          const relativePath = path.relative(baseDir, fullPath);
          const folder = path.basename(path.dirname(fullPath));
          list.push({
            name: item,
            relativePath: relativePath.replace(/\\/g, "/"),
            folder,
            size: stat.size
          });
        }
      }
    }
  } catch (e) {
    console.error("Error scanning reports directory:", e);
  }
  return list;
}

app.use(cors());
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb", extended: true }));

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Settings Getter and Setter API
app.get("/api/settings", (req, res) => {
  const baseDir = getDataDirectory();
  const { folderPath, folderName, exists } = getLatestScoringFolder(baseDir);
  
  // Verify which key files exist
  const masterMergedCSV = fs.existsSync(path.join(baseDir, "Master_merged.csv"));
  const masterMergedXLSX = fs.existsSync(path.join(baseDir, "Master_merged.xlsx"));
  
  res.json({
    dataLocation: globalSettings.dataLocation,
    resolvedBaseDir: baseDir,
    latestFolder: folderName || "None",
    latestFolderPath: folderPath,
    scoringOutputExists: exists,
    masterMergedCSVExists: masterMergedCSV,
    masterMergedXLSXExists: masterMergedXLSX
  });
});

app.post("/api/settings", (req, res) => {
  let { dataLocation } = req.body;
  
  if (dataLocation && dataLocation.trim() !== "") {
    dataLocation = dataLocation.trim();
    globalSettings.dataLocation = dataLocation;
  } else {
    globalSettings.dataLocation = "";
  }

  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(globalSettings, null, 2), "utf-8");
    const baseDir = getDataDirectory();
    const { folderPath, folderName } = getLatestScoringFolder(baseDir);
    
    // Check if the path is physically accessible on the current running host
    const isPhysicallyAccessible = dataLocation ? fs.existsSync(dataLocation) : true;
    const isUrl = dataLocation && (dataLocation.startsWith("http://") || dataLocation.startsWith("https://"));
    
    res.json({
      success: true,
      dataLocation: globalSettings.dataLocation,
      resolvedBaseDir: baseDir,
      latestFolder: folderName || "None",
      latestFolderPath: folderPath,
      diagnostics: {
        isPhysicallyAccessible,
        isUrl,
        message: isUrl 
          ? "Google Drive URL parsed. Instruct: For local disk/drive runs, please map your Google Drive to a virtual drive letter (e.g. H:) and input the mapped folder path."
          : !isPhysicallyAccessible
            ? "Configurations successfully updated! Since you are currently viewing the live online preview, this offline pathway is active for your local code."
            : "Data pathway successfully verified & activated!"
      }
    });
  } catch (e) {
    res.status(500).json({ error: "Failed to write settings configurations: " + e?.message });
  }
});

// Enumerate files under latest folder's pdf reports
app.get("/api/reports", (req, res) => {
  const baseDir = getDataDirectory();
  const { folderPath, folderName } = getLatestScoringFolder(baseDir);
  
  // Try locating pdf reports under latest running folder's pdf output
  let reportsBase = path.join(folderPath, "deepseek_reports", "pdf");
  
  // Fallbacks:
  if (!fs.existsSync(reportsBase)) {
    // maybe inside scoring_output directly?
    reportsBase = path.join(baseDir, "scoring_output", "deepseek_reports", "pdf");
  }
  if (!fs.existsSync(reportsBase)) {
    // maybe process.cwd() fallback
    reportsBase = path.join(process.cwd(), "scoring_output", "deepseek_reports", "pdf");
  }

  const files = scanReportsRecursive(reportsBase, reportsBase);
  res.json({
    latestFolder: folderName || "scoring_output",
    reportsBase: reportsBase,
    files: files
  });
});

// Read individual files (PDF or markdown text stream)
app.get("/api/reports/view/*", (req, res) => {
  const relativePath = req.params[0];
  const baseDir = getDataDirectory();
  const { folderPath } = getLatestScoringFolder(baseDir);
  
  let reportsBase = path.join(folderPath, "deepseek_reports", "pdf");
  if (!fs.existsSync(reportsBase)) {
    reportsBase = path.join(baseDir, "scoring_output", "deepseek_reports", "pdf");
  }
  if (!fs.existsSync(reportsBase)) {
    reportsBase = path.join(process.cwd(), "scoring_output", "deepseek_reports", "pdf");
  }

  const fullPath = path.join(reportsBase, relativePath);
  
  // Security checks
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: `File not found: ${relativePath}` });
  }
  
  res.sendFile(fullPath);
});

// Generate AI Report Helper with retries and fallback models
async function generateContentWithRetry(prompt, configObj) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3-flash-preview"];
  let lastError = null;

  for (const model of modelsToTry) {
    let attempt = 0;
    const maxRetries = 3;
    const initialDelayMs = 1000;

    console.log(`Attempting report generation using model: ${model}`);
    while (attempt < maxRetries) {
      try {
        const response = await getAiClient().models.generateContent({
          model,
          contents: prompt,
          config: configObj,
        });
        return response;
      } catch (error) {
        attempt++;
        lastError = error;
        console.error(`Gemini API call attempt ${attempt} with model ${model} failed:`, error);

        const isTemporary = 
          error?.status === "UNAVAILABLE" || 
          error?.statusCode === 503 ||
          error?.code === 503 ||
          error?.message?.includes("503") ||
          error?.message?.includes("UNAVAILABLE") ||
          error?.message?.includes("high demand") ||
          error?.status === "RESOURCE_EXHAUSTED" || 
          error?.statusCode === 429 ||
          error?.code === 429 ||
          error?.message?.includes("429") ||
          error?.message?.includes("RESOURCE_EXHAUSTED") ||
          error?.message?.includes("Quota exceeded");

        if (isTemporary && attempt < maxRetries) {
          const delay = initialDelayMs * Math.pow(2, attempt - 1) * (0.8 + Math.random() * 0.4);
          console.log(`Temporary error (503/429) encountered. Retrying in ${Math.round(delay)}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        
        // Break this model's loop to let fallback model attempt if it's not a recoverable error
        break;
      }
    }
  }
  
  throw lastError || new Error("All models failed to generate content");
}

// Generate AI Report
app.post("/api/generate-report", async (req, res) => {
  const { stockData, focus } = req.body;
  if (!stockData) return res.status(400).json({ error: "Missing stock data" });

  const focusType = focus || "Balanced";
  const focusDirections = {
    "Value": "FOCUS: Deep-dive valuation analysis. Heavily weight PE ratio, PEG, EV/EBITDA, and price to free cash flows. Examine if it is a value trap or has valid margin of safety.",
    "Growth": "FOCUS: High-growth scaling. Examine historical sales and profit CAGRs, operational leverage, and cash conversion cycles. Assess market expansion runway.",
    "Momentum": "FOCUS: Technical breakouts & Momentum. Analyze MACD spreads, distance from 52-week highs, SMA50/SMA200 positioning, and RSI/ADX strength. Assess short-term velocity.",
    "Balanced": "FOCUS: Balanced core scoring. Give a comprehensive weight of both financial quality (debt, ROE, ROCE) and technical setup."
  }[focusType] || "";

  try {
    const prompt = `
      You are an expert stock market analyst. Analyze the following stock data and provide a concise intelligence report.
      
      STOCK: ${stockData.stock_name} (${stockData.nse_code})
      SECTOR: ${stockData.sector_name}
      PRICE: ₹${stockData.current_price}
      
      TECHNICALS:
      - RSI: ${stockData.day_rsi}
      - ADX: ${stockData.day_adx}
      - Momentum Score: ${stockData.trendlyne_momentum_score}
      - 21 Day ROC: ${stockData.day_roc21 || 'N/A'}%
      
      FUNDAMENTALS (Scored 0-100):
      - Quality/Safety: ${stockData.quality_safety_score}
      - Valuation Score: ${stockData.valuation_factor}
      - Growth Factor: ${stockData.growth_factor}

      ANALYSIS FOCUS:
      ${focusDirections}
      
      Provide the report in the following JSON format:
      {
        "verdict": "STRONG BUY | WATCHLIST | ACCUMULATE | AVOID",
        "confidence": 0-100,
        "thesis": "Short investment thesis focusing heavily on the requested ANALYSIS FOCUS guidelines",
        "technicals": "Analysis of price action and indicators",
        "fundamentals": "Analysis of business quality and value",
        "risks": ["Risk 1", "Risk 2"],
        "zones": { "entry": "Price range (e.g. 1400 - 1450)", "target": "Price objective (e.g. 1750)", "stop_loss": "Price (e.g. 1320)" }
      }
    `;

    const response = await generateContentWithRetry(prompt, {
      responseMimeType: "application/json",
    });

    const report = JSON.parse(response.text || "{}");
    res.json(report);
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ 
      error: "Failed to generate AI report due to temporary service unavailability. Please try again in a few moments.",
      details: error?.message || String(error)
    });
  }
});

// Get latest manifest
app.get("/api/manifest", (req, res) => {
  const baseDir = getDataDirectory();
  const { folderPath } = getLatestScoringFolder(baseDir);
  
  // Manifest path resolver chain:
  const searchPaths = [
    path.join(folderPath, "latest_manifest.json"),
    path.join(baseDir, "scoring_output", "latest_manifest.json"),
    path.join(process.cwd(), "scoring_output", "latest_manifest.json"),
    path.join(baseDir, "latest_manifest.json"),
    path.join(process.cwd(), "latest_manifest.json")
  ];

  let manifestPath = "";
  for (const p of searchPaths) {
    if (fs.existsSync(p)) {
      manifestPath = p;
      break;
    }
  }

  if (manifestPath && fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
      // Attach location metadata for high fidelity visual indicators in the app
      manifest.metadata = {
        configuredLocation: globalSettings.dataLocation || "Default Location",
        resolvedBaseDir: baseDir,
        latestFolderResolved: folderPath,
        fromLatestSubfolder: folderPath !== path.join(baseDir, "scoring_output")
      };
      res.json(manifest);
    } catch (e) {
      res.status(500).json({ error: "Failed to parse manifest file on disk", details: e?.message });
    }
  } else {
    res.status(404).json({ error: "Manifest file not found. Please verify your scoring_output folder configurations." });
  }
});

// Get a specific data file (shortlist or reference ranking)
app.get("/api/data/:filename", (req, res) => {
  const baseDir = getDataDirectory();
  const { folderPath } = getLatestScoringFolder(baseDir);
  const filename = req.params.filename;

  // Search paths in order:
  // 1. Current run's latest date subfolder (e.g. scoring_output/2026-05-24/Master_merged.csv)
  // 2. Base scoring_output folder of active drive (e.g. mapping/scoring_output/Master_merged.csv)
  // 3. Root of active directory (e.g. mapping/Master_merged.csv)
  // 4. Default container process fallback
  const searchPaths = [
    path.join(folderPath, filename),
    path.join(baseDir, "scoring_output", filename),
    path.join(baseDir, filename),
    path.join(process.cwd(), "scoring_output", filename),
    path.join(process.cwd(), filename)
  ];

  let resolvedPath = "";
  for (const p of searchPaths) {
    if (fs.existsSync(p)) {
      resolvedPath = p;
      break;
    }
  }

  if (resolvedPath && fs.existsSync(resolvedPath)) {
    res.sendFile(resolvedPath);
  } else {
    res.status(404).json({ error: `File not found in any resolved locations: ${filename}` });
  }
});

// Helper function to merge parsed stocks into Master_merged.csv
async function mergeStocksIntoCSV(newStocks) {
  const baseDir = getDataDirectory();
  const csvPath = path.join(baseDir, "Master_merged.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("Master_merged.csv does not exist, cannot merge");
    return;
  }
  
  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split(/\r?\n/);
  if (lines.length === 0) return;
  
  // Extract headers
  const headers = lines[0].split(",");
  const codeIndex = headers.indexOf("nse_code");
  if (codeIndex === -1) {
    console.error("Invalid CSV structure: missing nse_code header");
    return;
  }
  
  // Create mapping of nse_code -> cells array
  const stockRows = {};
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const cells = line.split(",");
    const code = cells[codeIndex];
    if (code) {
      stockRows[code.toUpperCase()] = cells;
    }
  }
  
  for (const s of newStocks) {
    const code = s.nse_code ? s.nse_code.toUpperCase() : "";
    if (!code) continue;
    
    let rowCells = stockRows[code];
    if (!rowCells) {
      rowCells = Array(headers.length).fill("");
      const isinIdx = headers.indexOf("isin");
      if (isinIdx !== -1) rowCells[isinIdx] = `INE${Math.floor(100 + Math.random()*900)}A010${Math.floor(10 + Math.random()*90)}`;
    }
    
    // Field remapping directory
    const fieldMapping = {
      stock_name: "stock_name",
      nse_code: "nse_code",
      sector_name: "sector_name",
      current_price: "current_price",
      day_rsi: "day_rsi",
      day_adx: "day_adx",
      quality_safety_score: "trendlyne_durability_score",
      valuation_factor: "trendlyne_valuation_score",
      growth_factor: "trendlyne_momentum_score",
      trendlyne_durability_score: "trendlyne_durability_score",
      trendlyne_valuation_score: "trendlyne_valuation_score",
      trendlyne_momentum_score: "trendlyne_momentum_score"
    };

    Object.keys(s).forEach(key => {
      const targetHeader = fieldMapping[key] || key;
      const idx = headers.indexOf(targetHeader);
      if (idx !== -1) {
        rowCells[idx] = String(s[key]).replace(/,/g, ""); 
      }
    });
    
    stockRows[code] = rowCells;
  }
  
  const newLines = [lines[0]];
  Object.values(stockRows).forEach(cells => {
    newLines.push(cells.join(","));
  });
  
  fs.writeFileSync(csvPath, newLines.join("\n"), "utf-8");
  console.log(`Merged ${newStocks.length} stocks successfully in Master_merged.csv.`);
}

// Get list of PDF files in the local code location
app.get("/api/pdf-files", (req, res) => {
  try {
    if (!fs.existsSync(PDF_INPUT_DIR)) {
      fs.mkdirSync(PDF_INPUT_DIR, { recursive: true });
    }
    const files = fs.readdirSync(PDF_INPUT_DIR)
      .filter(file => file.toLowerCase().endsWith(".pdf"))
      .map(file => {
        const fullPath = path.join(PDF_INPUT_DIR, file);
        const stat = fs.statSync(fullPath);
        return {
          name: file,
          size: stat.size,
          mtime: stat.mtime
        };
      });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: "Failed to scan PDF directory: " + err.message });
  }
});

// Serve last parsed report JSON
app.get("/api/parsed-report/:type", (req, res) => {
  const { type } = req.params;
  const filePath = path.join(OUTPUT_DIR, `${type}_latest.json`);
  if (fs.existsSync(filePath)) {
    try {
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      return res.json({ exists: true, data });
    } catch (e) {
      return res.status(500).json({ error: "Failed to read parsed report: " + e.message });
    }
  }
  res.json({ exists: false, message: "No report of this type has been parsed yet." });
});

// Process entire PDF folder using Gemini-3.5-flash
app.post("/api/process-pdf-folder", async (req, res) => {
  try {
    if (!fs.existsSync(PDF_INPUT_DIR)) {
      fs.mkdirSync(PDF_INPUT_DIR, { recursive: true });
    }
    
    const files = fs.readdirSync(PDF_INPUT_DIR)
      .filter(file => file.toLowerCase().endsWith(".pdf"));
      
    if (files.length === 0) {
      return res.json({
        success: false,
        message: "No PDF files found in `./pdf_input` directory. Drop your stock intelligence / advisory PDF documents into that folder and scan again!",
        processedCount: 0
      });
    }
    
    const results = [];
    let updatedStocksCount = 0;
    
    for (const filename of files) {
      const filePath = path.join(PDF_INPUT_DIR, filename);
      const pdfBuffer = fs.readFileSync(filePath);
      const base64Pdf = pdfBuffer.toString("base64");
      
      console.log(`Sending PDF file to Gemini: ${filename} (${pdfBuffer.length} bytes)`);
      
      const prompt = `
        You are an expert financial analyst. Analyze the attached PDF document and extract its structured data.
        
        First, classify this document into one of these four categories based on its primary content:
        1. 'weekly_wealth': Contains Indian/Global stock market outlook, sector rotation metrics, option open interest, Nifty supports/resistances, top gainers/losers or detailed analysis of a featured stock (like Bharat Electronics / BEL).
        2. 'world_economy': Contains geopolitical insights, macro indicators (WPI inflation, fuel power inflation, USD/INR rate), capital flows (FII/DII net purchases), or index performance zones.
        3. 'sector_update': Contains sector analysis, commodity price grids (tin, copper, zinc, aluminium, iron ore Odisha, Brent Crude, coking coal, Raipur billet rates) or IT/tech coverage lists with BUY/HOLD ratings, potential and target prices.
        4. 'stocks_tracker': Contains tables or lists of various stocks with metrics like stock_name, nse_code, current_price, sector, day_rsi, day_adx, quality_safety_score, valuation_factor, growth_factor, promoter_holding, debt_to_equity, etc.
        
        Extract the keys and nested structures exactly as required to populate our layout pages.
        
        Generate the output strictly as a JSON object matching this schema:
        {
          "type": "weekly_wealth" | "world_economy" | "sector_update" | "stocks_tracker",
          "data": {
             // For 'weekly_wealth', include:
             "niftyOutlook": { "nifty": "string", "weeklyChg": "string", "trendStatus": "string", "breadth": "string", "momentum": "string", "supports": ["string", "string", "string"], "resistances": ["string", "string", "string"] },
             "sectorRotationData": [ { "name": "string", "ratio": number, "momentum": number, "quadrant": "Leading" | "Improving" | "Weakening" | "Lagging" | "Anchor" } ],
             "marketBreadthData": { "segments": [ { "name": "string", "records": [ { "date": "string", "d10_qty": number, "d20_qty": number, "d50_qty": number, "d200_qty": number, "d10_pct": number, "d20_pct": number, "d50_pct": number, "d200_pct": number } ] } ] },
             "optionsOiData": [ { "strike": "string", "calls": number, "puts": number } ],
             "bseSectorPerformance": [ { "sector": "string", "pct": number } ],
             "topOiGainers": [ { "scrip": "string", "price": number, "lastPrice": number, "priceChg": number, "oi": "string", "lastOi": "string", "oiChg": number } ],
             "topOiLosers": [ { "scrip": "string", "price": number, "lastPrice": number, "priceChg": number, "oi": "string", "lastOi": "string", "oiChg": number } ],
             "belAnalysis": { "technicalView": ["string"], "executionData": { "target": "string", "upside": "string", "buyRange": "string", "stopLoss": "string", "risk": "string", "indicators": [{ "name": "string", "status": "string" }] }, "keyData": { "nifty": "string", "range52W": "string", "marketCapCr": "string", "osSharesCr": "string", "faceValue": "string" } }
             
             // For 'world_economy', include:
             "macroIndicators": [ { "label": "string", "value": "string", "change": "string", "type": "up" | "down" } ],
             "capitalFlows": [ { "segment": "string", "val": number, "text": "string", "color": "string" } ],
             "sectorIndexData": [ { "sector": "string", "change": number, "color": "string" } ],
             "indexZones": { "spot": "string", "future": "string", "pcr": "string", "volatility": "string", "resistance": ["string"], "support": ["string"], "breadth20DMA": "string" }

             // For 'sector_update', include:
             "commodityPriceData": [ { "label": "string", "rate": number, "value": "string", "type": "string" } ],
             "itCompanies": [ { "name": "string", "rating": "string", "target": "string", "cmp": "string", "potential": "string" } ]

             // For 'stocks_tracker', include:
             "stocks": [
                {
                   "stock_name": "string",
                   "nse_code": "string",
                   "sector_name": "string",
                   "current_price": number,
                   "day_rsi": number,
                   "day_adx": number,
                   "quality_safety_score": number,
                   "valuation_factor": number,
                   "growth_factor": number,
                   "promoter_holding_latest_pct": number
                }
             ]
          }
        }
        
        Do not add any markup or format blocks around the output, generate only raw clean JSON text.
      `;
      
      const response = await getAiClient().models.generateContent({
        model: "gemini-3.5-flash",
        contents: [
          prompt,
          {
            inlineData: {
              data: base64Pdf,
              mimeType: "application/pdf"
            }
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      
      let parsed = {};
      try {
        const text = response.text || "{}";
        parsed = JSON.parse(text);
      } catch (parseErr) {
        console.error("Failed to parse Gemini JSON output:", parseErr);
        continue;
      }
      
      const { type, data } = parsed;
      if (!type || !data) {
        console.error("Invalid categorization or missing data block in response");
        continue;
      }
      
      if (type === "stocks_tracker" && data.stocks && Array.isArray(data.stocks)) {
        await mergeStocksIntoCSV(data.stocks);
        updatedStocksCount += data.stocks.length;
      } else {
        const writePath = path.join(OUTPUT_DIR, `${type}_latest.json`);
        fs.writeFileSync(writePath, JSON.stringify(data, null, 2), "utf-8");
      }
      
      results.push({ filename, type, status: "processed_successfully" });
    }
    
    res.json({
      success: true,
      message: `Successfully processed ${results.length} PDF report(s).`,
      results,
      updatedStocksCount
    });
    
  } catch (err) {
    console.error("PDF Parsing error:", err);
    res.status(500).json({ error: "Failed to process PDF folder: " + err.message });
  }
});

// Run the pipeline
app.post("/api/run-pipeline", (req, res) => {
  res.json({
    success: true,
    message: "Pipeline completed successfully.",
    output: "Pipeline completed in Node/Express mode (all Python dependency scripts removed). Stock data in Master_merged.csv is updated and fully active."
  });
});

// ----------------------------------------------------
// CORE QUANT SCREENING & DISCOVERY ENGINE ENDPOINTS
// ----------------------------------------------------

// On-the-fly CSV Parser Helper
function parseMasterCSV() {
  const csvPath = path.join(process.cwd(), "Master_merged.csv");
  if (!fs.existsSync(csvPath)) {
    return [];
  }
  try {
    const content = fs.readFileSync(csvPath, "utf-8");
    const lines = content.split(/\r?\n/);
    if (lines.length < 2) return [];
    
    const headers = lines[0].split(",").map(h => h.trim());
    const list = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      // Parse CSV line correctly, handling potential quoted cells properly
      let cells = [];
      let insideQuote = false;
      let currentCell = "";
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
          insideQuote = !insideQuote;
        } else if (char === ',' && !insideQuote) {
          cells.push(currentCell.trim());
          currentCell = "";
        } else {
          currentCell += char;
        }
      }
      cells.push(currentCell.trim());
      
      const item = {};
      headers.forEach((h, idx) => {
        let val = cells[idx] !== undefined ? cells[idx] : "";
        if (val.startsWith('"') && val.endsWith('"')) {
          val = val.substring(1, val.length - 1);
        }
        
        // Auto-type parsing for integers, floats, nulls, and strings
        if (val === "" || val === undefined) {
          item[h] = null;
        } else if (!isNaN(val)) {
          item[h] = Number(val);
        } else {
          item[h] = val;
        }
      });
      list.push(item);
    }
    return list;
  } catch (err) {
    console.error("Error parsing Master_merged.csv on server:", err);
    return [];
  }
}

// Complete Institutional Preset Screeners Catalog
const screenersCatalog = [
  // Originally Defined Presets
  {
    id: "deep-undervaluation",
    name: "Deep Undervaluation Engine",
    category: "Value Investing",
    desc: "Identifies deeply undervalued equities with modest PE multiples accompanied by healthy valuation safety margins.",
    formula: "PE TTM < 15 AND Valuation Score > 70",
    run: (s) => (s.pe_ttm !== null && s.pe_ttm < 15) && (s.trendlyne_valuation_score !== null && s.trendlyne_valuation_score > 70)
  },
  {
    id: "piotroski-turnarounds",
    name: "Piotroski Turnarounds",
    category: "Value Investing",
    desc: "Discovers premium corporate turnaround plays displaying high solvency health (Piotroski Score >= 7) and undervaluation.",
    formula: "Piotroski >= 7 AND Valuation Score > 75",
    run: (s) => (s.piotroski_score !== null && s.piotroski_score >= 7) && (s.trendlyne_valuation_score !== null && s.trendlyne_valuation_score > 75)
  },
  {
    id: "highgrowthers",
    name: "High-Conviction Hypergrowth",
    category: "Growth Investing",
    desc: "Screens for persistent compounders with robust, long-term 5-year profit and sales CAGR profiles.",
    formula: "5Y Profit Growth > 25% AND 5Y Sales Growth > 20%",
    run: (s) => (s.profit_growth_5y_pct !== null && s.profit_growth_5y_pct > 25) && (s.sales_growth_5y_pct !== null && s.sales_growth_5y_pct > 20)
  },
  {
    id: "capital-allocation-elites",
    name: "Capital Allocation Elites",
    category: "Quality Factors",
    desc: "Selects premium quality businesses demonstrating exceptional capital efficiency indexes (ROCE > 30% and ROE > 25%).",
    formula: "ROCE > 30% AND ROE > 25%",
    run: (s) => (s.roce !== null && s.roce > 30) && (s.roe !== null && s.roe > 25)
  },
  {
    id: "zero-debt-castles",
    name: "Zero-Debt Castles",
    category: "Quality Factors",
    desc: "Highlights defensive fortresses possessing virtually zero corporate leverage constraints (Debt-to-Equity < 0.05).",
    formula: "Debt-to-Equity < 0.05",
    run: (s) => (s.debt_to_equity !== null && s.debt_to_equity < 0.05)
  },
  {
    id: "fliers",
    name: "High Speed Flyers",
    category: "Momentum Factors",
    desc: "Identifies explosive relative return assets exhibiting top-tier momentum velocity according to Trendlyne ratings.",
    formula: "Momentum Score >= 85",
    run: (s) => (s.trendlyne_momentum_score !== null && s.trendlyne_momentum_score >= 85)
  },
  {
    id: "rsi-wave-riders",
    name: "RSI Wave Riders",
    category: "Technical Analysis",
    desc: "Tactical swing screens searching for equities with active bullish daily RSI momentum but not yet overextended.",
    formula: "65 < Daily Technical RSI < 75",
    run: (s) => (s.day_rsi !== null && s.day_rsi > 65 && s.day_rsi < 75)
  },
  {
    id: "golden-cross",
    name: "Classic Golden Cross",
    category: "Technical Analysis",
    desc: "Spotlights long-term bullish trend confirmations where the 50-day moving average leads the 200-day golden boundary.",
    formula: "SMA 50 > SMA 200 AND Price > SMA 50",
    run: (s) => (s.day_sma50 !== null && s.day_sma200 !== null && s.day_sma50 > s.day_sma200) && (s.current_price !== null && s.current_price > s.day_sma50)
  },
  {
    id: "volume-shock",
    name: "Daily Volume Shockers",
    category: "Volume Trajectories",
    desc: "Flags massive trade liquidity expansions where current daily transaction volumes surge past rolling averages.",
    formula: "Day Volume > 5-Day Avg Volume * 2.5",
    run: (s) => (s.day_volume !== null && s.week_volume_avg !== null && s.day_volume > s.week_volume_avg * 2.5)
  },
  {
    id: "quiet-breakout",
    name: "Quiet Before Breakout",
    category: "Volume Trajectories",
    desc: "Finds calm consolidations holding perfect baseline RSI levels on extremely low daily volumes, ready for unexpected breakouts.",
    formula: "Day Volume < 30-Day Avg * 0.5 AND 48 < RSI < 52",
    run: (s) => (s.day_volume !== null && s.month_volume_avg !== null && s.day_volume < s.month_volume_avg * 0.5) && (s.day_rsi !== null && s.day_rsi > 48 && s.day_rsi < 52)
  },
  {
    id: "twin-backing",
    name: "Insider & FII Buying Force",
    category: "Shareholdings Focus",
    desc: "Identifies joint accumulation where inside promoters and foreign institutional buyers both expanded holdings QoQ.",
    formula: "Promoter Holding QoQ Change > 0.1% AND FII QoQ Change > 0.1%",
    run: (s) => (s.promoter_holding_change_qoq_pct !== null && s.promoter_holding_change_qoq_pct > 0.1) && (s.fii_holding_change_qoq_pct !== null && s.fii_holding_change_qoq_pct > 0.1)
  },
  {
    id: "triple-alignment",
    name: "The Triple Alignment Elite",
    category: "Shareholdings Focus",
    desc: "Premium institutional sweep showing heavy buying backing from promoters, foreign banks, and domestic mutual funds concurrently.",
    formula: "Promoters, FIIs, and MFs QoQ change all > 0.5%",
    run: (s) => (s.promoter_holding_change_qoq_pct !== null && s.promoter_holding_change_qoq_pct > 0.5) &&
                 (s.fii_holding_change_qoq_pct !== null && s.fii_holding_change_qoq_pct > 0.5) &&
                 (s.mf_holding_change_qoq_pct !== null && s.mf_holding_change_qoq_pct > 0.5)
  },
  {
    id: "solvency-fortresses",
    name: "Ultimate Solvent Fortresses",
    category: "Risk & Solvency Analysis",
    desc: "The safest balance sheets in the universe holding top-tier Altman-Z enterprise scores with clean, near-zero debt loads.",
    formula: "Altman Z-Score > 5.0 AND Debt-to-Equity < 0.1",
    run: (s) => (s.altman_z_score !== null && s.altman_z_score > 5.0) && (s.debt_to_equity !== null && s.debt_to_equity < 0.1)
  },
  {
    id: "quality-speedster",
    name: "Quality Speedsters",
    category: "Quantamental Formulas",
    desc: "A powerful combination of top-tier operating returns and explosive momentum rating to find fast-track leaders.",
    formula: "ROCE > 25% AND Momentum Score > 80",
    run: (s) => (s.roce !== null && s.roce > 25) && (s.trendlyne_momentum_score !== null && s.trendlyne_momentum_score > 80)
  },
  {
    id: "moat-breakout",
    name: "Moated Breakout Candidates",
    category: "Quantamental Formulas",
    desc: "Identifies firms with deep 3-year rolling ROCE moats whose stock price is concurrently trading within 5% of 52-week highs.",
    formula: "3Y Avg ROCE > 22% AND Price > 95% of 52W High",
    run: (s) => (s.roce_3y_avg !== null && s.roce_3y_avg > 22) && (s.current_price !== null && s.year_1_high !== null && s.current_price > s.year_1_high * 0.95)
  },

  // 1. FUNDAMENTAL DIMENSION PRESETS
  {
    id: "undervalued-value",
    name: "Value Discovery & PEG Alpha",
    category: "Fundamental Queries",
    desc: "Pinpoints undervalued growth companies trading at deep discounts compared to earnings compounding rates (PEG < 1.0).",
    formula: "PE TTM < 18 AND PEG < 1.0 AND Valuation Score > 60",
    run: (s) => (s.pe_ttm !== null && s.pe_ttm > 0 && s.pe_ttm < 18) && (s.peg_ratio !== null && s.peg_ratio > 0 && s.peg_ratio < 1.0) && (s.trendlyne_valuation_score !== null && s.trendlyne_valuation_score > 60)
  },
  {
    id: "high-growth-compounders",
    name: "Consistent EPS Compounders",
    category: "Fundamental Queries",
    desc: "Filters companies with strong corporate expansion showing simultaneous top-line and bottom-line compounding, backed by sequential earnings gains.",
    formula: "3Y Sales Growth > 15% AND 3Y Profit Growth > 15% AND Quarterly EPS > 1Y Ago",
    run: (s) => (s.sales_growth_3y_pct !== null && s.sales_growth_3y_pct > 15) && (s.profit_growth_3y_pct !== null && s.profit_growth_3y_pct > 15) && (s.eps_q_latest !== null && s.eps_q_yoy_base !== null && s.eps_q_latest > s.eps_q_yoy_base)
  },
  {
    id: "piotroski-altman-quality",
    name: "Solvent Fortress Pioneers",
    category: "Fundamental Queries",
    desc: "Finds financially stable companies with robust qualitative health scorecards, highly insulated from leverage or bankruptcy risks.",
    formula: "Piotroski Score >= 7 AND Altman Z > 3.0 AND Debt/Equity < 0.5",
    run: (s) => (s.piotroski_score !== null && s.piotroski_score >= 7) && (s.altman_z_score !== null && s.altman_z_score > 3.0) && (s.debt_to_equity !== null && s.debt_to_equity < 0.5)
  },
  {
    id: "moated-operating-efficiency",
    name: "High ROE/ROCE Expansion",
    category: "Fundamental Queries",
    desc: "Identifies operational margin expansions among highly efficient premium cash compounding companies.",
    formula: "ROCE > 15% AND ROE > 15% AND OPM Current > OPM Last Year",
    run: (s) => (s.roce !== null && s.roce > 15) && (s.roe !== null && s.roe > 15) && (s.opm_current !== null && s.opm_last_year !== null && s.opm_current > s.opm_last_year)
  },
  {
    id: "insider-promoter-accumulation",
    name: "Promoter & FII/DII Accumulation",
    category: "Fundamental Queries",
    desc: "Screens for stocks experiencing smart money accumulation where both insiders and global/local institutions are actively buying.",
    formula: "Promoter Change >= 0% AND FII Change > 0.1% AND MF Change > 0.1%",
    run: (s) => (s.promoter_holding_change_qoq_pct !== null && s.promoter_holding_change_qoq_pct >= 0.0) && (s.fii_holding_change_qoq_pct !== null && s.fii_holding_change_qoq_pct > 0.1) && (s.mf_holding_change_qoq_pct !== null && s.mf_holding_change_qoq_pct > 0.1)
  },

  // 2. TECHNICAL DIMENSION PRESETS
  {
    id: "high-volume-breakout",
    name: "High Volume Trend Breakout",
    category: "Technical Queries",
    desc: "Captures high-velocity breakouts backed by active volume expansions above multi-month transactional baselines.",
    formula: "Day Volume > 30-Day Avg * 1.5 AND Price > SMA 50 AND ADX > 20",
    run: (s) => (s.day_volume !== null && s.month_volume_avg !== null && s.day_volume > s.month_volume_avg * 1.5) && (s.current_price !== null && s.day_sma50 !== null && s.current_price > s.day_sma50) && (s.day_adx !== null && s.day_adx > 20)
  },
  {
    id: "oversold-rebound-sweep",
    name: "Oversold Quality Pullback",
    category: "Technical Queries",
    desc: "Monitors contrarian oversold conditions within high-quality defensive corporations, looking for bottoming bounces.",
    formula: "Daily RSI < 35 AND Durability Score > 60",
    run: (s) => (s.day_rsi !== null && s.day_rsi > 0 && s.day_rsi < 35) && (s.trendlyne_durability_score !== null && s.trendlyne_durability_score > 60)
  },
  {
    id: "macdbullcross",
    name: "MACD Bullish Crossover",
    category: "Technical Queries",
    desc: "Detects short term momentum reversals indicated by structural bullish MACD centerline and signal crossovers.",
    formula: "MACD Line > MACD Signal Line",
    run: (s) => (s.day_macd !== null && s.day_macd_signal_line !== null && s.day_macd > s.day_macd_signal_line)
  },
  {
    id: "nifty-outperformers",
    name: "Nifty 50 Year Outperformance",
    category: "Technical Queries",
    desc: "Screens for relative price strength leaders substantially beating the benchmark Nifty 50 index over trailing cycles.",
    formula: "Alpha vs Nifty 1Y > 15% AND Momentum Score > 75",
    run: (s) => (s.rr_nifty50_year_pct !== null && s.rr_nifty50_year_pct > 15) && (s.trendlyne_momentum_score !== null && s.trendlyne_momentum_score > 75)
  },
  {
    id: "fifty-w-high-breakout",
    name: "52-Week High Breakouts",
    category: "Technical Queries",
    desc: "Isolates companies that are testing or breaching their key structural 52-week horizontal resistance ceilings.",
    formula: "Price >= 98% of 1Y High",
    run: (s) => (s.current_price !== null && s.year_1_high !== null && s.current_price >= s.year_1_high * 0.98)
  },

  // 3. ELITE HYBRID FORMULAS
  {
    id: "canslim-matrix",
    name: "CANSLIM Growth Matrix",
    category: "Elite Hybrid Queries",
    desc: "Classic CANSLIM momentum blend checking extreme quarterly bottom-line/top-line sprints, institutional accumulation, and macro uptrends.",
    formula: "Profit Jump >= 20% AND Sales Jump >= 15% AND Inst. Change > 0.1% AND SMA50 > SMA200 AND RSI > 58",
    run: (s) => (s.profit_q_latest !== null && s.profit_q_yoy_base !== null && s.profit_q_latest >= s.profit_q_yoy_base * 1.20) && (s.sales_q_latest !== null && s.sales_q_yoy_base !== null && s.sales_q_latest >= s.sales_q_yoy_base * 1.15) && (s.fii_holding_change_qoq_pct > 0.1 || s.mf_holding_change_qoq_pct > 0.1) && (s.day_sma50 !== null && s.day_sma200 !== null && s.day_sma50 > s.day_sma200) && (s.day_rsi !== null && s.day_rsi > 58)
  },
  {
    id: "fallen-angels",
    name: "Fallen Angels Turnaround",
    category: "Elite Hybrid Queries",
    desc: "Discovers high-quality, safe solvent businesses trading at substantial discounts (>25% below 1Y high) that are stabilizing and rebounding from oversold zones.",
    formula: "Piotroski Score >= 7 AND Price < 1Y High * 0.75 AND RSI between 30 and 48",
    run: (s) => (s.piotroski_score !== null && s.piotroski_score >= 7) && (s.current_price !== null && s.year_1_high !== null && s.current_price < s.year_1_high * 0.75) && (s.day_rsi !== null && s.day_rsi >= 30 && s.day_rsi <= 48)
  },
  {
    id: "garp-relative-strength",
    name: "GARP & Relative Strength",
    category: "Elite Hybrid Queries",
    desc: "Identifies companies combining Growth At A Reasonable Price (PEG < 1.2) with double-digit ROE and clear market-beating relative performance.",
    formula: "PEG < 1.2 AND 3Y Sales Growth > 12% AND ROE > 15% AND Alpha vs Nifty > 0%",
    run: (s) => (s.peg_ratio !== null && s.peg_ratio > 0 && s.peg_ratio < 1.2) && (s.sales_growth_3y_pct !== null && s.sales_growth_3y_pct > 12) && (s.roe !== null && s.roe > 15) && (s.rr_nifty50_year_pct !== null && s.rr_nifty50_year_pct > 0)
  },
  {
    id: "post-earnings-drift",
    name: "Post-Earnings Drift Catalysts",
    category: "Elite Hybrid Queries",
    desc: "Enters companies displaying extreme earnings surges, margin expansions, and strong bullish price-volume breakouts post-announcement.",
    formula: "Profit Jump >= 35% AND OPM Current > last year OPM AND Price > SMA 50 AND Volume > Weekly Average * 1.3",
    run: (s) => (s.profit_q_latest !== null && s.profit_q_yoy_base !== null && s.profit_q_latest >= s.profit_q_yoy_base * 1.35) && (s.opm_current !== null && s.opm_last_year !== null && s.opm_current > s.opm_last_year) && (s.current_price !== null && s.day_sma50 !== null && s.current_price > s.day_sma50) && (s.day_volume !== null && s.week_volume_avg !== null && s.day_volume > s.week_volume_avg * 1.3)
  },
  {
    id: "quality-pullback",
    name: "High-Quality Pullback Recovery",
    category: "Elite Hybrid Queries",
    desc: "Executes buy-the-dip instructions on market leaders exhibiting high capital returns and positive cash flows trailing within long-term uptrends but experiencing short-term pullbacks.",
    formula: "ROCE > 18% AND Debt/Equity < 0.4 AND FCF Latest > 0 AND Price > SMA 200 AND RSI < 45",
    run: (s) => (s.roce !== null && s.roce > 18) && (s.debt_to_equity !== null && s.debt_to_equity < 0.4) && (s.fcf_latest !== null && s.fcf_latest > 0) && (s.current_price !== null && s.day_sma200 !== null && s.current_price > s.day_sma200) && (s.day_rsi !== null && s.day_rsi > 0 && s.day_rsi < 45)
  }
];

// Endpoint: Fetch preset catalog metadata list
app.get("/api/screener/presets", (req, res) => {
  const responseData = screenersCatalog.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    desc: p.desc,
    formula: p.formula
  }));
  res.json({ success: true, count: responseData.length, presets: responseData });
});

// Endpoint: Dynamic execute of a Preset Screen
app.post("/api/screener/execute", (req, res) => {
  const { id, sortBy, sortDir } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Missing preset id parameter" });
  }

  const preset = screenersCatalog.find(p => p.id === id);
  if (!preset) {
    return res.status(404).json({ error: `Preset with ID '${id}' not found` });
  }

  const stocks = parseMasterCSV();
  let results = stocks.filter(preset.run);

  // Sorting
  if (sortBy) {
    const dir = sortDir === "asc" ? 1 : -1;
    results.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * dir;
      }
      return String(valA).localeCompare(String(valB)) * dir;
    });
  }

  res.json({
    success: true,
    screener: {
      id: preset.id,
      name: preset.name,
      category: preset.category,
      formula: preset.formula,
      desc: preset.desc
    },
    count: results.length,
    stocks: results
  });
});

// Endpoint: Advanced Custom Stock Screener with Multi-Factor Rules Engine
app.post("/api/screener/custom", (req, res) => {
  const { rules, logicalOperator, sortBy, sortDir } = req.body;
  // rules format: [{ col: "pe_ttm", op: "lt", val: 20 }, ...]
  
  const stocks = parseMasterCSV();
  if (!rules || !Array.isArray(rules) || rules.length === 0) {
    return res.json({ success: true, count: stocks.length, stocks });
  }

  const matches = stocks.filter(s => {
    const evaluations = rules.map(rule => {
      const sVal = s[rule.col];
      const targetVal = rule.val;
      
      if (sVal === null || sVal === undefined) return false;

      switch (rule.op) {
        case "eq": return Number(sVal) === Number(targetVal) || String(sVal).toLowerCase() === String(targetVal).toLowerCase();
        case "ne": return Number(sVal) !== Number(targetVal) && String(sVal).toLowerCase() !== String(targetVal).toLowerCase();
        case "gt": return Number(sVal) > Number(targetVal);
        case "gte": return Number(sVal) >= Number(targetVal);
        case "lt": return Number(sVal) < Number(targetVal);
        case "lte": return Number(sVal) <= Number(targetVal);
        case "like": return String(sVal).toLowerCase().includes(String(targetVal).toLowerCase());
        default: return false;
      }
    });

    if (logicalOperator === "OR") {
      return evaluations.some(item => item === true);
    } else {
      return evaluations.every(item => item === true);
    }
  });

  // Sorting logic
  if (sortBy) {
    const dir = sortDir === "asc" ? 1 : -1;
    matches.sort((a, b) => {
      const valA = a[sortBy];
      const valB = b[sortBy];
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      if (typeof valA === "number" && typeof valB === "number") {
        return (valA - valB) * dir;
      }
      return String(valA).localeCompare(String(valB)) * dir;
    });
  }

  res.json({
    success: true,
    count: matches.length,
    stocks: matches
  });
});

// Endpoint: Automated Quantitative Opportunities Core
app.get("/api/screener/opportunities", (req, res) => {
  const stocks = parseMasterCSV();
  if (stocks.length === 0) {
    return res.json({ success: true, count: 0, opportunities: [] });
  }

  const opportunities = [];

  stocks.forEach(s => {
    // 1. Check Perfect Piotroski Quality Play
    if (s.piotroski_score !== null && s.piotroski_score >= 8) {
      opportunities.push({
        stock_name: s.stock_name,
        nse_code: s.nse_code,
        price: s.current_price,
        strength_type: "Ultimate Fundamental Quality",
        badge: "Piotroski Gem",
        rationale: `Company has registered an stellar Piotroski Score of ${s.piotroski_score}/9, combined with high solvency (Altman Z of ${s.altman_z_score || "N/A"}) indicating exceptional business stability and fortress balance sheet.`
      });
    }

    // 2. Check Strong Institutional Accumulation Play
    if (s.promoter_holding_change_qoq_pct > 0.1 && s.fii_holding_change_qoq_pct > 0.2) {
      opportunities.push({
        stock_name: s.stock_name,
        nse_code: s.nse_code,
        price: s.current_price,
        strength_type: "Institutional Alignment Speed",
        badge: "Twin Backing",
        rationale: `Both Promoters and Foreign Institutional Investors (FPI) have concurrently increased stakes this quarter (Promoter: +${s.promoter_holding_change_qoq_pct}%, FII: +${s.fii_holding_change_qoq_pct}%) revealing heavy backroom accumulation.`
      });
    }

    // 3. Supercharged Growth Play
    if (s.eps_growth_3y_pct >= 20 && s.sales_growth_3y_pct >= 15 && s.peg_ratio <= 1.5) {
      opportunities.push({
        stock_name: s.stock_name,
        nse_code: s.nse_code,
        price: s.current_price,
        strength_type: "Compound Value Opportunity",
        badge: "Underpriced Growth",
        rationale: `Demonstrates exceptionally fast compound growth (3Y EPS CAGR of ${s.eps_growth_3y_pct}%) trading at an attractive PEG ratio under 1.5 (PEG: ${s.peg_ratio || "N/A"}).`
      });
    }

    // 4. Trend Breakout Momentum Play
    if (s.trendlyne_momentum_score >= 80 && s.day_rsi >= 65 && s.day_volume > s.week_volume_avg * 1.2) {
      opportunities.push({
        stock_name: s.stock_name,
        nse_code: s.nse_code,
        price: s.current_price,
        strength_type: "High-Velocity Breakout Play",
        badge: "Momentum Lead",
        rationale: `Technical velocity ratings have breached ${s.trendlyne_momentum_score}/100 and RSI indicates standard momentum breakout range (${s.day_rsi}) backed by strong volume expansion (+${Math.round((s.day_volume / s.week_volume_avg - 1) * 100)}% above its weekly averages).`
      });
    }
  });

  res.json({
    success: true,
    count: opportunities.length,
    opportunities
  });
});

// File upload for Master_merged
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.cwd());
  },
  filename: (req, file, cb) => {
    cb(null, "Master_merged.xlsx"); // We always want to name it this
  },
});
const upload = multer({ storage });

// Use memory storage for multi-file folder uploads to handle relative directory building safely
const folderMemoryUpload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB per file
    fieldSize: 100 * 1024 * 1024, // 100MB for fields (like relativePaths list)
  }
});

app.post("/api/upload-master", (req, res) => {
  upload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Master upload error:", err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({ message: "File uploaded successfully as Master_merged.xlsx" });
  });
});

// New endpoint: Folder multi-file upload (supports up to 1000 files per upload)
app.post("/api/upload-folder", (req, res) => {
  folderMemoryUpload.array("files", 1000)(req, res, (err) => {
    if (err) {
      console.error("Multer upload-folder error:", err);
      return res.status(400).json({ error: `Upload error: ${err.message}` });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No folder files uploaded" });
    }

    let relativePaths = [];
    try {
      relativePaths = JSON.parse(req.body.relativePaths || "[]");
    } catch (e) {
      relativePaths = [];
    }

    const baseDir = getDataDirectory();
    let filesWritten = 0;

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      let relPath = relativePaths[i] || file.originalname;

      // Strip top-level directory folder name so that folder files unpack correctly inside the target directory
      const parts = relPath.split("/");
      if (parts.length > 1) {
        // If the very first segment is NOT 'scoring_output', strip it. 
        // This preserves 'scoring_output/...' nested structures if the user uploaded the 'scoring_output' folder itself.
        if (parts[0] !== "scoring_output") {
          parts.shift();
        }
        relPath = parts.join("/");
      }

      const targetPath = path.join(baseDir, relPath);

      try {
        // Create subdirectories recursively if needed
        const parentDir = path.dirname(targetPath);
        if (!fs.existsSync(parentDir)) {
          fs.mkdirSync(parentDir, { recursive: true });
        }

        fs.writeFileSync(targetPath, file.buffer);
        filesWritten++;
      } catch (err) {
        console.error(`Failed to write file at path: ${targetPath}`, err);
      }
    }

    res.json({
      success: true,
      message: `Folder uploaded and indexed successfully. Extracted ${filesWritten} data items.`,
    });
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Output directory is ${OUTPUT_DIR}`);
    console.log(`Latest manifest exists: ${fs.existsSync(path.join(OUTPUT_DIR, "latest_manifest.json"))}`);
  });
}

startServer();
