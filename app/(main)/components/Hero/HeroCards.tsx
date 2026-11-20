import React from 'react'
import { IconType } from 'react-icons';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface HeroCardsProps {
  title: string;
  icon: IconType;
  number?: string | number;
  increment: string;
  priceValue?: number | string
}

export default function HeroCards({ title, icon: Icon, number, increment = "0", priceValue }: HeroCardsProps) {
  const isNegative = increment.startsWith("-");

  return (
    <div className='p-6 glass-card flex flex-col gap-5 w-full transition-all hover:scale-[1.02] cursor-default bg-white/90 shadow-2xl shadow-slate-200/50'>

      <div className='flex items-center justify-between'>
        <h3 className='text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]'>
          {title}
        </h3>
        <div className='p-2.5 bg-slate-50 rounded-xl text-slate-400 border border-slate-100'>
          <Icon size={22} />
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <h2 className='text-3xl font-black text-slate-900 tracking-tighter'>
          {priceValue ?? number ?? 0}
        </h2>

        <div className={`flex items-center gap-2 text-xs font-black uppercase tracking-wider ${isNegative ? "text-rose-600" : "text-emerald-600"}`}>
          <span className={`flex items-center justify-center p-1 rounded-full ${isNegative ? "bg-rose-50" : "bg-emerald-50"}`}>
            {isNegative ? <FaArrowTrendDown size={12} /> : <FaArrowTrendUp size={12} />}
          </span>
          <span>{increment.replace("-", "")}</span>
        </div>
      </div>

    </div>
  )
}
