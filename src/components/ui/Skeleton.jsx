import React from "react";

export const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-dash-line/50 via-dash-line/80 to-dash-line/50 rounded-lg ${className}`}
    />
  );
};

export const TableSkeleton = () => {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-12 w-full" />
    </div>
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-5 border border-dash-line rounded-2xl bg-dash-surface space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-1/4" />
      </div>
      <Skeleton className="h-4 w-2/3" />
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
};

export default Skeleton;
