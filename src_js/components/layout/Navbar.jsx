import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Search,
  Bell,
  TrendingUp,
  TrendingDown,
  Star,
  BarChart3,
} from "lucide-react";
import { setSearchQuery } from "../../store/stockStore";
import {
  auth,
  db,
  loginWithGoogle,
  OperationType,
  handleFirestoreError,
} from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

export const Navbar = () => {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.stocks.searchQuery);
  const stocks = useSelector((state) => state.stocks.stocks);
  const watchlist = useSelector((state) => state.stocks.watchlist);
  // Auth state states
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // High fidelity indices state details
  const niftyChange = 0.85;
  const sensexChange = 0.92;
  const vixChange = -3.42;

  useEffect(() => {
    let unsubscribeUserDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const userRef = doc(db, "users", u.uid);
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            const initialProfile = {
              userId: u.uid,
              email: u.email || "",
              displayName: u.displayName || "Market Trader",
              photoURL: u.photoURL || "",
              tier: "Free",
            };
            await setDoc(userRef, {
              ...initialProfile,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            });
          }
        } catch (err) {
          console.error("Failed to seed UserProfile: ", err);
        }

        // Live Real-Time tier sync listener
        try {
          unsubscribeUserDoc = onSnapshot(
            userRef,
            (snapshot) => {
              if (snapshot.exists()) {
                setUserProfile(snapshot.data());
              }
            },
            (error) => {
              console.warn("User Document snapshot error caught", error);
              handleFirestoreError(error, OperationType.GET, `users/${u.uid}`);
            },
          );
        } catch (snapErr) {
          console.error("Failed setting up active profile snapshot", snapErr);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeUserDoc) unsubscribeUserDoc();
    };
  }, []);

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleGoogleAuth = async () => {
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error("Google authentication failure: ", err);
    }
  };

  const handleTierChange = async (tier) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userRef, {
        tier: tier,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Failed to update access level tier", error);
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  return (
    <header className="h-20 glass-navbar px-6 flex items-center justify-between shrink-0 select-none relative z-50 shadow-sm font-sans">
      {/* Global Stock Search bar */}
      <div className="w-100 relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dash-muted">
          <Search className="w-4 h-4" />
        </span>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Search stocks by name or nse code (e.g. RELIANCE, TATA)..."
          className="w-full text-xs font-medium pl-10 pr-4 py-2.5 bg-dash-card/65 border border-dash-line rounded-lg text-dash-ink placeholder-dash-muted focus:outline-none focus:border-dash-primary focus:ring-1 focus:ring-dash-primary transition-all font-mono backdrop-blur-md"
        />
      </div>

      {/* Market Indicators ticker info */}
      <div className="hidden lg:flex items-center gap-6">
        {/* NIFTY 50 */}
        <div className="flex items-center gap-2 border-r border-dash-line pr-6">
          <div>
            <div className="text-[10px] font-black text-dash-muted uppercase tracking-wider font-mono">
              NIFTY 50
            </div>
            <div className="flex items-center gap-1.5 leading-none mt-1">
              <span className="text-xs font-black text-white font-mono">
                22,462.40
              </span>
              <span className="text-[10px] font-bold text-dash-success bg-dash-success/10 px-1 py-0.5 rounded flex items-center font-mono">
                <TrendingUp className="w-2.5 h-2.5" /> +{niftyChange}%
              </span>
            </div>
          </div>
        </div>

        {/* SENSEX */}
        <div className="flex items-center gap-2 border-r border-dash-line pr-6">
          <div>
            <div className="text-[10px] font-black text-dash-muted uppercase tracking-wider font-mono">
              SENSEX
            </div>
            <div className="flex items-center gap-1.5 leading-none mt-1">
              <span className="text-xs font-black text-white font-mono">
                73,896.15
              </span>
              <span className="text-[10px] font-bold text-dash-success bg-dash-success/10 px-1 py-0.5 rounded flex items-center font-mono">
                <TrendingUp className="w-2.5 h-2.5" /> +{sensexChange}%
              </span>
            </div>
          </div>
        </div>

        {/* INDIA VIX */}
        <div className="flex items-center gap-2">
          <div>
            <div className="text-[10px] font-black text-dash-muted uppercase tracking-wider font-mono">
              INDIA VIX
            </div>
            <div className="flex items-center gap-1.5 leading-none mt-1">
              <span className="text-xs font-black text-white font-mono">
                13.15
              </span>
              <span className="text-[10px] font-bold text-dash-danger bg-dash-danger/10 px-1 py-0.5 rounded flex items-center font-mono">
                <TrendingDown className="w-2.5 h-2.5" /> {vixChange}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar Indicators */}
      <div className="flex items-center gap-4">
        {/* Watchlist Core Metrics */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-dash-card border border-dash-line rounded-lg">
          <Star className="w-3.5 h-3.5 text-dash-warning fill-dash-warning animate-pulse" />
          <span className="text-[10px] font-black font-mono text-dash-ink uppercase">
            Watchlist:
          </span>
          <span className="text-[10px] font-bold font-mono text-dash-primary">
            {watchlist.length} Nodes
          </span>
        </div>

        {/* Total Universe count */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-dash-card border border-dash-line rounded-lg">
          <BarChart3 className="w-3.5 h-3.5 text-dash-primary" />
          <span className="text-[10px] font-black font-mono text-dash-ink uppercase">
            Universe:
          </span>
          <span className="text-[10px] font-bold font-mono text-dash-success">
            {stocks.length} Stocks
          </span>
        </div>

        {/* Notification Bell Badge */}
        <button
          id="notification_trigger"
          className="relative p-2 rounded-lg bg-dash-card border border-dash-line text-dash-ink hover:text-dash-primary hover:border-dash-primary transition-all cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-dash-primary rounded-full ring-2 ring-dash-surface" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
