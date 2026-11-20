import React from 'react';
import { IconType } from 'react-icons';

interface ActivityCardProps {
  icon: IconType;
  text: string;
  time: string;
}

export default function ActivityCard({ icon: Icon, text, time }: ActivityCardProps) {
  return (
    <div className="flex items-center px-5 py-4 w-full gap-5 transition-all duration-200 hover:bg-slate-50/50 border-b border-slate-100 last:border-none group cursor-default">

      {/* აიქონის კონტეინერი */}
      <div className="shrink-0 flex items-center justify-center p-3 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300 border border-slate-100 shadow-sm">
        <Icon size={20} />
      </div>

      <div className="flex flex-col gap-0.5 min-w-0">
        <h2 className="text-sm font-black text-slate-900 leading-tight truncate tracking-tight" title={text}>
          {text}
        </h2>
        <span className="text-slate-500 text-[11px] font-bold uppercase tracking-wider opacity-60">
          {time}
        </span>
      </div>

    </div>
  );
}
