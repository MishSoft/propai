import React from 'react'
import { RiBankCardLine } from "react-icons/ri";

export default function Logo() {
  return (
    <div className='flex items-center gap-3 xl:px-2 py-1 '>
      <div className='bg-purple-600 p-2 rounded-xl flex items-center justify-center shadow-lg shadow-purple-200'>
        <RiBankCardLine className='text-white xl:size-8' />
      </div>

      <div className='xl:flex flex-col leading-tight hidden'>
        <h1 className='font-bold text-lg tracking-tight text-slate-900'>
          Prop<span className='text-purple-600'>AI</span>
        </h1>
        <span className='text-slate-500 text-[10px] uppercase tracking-widest font-semibold'>
          SaaS Dashboard
        </span>
      </div>
    </div>
  )
}
