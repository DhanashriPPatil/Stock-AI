import React, { useState, useEffect } from "react";
import {
  Folder,
  FileText,
  ExternalLink,
  RefreshCw,
  Eye,
  Sparkles,
  AlertCircle,
  HardDrive,
  X,
} from "lucide-react";
import { fetchScannedReports, fetchSettings } from "../../api/stockApi";
import { motion, AnimatePresence } from "motion/react";

export const DiscoveredReportsPanel = ({ pageKeyword }) => {
  const [reports, setReports] = useState([]);
  const [config, setConfig] = useState(null);
  const [latestFolder, setLatestFolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Viewer state for text/markdown files
  const [viewingFile, setViewingFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [contentLoading, setContentLoading] = useState(false);

  const loadReports = async () => {
    setLoading(true);
    setError(null);
    try {
      const [settingsData, reportsData] = await Promise.all([
        fetchSettings(),
        fetchScannedReports(),
      ]);
      setConfig(settingsData);
      setReports(reportsData.files || []);
      setLatestFolder(reportsData.latestFolder || "");
    } catch (e) {
      console.error("Error loaded settings", e);
      setError("Failed to query files directory from configured location.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleOpenFile = async (file) => {
    // If it's a PDF, open in new tab
    if (file.name.toLowerCase().endsWith(".pdf")) {
      const url = `/api/reports/view/${file.relativePath}`;
      window.open(url, "_blank");
      return;
    }

    // Otherwise load text content
    setViewingFile(file);
    setContentLoading(true);
    setFileContent("");
    try {
      const response = await fetch(`/api/reports/view/${file.relativePath}`);
      if (!response.ok) throw new Error("Could not parse file from disk");
      const text = await response.text();
      setFileContent(text);
    } catch (err) {
      setFileContent(
        `Error loading report content: ${err?.message || "File might be binary or path is corrupted."}`,
      );
    } finally {
      setContentLoading(false);
    }
  };

  // Group reports by their parent subfolders for easy structured navigation
  const groupedReports = {};
  reports.forEach((file) => {
    const parent = file.folder || "Reports Summary";
    if (!groupedReports[parent]) {
      groupedReports[parent] = [];
    }
    groupedReports[parent].push(file);
  });

  return (
    <div className="glass-premium rounded-2xl p-5 border border-white/[0.04] space-y-4">
      {/* Header section with connection status */}
      <div className="flex justify-between items-center border-b border-white/[0.06] pb-3 flex-wrap gap-2">
        <div className="space-y-1">
          <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider font-extrabold bg-[#fbbf24]/10 text-[#fbbf24] uppercase">
            {config?.dataLocation
              ? "☁️ GOOGLE DRIVE CONNECTED"
              : "📂 LOCAL DISK WORKSPACE"}
          </span>
          <h4 className="text-xs font-black uppercase tracking-wider font-display text-white flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-dash-primary" />
            DISCOVERED REPORTS & SHORTLIST DIAGNOSTICS
          </h4>
          <p className="text-[10px] text-dash-muted">
            Current Active Scoring Run:{" "}
            <strong className="text-[#00c2ff]">{latestFolder}</strong>
          </p>
        </div>

        <button
          onClick={loadReports}
          disabled={loading}
          className="p-1 px-2.5 rounded bg-white/[0.02] border border-white/[0.08] text-dash-muted hover:text-white hover:border-white/15 transition-all text-[10px] font-mono flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
        >
          <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
          RESCAN
        </button>
      </div>

      {/* Directory structure scanner lists */}
      {loading ? (
        <div className="py-8 flex flex-col items-center justify-center space-y-2 text-dash-muted">
          <RefreshCw className="w-6 h-6 animate-spin text-dash-primary" />
          <span className="text-[10px] font-mono uppercase tracking-widest">
            Scanning local folders...
          </span>
        </div>
      ) : error ? (
        <div className="p-3 bg-dash-danger/10 border border-dash-danger/20 text-dash-danger text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <p>{error}</p>
        </div>
      ) : Object.keys(groupedReports).length === 0 ? (
        <div className="p-4 bg-dash-card/45 border border-dash-line rounded-xl text-center space-y-2 text-dash-muted select-none">
          <HardDrive className="w-8 h-8 mx-auto text-dash-muted/40" />
          <p className="text-xs font-medium">
            No pdf/text analytical report outputs detected in this scoring run.
          </p>
          <p className="text-[10px] max-w-sm mx-auto leading-normal">
            Ensure Python model runs or pipeline scoring saves reports to{" "}
            <code className="text-[#00c2ff]">
              scoring_output/&lt;date&gt;/deepseek_reports/pdf/
            </code>{" "}
            under the active configured location.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupedReports).map(([folderName, files]) => (
            <div
              key={folderName}
              className="bg-dash-bg/30 border border-white/[0.02] rounded-xl p-3.5 space-y-2.5"
            >
              <div className="flex items-center gap-1.5 border-b border-white/[0.04] pb-2">
                <Folder className="w-4 h-4 text-[#fbbf24] shrink-0" />
                <span className="text-[10px] font-black uppercase text-white tracking-wider font-mono truncate">
                  {folderName.replace(/_/g, " ")}
                </span>
                <span className="text-[8px] font-mono px-1.5 py-0.2 bg-white/5 rounded text-dash-muted ml-auto shrink-0">
                  {files.length} Nodes
                </span>
              </div>

              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {files.map((file, i) => {
                  const isPdf = file.name.toLowerCase().endsWith(".pdf");
                  return (
                    <button
                      key={i}
                      onClick={() => handleOpenFile(file)}
                      className="w-full text-left p-2 rounded-lg bg-white/[0.01] hover:bg-white/[0.04] border border-transparent hover:border-white/5 cursor-pointer flex items-center gap-2 group transition-all"
                    >
                      <FileText
                        className={`w-3.5 h-3.5 shrink-0 ${isPdf ? "text-red-400" : "text-cyan-400"}`}
                      />
                      <div className="min-w-0 flex-1 leading-tight">
                        <span className="text-[10.5px] font-bold text-dash-ink group-hover:text-white truncate block">
                          {file.name}
                        </span>
                        <span className="text-[8.5px] text-dash-muted font-mono block mt-0.5">
                          {(file.size / 1024).toFixed(1)} KB •{" "}
                          {isPdf ? "PDF file" : "Doc file"}
                        </span>
                      </div>

                      {isPdf ? (
                        <ExternalLink className="w-3.5 h-3.5 text-dash-muted group-hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 text-dash-muted group-hover:text-white shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dynamic Text / Report Content Viewer Modal overlay */}
      <AnimatePresence>
        {viewingFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl h-[85vh] glass-premium rounded-2xl p-6 flex flex-col relative"
            >
              <button
                onClick={() => setViewingFile(null)}
                className="absolute top-4 right-4 text-dash-muted hover:text-white transition-colors cursor-pointer p-1.5 rounded-lg bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="border-b border-white/[0.06] pb-3 mb-4 space-y-1 pr-12">
                <span className="text-[8px] font-mono px-2 py-0.5 rounded bg-dash-primary/10 border border-dash-primary/20 text-dash-primary font-black uppercase">
                  ACTIVE RUN REPORT DISCOVERY
                </span>
                <h3 className="text-sm font-black uppercase text-white font-mono flex items-center gap-2">
                  <FileText className="w-4 h-4 text-dash-primary" />
                  {viewingFile.name}
                </h3>
                <p className="text-[10px] text-dash-muted">
                  Scored root path:{" "}
                  <code className="text-[#00c2ff] font-mono">
                    {viewingFile.relativePath}
                  </code>
                </p>
              </div>

              {/* Loader or Content Scrollbox */}
              <div className="flex-1 overflow-y-auto bg-slate-950/80 border border-white/[0.03] rounded-xl p-5 font-sans leading-relaxed select-text text-justify text-xs">
                {contentLoading ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-2 text-dash-muted">
                    <RefreshCw className="w-6 h-6 animate-spin text-dash-primary" />
                    <span className="text-[10px] font-mono uppercase tracking-widest">
                      Parsing content...
                    </span>
                  </div>
                ) : (
                  <pre className="font-sans text-dash-ink text-xs whitespace-pre-wrap leading-relaxed text-justify">
                    {fileContent ||
                      "This analyzed report file appears to be completely empty."}
                  </pre>
                )}
              </div>

              <div className="border-t border-white/[0.06] pt-3.5 mt-4 flex justify-between items-center">
                <span className="text-[9px] font-mono text-dash-muted uppercase">
                  Press ESC or click close to return to the dashboard view
                </span>
                <button
                  onClick={() => setViewingFile(null)}
                  className="py-1.5 px-4 bg-dash-primary hover:bg-dash-primary-dark text-dash-bg font-black font-mono text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
