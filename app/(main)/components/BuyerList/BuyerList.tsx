import React from 'react';
import { BuyerCard } from "../BuyerCard/BuyerCard"
import { Buyer } from '@/types/buyer';

interface BuyerListProps {
  buyers: Buyer[];
  onViewDetails: (buyer: Buyer) => void;
  // 1. დავამატეთ onDelete ინტერფეისში
  onDelete: (id: string) => void;
}

// 2. მივიღეთ onDelete პროპსებიდან
export const BuyerList: React.FC<BuyerListProps> = ({ buyers, onViewDetails, onDelete }) => {
  if (buyers.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-24 text-center">
        <div className="max-w-xs mx-auto">
          <p className="text-gray-400 font-medium">კლიენტების სია ცარიელია</p>
          <p className="text-gray-300 text-sm mt-1">ახალი მოთხოვნები აქ გამოჩნდება</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {buyers.map((buyer) => (
        <BuyerCard
          key={buyer.id}
          buyer={buyer}
          onViewDetails={onViewDetails}
          // 3. გადავაწოდეთ ფუნქცია თითოეულ ბარათს
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
