"use client"
import React, { useState } from 'react'
import { IoSearchOutline } from "react-icons/io5";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function Search() {
  const [query, setQuery] = useState('');

  return (
    <section className="w-full max-w-md">
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors duration-200">
          <IoSearchOutline size={20} />
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search listings, buyers or locations..."
          className="w-full pl-12 pr-10 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-50 transition-all text-sm font-medium text-slate-600 placeholder:text-slate-400 shadow-sm"
        />

        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <IoCloseCircleOutline size={20} />
          </button>
        )}

        {/* Keyboard Shortcut Indicator (Optional - "Premium" შეგრძნებისთვის) */}
        {!query && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-1.5 py-0.5 border border-slate-200 rounded text-[10px] font-bold text-slate-400 bg-slate-50">
            <span>⌘</span>
            <span>K</span>
          </div>
        )}
      </div>
    </section>
  )
}
