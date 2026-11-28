"use client";

import { useUiStore } from "@/store/useUiStore";

const navigationItems = ["dashboard", "listings", "buyers", "settings"];

export default function Skeleton() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);

  return (
    <>
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs xl:hidden ${
          isSidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      />

      <aside
        aria-hidden="true"
        className={`sb-skel-aside fixed left-0 top-0 z-50 flex h-full w-64 flex-col items-center border-r border-slate-100 bg-white transition-none duration-0 xl:w-64 xl:translate-x-0 ${
          isSidebarOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full max-xl:invisible"
        }`}
      >
        <div className="flex w-full flex-col">
          <div className="sb-skel-topbar hidden border-b border-gray-100 py-3 xl:flex xl:justify-end xl:pr-5">
            <div className="h-4.5 w-4.5 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="mt-5 mb-8 flex w-full items-center justify-between px-3">
            <div className="sb-skel-logo-wrap flex animate-pulse items-center gap-3 xl:px-2">
              <div className="h-11 w-11 shrink-0 rounded-2xl bg-purple-200" />
              <div className="sb-skel-logo-text min-w-0 flex max-w-40 flex-col gap-2 overflow-hidden opacity-100">
                <div className="h-4 w-20 rounded bg-slate-200" />
                <div className="h-2 w-24 rounded bg-slate-100" />
              </div>
            </div>

            <div className="mr-2 h-6 w-6 animate-pulse rounded bg-slate-200 xl:hidden" />
          </div>
        </div>

        <div className="custom-scrollbar w-full flex-1 overflow-hidden px-4">
          <nav className="flex w-full flex-col gap-3">
            {navigationItems.map((item) => (
              <div
                key={item}
                className="sb-skel-nav-item flex animate-pulse items-center gap-3.5 rounded-2xl px-3.5 py-4"
              >
                <div className="h-4.5 w-4.5 shrink-0 rounded bg-slate-200" />
                <div className="sb-skel-nav-label min-w-0 h-3 w-24 max-w-44 rounded bg-slate-100 opacity-100" />
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-auto w-full border-t border-slate-100 px-4 py-3">
          <div className="sb-skel-footer-item flex animate-pulse items-center gap-4 rounded-2xl px-5 py-4">
            <div className="h-4.5 w-4.5 shrink-0 rounded bg-slate-200" />
            <div className="sb-skel-footer-label min-w-0 h-3 w-16 max-w-16 rounded bg-slate-100 opacity-100" />
          </div>
        </div>
      </aside>
    </>
  );
}
