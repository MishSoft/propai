"use client"
import React, { useEffect, useId, useRef } from 'react';
import { useUiStore } from '@/store/useUiStore';
import { IoCloseOutline } from "react-icons/io5";
import { useTranslations } from 'next-intl';
import { lockBodyScroll } from '@/lib/scroll-lock';
import Gallery from './Gallery';
import DetailsInfo from './DetailsInfo';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function ListingDetails() {
  const { selectedListing: item, closeDetailsModal } = useUiStore();
  const common = useTranslations('Common');
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(closeDetailsModal);
  const isOpen = Boolean(item);

  useEffect(() => {
    onCloseRef.current = closeDetailsModal;
  }, [closeDetailsModal]);

  useEffect(() => {
    if (!isOpen) return;

    const releaseScrollLock = lockBodyScroll();
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const insideDialog = active instanceof Node && dialogRef.current.contains(active);

      if (event.shiftKey && (active === first || !insideDialog)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !insideDialog)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      releaseScrollLock();
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6 lg:p-8 overflow-hidden">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={closeDetailsModal}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative bg-white w-full max-w-6xl h-[100dvh] md:h-[90dvh] md:rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-10 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id={titleId} className="sr-only">{item.street}, {item.city}</h2>

        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-[110]">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDetailsModal}
            aria-label={common('close')}
            className="flex h-11 w-11 items-center justify-center bg-white/90 md:bg-slate-50 hover:bg-white text-slate-900 md:text-slate-400 rounded-full shadow-xl md:shadow-none border border-slate-200 transition-all cursor-pointer"
          >
            <IoCloseOutline size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="md:col-span-6 h-[35dvh] md:h-full min-h-0 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 relative shrink-0">
          <Gallery images={item.images} />
        </div>

        <div className="md:col-span-4 h-[65dvh] md:h-full min-h-0 flex flex-col relative bg-white overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6 md:px-8 lg:px-10 md:py-8 flex flex-col custom-scrollbar">
            <DetailsInfo item={item} />
          </div>
        </div>

      </div>
    </div>
  );
}
