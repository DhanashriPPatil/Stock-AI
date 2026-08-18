import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

export const ErrorState = ({
  message = "Failed to sync system database",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4 border border-dash-danger/20 rounded-2xl bg-dash-danger/5 text-center max-w-md mx-auto my-6">
      <div className="p-3 rounded-full bg-dash-danger/10 border border-dash-danger/20">
        <AlertCircle className="w-8 h-8 text-dash-danger" />
      </div>
      <div>
        <h4 className="text-sm font-black tracking-wide font-display text-dash-danger uppercase">
          Connection Outage or Parse Failure
        </h4>
        <p className="text-xs text-dash-muted mt-1 leading-relaxed">
          {message}
        </p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 py-1.5 px-4 bg-dash-danger hover:bg-dash-danger hover:opacity-90 text-dash-bg font-mono font-black text-[10px] uppercase tracking-widest rounded-lg transition-all cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          FORCE SYNC
        </button>
      )}
    </div>
  );
};

export default ErrorState;
