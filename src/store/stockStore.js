import {
  configureStore,
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";
import {
  fetchManifest,
  fetchCSV,
  runPipelineCmd,
  generateReport,
} from "../api/stockApi";

const initialWatchlist = () => {
  const saved = localStorage.getItem("watchlist_nodes");
  return saved ? JSON.parse(saved) : [];
};

const initialState = {
  stocks: [],
  manifest: null,
  selectedStock: null,
  activeCategory: "all",
  searchQuery: "",
  watchlist: initialWatchlist(),
  selectedComparisons: [],
  loading: false,
  running: false,
  reportLoading: false,
  activeReport: null,
  analysisFocus: "Balanced",
  error: null,
};

// Thunks
export const loadStockData = createAsyncThunk(
  "stocks/loadAll",
  async (_, { rejectWithValue }) => {
    try {
      const manifest = await fetchManifest();
      const scoredFile = manifest.scored_master || "Master_merged.csv";
      const stocks = await fetchCSV(scoredFile);
      return { manifest, stocks };
    } catch (err) {
      console.error(
        "Redux load stock data err, using fallback local master:",
        err,
      );
      try {
        const stocks = await fetchCSV("Master_merged.csv");
        return { manifest: null, stocks };
      } catch (innerErr) {
        return rejectWithValue(
          innerErr?.message || "Failed to load stock index sheet",
        );
      }
    }
  },
);

export const runPipeline = createAsyncThunk(
  "stocks/runPipeline",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await runPipelineCmd();
      dispatch(loadStockData());
      return true;
    } catch (err) {
      return rejectWithValue(err?.message || "Pipeline compile error");
    }
  },
);

export const fetchAIReportForSelected = createAsyncThunk(
  "stocks/fetchReport",
  async ({ stock, focus }, { rejectWithValue }) => {
    try {
      const report = await generateReport(stock, focus);
      return report;
    } catch (err) {
      return rejectWithValue(
        err?.message || "Failed to generate stock intelligence parameters",
      );
    }
  },
);

const stockSlice = createSlice({
  name: "stocks",
  initialState,
  reducers: {
    setActiveCategory(state, action) {
      state.activeCategory = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSelectedStock(state, action) {
      state.selectedStock = action.payload;
      state.activeReport = null; // reset report when stock changes
    },
    setAnalysisFocus(state, action) {
      state.analysisFocus = action.payload;
    },
    toggleWatchlist(state, action) {
      const isinCode = action.payload;
      if (state.watchlist.includes(isinCode)) {
        state.watchlist = state.watchlist.filter((code) => code !== isinCode);
      } else {
        state.watchlist.push(isinCode);
      }
      localStorage.setItem("watchlist_nodes", JSON.stringify(state.watchlist));
    },
    setWatchlist(state, action) {
      state.watchlist = action.payload;
      localStorage.setItem("watchlist_nodes", JSON.stringify(state.watchlist));
    },
    toggleComparison(state, action) {
      const stock = action.payload;
      const exists = state.selectedComparisons.some(
        (s) => s.nse_code === stock.nse_code,
      );
      if (exists) {
        state.selectedComparisons = state.selectedComparisons.filter(
          (s) => s.nse_code !== stock.nse_code,
        );
      } else {
        state.selectedComparisons.push(stock);
      }
    },
    clearComparisons(state) {
      state.selectedComparisons = [];
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load stock data
      .addCase(loadStockData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadStockData.fulfilled, (state, action) => {
        state.loading = false;
        state.manifest = action.payload.manifest;
        state.stocks = action.payload.stocks;
        if (action.payload.stocks.length > 0 && !state.selectedStock) {
          state.selectedStock = action.payload.stocks[0];
        }
      })
      .addCase(loadStockData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Could not retrieve core telemetry";
      })
      // Run Pipeline
      .addCase(runPipeline.pending, (state) => {
        state.running = true;
      })
      .addCase(runPipeline.fulfilled, (state) => {
        state.running = false;
      })
      .addCase(runPipeline.rejected, (state, action) => {
        state.running = false;
        state.error = action.payload || "Pipeline execution failed";
      })
      // AI Report
      .addCase(fetchAIReportForSelected.pending, (state) => {
        state.reportLoading = true;
        state.activeReport = null;
      })
      .addCase(fetchAIReportForSelected.fulfilled, (state, action) => {
        state.reportLoading = false;
        state.activeReport = action.payload;
      })
      .addCase(fetchAIReportForSelected.rejected, (state, action) => {
        state.reportLoading = false;
        state.error = action.payload || "AI parsing error";
      });
    },
});

export const {
  setActiveCategory,
  setSearchQuery,
  setSelectedStock,
  setAnalysisFocus,
  toggleWatchlist,
  setWatchlist,
  toggleComparison,
  clearComparisons,
  clearError,
} = stockSlice.actions;

export const store = configureStore({
  reducer: {
    stocks: stockSlice.reducer,
  },
});
