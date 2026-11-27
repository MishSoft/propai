"use client";
import { RiDashboardLine, RiHome3Line, RiUserHeartLine, RiSettings3Line } from "react-icons/ri";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useUiStore } from "@/store/useUiStore";

interface SideLinksProps {
  onNavigate?: () => void;
  isDesktop: boolean;
}

export default function SideLinks({ onNavigate, isDesktop }: SideLinksProps) {
  const pathname = usePathname();
  const t = useTranslations("Navigation");
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed);
  const isDesktopCollapsed = isDesktop && isSidebarCollapsed;

  const links = [
    { id: 1, title: t("dashboard"), href: "/", icon: <RiDashboardLine size={18} /> },
    { id: 2, title: t("listings"), href: "/listings", icon: <RiHome3Line size={18} /> },
    { id: 3, title: t("buyers"), href: "/buyers", icon: <RiUserHeartLine size={18} /> },
    { id: 4, title: t("settings"), href: "/settings", icon: <RiSettings3Line size={18} /> },
  ];

  return (
    <nav className="flex flex-col gap-3 w-full">
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.id}
            href={link.href}
            onClick={onNavigate}
            className={`flex relative items-center rounded-2xl text-sm font-bold px-3.5 py-4 transition-[gap,background-color,color,box-shadow,transform] duration-300 group ${isDesktopCollapsed ? "gap-0" : "gap-3.5"
              } ${isActive
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 active:scale-95"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            {isDesktopCollapsed && (
              <span className="pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50 whitespace-nowrap text-xs font-semibold bg-gray-900 border border-gray-800 px-3 py-1.5 rounded-xl text-white shadow-lg">
                {link.title}
              </span>
            )}

            <span
              className={`shrink-0 transition-transform duration-200 ${!isActive && "group-hover:scale-110"
                }`}
            >
              {link.icon}
            </span>

            <span
              className={`tracking-tight text-xs whitespace-nowrap overflow-hidden transition-[max-width,opacity] duration-300 ${isDesktopCollapsed
                ? "max-w-0 opacity-0"
                : "max-w-44 opacity-100"
                }`}
            >
              {link.title}
            </span>

            {isActive && (
              <div
                className={`shrink-0 rounded-full bg-white shadow-sm animate-pulse transition-[width,height,opacity,margin] duration-300 ${isDesktopCollapsed
                  ? "w-0 h-0 opacity-0 ml-0"
                  : "w-1.5 h-1.5 opacity-100 ml-auto"
                  }`}
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
