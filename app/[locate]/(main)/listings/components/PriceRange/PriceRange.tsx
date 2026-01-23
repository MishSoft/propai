"use client"
import React, { useState } from 'react'
import { HiOutlineCurrencyDollar } from "react-icons/hi2";

export default function PriceRange() {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  return (
    <section className="bg-white border border-slate-200 rounded-xl p-4 w-fit">
      <h3 className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mb-3 px-1">
        Price Range
      </h3>

      <div className="flex items-center gap-3">
        {/* Min Price Input */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors">
            <HiOutlineCurrencyDollar size={18} />
          </div>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-28 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Divider */}
        <div className="h-px w-3 bg-slate-300" />

        {/* Max Price Input */}
        <div className="relative group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors">
            <HiOutlineCurrencyDollar size={18} />
          </div>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-28 pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-slate-400"
          />
        </div>
      </div>
    </section>
  )
}
