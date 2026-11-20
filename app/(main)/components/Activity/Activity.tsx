"use client";

import React from 'react'
import ActivityCard from './ActivityCard'
import { FaBuilding } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';

interface ActivityProps {
  data: {
    id: string;
    street: string;
    createdAt: Date;
    price: number;
  }[];
}

import { ka, enUS, ru } from 'date-fns/locale';
import { useLocale } from 'next-intl';

export default function Activity({ data }: ActivityProps) {
  const t = useTranslations('Dashboard');
  const localeStr = useLocale();

  const getLocale = () => {
    if (localeStr === 'ka') return ka;
    if (localeStr === 'ru') return ru;
    return enUS;
  };

  return (
    <div className='flex flex-col w-full xl:w-auto flex-1'>
      <div className='flex items-center justify-between mb-2'>
        <h2 className='text-2xl font-black text-slate-900 tracking-tighter uppercase'>
          {t('activity_feed')}
        </h2>
      </div>

      <div className='glass-card my-5 overflow-hidden bg-white/90 border-slate-100 shadow-xl shadow-slate-200/50'>
        {data && data.length > 0 ? (
          data.map((item) => (
            <ActivityCard
              key={item.id}
              icon={FaBuilding}
              text={`${t('new_listing')}: ${item.street}`}
              time={formatDistanceToNow(new Date(item.createdAt), {
                addSuffix: true,
                locale: getLocale()
              })}
            />
          ))
        ) : (
          <div className="p-10 text-center w-full">
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] opacity-60">
              {t('no_activity')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
