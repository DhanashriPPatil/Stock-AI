import Papa from "papaparse";

export const fetchManifest = async () => {
  const response = await fetch("./api/manifest");
  if (!response.ok) {
    const text = await response.text();
    console.error("Manifest fetch failed:", text);
    throw new Error(`Failed to fetch manifest: ${response.status}`);
  }
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Manifest received non-JSON response:", text);
    throw new Error("Manifest received non-JSON response");
  }
  return response.json();
};

export const fetchCSV = async (filename) => {
  const response = await fetch(`./api/data/${filename}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.status}`);
  }
  const text = await response.text();
  if (text.startsWith("<!doctype") || text.startsWith("<html")) {
    console.error(`Received HTML for CSV ${filename}:`, text.substring(0, 100));
    throw new Error(`Received HTML instead of CSV for ${filename}`);
  }
  return new Promise((resolve, reject) => {
    Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => resolve(results.data),
      error: (error) => reject(error),
    });
  });
};

export const runPipeline = async () => {
  const response = await fetch("./api/run-pipeline", { method: "POST" });
  return response.json();
};

export const generateReport = async (stockData, focus = "Balanced") => {
  const response = await fetch("./api/generate-report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stockData, focus }),
  });
  if (!response.ok) throw new Error("Failed to generate report");
  return response.json();
};

export const uploadMaster = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch("./api/upload-master", {
    method: "POST",
    body: formData,
  });
  return response.json();
};
