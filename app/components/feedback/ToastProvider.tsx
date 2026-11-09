"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { IoClose } from "react-icons/io5";
import { useTranslations } from "next-intl";

export type ToastVariant = "success" | "error" | "info";

export interface ToastOptions {
  title?: string;
  duration?: number;
}

export interface ToastInput extends ToastOptions {
  message: string;
  variant: ToastVariant;
}

interface ToastRecord extends ToastInput {
  id: number;
}

export interface ToastApi {
  show: (input: ToastInput) => number;
  success: (message: string, options?: ToastOptions) => number;
  error: (message: string, options?: ToastOptions) => number;
  info: (message: string, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success: "border-emerald-200 text-emerald-800",
  error: "border-red-200 text-red-800",
  info: "border-purple-200 text-slate-800",
};

function ToastItem({
  toast,
  onDismiss,
  dismissLabel,
}: {
  toast: ToastRecord;
  onDismiss: (id: number) => void;
  dismissLabel: string;
}) {
  const isError = toast.variant === "error";

  return (
    <div
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      className={`pointer-events-auto flex min-w-0 items-start gap-3 rounded-xl border bg-white p-4 shadow-lg ${variantStyles[toast.variant]}`}
    >
      <div className="min-w-0 flex-1">
        {toast.title && <p className="font-semibold">{toast.title}</p>}
        <p className="wrap-break-word text-sm leading-5">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label={dismissLabel}
        className="shrink-0 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500"
      >
        <IoClose size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const t = useTranslations("Common");
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback((input: ToastInput) => {
    const id = ++nextId.current;
    setToasts((current) => [...current, { ...input, id }]);
    return id;
  }, []);

  const api: ToastApi = {
    show,
    success: (message, options) => show({ ...options, message, variant: "success" }),
    error: (message, options) => show({ ...options, message, variant: "error" }),
    info: (message, options) => show({ ...options, message, variant: "info" }),
    dismiss,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[1100] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
        {toasts.map((toast) => (
          <ToastWithTimer
            key={toast.id}
            toast={toast}
            onDismiss={dismiss}
            dismissLabel={t("dismiss")}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastWithTimer({
  toast,
  onDismiss,
  dismissLabel,
}: {
  toast: ToastRecord;
  onDismiss: (id: number) => void;
  dismissLabel: string;
}) {
  const duration = toast.duration ?? 5000;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => onDismiss(toast.id), duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onDismiss, toast.id]);

  return <ToastItem toast={toast} onDismiss={onDismiss} dismissLabel={dismissLabel} />;
}

export function useToast(): ToastApi {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
