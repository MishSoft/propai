import React from 'react'
import ListingCard from './ListingCard'
import AiBioAgent from '../AIBioAgent/AiBioAgent'

import { useTranslations } from 'next-intl';

export default function QuickAction() {
  const t = useTranslations('Dashboard');
  return (
    <section className='flex flex-col w-full justify-center xl:w-auto mt-4'>
      <h2 className='text-2xl font-black text-slate-900 tracking-tighter uppercase mb-2'>{t('quick_actions')}</h2>
      <div className='flex justify-between gap-6 flex-col md:flex-row xl:flex-col items-center my-5'>
        <ListingCard/>
        <AiBioAgent/>
      </div>
    </section>
  )
}
