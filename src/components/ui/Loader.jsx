import React from "react";
import { RefreshCw } from "lucide-react";

export const Loader = ({ message = "Analyzing financial indexes..." }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center">
      <div className="relative flex items-center justify-center w-14 h-14">
        <div className="absolute inset-0 border-2 border-dash-primary/20 rounded-full animate-ping" />
        <div className="absolute inset-2 border-2 border-dotted border-dash-primary/40 rounded-full animate-spin [animation-duration:3s]" />
        <RefreshCw className="w-5 h-5 text-dash-primary animate-spin" />
      </div>
      <p className="font-mono text-xs font-bold tracking-widest text-dash-primary uppercase animate-pulse">
        {message}
      </p>
    </div>
  );
};

export default Loader;
