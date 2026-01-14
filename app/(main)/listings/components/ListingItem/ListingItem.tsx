"use client"
import React from 'react'
import ImageItem from './Image'
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdArrowRightAlt } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";

export default function ListingItem() {
  return (
    <article className='group w-80 bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300'>
      <div className='relative overflow-hidden'>
        <ImageItem />
        <div className='absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 uppercase'>
          For Sale
        </div>
      </div>

      <div className='p-5 flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-slate-900'>$1,250,000</h2>
          <div className='flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg'>
            <FaArrowTrendUp size={12} />
            <span className='text-[11px] font-bold'>+4%</span>
          </div>
        </div>

        <div className='space-y-2'>
          <div className='flex items-center gap-1 text-slate-600'>
            <HiOutlineMapPin size={16} className='text-slate-400' />
            <p className='text-sm font-semibold truncate'>123 Maple Ave, Oak Creek, CA</p>
          </div>
          <div className='flex items-center gap-3 text-slate-400 text-[11px] font-medium uppercase tracking-wider'>
            <span>4 Bed</span>
            <span className='w-1 h-1 bg-slate-300 rounded-full' />
            <span>3 Bath</span>
            <span className='w-1 h-1 bg-slate-300 rounded-full' />
            <span>2,400 sqft</span>
          </div>
        </div>

        <button className='mt-2 flex items-center justify-center gap-2 w-full py-2.5 bg-slate-50 text-slate-600 text-sm font-semibold rounded-xl border border-slate-100 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-300'>
          View Analytics
          <MdArrowRightAlt size={18} className='transition-transform group-hover:translate-x-1' />
        </button>
      </div>
    </article>
  )
}
