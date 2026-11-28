"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { GoSidebarCollapse } from "react-icons/go";
import { RiCloseLine } from "react-icons/ri";
import { lockBodyScroll } from "@/lib/scroll-lock";
import { useUiStore } from "@/store/useUiStore";
import Logo from "./Logo";
import SideLinks from "./SideLinks";
import SignOutBtn from "./SignOutBtn";
import Skeleton from "./Skeleton";


const DESKTOP_QUERY = "(min-width: 1280px)";
const MENU_BUTTON_ID = "propai-menu-toggle-btn";
const FOCUSABLE_SELECTOR =
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function SideBar() {
  const isSidebarOpen = useUiStore((state) => state.isSidebarOpen);
  const closeSidebar = useUiStore((state) => state.closeSidebar);
  const toggleSidebarCollapsed = useUiStore((state) => state.toggleSidebarCollapsed);
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const sidebarRef = useRef<HTMLElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [loading, setLoading] = useState(true)
  const [isSidebarReady, setIsSidebarReady] = useState(false);
  const hasHydrated = useUiStore((state) => state._hasHydrated)
  const isDesktopCollapsed = isDesktop && isSidebarCollapsed;
  const sidebarTransition = hasHydrated
    ? "transition-[width,transform,visibility] duration-300 motion-reduce:transition-none"
    : "transition-none duration-0";
  const backdropTransition = hasHydrated
    ? "transition-opacity duration-300"
    : "transition-none duration-0";

  // Mobile drawer is a modal dialog; desktop sidebar is a plain navigation landmark
  const sidebarSemantics: {
    role: "dialog" | "navigation";
    "aria-modal"?: "true";
  } = isDesktop
      ? { role: "navigation" }
      : { role: "dialog", "aria-modal": isSidebarOpen ? "true" : undefined };

  // Desktop is a persistent navigation landmark; leaving mobile mode closes the drawer, which releases scroll lock
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const sync = () => {
      setIsDesktop(mq.matches);
      if (mq.matches) closeSidebar();
      setLoading(false);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [closeSidebar]);

  useEffect(() => {
    if (!hasHydrated) return;

    const root = document.documentElement;
    if (isSidebarCollapsed) {
      root.setAttribute("data-sidebar-collapsed", "true");
    } else {
      root.removeAttribute("data-sidebar-collapsed");
    }
  }, [isSidebarCollapsed, hasHydrated]);

  useEffect(() => {
    if (loading || !hasHydrated || isSidebarReady) return;

    const frame = window.requestAnimationFrame(() => {
      setIsSidebarReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, [loading, hasHydrated, isSidebarReady]);

  // Route changes close the drawer silently; focus is not moved
  const lastPathnameRef = useRef(pathname);
  useEffect(() => {
    if (lastPathnameRef.current === pathname) return;
    lastPathnameRef.current = pathname;
    closeSidebar();
  }, [pathname, closeSidebar]);

  // User-initiated dismissal (close button, backdrop, Escape) returns focus to the opener
  const dismiss = useCallback(() => {
    closeSidebar();
    const opener = openerRef.current?.isConnected
      ? openerRef.current
      : document.getElementById(MENU_BUTTON_ID);
    opener?.focus();
  }, [closeSidebar]);

  useEffect(() => {
    if (!isSidebarOpen || isDesktop) return;

    openerRef.current = document.activeElement as HTMLElement | null;

    const unlockScroll = lockBodyScroll();

    const focusTimer = window.setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        dismiss();
        return;
      }

      if (e.key !== "Tab" || !sidebarRef.current) return;

      const focusables =
        sidebarRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!first || !last) return;

      const active = document.activeElement;
      const insideDrawer = sidebarRef.current.contains(active);

      if (e.shiftKey) {
        if (!insideDrawer || active === first) {
          e.preventDefault();
          last.focus();
        }
      } else if (!insideDrawer || active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      unlockScroll();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen, isDesktop, dismiss]);

  const handleSidebarOpen = () => {
    if (!isDesktop) return
    toggleSidebarCollapsed();
  }

  return (
    <>
      {
        !isSidebarReady ? (
          <Skeleton />
        ) : (
          <>
            {/* Dimmed backdrop overlay behind drawer on mobile/tablet */}
            <div
              onClick={dismiss}
              aria-hidden="true"
              className={`fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 ${backdropTransition} xl:hidden ${isSidebarOpen
                ? "opacity-100  pointer-events-auto"
                : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Sidebar container: modal dialog on mobile/tablet, plain navigation landmark on desktop */}
            <aside
              {...sidebarSemantics}
              ref={sidebarRef}
              id="propai-sidebar-nav"
              aria-label={t("mainNavigation")}
              className={`fixed left-0 top-0 h-full w-64 bg-white border-r border-slate-100 flex flex-col items-center z-50 ${sidebarTransition} xl:translate-x-0 ${isDesktopCollapsed ? "xl:w-20" : "xl:w-64"
                } ${isSidebarOpen
                  ? "translate-x-0 shadow-2xl"
                  : "-translate-x-full max-xl:invisible"
                }`}
            >
              <div className="flex flex-col w-full">
                {
                  isDesktop && (
                    <div
                      className={`border-b border-gray-100 py-3 flex items-center justify-end ${
                        hasHydrated
                          ? "transition-[padding] duration-300 motion-reduce:transition-none"
                          : "transition-none duration-0"
                      } ${isDesktopCollapsed ? "xl:pr-7.75" : "xl:pr-5"}`}
                    >
                      <button
                        type="button"
                        onClick={handleSidebarOpen}
                        className="cursor-pointer"
                      >
                        <GoSidebarCollapse size={18} />
                      </button>
                    </div>
                  )
                }
                <div className="w-full mb-8 mt-5 flex items-center justify-between px-3">
                  <Logo isDesktop={isDesktop} />
                  {/* Close button for mobile/tablet */}
                  <button
                    ref={closeButtonRef}
                    type="button"
                    onClick={dismiss}
                    aria-label={t("closeMenu")}
                    className="xl:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 cursor-pointer"
                  >
                    <RiCloseLine size={24} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full px-4   custom-scrollbar">
                <SideLinks onNavigate={closeSidebar} isDesktop={isDesktop} />
              </div>

              <div className="w-full px-4 mt-auto py-3 border-t border-slate-100">
                <SignOutBtn isDesktop={isDesktop} />
              </div>
            </aside>
          </>
        )
      }
    </>
  );
}
