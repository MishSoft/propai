import React from 'react'
import { IoNotifications } from "react-icons/io5";

export default function NotificationBtn() {
  return (
    <div className='relative group cursor-pointer'>
      <div className='p-2.5 bg-white border border-gray-100 flex items-center justify-center rounded-xl shadow-sm group-hover:bg-gray-50 transition-all duration-200'>
        <span className='absolute top-2 right-2 flex h-3 w-3'>
          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
          <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white'></span>
        </span>

        <button className='text-gray-600 group-hover:text-purple-600 transition-colors'>
          <IoNotifications size={22} />
        </button>
      </div>
    </div>
  )
}
