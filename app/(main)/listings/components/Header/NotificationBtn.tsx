"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { IoNotifications } from "react-icons/io5";
import NotificationSidebar from '../notification/notification';

// 1. აღვწეროთ ზუსტი ინტერფეისი ნაცვლად any-სა
interface Notification {
  id: string;
  isRead: boolean;
  message: string;
  type: string;
  createdAt: string;
}

export default function NotificationBtn() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // 2. გამოვიყენოთ ტიპიზირებული filter
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // 3. fetchNotifications გავხადოთ useCallback, რომ ზედმეტი რენდერები ავიცილოთ
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
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
      />
    </>
  )
}
