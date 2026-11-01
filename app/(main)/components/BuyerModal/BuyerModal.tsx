"use client";

import React from 'react';
import {
  IoClose, IoCall, IoLocation, IoPricetag,
  IoBusiness, IoBed, IoWater, IoLayers,
  IoInformationCircle, IoCalendar, IoStatsChart
} from "react-icons/io5";
import { Buyer } from '@/types/buyer';
import { useTranslations } from 'next-intl';

interface BuyerModalProps {
  buyer: Buyer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BuyerModal: React.FC<BuyerModalProps> = ({ buyer, isOpen, onClose }) => {
  const t = useTranslations('Buyers');
  const common = useTranslations('Common');
  const listingsT = useTranslations('Listings');

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
      <div className="relative w-full max-w-2xl bg-white border border-slate-100 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header - Gradient Background */}
        <div className="relative h-48 bg-slate-900 p-10 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 opacity-50" />
          
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2.5 bg-white/10 hover:bg-white text-white hover:text-slate-900 rounded-full transition-all duration-300 z-10 backdrop-blur-md border border-white/10"
          >
            <IoClose size={24} />
          </button>

          <div className="relative mt-2">
            <span className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-600/20">
              {isSale ? listingsT('for_sale') : listingsT('for_rent')}
            </span>
            <h2 className="text-4xl font-black mt-3 leading-none tracking-tighter uppercase">{buyer.name}</h2>
            <div className="flex flex-wrap items-center gap-6 mt-5 opacity-80 text-xs font-bold uppercase tracking-wider">
              <a href={`tel:${buyer.phone}`} className="flex items-center gap-2 hover:text-purple-400 transition-colors">
                <IoCall size={18} className="text-purple-400" /> {buyer.phone}
              </a>
              <div className="flex items-center gap-2">
                <IoLocation size={18} className="text-purple-400" /> {buyer.location}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto custom-scrollbar bg-white">

          {/* Section 1: ფინანსები და ტიპი */}
          <div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              {t('main_requirements') || 'Main Requirements'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('budget')}</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">${buyer.budget.toLocaleString()}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('property_type') || 'Property Type'}</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter">{buyer.propertyType}</p>
              </div>
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">{t('status')}</p>
                <p className="text-xl font-black text-slate-900 tracking-tighter capitalize">{buyer.status}</p>
              </div>
            </div>
          </div>

          {/* Section 2: დეტალური პარამეტრები */}
          <div>
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 flex items-center gap-2.5">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
              {t('property_details') || 'Property Details'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-purple-600 border border-slate-50"><IoBed size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{listingsT('rooms')}</p>
                  <p className="font-black text-slate-900 text-lg tracking-tighter">{buyer.minRooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-blue-500 border border-slate-50"><IoWater size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{listingsT('baths')}</p>
                  <p className="font-black text-slate-900 text-lg tracking-tighter">{buyer.minBaths}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-orange-500 border border-slate-50"><IoStatsChart size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">{t('floor') || 'Floor'}</p>
                  <p className="font-black text-slate-900 text-lg tracking-tighter capitalize">{(buyer as any).floor || 'Any'}</p>
                </div>
              </div>
              <div className="flex items-center gap-5 p-5 rounded-3xl bg-slate-50 border border-slate-100 shadow-sm group hover:bg-white transition-colors">
                <div className="p-4 bg-white rounded-2xl shadow-sm text-green-500 border border-slate-50"><IoInformationCircle size={22} /></div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">ID CODE</p>
                  <p className="font-black text-slate-900 text-lg tracking-tighter">{generateNumericId(buyer.id)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: დამატებითი კომენტარი */}
          <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><IoInformationCircle size={60} className="text-indigo-600" /></div>
            <h4 className="text-[11px] font-black text-indigo-600 uppercase tracking-widest mb-3">{t('client_comment') || 'Client Comment'}:</h4>
            <p className="text-slate-700 leading-relaxed font-medium italic text-sm">
              "{buyer.description || "No description provided."}"
            </p>
          </div>

          {/* Footer Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-100">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-black uppercase tracking-widest">
              <IoCalendar className="text-purple-600" size={16} /> {t('added') || 'Added'}: {new Date(buyer.createdAt).toLocaleDateString()}
            </div>
            {telHref ? (
              <a
                href={telHref}
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-center text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-purple-600 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer"
              >
                {t('contact_client')}
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 opacity-50 cursor-not-allowed"
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
