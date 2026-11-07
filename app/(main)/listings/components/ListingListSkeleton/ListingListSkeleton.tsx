import React from 'react';

interface ListingListSkeletonProps {
  label: string;
  count?: number;
}

// Mirrors ListingItem's card structure and the listings page grid so the layout does not shift when data arrives.
export default function ListingListSkeleton({ label, count = 3 }: ListingListSkeletonProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-32'
    >
      <span className="sr-only">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <div key={index} aria-hidden="true" className="flex justify-center min-w-0">
          <div className="w-full glass-card overflow-hidden flex flex-col bg-white/90 shadow-2xl shadow-slate-200/50 border-slate-100 animate-pulse">
            <div className="relative h-64 bg-slate-100 shrink-0" />

            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <div className="h-7 w-1/2 rounded-md bg-slate-200" />
                <div className="h-6 w-28 rounded-full bg-emerald-50" />
              </div>

              <div className="flex items-center gap-2 mb-6">
                <div className="h-4 w-4 shrink-0 rounded-full bg-slate-200" />
                <div className="h-3 w-2/3 rounded-md bg-slate-100" />
              </div>

              <div className="grid grid-cols-3 py-4 border-y border-slate-100 mb-6">
                {[0, 1, 2].map((stat) => (
                  <div key={stat} className="flex flex-col items-center gap-1.5">
                    <div className="h-3 w-6 rounded-md bg-slate-200" />
                    <div className="h-2 w-10 rounded-md bg-slate-100" />
                  </div>
                ))}
              </div>

              <div className="mt-auto h-14 w-full rounded-xl bg-purple-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
