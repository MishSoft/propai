"use client"
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { IoNotifications } from "react-icons/io5";
import NotificationSidebar from '../notification/notification';

// 1. აღვწეროთ ზუსტი ინტერფეისი ნაცვლად any-სა
interface Notification {
  id: string;
  isRead: boolean;
  isDone?: boolean;
  message: string;
  type: string;
  createdAt: string;
  buyerId?: string | null;
}

export default function NotificationBtn() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingDoneIds, setPendingDoneIds] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  // Ref mirrors pendingDoneIds so rapid double-clicks are blocked before a re-render.
  const pendingDoneRef = useRef<Set<string>>(new Set());

  // 2. გამოვიყენოთ ტიპიზირებული filter
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 3. fetchNotifications გავხადოთ useCallback, რომ ზედმეტი რენდერები ავიცილოთ
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        // Completion is final: never let a poll that raced a PATCH flip isDone back to false.
        setNotifications(prev =>
          data.map((n: Notification) => ({
            ...n,
            isDone: Boolean(n.isDone) || prev.some(p => p.id === n.id && p.isDone),
          }))
        );
      }
    } catch (err) {
      console.error("Fetch Notifications Error:", err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  const markAsRead = async (id: string) => {
    // Optimistic Update
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );

    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        fetchNotifications();
      }
    } catch (err) {
      console.error("PATCH_ERROR:", err);
      fetchNotifications();
    }
  };

  const markAsDone = async (id: string) => {
    if (pendingDoneRef.current.has(id)) return;

    pendingDoneRef.current.add(id);
    setPendingDoneIds(new Set(pendingDoneRef.current));
    setActionError(null);

    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isDone: true }),
      });

      if (!res.ok) {
        throw new Error(`PATCH failed with status ${res.status}`);
      }

      // Only isDone changes locally; isRead and all other fields are preserved.
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isDone: true } : n)
      );
    } catch (err) {
      console.error("PATCH_DONE_ERROR:", err);
      setActionError("Could not mark notification as done. Please try again.");
    } finally {
      pendingDoneRef.current.delete(id);
      setPendingDoneIds(new Set(pendingDoneRef.current));
    }
  };

  return (
    <>
      <div
        onClick={() => {
          setIsOpen(true);
          fetchNotifications(); // 4. გვერდის გახსნისას ეგრევე განვაახლოთ
        }}
        className='relative group cursor-pointer'
      >
        <div className='p-2.5 bg-white border border-gray-100 flex items-center justify-center rounded-xl shadow-sm group-hover:bg-gray-50 transition-all duration-200'>
          {unreadCount > 0 && (
            <span className='absolute top-2 right-2 flex h-3 w-3 z-10'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-red-500 border-2 border-white'></span>
            </span>
          )}

          {/* აიაქონი შეიცვალოს ფერით თუ არის წაუკითხავი */}
          <button className={`${unreadCount > 0 ? 'text-indigo-600' : 'text-gray-600'} group-hover:text-indigo-600 transition-colors`}>
            <IoNotifications size={22} />
          </button>
        </div>
      </div>

      <NotificationSidebar
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        notifications={notifications}
        onMarkRead={markAsRead}
        onMarkDone={markAsDone}
        pendingDoneIds={pendingDoneIds}
        actionError={actionError}
        onOpenBuyer={(buyerId) => {
          setIsOpen(false);
          router.push(`/buyers?buyerId=${encodeURIComponent(buyerId)}`);
        }}
      />
    </>
  )
}
