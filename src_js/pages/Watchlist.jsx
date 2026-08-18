import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, Star, Layers, Trash2 } from "lucide-react";
import StockTable from "../components/stocks/StockTable";
import Loader from "../components/ui/Loader";
import ErrorState from "../components/ui/ErrorState";
import {
  loadStockData,
  toggleWatchlist,
  setWatchlist,
} from "../store/stockStore";
import { formatPrice, getRecommendation } from "../utils";
import { auth, db, OperationType, handleFirestoreError } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

export const Watchlist = () => {
  const dispatch = useDispatch();
  const { stocks, loading, error, watchlist } = useSelector(
    (state) => state.stocks,
  );

  // Auth and sync state parameters
  const [user, setUser] = useState(null);
  const [syncStatus, setSyncStatus] = useState("idle");
  const [syncMessage, setSyncMessage] = useState("");

  useEffect(() => {
    if (stocks.length === 0) {
      dispatch(loadStockData());
    }

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return unsubscribe;
  }, [stocks, dispatch]);

  const watchlistStocks = useMemo(() => {
    return stocks.filter((s) => watchlist.includes(s.isin));
  }, [stocks, watchlist]);

  // Cloud backup function
  const syncWatchlistToCloud = async () => {
    if (!user) return;
    setSyncStatus("backing_up");
    setSyncMessage("Backing up watchlist nodes to cloud...");
    try {
      const listRef = doc(db, "watchlists", user.uid);
      await setDoc(listRef, {
        userId: user.uid,
        symbols: watchlist,
        updatedAt: serverTimestamp(),
      });
      setSyncStatus("backup_done");
      setSyncMessage("Backup complete! Cloud registry synced.");
      setTimeout(() => setSyncStatus("idle"), 4000);
    } catch (err) {
      console.error("Watchlist backup failed: ", err);
      setSyncStatus("error");
      setSyncMessage(err?.message || "Failed syncing to backups container");
      handleFirestoreError(err, OperationType.WRITE, `watchlists/${user.uid}`);
    }
  };

  // Cloud restore function
  const loadWatchlistFromCloud = async () => {
    if (!user) return;
    setSyncStatus("restoring");
    setSyncMessage("Retrieving backup registry payload...");
    try {
      const listRef = doc(db, "watchlists", user.uid);
      const snap = await getDoc(listRef);
      if (snap.exists()) {
        const data = snap.data();
        const cloudSymbols = data.symbols || [];
        dispatch(setWatchlist(cloudSymbols));
        setSyncStatus("restore_done");
        setSyncMessage(`Restored ${cloudSymbols.length} nodes successfully!`);
        setTimeout(() => setSyncStatus("idle"), 4000);
      } else {
        setSyncStatus("error");
        setSyncMessage("No cloud backups found for this profile.");
        setTimeout(() => setSyncStatus("idle"), 4000);
      }
    } catch (err) {
      console.error("Watchlist restore failed: ", err);
      setSyncStatus("error");
      setSyncMessage(
        err?.message || "Could not retrieve backup database nodes",
      );
      handleFirestoreError(err, OperationType.GET, `watchlists/${user.uid}`);
    }
  };

  if (loading) {
    return <Loader message="Accessing favorites watchlist..." />;
  }

  if (error) {
    return (
      <ErrorState message={error} onRetry={() => dispatch(loadStockData())} />
    );
  }

  return (
    <div
      id="watchlist_page_container"
      className="space-y-6 select-none animate-fadeIn font-sans"
    >
      {/* Dynamic Header tracking links Link */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="p-2 border border-dash-line bg-dash-card text-dash-ink hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-xl font-black font-display text-white uppercase flex items-center gap-2">
              <Star className="w-5 h-5 text-dash-warning fill-dash-warning animate-pulse" />
              Watchlist Core Terminal
            </h2>
            <p className="text-xs text-dash-ink mt-1">
              Track custom entries compiled from the momentum breakout grids or
              value shortlists.
            </p>
          </div>
        </div>
      </div>

      {watchlistStocks.length === 0 ? (
        /* Empty watchlist display */
        <div className="p-12 text-center border border-dash-line bg-dash-card rounded-2xl">
          <Layers className="w-9 h-9 text-dash-muted mx-auto mb-3 animate-pulse" />
          <h4 className="text-sm font-black font-mono text-white uppercase">
            Your Watchlist Is Empty
          </h4>
          <p className="text-xs text-dash-muted mt-2 max-w-sm mx-auto leading-relaxed">
            Pin equities from the Main Dashboard, Intraday Breakout lists, or
            category screeners using the star checkboxes.
          </p>
          <div className="mt-5">
            <Link
              to="/"
              className="py-2.5 px-5 bg-dash-primary hover:bg-dash-primary-dark text-dash-bg font-black text-[10.5px] uppercase tracking-widest rounded-lg transition-all inline-block font-mono"
            >
              BROWSE UNIVERSAL TRACKS
            </Link>
          </div>
        </div>
      ) : (
        /* Watched Stocks Table list */
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[10.5px] font-mono text-dash-muted">
            <span>TRACKING {watchlistStocks.length} ROOT NODE EQUITIES:</span>
            <span>STORE SYNC: SECURE</span>
          </div>

          <div className="border border-dash-line bg-dash-card rounded-2xl overflow-hidden">
            <StockTable stocks={watchlistStocks} />
          </div>

          {/* Quick list view details */}
          <div className="pt-4 space-y-3">
            <span className="text-[10px] font-black font-mono text-dash-muted uppercase tracking-wider block">
              Watchlist Speed Index:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {watchlistStocks.map((stock) => {
                const rec = getRecommendation(stock);
                return (
                  <div
                    key={stock.isin}
                    className="p-4 bg-dash-card border border-dash-line hover:border-dash-primary/30 rounded-xl flex items-center justify-between gap-4 transition-all duration-200"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/stocks/${stock.nse_code}`}
                          className="font-bold text-sm text-white hover:text-dash-primary transition-colors truncate"
                        >
                          {stock.nse_code}
                        </Link>
                        <span className="text-[9px] font-bold text-dash-muted font-mono bg-dash-bg border border-dash-line px-1.5 py-0.5 rounded">
                          {getRecommendation(stock)}
                        </span>
                      </div>
                      <span className="text-[10px] text-dash-ink block truncate mt-1 leading-none">
                        {stock.stock_name}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 font-mono shrink-0">
                      <div className="text-right">
                        <span className="text-sm font-black text-white block leading-none">
                          {formatPrice(stock.current_price)}
                        </span>
                        <span className="text-[9px] text-[#00c2ff] block mt-1 leading-none font-bold">
                          MOM: {stock.trendlyne_momentum_score.toFixed(1)}
                        </span>
                      </div>
                      <button
                        onClick={() => dispatch(toggleWatchlist(stock.isin))}
                        className="p-2 border border-dash-line bg-dash-bg hover:border-dash-danger hover:text-dash-danger transition-colors rounded-lg cursor-pointer text-dash-muted"
                        title="Remove from watchlist"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Watchlist;
