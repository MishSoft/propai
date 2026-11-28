"use client";

import { RiBankCardLine } from "react-icons/ri";
import { useUiStore } from "@/store/useUiStore";

interface LogoProps {
  isDesktop: boolean;
}

export default function Logo({ isDesktop }: LogoProps) {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const hasHydrated = useUiStore((state) => state._hasHydrated);
  const isDesktopCollapsed = isDesktop && isSidebarCollapsed;
  const transitionClass = hasHydrated
    ? "duration-300 motion-reduce:transition-none"
    : "transition-none duration-0";

  return (
    <div
      className={`flex items-center py-1 ${hasHydrated ? "transition-[gap,padding]" : "transition-none"} ${transitionClass} ${isDesktopCollapsed ? "gap-0 xl:pl-1" : "gap-3 xl:px-2"
        }`}
    >
      <div className="bg-purple-600 p-2.5 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-purple-600/20">
        <RiBankCardLine className="text-white size-6 2xl:size-8" />
      </div>

      <div
        className={`min-w-0 flex flex-col leading-tight whitespace-nowrap overflow-hidden ${hasHydrated ? "transition-[max-width,opacity] duration-300" : "transition-none duration-0"} ${isDesktopCollapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
          }`}
      >
        <h1 className="font-black text-xl tracking-tighter text-slate-900 uppercase">
          Prop<span className="text-purple-600">AI</span>
        </h1>
        <span className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
          SaaS Dashboard
        </span>
      </div>
    </div>
  );
}
