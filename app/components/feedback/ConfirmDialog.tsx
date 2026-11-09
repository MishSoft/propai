"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { lockBodyScroll } from "@/lib/scroll-lock";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface OpenDialog {
  id: symbol;
  element: HTMLDivElement;
  initialFocus: HTMLButtonElement;
  previouslyFocused: HTMLElement | null;
}

const openDialogs: OpenDialog[] = [];

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "default",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = useTranslations("Common");
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);
  const pendingRef = useRef(false);
  const operationRef = useRef(0);
  const mountedRef = useRef(false);
  const onCancelRef = useRef(onCancel);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  onCancelRef.current = onCancel;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setError(null);
      return;
    }

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const releaseScrollLock = lockBodyScroll();
    cancelButtonRef.current?.focus();
    const dialog = dialogRef.current;
    const initialFocus = cancelButtonRef.current;
    if (!dialog || !initialFocus) {
      releaseScrollLock();
      return;
    }

    const entry: OpenDialog = {
      id: Symbol("confirm-dialog"),
      element: dialog,
      initialFocus,
      previouslyFocused,
    };
    openDialogs.push(entry);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (openDialogs[openDialogs.length - 1]?.id !== entry.id) return;

      if (event.key === "Escape") {
        event.preventDefault();
        if (!pendingRef.current) onCancelRef.current();
        return;
      }

      if (event.key !== "Tab") return;
      const focusable = Array.from(
        entry.element.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      if (focusable.length === 0) {
        event.preventDefault();
        entry.element.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const insideDialog = active instanceof Node && entry.element.contains(active);

      if (event.shiftKey && (active === first || !insideDialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !insideDialog)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      const stackIndex = openDialogs.findIndex((openDialog) => openDialog.id === entry.id);
      const wasTopmost = stackIndex === openDialogs.length - 1;
      if (stackIndex !== -1) openDialogs.splice(stackIndex, 1);

      const nextTop = openDialogs[openDialogs.length - 1];
      if (nextTop && entry.element.contains(nextTop.previouslyFocused)) {
        nextTop.previouslyFocused = entry.previouslyFocused;
      }

      releaseScrollLock();
      if (!wasTopmost) return;

      const target = entry.previouslyFocused;
      if (target?.isConnected && (!nextTop || nextTop.element.contains(target))) {
        target.focus();
      } else if (nextTop) {
        nextTop.initialFocus.focus();
      } else {
        target?.focus();
      }
    };
  }, [isOpen]);

  const confirm = async () => {
    if (pendingRef.current) return;

    const operationId = ++operationRef.current;
    pendingRef.current = true;
    setPending(true);
    setError(null);
    try {
      await onConfirm();
    } catch (reason) {
      if (operationId === operationRef.current && mountedRef.current) {
        setError(reason instanceof Error ? reason.message : t("confirm_error"));
      }
    } finally {
      if (operationId === operationRef.current) {
        pendingRef.current = false;
        if (mountedRef.current) setPending(false);
      }
    }
  };

  const cancel = () => {
    if (!pendingRef.current) onCancel();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center overflow-y-auto p-4">
      <button
        type="button"
        tabIndex={-1}
        aria-label={t("cancel")}
        className="absolute inset-0 cursor-default bg-slate-900/50 backdrop-blur-sm"
        onClick={cancel}
      />
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
        className="relative my-auto w-full max-w-md min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl sm:p-6"
      >
        <h2 id={titleId} className="break-words text-lg font-bold text-slate-900 sm:text-xl">
          {title}
        </h2>
        <p id={descriptionId} className="mt-2 break-words text-sm leading-6 text-slate-600">
          {description}
        </p>
        {error && (
          <p role="alert" className="mt-4 break-words text-sm text-red-700">
            {error}
          </p>
        )}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            ref={cancelButtonRef}
            type="button"
            disabled={pending || pendingRef.current}
            onClick={cancel}
            className="min-h-11 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelLabel ?? t("cancel")}
          </button>
          <button
            type="button"
            disabled={pending || pendingRef.current}
            onClick={confirm}
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${
              variant === "destructive"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-purple-700 hover:bg-purple-800"
            }`}
          >
            {pending ? t("confirming") : confirmLabel ?? t("confirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
