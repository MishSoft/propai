import React from 'react'
import { CiLogout } from "react-icons/ci";

export default function SignOutBtn() {
  return (
    <div className='mt-auto xl:px-4 xl:pb-6 w-full'>
      <button
        className='
          flex items-center gap-3 w-full px-4 py-3
          text-slate-500 font-medium rounded-xl
          transition-all duration-200
          hover:bg-red-50 hover:text-red-600
          cursor-pointer group
        '
      >
        <CiLogout

          className='transition-transform size-5 duration-200 group-hover:-translate-x-1'
        />
        <span className='text-[15px] hidden xl:block'>Log Out</span>
      </button>
    </div>
  )
}
