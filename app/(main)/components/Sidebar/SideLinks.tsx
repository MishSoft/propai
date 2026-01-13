"use client"
import Link from 'next/link'
import Logo from './Logo'
import { MdDashboard } from "react-icons/md";
import { FaListAlt } from "react-icons/fa";
import { IoPeople, IoSettingsSharp } from "react-icons/io5";
import { usePathname } from 'next/navigation';

const links = [
  { id: 1, title: "Dashboard", icon: MdDashboard, href: "/" },
  { id: 2, title: "Listings", icon: FaListAlt, href: "/listings" },
  { id: 3, title: "Buyers", icon: IoPeople, href: "/buyers" },
  { id: 4, title: "Settings", icon: IoSettingsSharp, href: "/settings" },
]

export default function SideLinks() {
  const pathname = usePathname()

  return (
    <aside className='flex flex-col'>
      {/* Logo Section */}
      <div className='p-2 xl:p-6 mb-2'>
        <Logo />
      </div>

      {/* Navigation Links */}
      <nav className='flex-1 px-4 space-y-1'>
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.id}
              href={link.href}
              className={`
                flex items-center gap-3 xl:px-4 flex-col xl:flex-row py-3 rounded-lg transition-all duration-200 group
                ${isActive
                  ? "xl:bg-purple-50 text-purple-700 font-medium"
                  : "text-slate-600 xl:hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              <link.icon
                size={22}
                className={`${isActive ? "xl:text-purple-700" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="text-[15px] hidden xl:block">{link.title}</span>

              {/* Active Indicator (პატარა ხაზი მარჯვნივ ან მარცხნივ უფრო დახვეწილისთვის) */}
              {isActive && (
                <div className="xl:ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
              )}
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}
