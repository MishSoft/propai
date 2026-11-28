"use client";

import { useEffect, useRef } from "react";
import { useUiStore } from "@/store/useUiStore";
import MobileHeader from "./components/MobileHeader";
import NotificationCenter from "./components/NotificationCenter";
import SideBar from "./components/Sidebar/SideBar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const hasHydrated = useUiStore((state) => state._hasHydrated);
  const hydrationStarted = useRef(false);

  useEffect(() => {
    if (hasHydrated || hydrationStarted.current) return;
    hydrationStarted.current = true;
    void useUiStore.persist.rehydrate();
  }, [hasHydrated]);

  return (
    <div className="flex flex-col xl:flex-row bg-slate-50 min-h-screen text-slate-900">
      <SideBar />
      <NotificationCenter />

      <div
        className={`sb-main-offset flex-1 min-w-0 max-w-full overflow-x-hidden flex flex-col min-h-screen ${
          hasHydrated
            ? "transition-[padding] duration-300 motion-reduce:transition-none"
            : "transition-none duration-0"
        } ${isSidebarCollapsed ? "xl:pl-20" : "xl:pl-64"}`}
      >
        <MobileHeader />
        <main className="p-4 sm:p-6 lg:p-10 w-full flex-1">
          <div className="max-w-400 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
