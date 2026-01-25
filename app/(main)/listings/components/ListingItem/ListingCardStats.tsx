interface StatsProps {
  beds: number;
  baths: number;
  sqft: number;
}

export default function ListingCardStats({ beds, baths, sqft }: StatsProps) {
  const statClass = 'flex flex-col items-center border-slate-50';
  const labelClass = 'text-[9px] font-bold text-slate-400 uppercase tracking-tighter';
  const valueClass = 'text-xs font-black text-slate-900';

  return (
    <div className='grid grid-cols-3 py-4 border-y border-slate-50 mb-6'>
      <div className={`${statClass} border-r`}>
        <span className={valueClass}>{beds}</span>
        <span className={labelClass}>Beds</span>
      </div>
      <div className={`${statClass} border-r`}>
        <span className={valueClass}>{baths}</span>
        <span className={labelClass}>Baths</span>
      </div>
      <div className={statClass}>
        <span className={valueClass}>{sqft}</span>
        <span className={labelClass}>Sqft</span>
      </div>
    </div>
  );
}
