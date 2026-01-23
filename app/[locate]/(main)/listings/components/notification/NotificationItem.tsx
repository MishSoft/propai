import React from 'react'
import { IoCheckmarkCircleOutline, IoMailUnreadOutline } from "react-icons/io5";

interface NotificationItemProps {
  notification: any;
  onMarkRead: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  return (
    <div
      onClick={() => onMarkRead(notification.id)}
      className={`p-4 flex items-start gap-3 w-full border-b hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-purple-50/30' : ''}`}
    >
      <div className={`mt-1 ${!notification.isRead ? 'text-purple-600' : 'text-gray-400'}`}>
        {!notification.isRead ? <IoMailUnreadOutline size={20} /> : <IoCheckmarkCircleOutline size={20} />}
      </div>

      <div className='flex-1'>
        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
          {notification.message}
        </p>
        <span className='text-[11px] text-gray-400 mt-1 block'>
          {new Date(notification.createdAt).toLocaleDateString('ka-GE')}
        </span>
      </div>

      {!notification.isRead && (
        <div className='h-2 w-2 rounded-full bg-purple-600 mt-2'></div>
      )}
    </div>
  )
}
