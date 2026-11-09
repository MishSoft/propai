import React from 'react'
import { useTranslations } from 'next-intl';
import { IoClose } from "react-icons/io5";
import NotificationItem from './NotificationItem';
import type { AppNotification } from '@/store/useNotificationStore';

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: AppNotification[];
  onMarkDone: (id: string) => void;
  pendingDoneIds: Set<string>;
  actionError: boolean;
  onOpenBuyer: (buyerId: string) => void;
}

export default function NotificationSidebar({ isOpen, onClose, notifications, onMarkDone, pendingDoneIds, actionError, onOpenBuyer }: NotificationSidebarProps) {
  const t = useTranslations('Notifications');
  if (!isOpen) return null;

  return (
    <>
      {/* Background Overlay */}
      <div onClick={onClose} className='fixed inset-0 bg-black/20 backdrop-blur-sm z-998' />

      {/* Sidebar Panel */}
      <section className='fixed top-0 right-0 h-full max-w-sm w-full bg-white shadow-2xl z-999 border-l border-gray-200 flex flex-col animate-in slide-in-from-right duration-300'>
        <div className='px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200 flex items-center justify-between gap-3 bg-white sticky top-0 z-10'>
          <h2 className='text-base sm:text-lg font-semibold tracking-tight text-slate-900'>{t('title')}</h2>
          <button
            type='button'
            onClick={onClose}
            aria-label={t('close')}
            className='p-2 -mr-1 rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1'
          >
            <IoClose size={22} aria-hidden='true' />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto overscroll-contain bg-white'>
          {actionError && (
            <div
              role='alert'
              className='mx-3 sm:mx-4 mt-3 sm:mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs leading-5 text-red-700'
            >
              {t('mark_done_error')}
            </div>
          )}
          {notifications.length === 0 ? (
            <div className='h-full flex flex-col items-center justify-center p-8 text-center text-sm text-slate-500'>
              <p>{t('empty_state')}</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <NotificationItem
                key={notif.id}
                notification={notif}
                onMarkDone={onMarkDone}
                isDonePending={pendingDoneIds.has(notif.id)}
                onOpenBuyer={onOpenBuyer}
              />
            ))
          )}
        </div>
      </section>
    </>
  )
}
