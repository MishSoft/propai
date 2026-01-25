import React from 'react';
import {
  IoClose, IoCall, IoLocation, IoPricetag,
  IoBusiness, IoBed, IoWater, IoLayers,
  IoInformationCircle, IoCalendar, IoStatsChart
} from "react-icons/io5";
import { Buyer } from '@/types/buyer';

interface BuyerModalProps {
  buyer: Buyer | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BuyerModal: React.FC<BuyerModalProps> = ({ buyer, isOpen, onClose }) => {
  if (!isOpen || !buyer) return null;

  // ფუნქცია, რომელიც სტრინგ ID-ს გარდაქმნის ციფრულ ID-დ
  const generateNumericId = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash % 1000000).toString().padStart(6, '0');
  };
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header - Gradient Background */}
        <div className="relative h-40 bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all"
          >
            <IoClose size={24} />
          </button>

          <div className="mt-4">
            <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold uppercase tracking-widest">
              {buyer.category === 'Buy' ? 'ყიდვა' : 'ქირა'}
            </span>
            <h2 className="text-3xl font-black mt-2 leading-none">{buyer.name}</h2>
            <div className="flex items-center gap-4 mt-3 opacity-90">
              <a href={`tel:${buyer.phone}`} className="flex items-center gap-1.5 hover:underline font-medium">
                <IoCall size={18} /> {buyer.phone}
              </a>
              <div className="flex items-center gap-1.5 font-medium">
                <IoLocation size={18} /> {buyer.location}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">

          {/* Section 1: ფინანსები და ტიპი */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 text-balance">
              <IoPricetag /> ძირითადი მოთხოვნები
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] text-gray-500 font-bold uppercase">ბიუჯეტი</p>
                <p className="text-lg font-black text-indigo-600">${buyer.budget.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] text-gray-500 font-bold uppercase">ქონების ტიპი</p>
                <p className="text-lg font-black text-gray-800">{buyer.propertyType}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-3xl border border-gray-100">
                <p className="text-[10px] text-gray-500 font-bold uppercase">სტატუსი</p>
                <p className="text-lg font-black text-gray-800">{buyer.status}</p>
              </div>
            </div>
          </div>

          {/* Section 2: დეტალური პარამეტრები */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <IoBusiness /> ბინის დეტალები
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-purple-600"><IoBed size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">ოთახები</p>
                  <p className="font-bold text-gray-800">{buyer.minRooms}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-blue-500"><IoWater size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">სველი წერტილი</p>
                  <p className="font-bold text-gray-800">{buyer.minBaths}</p>
                </div>
              </div>
              {/* სართულის ველი */}
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-orange-500"><IoStatsChart size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">სართული</p>
                  <p className="font-bold text-gray-800">{(buyer as Buyer).floor || 'ნებისმიერი'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 border border-slate-100">
                <div className="p-3 bg-white rounded-2xl shadow-sm text-green-500"><IoInformationCircle size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">ID კოდი</p>
                  <p className="font-bold text-gray-800">{generateNumericId(buyer.id)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: დამატებითი კომენტარი */}
          <div className="p-6 bg-amber-50 rounded-4xl border border-amber-100">
            <h4 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">კლიენტის კომენტარი:</h4>
            <p className="text-gray-700 leading-relaxed italic">
              {buyer.description || "დამატებითი აღწერა არ არის მითითებული."}
            </p>
          </div>

          {/* Footer Stats */}
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold pt-4 border-t border-gray-100">
            <div className="flex items-center gap-1">
              <IoCalendar /> დაემატა: {new Date(buyer.createdAt).toLocaleDateString('ka-GE')}
            </div>
            <button
              onClick={() => window.open(`tel:${buyer.phone}`)}
              className="px-8 py-3 bg-gray-900 text-white rounded-2xl hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95 font-bold"
            >
              დაუკავშირდი კლიენტს
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
