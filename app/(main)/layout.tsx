"use client";

import { useUiStore } from "@/store/useUiStore";
import SideBar from "./components/Sidebar/SideBar";
import MobileHeader from "./components/MobileHeader";
import NotificationCenter from "./components/NotificationCenter";

export default function Layout({ children }: { children: React.ReactNode }) {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);

  return (
    <div className="flex flex-col xl:flex-row bg-slate-50 min-h-screen text-slate-900">
      <SideBar />
      <NotificationCenter />

      <div
        className={`flex-1 min-w-0 max-w-full overflow-x-hidden flex flex-col min-h-screen transition-[padding] duration-300 motion-reduce:transition-none ${isSidebarCollapsed ? "xl:pl-20" : "xl:pl-64"
          }`}
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
