"use client";

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { RiLogoutBoxLine } from "react-icons/ri";
import { CgSpinner } from 'react-icons/cg';
import { useTranslations } from 'next-intl';
import { useUiStore } from '@/store/useUiStore';


type SignOutBtnType = {
  isDesktop: boolean
}


export default function SignOutBtn({ isDesktop }: SignOutBtnType) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations('Common');
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: '/login' });
    } catch (error) {
      console.error('Sign out error:', error);
      setIsLoggingOut(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoggingOut}
      className={`w-full flex items-center ${isSidebarCollapsed ? "justify-center" : "justify-start"} gap-4 px-5 py-4 rounded-2xl text-slate-500 font-bold hover:bg-red-50 hover:text-red-600 transition-all duration-200 group cursor-pointer active:scale-95 disabled:opacity-50`}
    >
      <div className="transition-transform duration-200 group-hover:scale-110">
        {isLoggingOut ? (
          <CgSpinner className='animate-spin size-6' />
        ) : (
          <RiLogoutBoxLine size={18} />
        )}
      </div>
      {
        !(isSidebarCollapsed && isDesktop) && (
          <span className="text-xs tracking-tight capitalize">
            {t('logout')}
          </span>
        )
      }
    </button>
  );
}
