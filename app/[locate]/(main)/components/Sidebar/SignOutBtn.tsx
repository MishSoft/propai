"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CiLogout } from "react-icons/ci";
import { CgSpinner } from "react-icons/cg";

export default function SignOutBtn() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true);

      // მივმართავთ შენს მიერ შექმნილ logout API-ს
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className='mt-auto xl:px-4 xl:pb-6 w-full'>
      <button
        onClick={handleSignOut}
        disabled={isLoggingOut}
        className={`
          flex items-center gap-3 w-full px-4 py-3
          font-medium rounded-xl transition-all duration-200
          cursor-pointer group
          ${isLoggingOut
            ? 'bg-slate-100 text-slate-400'
            : 'text-slate-500 hover:bg-red-50 hover:text-red-600'}
        `}
      >
        {isLoggingOut ? (
          <CgSpinner className='animate-spin size-5' />
        ) : (
            <CiLogout
              className='transition-transform size-5 duration-200 group-hover:-translate-x-1'
            />
        )}

        <span className='text-[15px] hidden xl:block'>
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </span>
      </button>
    </div>
  )
}
