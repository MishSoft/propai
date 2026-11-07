interface StatsProps {
  beds: number;
  baths: number;
  sqft: number;
}

import { useTranslations } from 'next-intl';

export default function ListingCardStats({ beds, baths, sqft }: StatsProps) {
  const t = useTranslations('Listings');
  const statClass = 'flex flex-col items-center border-slate-100';
  const labelClass = 'text-[9px] font-black text-slate-400 uppercase tracking-widest';
  const valueClass = 'text-xs font-black text-slate-900';

  return (
    <div className='grid grid-cols-3 py-4 border-y border-slate-100 mb-6'>
      <div className={`${statClass} border-r`}>
        <span className={valueClass}>{beds}</span>
        <span className={labelClass}>{t('beds')}</span>
      </div>
      <div className={`${statClass} border-r`}>
        <span className={valueClass}>{baths}</span>
        <span className={labelClass}>{t('baths')}</span>
      </div>
      <div className={statClass}>
        <span className={valueClass}>{sqft}</span>
        <span className={labelClass}>{t('sqft')}</span>
      </div>
    </div>
  );
}
