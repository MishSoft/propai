"use client";

import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { CgSpinner } from 'react-icons/cg';
import { RiLogoutBoxLine } from "react-icons/ri";
import { useUiStore } from '@/store/useUiStore';


type SignOutBtnType = {
  isDesktop: boolean
}


export default function SignOutBtn({ isDesktop }: SignOutBtnType) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const t = useTranslations('Common');
  const isSidebarCollapsed = useUiStore((state) => state.isSidebarCollapsed)
  const hasHydrated = useUiStore((state) => state._hasHydrated)
  const isDesktopCollapsed = isDesktop && isSidebarCollapsed;
  const transitionClass = hasHydrated
    ? "duration-300 motion-reduce:transition-none"
    : "transition-none duration-0";

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
      className={`w-full flex items-center justify-start gap-4 px-5 py-4 rounded-2xl text-slate-500 font-bold hover:bg-red-50 hover:text-red-600 ${hasHydrated ? "transition-[gap,padding,background-color,color,transform,opacity]" : "transition-none"} ${transitionClass} group cursor-pointer active:scale-95 disabled:opacity-50 ${
        isDesktopCollapsed ? "xl:gap-0 xl:px-4" : ""
      }`}
    >
      <div className={hasHydrated ? "transition-transform duration-200 group-hover:scale-110" : ""}>
        {isLoggingOut ? (
          <CgSpinner className='animate-spin size-6' />
        ) : (
          <RiLogoutBoxLine size={18} />
        )}
      </div>
      <span
        className={`min-w-0 max-w-20 overflow-hidden whitespace-nowrap text-xs tracking-tight capitalize ${
          hasHydrated
            ? "transition-[max-width,opacity] duration-300"
            : "transition-none duration-0"
        } ${
          isDesktopCollapsed ? "max-w-0 opacity-0 xl:pointer-events-none" : "opacity-100"
        }`}
      >
        {t('logout')}
      </span>
    </button>
  );
}
