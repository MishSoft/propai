import React from 'react';

interface BuyerListSkeletonProps {
  label: string;
  count?: number;
}

// Mirrors BuyerCard's structure and BuyerList's grid so the layout does not shift when data arrives.
export const BuyerListSkeleton: React.FC<BuyerListSkeletonProps> = ({ label, count = 3 }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full"
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          aria-hidden="true"
          className="glass-card flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden bg-white/90 shadow-2xl shadow-slate-200/50 border-slate-100 animate-pulse"
        >
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 h-5 w-16 rounded-xl bg-slate-100" />

          <div className="mb-3 sm:mb-4 pr-20 space-y-2">
            <div className="h-4 sm:h-5 w-3/4 rounded-md bg-slate-200" />
            <div className="h-3 w-1/2 rounded-md bg-slate-100" />
          </div>

          <div className="space-y-2.5 sm:space-y-3.5 border-t border-slate-100 pt-3 sm:pt-5">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 rounded-full bg-slate-200" />
              <div className="h-3 w-2/3 rounded-md bg-slate-100" />
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 rounded-full bg-slate-200" />
              <div className="h-3 w-1/2 rounded-md bg-slate-100" />
            </div>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 rounded-full bg-slate-200" />
              <div className="h-4 w-1/3 rounded-md bg-slate-200" />
            </div>
          </div>

          <div className="mt-4 sm:mt-5 h-12 sm:h-14 rounded-2xl bg-slate-50 border border-slate-100" />

          <div className="flex gap-2.5 sm:gap-3 mt-5 sm:mt-8">
            <div className="flex-[2] min-w-0 min-h-11 rounded-xl bg-slate-200" />
            <div className="flex-1 min-w-0 min-h-11 rounded-xl bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
};
