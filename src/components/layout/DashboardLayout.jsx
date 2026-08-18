import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import StockTicker from "../dashboard/StockTicker";
import {
  X,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  FileText,
  Sparkles,
  Menu,
  LayoutDashboard,
  Building2,
  Star,
} from "lucide-react";
import { loadStockData } from "../../store/stockStore";
import { useDispatch, useSelector } from "react-redux";
import { fetchPdfFiles, processPdfFolder } from "../../api/stockApi";

export const DashboardLayout = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const watchlist = useSelector((state) => state.stocks.watchlist) || [];

  // Sidebar toggle state for responsive mobile view
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // PDF AI Ingestor states
  const [pdfIngestorOpen, setPdfIngestorOpen] = useState(false);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [processingPdfs, setProcessingPdfs] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(null);
  const [pdfError, setPdfError] = useState(null);

  const loadPdfFiles = async () => {
    try {
      const data = await fetchPdfFiles();
      setPdfFiles(data.files || []);
    } catch (e) {
      console.error("Error loading PDF files:", e);
    }
  };

  const handleProcessPdfs = async () => {
    setProcessingPdfs(true);
    setPdfSuccess(null);
    setPdfError(null);
    try {
      const resp = await processPdfFolder();
      if (resp.success) {
        setPdfSuccess(
          resp.message +
            (resp.updatedStocksCount > 0
              ? ` Merged ${resp.updatedStocksCount} newly extracted stocks into your datastore!`
              : " Dynamic Intel Reports populated!")
        );
        loadPdfFiles();
        dispatch(loadStockData());
      } else {
        setPdfError(resp.message || "Failed to process PDFs in the code location.");
      }
    } catch (e) {
      console.error("Error processing PDFs:", e);
      setPdfError(
        e?.response?.data?.error ||
          e?.message ||
          "Failed parsing docs in PDF directory."
      );
    } finally {
      setProcessingPdfs(false);
    }
  };

  useEffect(() => {
    if (pdfIngestorOpen) {
      loadPdfFiles();
    }
  }, [pdfIngestorOpen]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-dash-bg text-dash-ink relative">
      {/* Institutional Ambient Background Glow Fields */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#00c2ff]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[60%] h-[60%] rounded-full bg-[#10b981]/3 blur-[140px] pointer-events-none z-0" />

      {/* Dynamic Left Sidebar Navigation Pane */}
      <Sidebar
        onOpenPdfIngestor={() => setPdfIngestorOpen(true)}
        sidebarOpen={sidebarOpen}
        onCloseSidebar={() => setSidebarOpen(false)}
      />

      {/* Main Container Content */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative z-10">
        {/* Dynamic Top Navbar Indices Panel */}
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Real-Time Continuous Asset Stream */}
        <StockTicker />

        {/* Dynamic Scrollable Main View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 pb-24 lg:pb-8">{children}</main>
      </div>

      {/* Mobile/Tablet Bottom Navigation Action Bar */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40 flex justify-center pointer-events-none">
        <div className="bg-dash-card/90 backdrop-blur-xl border border-dash-line py-2.5 px-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.6)] flex items-center justify-around pointer-events-auto max-w-md w-full">
          {/* Menu Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex flex-col items-center gap-1 p-1 bg-transparent hover:text-dash-primary text-dash-muted transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5 text-dash-muted" />
            <span className="text-[9px] font-mono font-medium">Menu</span>
          </button>

          {/* Dashboard */}
          <Link
            to="/"
            className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
              location.pathname === "/" ? "text-dash-primary" : "text-dash-muted hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[9px] font-mono font-medium">Research</span>
          </Link>

          {/* Weekly Wealth */}
          <Link
            to="/weekly-wealth"
            className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
              location.pathname === "/weekly-wealth" ? "text-[#fbbf24]" : "text-dash-muted hover:text-white"
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span className="text-[9px] font-mono font-medium">Wealth</span>
          </Link>

          {/* Sector Update */}
          <Link
            to="/sector-update"
            className={`flex flex-col items-center gap-1 p-1 transition-colors cursor-pointer ${
              location.pathname === "/sector-update" ? "text-purple-400" : "text-dash-muted hover:text-white"
            }`}
          >
            <Building2 className="w-5 h-5" />
            <span className="text-[9px] font-mono font-medium">Sectors</span>
          </Link>

          {/* Watchlist */}
          <Link
            to="/watchlist"
            className={`flex flex-col items-center gap-1 p-1 relative transition-colors cursor-pointer ${
              location.pathname === "/watchlist" ? "text-dash-warning" : "text-dash-muted hover:text-white"
            }`}
          >
            <div className="relative">
              <Star className={`w-5 h-5 ${location.pathname === "/watchlist" ? "fill-dash-warning" : ""}`} />
              {watchlist.length > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-dash-primary text-black text-[8px] font-mono font-bold px-1 rounded-full min-w-[12px] h-[12px] flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </div>
            <span className="text-[9px] font-mono font-medium">My Watch</span>
          </Link>
        </div>
      </div>

      {/* Dynamic AI PDF Ingestor Modal Dialog */}
      {pdfIngestorOpen && (
        <div id="pdf-ingestor-modal" className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm select-none">
          <div className="w-full max-w-xl bg-dash-grid rounded-2xl border border-dash-line shadow-2xl p-6 relative overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Top Close Panel */}
            <button
              onClick={() => {
                setPdfIngestorOpen(false);
                setPdfSuccess(null);
                setPdfError(null);
              }}
              className="absolute top-4 right-4 text-dash-muted hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Title & Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-dash-line mb-4">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <div>
                <h3 className="text-sm font-extrabold tracking-wider font-display uppercase text-white">
                  AI PDF INGESTOR
                </h3>
                <p className="text-[10px] text-dash-muted mt-0.5">
                  Scan and feed research PDF reports directly from the code folder location
                </p>
              </div>
            </div>

            {/* Core Info Alert Box */}
            <div className="p-3.5 rounded-xl border border-[#00c2ff]/10 bg-[#00c2ff]/3 text-[11px] text-[#00c2ff] leading-relaxed mb-4">
              <strong>📁 Code-Location Folder:</strong> Drop any stock advisor research documents inside the <code className="bg-black/40 px-1 py-0.5 rounded text-white font-mono font-bold">./pdf_input/</code> folder at your app's environment root, and Gemini will automatically extract metrics, classify reports, and refresh the system live.
            </div>

            {/* Status indicators */}
            {pdfSuccess && (
              <div className="mb-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-dash-success flex items-start gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{pdfSuccess}</div>
              </div>
            )}

            {pdfError && (
              <div className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-[11px] text-dash-danger flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>{pdfError}</div>
              </div>
            )}

            {/* List of files detected in pdf_input */}
            <div className="flex-1 overflow-y-auto min-h-[140px] mb-4 bg-black/20 rounded-xl border border-dash-line p-3">
              <div className="text-[10px] font-bold text-dash-muted uppercase tracking-wider mb-2 font-mono flex items-center justify-between">
                <span>Detected Folder PDF Files</span>
                <span className="text-cyan-400 font-bold">Total: {pdfFiles.length}</span>
              </div>

              {pdfFiles.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center py-6 text-center text-dash-muted text-xs">
                  <FileText className="w-8 h-8 opacity-20 mb-2 text-cyan-400" />
                  <p>No PDF files detected inside <code className="bg-black/30 px-1 text-[11px] py-0.5 rounded text-white font-mono">./pdf_input/</code> yet.</p>
                  <p className="text-[10px] opacity-60 mt-1">Add them via the file manager or terminal/tools to see them here.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {pdfFiles.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/3 border border-white/5 hover:border-white/10 transition-colors">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span className="text-xs font-mono font-semibold text-white truncate max-w-[280px]">
                          {file.name}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-dash-muted">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Triggers */}
            <div className="flex items-center justify-between border-t border-dash-line pt-4 mt-auto">
              {/* Refresh list button */}
              <button
                type="button"
                onClick={loadPdfFiles}
                className="py-2 px-3 text-dash-muted hover:text-cyan-400 text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" /> RE-SCAN FOLDER
              </button>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setPdfIngestorOpen(false);
                    setPdfSuccess(null);
                    setPdfError(null);
                  }}
                  className="py-2 px-4 text-dash-ink hover:text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  disabled={processingPdfs || pdfFiles.length === 0}
                  onClick={handleProcessPdfs}
                  className="py-2 px-5 bg-cyan-400 hover:bg-cyan-500 disabled:opacity-40 disabled:hover:bg-cyan-400 cursor-pointer text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg transition-all flex items-center gap-1.5"
                >
                  {processingPdfs ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                      <span>DIGESTING COGNITIVE INTEL...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-black" />
                      <span>DIGEST READINGS VIA AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;
