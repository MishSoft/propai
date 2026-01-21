import React from 'react'
import { IoClose } from "react-icons/io5";
import NotificationItem from './NotificationItem';

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: any[];
  onMarkRead: (id: string) => void;
}

export default function NotificationSidebar({ isOpen, onClose, notifications, onMarkRead }: NotificationSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div onClick={onClose} className='fixed inset-0 bg-black/20 backdrop-blur-sm z-998' />

      {/* Sidebar Panel */}
      <section className='fixed top-0 right-0 h-full max-w-sm w-full bg-white shadow-2xl z-999 border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300'>
        <div className='p-6 border-b flex items-center justify-between bg-white sticky top-0'>
          <h2 className='text-lg font-bold text-gray-800'>შეტყობინებები</h2>
          <button onClick={onClose} className='p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500'>
            <IoClose size={24} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto'>
          {notifications.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center p-8 text-center text-gray-400'>
              <p>შეტყობინებები არ არის</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkRead={onMarkRead}
              />
            ))
          )}
        </div>
      </section>
    </>
  )
}
