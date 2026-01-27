import React from 'react';
import { BuyerCard } from "../BuyerCard/BuyerCard"
import { Buyer } from '@/types/buyer';

interface BuyerListProps {
  buyers: Buyer[];
  onViewDetails: (buyer: Buyer) => void;
  onDelete: (id: string) => void;
}

export const BuyerList: React.FC<BuyerListProps> = ({ buyers, onViewDetails, onDelete }) => {
  if (buyers.length === 0) {
    return (
      /* p-24 შევცვალეთ px-6 py-12-ით, რომ მობილურზე დაეტიოს */
      <div className="bg-white border border-dashed border-gray-200 rounded-3xl px-6 py-12 sm:py-24 text-center w-full">
        <div className="max-w-xs mx-auto">
          <p className="text-gray-400 font-medium">კლიენტების სია ცარიელია</p>
          <p className="text-gray-300 text-sm mt-1">ახალი მოთხოვნები აქ გამოჩნდება</p>
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
