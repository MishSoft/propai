"use client"
import { RiDashboardLine, RiHome3Line, RiUserHeartLine, RiSettings3Line } from "react-icons/ri";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

interface SideLinksProps {
  onNavigate?: () => void;
}

export default function SideLinks({ onNavigate }: SideLinksProps) {
  const pathname = usePathname();
  const t = useTranslations('Navigation');

  const links = [
    { id: 1, title: t('dashboard'), href: "/", icon: <RiDashboardLine size={24} /> },
    { id: 2, title: t('listings'), href: "/listings", icon: <RiHome3Line size={24} /> },
    { id: 3, title: t('buyers'), href: "/buyers", icon: <RiUserHeartLine size={24} /> },
    { id: 4, title: t('settings'), href: "/settings", icon: <RiSettings3Line size={24} /> },
  ];

  return (
    <nav className='flex flex-col gap-3 w-full'>
      {links.map((link) => {
        const isActive = pathname === link.href;

        return (
          <Link
            key={link.id}
            href={link.href}
            onClick={onNavigate}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all duration-200 group ${
              isActive
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 active:scale-95'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            <span className={`transition-transform duration-200 ${!isActive && 'group-hover:scale-110'}`}>
              {link.icon}
            </span>
            <span className="tracking-tight">{link.title}</span>
            {isActive && (
              <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-sm animate-pulse" />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
