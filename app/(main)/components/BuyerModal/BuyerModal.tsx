"use client";

import React, { useEffect, useId, useRef } from 'react';
import {
  IoClose, IoCall, IoLocation, IoPricetag,
  IoBusiness, IoBed, IoWater, IoLayers,
  IoInformationCircle, IoCalendar, IoStatsChart
} from "react-icons/io5";
import { Buyer } from '@/types/buyer';
import { useTranslations } from 'next-intl';
import { lockBodyScroll } from '@/lib/scroll-lock';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface BuyerModalProps {
  buyer: Buyer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BuyerModal: React.FC<BuyerModalProps> = ({ buyer, isOpen, onClose }) => {
  const t = useTranslations('Buyers');
  const common = useTranslations('Common');
  const listingsT = useTranslations('Listings');
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);
  const isVisible = isOpen && buyer !== null;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isVisible) return;

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
  }, [isVisible]);

  if (!isOpen || !buyer) return null;

  const generateNumericId = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 1000000).toString().padStart(6, '0');
  };

  const cleanedPhone = (buyer.phone ?? '').replace(/[^\d+]/g, '');
  const telHref = cleanedPhone.replace(/\D/g, '').length >= 5 ? `tel:${cleanedPhone}` : null;

  const isSale = buyer.category === 'Buy' || buyer.category === 'Sale';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex flex-col w-full max-w-2xl max-h-[90dvh] bg-white border border-slate-100 rounded-[2rem] sm:rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
      >

        {/* Header - Gradient Background */}
        <div className="relative shrink-0 min-h-0 sm:min-h-[12rem] p-5 pt-14 sm:p-10 text-white overflow-hidden bg-slate-900">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 opacity-50" />
          
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={common('close')}
            className="absolute top-3 right-3 sm:top-8 sm:right-8 flex h-11 w-11 sm:h-auto sm:w-auto items-center justify-center p-2 sm:p-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all duration-300 z-10 backdrop-blur-md border border-white/10"
          >
            <IoClose size={24} />
          </button>

          <div className="relative mt-2">
            <span className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-600/20">
              {isSale ? listingsT('for_sale') : listingsT('for_rent')}
            </span>
            <h2 id={titleId} className="text-xl sm:text-4xl font-black mt-2 sm:mt-3 pr-12 sm:pr-0 leading-tight tracking-tighter uppercase wrap-anywhere">{buyer.name}</h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:gap-x-6 sm:gap-y-3 mt-3 sm:mt-5 opacity-80 text-xs font-bold uppercase tracking-wider">
              {telHref ? (
                <a href={telHref} className="flex min-w-0 max-w-full items-center gap-2 wrap-anywhere hover:text-purple-400 transition-colors">
                  <IoCall size={18} className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 text-purple-400" /> {buyer.phone}
                </a>
              ) : (
                <span className="flex min-w-0 max-w-full items-center gap-2 wrap-anywhere">
                  <IoCall size={18} className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 text-purple-400" /> {buyer.phone}
                </span>
              )}
              <div className="flex min-w-0 max-w-full items-center gap-2 wrap-anywhere">
                <IoLocation size={18} className="h-4 w-4 sm:h-[18px] sm:w-[18px] shrink-0 text-purple-400" /> {buyer.location}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 p-4 sm:p-10 space-y-6 sm:space-y-10 overflow-y-auto overscroll-contain custom-scrollbar bg-white">

          {/* Section 1: ფინანსები და ტიპი */}
          <div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 sm:mb-6 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              {t('main_requirements')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
              <div className="p-3.5 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm min-w-0">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('budget')}</p>
                <p className="text-base sm:text-xl font-black text-slate-900 tracking-tighter wrap-anywhere">${buyer.budget.toLocaleString()}</p>
              </div>
              <div className="p-3.5 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm min-w-0">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('property_type')}</p>
                <p className="text-base sm:text-xl font-black text-slate-900 tracking-tighter wrap-anywhere">{buyer.propertyType}</p>
              </div>
              <div className="p-3.5 sm:p-5 bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-100 shadow-sm min-w-0">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('status')}</p>
                <p className="text-base sm:text-xl font-black text-slate-900 tracking-tighter capitalize wrap-anywhere">{buyer.status}</p>
              </div>
            </div>
          </div>

          {/* Section 2: დეტალური პარამეტრები */}
          <div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 sm:mb-6 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              {t('property_details')}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-5">
              <div className="flex items-center gap-3 sm:gap-5 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors min-w-0">
                <div className="p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm text-purple-600 border border-slate-50 shrink-0"><IoBed size={22} className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{listingsT('rooms')}</p>
                  <p className="font-black text-slate-900 text-base sm:text-lg tracking-tighter wrap-anywhere">{buyer.minRooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors min-w-0">
                <div className="p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm text-blue-500 border border-slate-50 shrink-0"><IoWater size={22} className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{listingsT('baths')}</p>
                  <p className="font-black text-slate-900 text-base sm:text-lg tracking-tighter wrap-anywhere">{buyer.minBaths}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors min-w-0">
                <div className="p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm text-orange-500 border border-slate-50 shrink-0"><IoStatsChart size={22} className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{t('floor')}</p>
                  <p className="font-black text-slate-900 text-base sm:text-lg tracking-tighter wrap-anywhere">{buyer.floor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-5 p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors min-w-0">
                <div className="p-2.5 sm:p-4 bg-white rounded-xl sm:rounded-2xl shadow-sm text-green-500 border border-slate-50 shrink-0"><IoInformationCircle size={22} className="h-[18px] w-[18px] sm:h-[22px] sm:w-[22px]" /></div>
                <div className="min-w-0">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{t('id_code')}</p>
                  <p className="font-black text-slate-900 text-base sm:text-lg tracking-tighter wrap-anywhere">{generateNumericId(buyer.id)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: დამატებითი კომენტარი */}
          <div className="p-5 sm:p-8 bg-indigo-50/50 rounded-3xl sm:rounded-[2.5rem] border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><IoInformationCircle size={60} className="text-indigo-600" /></div>
            <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-2 sm:mb-3">{t('client_comment')}:</h4>
            <p className="text-slate-700 leading-relaxed font-medium italic text-sm break-words wrap-anywhere">
              "{buyer.description?.trim() || t('no_description')}"
            </p>
          </div>

          {/* Footer Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 pt-5 sm:pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase tracking-widest wrap-anywhere">
              <IoCalendar className="text-purple-600 shrink-0" size={16} /> {t('added')}: {new Date(buyer.createdAt).toLocaleDateString()}
            </div>
            {telHref ? (
              <a
                href={telHref}
                className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center px-6 py-3.5 sm:px-10 sm:py-4 bg-slate-900 text-white text-center text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-600 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer"
              >
                {t('contact_client')}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center px-6 py-3.5 sm:px-10 sm:py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 opacity-50 cursor-not-allowed"
              >
                {t('contact_client')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
