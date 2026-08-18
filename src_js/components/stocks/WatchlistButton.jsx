import React from "react";
import { Star } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleWatchlist } from "../../store/stockStore";

export const WatchlistButton = ({
  isinCode,
  showText = false,
  className = "",
}) => {
  const dispatch = useDispatch();
  const watchlist = useSelector((state) => state.stocks.watchlist);
  const isInWatchlist = watchlist.includes(isinCode);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(toggleWatchlist(isinCode));
  };

  return (
    <button
      onClick={handleClick}
      className={`p-2 rounded-lg border transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer ${
        isInWatchlist
          ? "border-dash-warning bg-dash-warning/10 text-dash-warning"
          : "border-dash-line bg-dash-card hover:border-dash-muted text-dash-muted hover:text-white"
      } ${className}`}
      title={isInWatchlist ? "Remove from watchlist core" : "Pin to Watchlist"}
    >
      <Star className={`w-4 h-4 ${isInWatchlist ? "fill-dash-warning" : ""}`} />
      {showText && (
        <span className="text-[10px] font-black uppercase tracking-wider font-mono">
          {isInWatchlist ? "Favorited" : "Add Watchlist"}
        </span>
      )}
    </button>
  );
};

export default WatchlistButton;
