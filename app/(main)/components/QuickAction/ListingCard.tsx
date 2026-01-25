"use client"
import { useUiStore } from '@/store/useUiStore';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FaBuildingUser } from "react-icons/fa6";

export default function ListingCard() {
  const {toggleListingModal} = useUiStore()
  const router = useRouter()
  const handleListingClick = () => {
    toggleListingModal();
    router.push('/listings');
  }

  return (
    <div className='p-6 flex flex-col w-full xl:w-auto items-start gap-6 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 xl:max-w-sm'>

      <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center'>
        <FaBuildingUser size={24} className='text-blue-600' />
      </div>

      <div className='flex flex-col gap-2'>
        <h2 className='text-xl font-bold text-gray-900'>New Listing</h2>
        <p className='text-gray-500 text-sm leading-relaxed'>
          Launch a new property listing with automated AI content generation.
        </p>
      </div>

      <button onClick={handleListingClick} className='w-full py-3 px-4 font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors duration-200 shadow-sm active:scale-[0.98]'>
        Create Listing
      </button>

    </div>
  )
}
