"use client";

import React from 'react'
import ActivityCard from './ActivityCard'
import { FaBuilding } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';
import { useTranslations } from 'next-intl';
import { ka, enUS, ru } from 'date-fns/locale';
import { useLocale } from 'next-intl';

// 1. განვსაზღვროთ მონაცემების ტიპი
interface ActivityProps {
  data: {
    id: string;
    street: string;
    createdAt: Date;
    price: number;
  }[];
}

// 2. მივიღოთ data როგორც პროპი (აღარ გვჭირდება async/await აქ)
export default function Activity({ data }: ActivityProps) {
  const t = useTranslations('Dashboard');
  const localeStr = useLocale();

  const getLocale = () => {
    if (localeStr === 'ka') return ka;
    if (localeStr === 'ru') return ru;
    return enUS;
  };
  return (
    <div className='flex flex-col w-full xl:w-auto md:flex-1'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-black'>{t('activity_feed')}</h2>
        <button className='bg-none border-none text-blue-500 text-sm font-semibold hover:underline cursor-pointer'>
          View All Activity
        </button>
      </div>

      <div className='border my-5 border-gray-300 bg-white rounded-xl flex flex-col items-start w-full overflow-hidden shadow-sm'>
        {data && data.length > 0 ? (
          data.map((item) => (
            <ActivityCard
              key={item.id}
              icon={FaBuilding}
              text={`${t('new_listing')}: ${item.street}`}
              time={formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: getLocale() })}
            />
          ))
        ) : (
            <div className="p-10 text-center w-full">
              <p className="text-gray-400">{t('no_activity')}</p>
            </div>
        )}
      </div>
    </div>
  )
}
