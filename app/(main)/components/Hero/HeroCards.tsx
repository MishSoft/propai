import React from 'react'
import { IconType } from 'react-icons';
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

interface HeroCardsProps {
  title: string;
  icon: IconType;
  number: string | number; // სტატისტიკისთვის ხშირად string-იც გვჭირდება (მაგ: $2.4k)
  increment: string;
}

export default function HeroCards({ title, icon: Icon, number, increment }: HeroCardsProps) {
  const isNegative = increment.startsWith("-");

  return (
    <div className='p-5 border border-gray-100 shadow-sm bg-white rounded-2xl flex flex-col gap-4 w-full transition-all hover:shadow-md'>

      <div className='flex items-center justify-between'>
        <h3 className='text-[12px] text-gray-400 font-bold uppercase tracking-wider'>
          {title}
        </h3>
        <div className='p-2 bg-gray-50 rounded-lg text-gray-500'>
          <Icon size={20} />
        </div>
      </div>

      <div className='flex flex-col gap-1'>
        <h2 className='text-3xl font-bold text-gray-900 tracking-tight'>
          {number}
        </h2>

        <div className={`flex items-center gap-1.5 text-sm font-medium ${isNegative ? "text-rose-500" : "text-emerald-500"}`}>
          <span className={`flex items-center justify-center p-1 rounded-full ${isNegative ? "bg-rose-50" : "bg-emerald-50"}`}>
            {isNegative ? <FaArrowTrendDown size={12} /> : <FaArrowTrendUp size={12} />}
          </span>
          <span>{increment.replace("-", "")}</span>
        </div>
      </div>

    </div>
  )
}
