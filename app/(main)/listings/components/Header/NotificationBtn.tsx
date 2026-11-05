"use client"
import React from 'react'
import { IoNotifications } from "react-icons/io5";
import { useNotificationStore } from '@/store/useNotificationStore';

// Presentational bell: polling, drawer, and toasts live in NotificationCenter (mounted once in the (main) layout).
export default function NotificationBtn() {
  const undoneCount = useNotificationStore((state) =>
    state.notifications.reduce((count, n) => (n.isDone ? count : count + 1), 0)
  );
  const openNotifications = useNotificationStore((state) => state.openNotifications);

  const label = undoneCount > 0 ? `Notifications, ${undoneCount} not done` : 'Notifications';

  return (
    <button
      type='button'
      onClick={openNotifications}
      aria-label={label}
      className='relative group p-2.5 bg-white border border-gray-100 flex items-center justify-center rounded-xl shadow-sm hover:bg-gray-50 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1'
    >
      <IoNotifications
        size={22}
        aria-hidden='true'
        className={`${undoneCount > 0 ? 'text-indigo-600' : 'text-gray-600'} group-hover:text-indigo-600 transition-colors`}
      />
      {undoneCount > 0 && (
        <span
          aria-hidden='true'
          className='absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-semibold leading-none text-white'
        >
          {undoneCount > 99 ? '99+' : undoneCount}
        </span>
      )}
    </button>
  )
}
