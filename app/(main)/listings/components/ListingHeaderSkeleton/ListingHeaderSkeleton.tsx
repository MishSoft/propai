import React from 'react';

// Mirrors Header's layout. Header's action buttons are fixed on mobile, so they are only shown from md up.
export default function ListingHeaderSkeleton() {
  return (
    <div aria-hidden="true" className="flex items-center justify-between w-full animate-pulse">
      <div className="flex flex-col gap-2 min-w-0">
        <div className="h-7 md:h-9 w-48 md:w-64 rounded-md bg-slate-200" />
        <div className="h-3.5 md:h-4 w-64 max-w-full rounded-md bg-slate-100" />
      </div>

      <div className="hidden md:flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <div className="h-11 w-36 rounded-xl bg-purple-100" />
      </div>
    </div>
  );
}
