import axios from "axios";
import Papa from "papaparse";

const API = axios.create({
  baseURL: "/api",
});

export const fetchManifest = async () => {
  const response = await API.get("/manifest");
  return response.data;
};

export const fetchCSV = async (filename) => {
  const response = await API.get(`/data/${filename}`, {
    responseType: "text",
  });
  const text = response.data;
  if (text.startsWith("<!doctype") || text.startsWith("<html")) {
    console.error(`Received HTML for CSV ${filename}:`, text.substring(0, 100));
    throw new Error(`Received HTML instead of CSV for ${filename}`);
  }

  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        const typedDataset = results.data.map((item) => ({
          ...item,
          current_price: parseFloat(item.current_price || 0),
          market_capitalization: parseFloat(item.market_capitalization || 0),
          trendlyne_momentum_score: parseFloat(
            item.trendlyne_momentum_score || 50,
          ),
          trendlyne_durability_score: parseFloat(
            item.trendlyne_durability_score || 50,
          ),
          trendlyne_valuation_score: parseFloat(
            item.trendlyne_valuation_score || 50,
          ),
          day_rsi: parseFloat(item.day_rsi || 50),
          day_adx: parseFloat(item.day_adx || 20),
          day_macd: parseFloat(item.day_macd || 0),
          day_macd_signal_line: parseFloat(item.day_macd_signal_line || 0),
          day_volume: parseFloat(item.day_volume || 1000),
          week_volume_avg: parseFloat(item.week_volume_avg || 1000),
          month_volume_avg: parseFloat(item.month_volume_avg || 1000),
          pe_ttm: parseFloat(item.pe_ttm || 20),
          piotroski_score: parseInt(item.piotroski_score || 6),
          debt_to_equity: parseFloat(item.debt_to_equity || 0.1),
          roce: parseFloat(item.roce || 12),
          roe: parseFloat(item.roe || 12),
        }));
        resolve(typedDataset);
      },
      error: (error) => reject(error),
    });
  });
};

export const runPipelineCmd = async () => {
  const response = await API.post("/run-pipeline");
  return response.data;
};

export const generateReport = async (stockData, focus = "Balanced") => {
  const response = await API.post("/generate-report", { stockData, focus });
  return response.data;
};

export const uploadMaster = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await API.post("/upload-master", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const fetchSettings = async () => {
  const response = await API.get("/settings");
  return response.data;
};

export const updateSettings = async (dataLocation) => {
  const response = await API.post("/settings", { dataLocation });
  return response.data;
};

export const fetchScannedReports = async () => {
  const response = await API.get("/reports");
  return response.data;
};

export default API;
