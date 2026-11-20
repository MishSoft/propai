"use client"
import React from 'react'
import { useUiStore } from '@/store/useUiStore';
import { useRouter } from 'next/navigation';
import { FaBuildingUser } from "react-icons/fa6";
import { useTranslations } from 'next-intl';

export default function ListingCard() {
  const {toggleListingModal} = useUiStore()
  const router = useRouter()
  const t = useTranslations('Listings');
  const dashboardT = useTranslations('Dashboard');

  const handleListingClick = () => {
    toggleListingModal();
    router.push('/listings');
  }

  return (
    <div className='p-8 flex flex-col w-full xl:w-auto items-start gap-8 glass-card transition-all hover:scale-[1.02] cursor-default xl:max-w-sm bg-white/90 shadow-2xl shadow-slate-200/50'>

      <div className='w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-600/30 active:scale-95 transition-all duration-300'>
        <FaBuildingUser size={32} className='text-white' />
      </div>

      <div className='flex flex-col gap-2'>
        <h2 className='text-2xl font-black text-slate-900 tracking-tighter uppercase'>
          {t('addNew')}
        </h2>
        <p className='text-slate-500 text-sm leading-relaxed font-medium'>
          {dashboardT('listing_card_description')}
        </p>
      </div>

      <button onClick={handleListingClick} className='w-full py-4 px-6 font-black text-xs uppercase tracking-widest text-white bg-slate-900 hover:bg-purple-600 rounded-xl transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-[0.98] cursor-pointer'>
        {t('addNew')}
      </button>

    </div>
  )
}
