"use client";

import React, { useState } from 'react';
import {
  IoCallOutline,
  IoLocationOutline,
  IoPricetagOutline,
  IoBusinessOutline,
  IoTrashOutline
} from "react-icons/io5";
import { Buyer } from "@/types/buyer";
import { useTranslations } from 'next-intl';

interface BuyerCardProps {
  buyer: Buyer;
  onViewDetails: (buyer: Buyer) => void;
  onDelete?: (id: string) => void;
}

export const BuyerCard: React.FC<BuyerCardProps> = ({ buyer, onViewDetails, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const t = useTranslations('Buyers');
  const common = useTranslations('Common');

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!window.confirm(common('confirm_delete'))) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/buyers/${buyer.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        if (onDelete) onDelete(buyer.id);
      } else {
        const data = await res.json();
        alert(data.error || "წაშლა ვერ მოხერხდა");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("სერვერთან კავშირი ვერ დამყარდა");
    } finally {
      setIsDeleting(false);
    }
  };

  const isSale = buyer.category === "Sale" || buyer.category === "Buy";

  return (
    <div className="glass-card flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 relative overflow-hidden group hover:scale-[1.02] cursor-default bg-white/90 shadow-2xl shadow-slate-200/50 border-slate-100">

      {/* Category Badge */}
      <div className={`absolute top-3 right-3 sm:top-4 sm:right-4 text-[10px] font-black px-2.5 py-1.5 rounded-xl uppercase tracking-widest shadow-sm ${
        isSale ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-blue-50 text-blue-600 border border-blue-100"
      }`}>
        {isSale ? t('for_sale') : t('for_rent')}
      </div>

      <div className="mb-3 sm:mb-4 pr-20 min-w-0">
        <h3 className="text-base sm:text-xl font-black text-slate-900 mb-1 leading-tight tracking-tighter uppercase wrap-anywhere">
          {buyer.name}
        </h3>

        <div className="flex items-start min-w-0 text-purple-600 font-black text-xs uppercase tracking-wider">
          <IoCallOutline className="mr-1.5 mt-px shrink-0" size={16} />
          <span className="min-w-0 wrap-anywhere">{buyer.phone}</span>
        </div>
      </div>

      <div className="space-y-2.5 sm:space-y-3.5 text-sm text-slate-500 border-t border-slate-100 pt-3 sm:pt-5">
        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
          <IoLocationOutline className="text-slate-400 shrink-0 mt-px h-4 w-4 sm:h-[18px] sm:w-[18px]" size={18} />
          <span className="min-w-0 font-medium wrap-anywhere">{buyer.location}</span>
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
          <IoBusinessOutline className="text-slate-400 shrink-0 mt-px h-4 w-4 sm:h-[18px] sm:w-[18px]" size={18} />
          <span className="min-w-0 font-medium wrap-anywhere">{buyer.propertyType}</span>
        </div>
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <IoPricetagOutline className="text-slate-400 shrink-0 h-4 w-4 sm:h-[18px] sm:w-[18px]" size={18} />
          <span className="font-black text-slate-900 text-base tracking-tighter wrap-anywhere">
            ${buyer.budget.toLocaleString()}
          </span>
        </div>
      </div>

      {buyer.description && (
        <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-slate-50 rounded-2xl text-[12px] text-slate-500 leading-relaxed font-medium italic border border-slate-100">
          <p className="line-clamp-2 wrap-anywhere">"{buyer.description}"</p>
        </div>
      )}

      <div className="flex gap-2.5 sm:gap-3 mt-5 sm:mt-8">
        <button
          onClick={() => onViewDetails(buyer)}
          className="flex-[2] min-w-0 min-h-11 cursor-pointer px-2 py-3 sm:py-4 bg-purple-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-900 active:scale-[0.98] transition-all duration-300 shadow-xl shadow-purple-600/20"
        >
          {t('view_details') || 'View Details'}
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 min-w-0 min-h-11 cursor-pointer px-2 py-3 sm:py-4 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 active:scale-[0.98] transition-all duration-300 border border-slate-100"
        >
          {isDeleting ? common('saving') : (t('delete') || 'Delete')}
        </button>
      </div>
    </div>
  );
};
