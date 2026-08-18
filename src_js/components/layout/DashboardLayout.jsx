import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Folder,
  Server,
  HardDrive,
} from "lucide-react";
import { loadStockData } from "../../store/stockStore";
import { useDispatch } from "react-redux";
import { fetchSettings, updateSettings } from "../../api/stockApi";

export const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [folderFiles, setFolderFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);

  // Settings Configuration states
  const [locationOpen, setLocationOpen] = useState(false);
  const [locationPath, setLocationPath] = useState("");
  const [locationMode, setLocationMode] = useState("local");
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(null);
  const [settingsError, setSettingsError] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);

  // Fetch settings on load and when open
  const loadLocationSettings = async () => {
    setSettingsLoading(true);
    setSettingsError(null);
    try {
      const data = await fetchSettings();
      setDiagnostics(data);
      setLocationPath(data.dataLocation || "");
      setLocationMode(data.dataLocation ? "custom" : "local");
    } catch (e) {
      console.error("Error loading location settings", e);
      setSettingsError(
        "Failed to fetch data location diagnostics from backend.",
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    loadLocationSettings();
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const traverseFileTree = (entry, pathStr = "") => {
    return new Promise((resolve) => {
      if (entry.isFile) {
        entry.file((file) => {
          const customFile = new File([file], file.name, { type: file.type });
          Object.defineProperty(customFile, "webkitRelativePath", {
            value: pathStr + entry.name,
            writable: false,
          });
          resolve([customFile]);
        });
      } else if (entry.isDirectory) {
        const dirReader = entry.createReader();
        const readAllEntries = () => {
          return new Promise((resolveEntries) => {
            const allEntries = [];
            const read = () => {
              dirReader.readEntries((entries) => {
                if (entries.length === 0) {
                  resolveEntries(allEntries);
                } else {
                  allEntries.push(...entries);
                  read();
                }
              });
            };
            read();
          });
        };

        readAllEntries().then(async (entries) => {
          const promises = entries.map((e) =>
            traverseFileTree(e, pathStr + entry.name + "/"),
          );
          const results = await Promise.all(promises);
          resolve(results.flat());
        });
      } else {
        resolve([]);
      }
    });
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);
    if (e.dataTransfer.items) {
      const queue = [];
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const item = e.dataTransfer.items[i];
        if (item.kind === "file") {
          const entry = item.webkitGetAsEntry();
          if (entry) {
            queue.push(traverseFileTree(entry));
          }
        }
      }
      if (queue.length > 0) {
        setUploading(true);
        try {
          const results = await Promise.all(queue);
          const flattened = results.flat();
          setFolderFiles(flattened);
        } catch (err) {
          console.error("Error parsing dropped folder items", err);
          setErrorMsg(
            "Could not parse folders. Try selecting using SELECT FOLDER.",
          );
        } finally {
          setUploading(false);
        }
      }
    } else if (e.dataTransfer.files) {
      setFolderFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFolderChange = (e) => {
    setSuccessMsg(null);
    setErrorMsg(null);
    if (e.target.files && e.target.files.length > 0) {
      setFolderFiles(Array.from(e.target.files));
    }
  };

  const handleUploadSubmit = async () => {
    if (folderFiles.length === 0) return;
    setUploading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    setUploadProgress("Preparing upload...");

    try {
      // Group files into small batches based on cumulative size and count to prevent 413 Request Entity Too Large
      const batches = [];
      let currentBatch = [];
      let currentBatchSize = 0;
      const MAX_BATCH_SIZE_BYTES = 3 * 1024 * 1024; // 3MB limit to be highly safe
      const MAX_BATCH_FILE_COUNT = 6; // Limit to 6 files per batch to reduce payload size

      for (const file of folderFiles) {
        if (
          currentBatch.length > 0 &&
          (currentBatchSize + file.size > MAX_BATCH_SIZE_BYTES ||
            currentBatch.length >= MAX_BATCH_FILE_COUNT)
        ) {
          batches.push(currentBatch);
          currentBatch = [];
          currentBatchSize = 0;
        }
        currentBatch.push(file);
        currentBatchSize += file.size;
      }
      if (currentBatch.length > 0) {
        batches.push(currentBatch);
      }

      let filesUploadedCount = 0;
      const totalBatches = batches.length;

      for (let bIdx = 0; bIdx < totalBatches; bIdx++) {
        const batch = batches[bIdx];
        const percent = Math.round((bIdx / totalBatches) * 100);
        setUploadProgress(
          `Uploading batch ${bIdx + 1} of ${totalBatches} (${percent}%) - ${batch.length} files`,
        );

        const formData = new FormData();
        const relativePaths = [];

        batch.forEach((file) => {
          formData.append("files", file);
          relativePaths.push(file.webkitRelativePath || file.name);
        });

        formData.append("relativePaths", JSON.stringify(relativePaths));

        const response = await fetch("/api/upload-folder", {
          method: "POST",
          body: formData,
        });

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          let errorMsgBody = `HTTP ${response.status}: Server did not return JSON.`;
          if (text.includes("<title>")) {
            const match = text.match(/<title>([\s\S]*?)<\/title>/i);
            if (match && match[1]) {
              errorMsgBody = `Server Error: ${match[1].trim()}`;
            }
          } else if (text.trim().length > 0 && text.length < 200) {
            errorMsgBody = text.trim();
          }
          throw new Error(errorMsgBody);
        }

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Batch folder upload ingestion failed");
        }
        filesUploadedCount += batch.length;
      }

      setUploadProgress(null);
      setSuccessMsg(
        `Stock Data folder uploaded and indexed successfully. Extracted ${filesUploadedCount} files.`,
      );
      setFolderFiles([]);
      // Reload settings diagnostics and stocks database
      loadLocationSettings();
      dispatch(loadStockData());
    } catch (err) {
      console.error(err);
      setUploadProgress(null);
      setErrorMsg(err?.message || "Folder ingestion failed. Check logs.");
    } finally {
      setUploading(false);
    }
  };

  const handleSettingsSubmit = async () => {
    setSettingsLoading(true);
    setSettingsSuccess(null);
    setSettingsError(null);
    try {
      const activePath = locationMode === "local" ? "" : locationPath;
      const data = await updateSettings(activePath);
      setDiagnostics(data);
      const customMsg =
        data.diagnostics?.message ||
        "Data Location configured and validated successfully!";
      setSettingsSuccess(customMsg);
      // Reload stocks database with the new source files instantly!
      dispatch(loadStockData());
    } catch (err) {
      console.error(err);
      setSettingsError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to set location path.",
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dash-bg text-dash-ink relative">
      {/* Institutional Ambient Background Glow Fields */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00c2ff]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[#10b981]/3 blur-[140px] pointer-events-none z-0" />

      {/* Dynamic Left Sidebar Navigation Pane */}
      <Sidebar
        onOpenUpload={() => setUploadOpen(true)}
        onOpenLocation={() => {
          loadLocationSettings();
          setLocationOpen(true);
        }}
      />

      {/* Main Container Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-10">
        {/* Dynamic Top Navbar Indices Panel */}
        <Navbar />

        {/* Dynamic Scrollable Main View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>

      {/* Upload Stock Data Folder Modal Drawer */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4">
          <div className="w-full max-w-md glass-premium rounded-2xl shadow-2xl p-6 relative">
            {/* Close trigger button */}
            <button
              onClick={() => {
                setUploadOpen(false);
                setFolderFiles([]);
                setSuccessMsg(null);
                setErrorMsg(null);
              }}
              className="absolute top-4 right-4 text-dash-muted hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Title */}
            <div className="mb-5">
              <h3 className="text-sm font-black tracking-wider uppercase font-display text-white">
                Upload Stock Data Folder
              </h3>
              <p className="text-xs text-dash-muted mt-1 leading-relaxed">
                Upload your stock data directory (containing files like
                `Master_merged.csv` or a `scoring_output` subfolder) directly
                into the model directory.
              </p>
            </div>

            {/* Ingest Status Displays */}
            {successMsg && (
              <div className="mb-4 p-3 bg-dash-success/10 border border-dash-success/20 text-dash-success text-xs rounded-xl flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{successMsg}</p>
              </div>
            )}

            {errorMsg && (
              <div className="mb-4 p-3 bg-dash-danger/10 border border-dash-danger/20 text-dash-danger text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            {uploadProgress && (
              <div className="mb-4 p-3 bg-dash-primary/10 border border-dash-primary/20 text-[#00c2ff] text-xs rounded-xl flex items-center gap-2">
                <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
                <p className="font-mono">{uploadProgress}</p>
              </div>
            )}

            {/* Drag & Drop Frame */}
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-dash-line hover:border-dash-primary/40 transition-colors p-8 rounded-xl flex flex-col items-center justify-center text-center space-y-3 cursor-pointer bg-dash-card"
            >
              <div className="p-3 bg-dash-primary/10 rounded-full border border-dash-primary/20">
                <Upload className="w-6 h-6 text-dash-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Drag your stock data folder here
                </p>
                <p className="text-[10px] text-dash-muted mt-1">
                  Accepts folders containing CSV or JSON files
                </p>
              </div>
              <input
                type="file"
                id="folder-ingestor"
                {...{
                  webkitdirectory: "",
                  directory: "",
                  multiple: true,
                }}
                onChange={handleFolderChange}
                className="hidden"
              />

              <button
                onClick={() =>
                  document.getElementById("folder-ingestor")?.click()
                }
                className="py-1.5 px-4 bg-dash-card border border-dash-line text-dash-ink hover:text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer"
              >
                SELECT FOLDER
              </button>
            </div>

            {/* Selected Files Count & List */}
            {folderFiles.length > 0 && (
              <div className="mt-4 p-3 bg-dash-card border border-dash-line rounded-lg flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    Folder:{" "}
                    {folderFiles[0].webkitRelativePath?.split("/")[0] ||
                      "Selected Content"}
                  </p>
                  <p className="text-[10px] text-dash-muted font-mono">
                    {folderFiles.length} files to upload
                  </p>
                </div>
                <button
                  onClick={() => setFolderFiles([])}
                  className="text-dash-danger text-xs font-bold uppercase tracking-wider hover:underline font-mono"
                >
                  REMOVE
                </button>
              </div>
            )}

            {/* Submit Trigger Actions */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-dash-line pt-4">
              <button
                onClick={() => {
                  setUploadOpen(false);
                  setFolderFiles([]);
                  setSuccessMsg(null);
                  setErrorMsg(null);
                }}
                className="py-2 px-4 text-dash-ink hover:text-white text-[10px] font-black uppercase tracking-widest cursor-pointer"
              >
                BACK
              </button>
              <button
                disabled={folderFiles.length === 0 || uploading}
                onClick={handleUploadSubmit}
                className="py-2 px-5 bg-dash-primary hover:bg-dash-primary-dark disabled:opacity-40 text-dash-bg font-black text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                {uploading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "UPLOAD FOLDER"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Configure Data Location Modal */}
      {locationOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4">
          <div className="w-full max-w-lg glass-premium rounded-2xl shadow-2xl p-6 relative select-none">
            {/* Close button */}
            <button
              onClick={() => {
                setLocationOpen(false);
                setSettingsSuccess(null);
                setSettingsError(null);
              }}
              className="absolute top-4 right-4 text-dash-muted hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Title */}
            <div className="mb-4">
              <h3 className="text-sm font-black tracking-wider uppercase font-display text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-dash-primary" />
                Configure Stock Data Location
              </h3>
              <p className="text-xs text-dash-muted mt-1 leading-relaxed">
                Connect your analytical application directly to your local
                computer disk base or Google Drive folder mapping.
              </p>
            </div>

            {/* Success and Error messages */}
            {settingsSuccess && (
              <div className="mb-4 p-3 bg-dash-success/10 border border-dash-success/20 text-dash-success text-xs rounded-xl flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{settingsSuccess}</p>
              </div>
            )}

            {settingsError && (
              <div className="mb-4 p-3 bg-dash-danger/10 border border-dash-danger/20 text-dash-danger text-xs rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{settingsError}</p>
              </div>
            )}

            {/* Selector Option Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                type="button"
                onClick={() => setLocationMode("local")}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center ${
                  locationMode === "local"
                    ? "border-dash-primary bg-dash-primary/10 text-white"
                    : "border-white/[0.04] bg-white/[0.01] text-dash-muted hover:border-white/[0.1] hover:text-white"
                }`}
              >
                <Server className="w-5 h-5" />
                <div className="text-[10px] font-black uppercase tracking-wider font-mono">
                  Default Workspace
                </div>
                <div className="text-[9px] text-dash-muted leading-tight">
                  Read files from standard build repository
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLocationMode("custom")}
                className={`p-3 border rounded-xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer text-center ${
                  locationMode === "custom"
                    ? "border-dash-primary bg-dash-primary/10 text-white"
                    : "border-white/[0.04] bg-white/[0.01] text-dash-muted hover:border-white/[0.1] hover:text-white"
                }`}
              >
                <Folder className="w-5 h-5 text-[#fbbf24]" />
                <div className="text-[10px] font-black uppercase tracking-wider font-mono">
                  Google Drive / Disk
                </div>
                <div className="text-[9px] text-dash-muted leading-tight">
                  Connect path on Google Drive or partition
                </div>
              </button>
            </div>

            {/* Custom Input Path field */}
            {locationMode === "custom" && (
              <div className="space-y-2 mb-4">
                <label className="text-[9px] font-black tracking-widest font-mono uppercase text-dash-muted">
                  Custom Directory Path Location:
                </label>
                <input
                  type="text"
                  value={locationPath}
                  onChange={(e) => setLocationPath(e.target.value)}
                  placeholder="e.g. H:\My Drive\Master_database"
                  className="w-full text-xs font-medium px-3 py-2 bg-dash-card border border-dash-line rounded-lg text-white font-mono focus:outline-none focus:border-dash-primary"
                />

                <div className="p-2.5 bg-dash-bg/45 border border-dash-line rounded text-[9.5px] leading-normal text-dash-muted">
                  <span className="font-bold text-white block mb-0.5">
                    • Mapping Instruction Guides
                  </span>
                  Windows Mapped Drive:{" "}
                  <code className="text-[#00c2ff]">
                    G:\My Drive\Master_database
                  </code>{" "}
                  or{" "}
                  <code className="text-[#00c2ff]">
                    H:\My Drive\Master_database
                  </code>
                  <br />
                  MacOS Volume Path:{" "}
                  <code className="text-[#00c2ff]">
                    /Volumes/GoogleDrive/My Drive/Master_database
                  </code>
                </div>
              </div>
            )}

            {/* Connection Diagnostics Card */}
            {diagnostics && (
              <div className="bg-dash-bg/60 border border-dash-line p-4 rounded-xl space-y-2 font-mono text-[10px] mb-4">
                <span className="text-[9px] text-dash-primary font-black uppercase block border-b border-dash-line pb-1.5">
                  📁 Connection Diagnostics Status
                </span>
                <div className="grid grid-cols-2 gap-y-1.5 gap-x-4">
                  <div className="text-dash-muted">Resolved base dir:</div>
                  <div
                    className="text-white truncate text-right font-bold"
                    title={diagnostics.resolvedBaseDir}
                  >
                    {diagnostics.resolvedBaseDir || "/"}
                  </div>

                  <div className="text-dash-muted">Latest scoring run:</div>
                  <div className="text-[#fbbf24] text-right font-black">
                    {diagnostics.latestFolder !== "None"
                      ? `📂 ${diagnostics.latestFolder}`
                      : "❌ No latest subfolder"}
                  </div>

                  <div className="text-dash-muted">Master_merged.csv:</div>
                  <div className="text-right">
                    {diagnostics.masterMergedCSVExists ? (
                      <span className="text-dash-success font-bold">
                        ✅ DETECTED
                      </span>
                    ) : (
                      <span className="text-dash-danger font-bold">
                        ❌ MISSING
                      </span>
                    )}
                  </div>

                  <div className="text-dash-muted">Master_merged.xlsx:</div>
                  <div className="text-right">
                    {diagnostics.masterMergedXLSXExists ? (
                      <span className="text-dash-success font-bold">
                        ✅ DETECTED
                      </span>
                    ) : (
                      <span className="text-dash-danger font-bold">
                        ❌ MISSING
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Submit Action Triggers */}
            <div className="flex items-center justify-end gap-3 border-t border-dash-line pt-4">
              <button
                type="button"
                onClick={() => {
                  setLocationOpen(false);
                  setSettingsSuccess(null);
                  setSettingsError(null);
                }}
                className="py-2 px-4 text-dash-ink hover:text-white text-[10px] font-black uppercase tracking-widest cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
                disabled={settingsLoading}
                onClick={handleSettingsSubmit}
                className="py-2 px-5 bg-dash-primary hover:bg-dash-primary-dark text-dash-bg font-black text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                {settingsLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  "TEST & ACTIVATE"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
