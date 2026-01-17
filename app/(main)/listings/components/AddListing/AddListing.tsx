"use client"
import { useUiStore } from '@/store/useUiStore';
import React from 'react'
import { IoAddSharp } from "react-icons/io5";

export default function AddListing() {
  const openModal = useUiStore((state) => state.openListingModal)
  return (
    <div className='flex items-center justify-center'>
      <button onClick={openModal} className='flex items-center gap-2 p-2.5 md:py-2.5 md:px-5 rounded-xl bg-purple-600 text-white shadow-md shadow-purple-200 hover:bg-purple-700 hover:shadow-lg transition-all duration-200 ease-in-out cursor-pointer active:scale-95'>
        <IoAddSharp size={22} className="stroke-[20px]" />
        <span className='text-sm hidden md:block font-bold tracking-wide'>
          Add Listing
        </span>
      </button>
    </div>
  )
}
