"use client";

import { useTranslations } from "next-intl";
import { RiMenu2Line } from "react-icons/ri";
import { useUiStore } from "@/store/useUiStore";
import Logo from "./Sidebar/Logo";

export default function MobileHeader() {
  const t = useTranslations("Navigation");
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const openSidebar = useUiStore((state) => state.openSidebar);

  return (
    <header className="xl:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <Logo />
      <button
        id="propai-menu-toggle-btn"
        type="button"
        onClick={openSidebar}
        aria-label={t("openMenu")}
        aria-expanded={isSidebarOpen}
        aria-controls="propai-sidebar-nav"
        className="p-2.5 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 cursor-pointer"
      >
        <RiMenu2Line size={24} aria-hidden="true" />
      </button>
    </header>
  );
}
