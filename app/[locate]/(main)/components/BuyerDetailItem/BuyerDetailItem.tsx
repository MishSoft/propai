import React from 'react';

interface DetailItemProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const BuyerDetailItem: React.FC<DetailItemProps> = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 border border-gray-100">
    <div className="p-2 bg-white rounded-lg shadow-sm text-purple-600">
      <Icon size={18} />
    </div>
    <div>
      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value}</p>
    </div>
  </div>
);

export default BuyerDetailItem;
