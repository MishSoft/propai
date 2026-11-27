"use client";

import { useUiStore } from "@/store/useUiStore";
import { RiBankCardLine } from "react-icons/ri";

interface LogoProps {
  isDesktop?: boolean;
}

export default function Logo({ isDesktop = true }: LogoProps) {
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const isDesktopCollapsed = isDesktop && isSidebarCollapsed;

  return (
    <div
      className={`flex items-center py-1 transition-[gap,padding] duration-300 ${isDesktopCollapsed ? "gap-0 xl:px-0 justify-center" : "gap-3 xl:px-2"
        }`}
    >
      <div className="bg-purple-600 p-2.5 rounded-2xl flex items-center justify-center shrink-0 shadow-xl shadow-purple-600/20">
        <RiBankCardLine className="text-white size-6 2xl:size-8" />
      </div>

      <div
        className={`flex flex-col leading-tight whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ${isDesktopCollapsed ? "max-w-0 opacity-0" : "max-w-40 opacity-100"
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
