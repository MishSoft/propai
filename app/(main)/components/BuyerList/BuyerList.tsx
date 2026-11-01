import React from 'react';
import { BuyerCard } from "../BuyerCard/BuyerCard"
import { Buyer } from '@/types/buyer';

interface BuyerListProps {
  buyers: Buyer[];
  onViewDetails: (buyer: Buyer) => void;
  onDelete: (id: string) => void;
}

import { useTranslations } from 'next-intl';

export const BuyerList: React.FC<BuyerListProps> = ({ buyers, onViewDetails, onDelete }) => {
  const common = useTranslations('Common');
  const t = useTranslations('Buyers');

  if (buyers.length === 0) {
    return (
      <div className="glass-card px-6 py-12 sm:py-24 text-center w-full border-dashed border-slate-200 bg-white/90 shadow-2xl shadow-slate-200/50">
        <div className="max-w-xs mx-auto">
          <p className="text-slate-900 font-black tracking-tighter uppercase text-lg">List is empty</p>
          <p className="text-slate-500 text-sm mt-2 font-medium tracking-tight">New requests from potential clients will appear here</p>
        </div>
      </div>
    );
  }

  return (
    /* შევცვალეთ gap-8 -> gap-4 მობილურზე, gap-6/8 დიდზე. დავამატეთ w-full */
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {buyers.map((buyer) => (
        <BuyerCard
          key={buyer.id}
          buyer={buyer}
          onViewDetails={onViewDetails}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
