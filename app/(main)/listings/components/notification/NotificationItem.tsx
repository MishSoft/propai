import React from 'react'
import { IoCheckmarkCircle, IoMailUnreadOutline } from "react-icons/io5";
import type { AppNotification } from '@/store/useNotificationStore';

interface NotificationItemProps {
  notification: AppNotification;
  onMarkDone: (id: string) => void;
  isDonePending: boolean;
  onOpenBuyer: (buyerId: string) => void;
}

export default function NotificationItem({ notification, onMarkDone, isDonePending, onOpenBuyer }: NotificationItemProps) {
  const handleClick = () => {
    if (notification.buyerId) {
      onOpenBuyer(notification.buyerId);
    }
  };

  // isDone is the only status: pending (purple) until completed, then done (green).
  const isDone = Boolean(notification.isDone);

  return (
    <div
      onClick={handleClick}
      className={`group flex items-start gap-3 w-full px-3 sm:px-4 py-3.5 border-b border-slate-100 border-l-[3px] cursor-pointer transition-colors hover:bg-slate-50 focus-within:bg-slate-50 ${
        isDone
          ? 'bg-emerald-50/50 border-l-emerald-500 hover:bg-emerald-50'
          : 'bg-white border-l-purple-500'
      }`}
    >
      <div
        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isDone
            ? 'bg-emerald-100 text-emerald-600'
            : 'bg-purple-100 text-purple-700'
        }`}
        aria-hidden='true'
      >
        {isDone ? (
          <IoCheckmarkCircle size={18} />
        ) : (
          <IoMailUnreadOutline size={18} />
        )}
      </div>

      <div className='min-w-0 flex-1'>
        <div className='flex flex-wrap items-center gap-1.5'>
          <span
            className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white ${
              isDone ? 'bg-emerald-600' : 'bg-purple-600'
            }`}
          >
            {isDone ? 'Done' : 'Pending'}
          </span>
          <span className='text-[11px] text-slate-500'>
            {new Date(notification.createdAt).toLocaleDateString('ka-GE')}
          </span>
        </div>

        <p
          className={`mt-1 break-words text-sm leading-5 ${
            isDone
              ? 'text-slate-500'
              : 'font-semibold text-slate-900'
          }`}
        >
          {notification.message}
        </p>

        {/* stopPropagation keeps these controls from triggering the row's BuyerModal navigation */}
        {!isDone && (
          <div
            className='mt-2.5 flex flex-wrap items-center gap-2'
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type='button'
              disabled={isDonePending}
              onClick={(e) => {
                e.stopPropagation();
                onMarkDone(notification.id);
              }}
              className='inline-flex cursor-pointer items-center rounded-md border border-emerald-200 bg-white px-2 py-1 text-[11px] font-medium text-emerald-700 transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {isDonePending ? 'Saving…' : 'Mark as done'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
