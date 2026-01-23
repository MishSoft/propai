import React from 'react';
import { IoCallOutline, IoLocationOutline, IoPricetagOutline, IoTimeOutline, IoBusinessOutline } from "react-icons/io5";
import { Buyer } from "@/types/buyer"

interface BuyerCardProps {
  buyer: Buyer;
  onViewDetails: (buyer: Buyer) => void;
}

export const BuyerCard: React.FC<BuyerCardProps> = ({ buyer, onViewDetails }) => {
  return (
    <div className="bg-white flex flex-col justify-between border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden group">
      {/* Category Badge */}
      <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${buyer.category === "Sale"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-blue-100 text-blue-700"
        }`}>
        {buyer.category === "Sale" ? "ყიდვა" : "ქირა"}
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-purple-700 transition-colors">
        {buyer.name}
      </h3>

      <div className="flex items-center text-purple-600 font-semibold mb-4 text-sm">
        <IoCallOutline className="mr-1.5" size={16} />
        <span>{buyer.phone}</span>
      </div>

      <div className="space-y-3 text-sm text-gray-600 border-t border-gray-50 pt-4">
        <div className="flex items-center gap-2.5">
          <IoLocationOutline className="text-gray-400" size={18} />
          <span className="truncate">{buyer.location}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <IoBusinessOutline className="text-gray-400" size={18} />
          <span>{buyer.propertyType}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <IoPricetagOutline className="text-gray-400" size={18} />
          <span className="font-bold text-gray-900">
            ${buyer.budget.toLocaleString()}
          </span>
        </div>
      </div>

      {buyer.description && (
        <div className="mt-4 p-3 bg-gray-50/50 rounded-xl text-[12px] text-gray-500 leading-relaxed border border-transparent hover:border-gray-100 transition-colors">
          <p className="line-clamp-2 italic">"{buyer.description}"</p>
        </div>
      )}

      <button onClick={() => onViewDetails(buyer)} className="w-full cursor-pointer mt-5 py-3 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-purple-700 active:scale-[0.98] transition-all duration-200 shadow-sm shadow-gray-200">
        დეტალების ნახვა
      </button>
    </div>
  );
};
