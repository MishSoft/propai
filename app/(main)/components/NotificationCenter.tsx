"use client"
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { IoClose } from "react-icons/io5";
import NotificationSidebar from '../listings/components/notification/notification';
import { AppNotification, useNotificationStore } from '@/store/useNotificationStore';

const POLL_INTERVAL_MS = 15000;
const TOAST_DURATION_MS = 6000;
const MAX_TOASTS = 3;

interface NotificationToast {
  id: string;
  message: string;
  buyerId: string | null;
}

interface NotificationToastItemProps extends NotificationToast {
  onOpen: (toast: NotificationToast) => void;
  onDismiss: (id: string) => void;
}

function NotificationToastItem({ id, message, buyerId, onOpen, onDismiss }: NotificationToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(id), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [id, onDismiss]);

  const content = (
    <>
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-purple-700">New notification</span>
      <span className="mt-0.5 block wrap-break-word text-sm leading-5 text-slate-900">{message}</span>
    </>
  );

  return (
    <div
      role="status"
      className="pointer-events-auto flex items-start gap-2 rounded-xl border border-purple-200 bg-white px-3 py-2.5 shadow-lg"
    >
      {buyerId ? (
        <button
          type="button"
          onClick={() => onOpen({ id, message, buyerId })}
          className="min-w-0 flex-1 cursor-pointer rounded-md text-left transition-colors hover:text-purple-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1"
        >
          {content}
        </button>
      ) : (
        <div className="min-w-0 flex-1">{content}</div>
      )}
      <button
        type="button"
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
        className="shrink-0 cursor-pointer rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-1"
      >
        <IoClose size={16} aria-hidden="true" />
      </button>
    </div>
  );
}

export default function NotificationCenter() {
  const router = useRouter();
  const notifications = useNotificationStore((state) => state.notifications);
  const setNotifications = useNotificationStore((state) => state.setNotifications);
  const isOpen = useNotificationStore((state) => state.isOpen);
  const closeNotifications = useNotificationStore((state) => state.closeNotifications);

  const [toasts, setToasts] = useState<NotificationToast[]>([]);
  const [pendingDoneIds, setPendingDoneIds] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  // Ref mirrors pendingDoneIds so rapid double-clicks are blocked before a re-render.
  const pendingDoneRef = useRef<Set<string>>(new Set());
  // null until the first successful poll, so notifications present at load never toast.
  const seenIdsRef = useRef<Set<string> | null>(null);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let controller: AbortController | null = null;

    const schedule = () => {
      if (!active) return;
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    // Next poll is scheduled only after this one settles, so GET requests never overlap.
    const poll = async () => {
      timer = null;
      const current = new AbortController();
      controller = current;
      const isStale = () => !active || current.signal.aborted;

      try {
        const res = await fetch('/api/notifications', { signal: current.signal, cache: 'no-store' });
        if (!res.ok) return;

        const data = (await res.json()) as AppNotification[];
        if (isStale() || !Array.isArray(data)) return;

        // Completion is final: never let a poll that raced a PATCH flip isDone back to false.
        const prev = useNotificationStore.getState().notifications;
        setNotifications(
          data.map((n) => ({
            ...n,
            isDone: Boolean(n.isDone) || prev.some((p) => p.id === n.id && p.isDone),
          }))
        );

        if (seenIdsRef.current === null) {
          seenIdsRef.current = new Set(data.map((n) => n.id));
          return;
        }

        const seen = seenIdsRef.current;
        const fresh = data.filter((n) => !seen.has(n.id));
        if (fresh.length === 0) return;

        fresh.forEach((n) => seen.add(n.id));
        setToasts((currentToasts) =>
          [
            ...fresh.map((n) => ({ id: n.id, message: n.message, buyerId: n.buyerId ?? null })),
            ...currentToasts,
          ].slice(0, MAX_TOASTS)
        );
      } catch (err) {
        if (isStale()) return;
        console.error("Fetch Notifications Error:", err);
      } finally {
        if (controller === current) controller = null;
        schedule();
      }
    };

    poll();

    return () => {
      active = false;
      if (timer !== null) clearTimeout(timer);
      controller?.abort();
    };
  }, [setNotifications]);

  const dismissToast = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const openBuyer = (buyerId: string) => {
    closeNotifications();
    router.push(`/buyers?buyerId=${encodeURIComponent(buyerId)}`);
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
      setNotifications(
        useNotificationStore.getState().notifications.map((n) =>
          n.id === id ? { ...n, isDone: true } : n
        )
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
      {toasts.length > 0 && (
        <div className="pointer-events-none fixed top-20 right-4 z-1000 flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2 sm:top-4">
          {toasts.map((toast) => (
            <NotificationToastItem
              key={toast.id}
              {...toast}
              onOpen={(t) => {
                dismissToast(t.id);
                if (t.buyerId) openBuyer(t.buyerId);
              }}
              onDismiss={dismissToast}
            />
          ))}
        </div>
      )}

      <NotificationSidebar
        isOpen={isOpen}
        onClose={closeNotifications}
        notifications={notifications}
        onMarkDone={markAsDone}
        pendingDoneIds={pendingDoneIds}
        actionError={actionError}
        onOpenBuyer={openBuyer}
      />
    </>
  )
}
