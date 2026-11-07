import React from 'react';

// Mirrors Filter's section and the City/Street/Min/Max grid so the layout does not shift when controls render.
export default function ListingFilterSkeleton() {
  return (
    <div aria-hidden="true" className="w-full my-10 border-t pt-10 border-slate-100 flex flex-col gap-4 animate-pulse">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="col-span-2 sm:col-span-1 min-w-0">
          <div className="mb-1.5 ml-1 h-2.5 w-12 rounded bg-slate-200" />
          <div className="h-11 w-full rounded-2xl bg-slate-100 border border-slate-200" />
        </div>
        <div className="col-span-2 sm:col-span-1 min-w-0">
          <div className="mb-1.5 ml-1 h-2.5 w-14 rounded bg-slate-200" />
          <div className="h-11 w-full rounded-2xl bg-slate-100 border border-slate-200" />
        </div>
        <div className="min-w-0">
          <div className="mb-1.5 ml-1 h-2.5 w-16 rounded bg-slate-200" />
          <div className="h-11 w-full rounded-2xl bg-slate-100 border border-slate-200" />
        </div>
        <div className="min-w-0">
          <div className="mb-1.5 ml-1 h-2.5 w-16 rounded bg-slate-200" />
          <div className="h-11 w-full rounded-2xl bg-slate-100 border border-slate-200" />
        </div>
      </div>
    </div>
  );
}
