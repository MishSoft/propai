"use client"
import React, { useId } from 'react'
import { useTranslations } from 'next-intl'
import { IoCloseOutline } from 'react-icons/io5'
import {
  ListingFilters,
  getActiveFilterChips,
  isPriceRangeInvalid,
} from './listingFilters'

interface FilterProps {
  filters: ListingFilters;
  cityOptions: string[];
  streetOptions: string[];
  onChange: (patch: Partial<ListingFilters>) => void;
  onClearAll: () => void;
}

const CONTROL_CLASS = 'w-full min-w-0 px-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 aria-[invalid=true]:border-rose-500 transition-all text-sm font-black text-slate-900 placeholder:text-slate-400 placeholder:font-bold shadow-xl shadow-slate-200/50';
const LABEL_CLASS = 'block mb-1.5 ml-1 text-[10px] font-black uppercase tracking-widest text-slate-400';

export default function Filter({ filters, cityOptions, streetOptions, onChange, onClearAll }: FilterProps) {
  const t = useTranslations('Listings');
  const id = useId();
  const invalidRange = isPriceRangeInvalid(filters);
  const chips = getActiveFilterChips(filters);

  return (
    <section
      aria-label={t('filters_label')}
      className='w-full my-10 border-t pt-10 border-slate-100 flex flex-col gap-4'
    >
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <div className='col-span-2 sm:col-span-1 min-w-0'>
          <label htmlFor={`${id}-city`} className={LABEL_CLASS}>{t('filter_city')}</label>
          <select
            id={`${id}-city`}
            value={filters.city}
            onChange={(e) => onChange({ city: e.target.value })}
            className={CONTROL_CLASS}
          >
            <option value=''>{t('filter_all_cities')}</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className='col-span-2 sm:col-span-1 min-w-0'>
          <label htmlFor={`${id}-street`} className={LABEL_CLASS}>{t('filter_street')}</label>
          <select
            id={`${id}-street`}
            value={filters.street}
            onChange={(e) => onChange({ street: e.target.value })}
            className={CONTROL_CLASS}
          >
            <option value=''>{t('filter_all_streets')}</option>
            {streetOptions.map((street) => (
              <option key={street} value={street}>{street}</option>
            ))}
          </select>
        </div>

        <div className='min-w-0'>
          <label htmlFor={`${id}-min`} className={LABEL_CLASS}>{t('filter_min_price')}</label>
          <input
            id={`${id}-min`}
            type='number'
            inputMode='decimal'
            min={0}
            step='any'
            placeholder={t('filter_min_price')}
            value={filters.minPrice}
            aria-invalid={invalidRange || undefined}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className={CONTROL_CLASS}
          />
        </div>

        <div className='min-w-0'>
          <label htmlFor={`${id}-max`} className={LABEL_CLASS}>{t('filter_max_price')}</label>
          <input
            id={`${id}-max`}
            type='number'
            inputMode='decimal'
            min={0}
            step='any'
            placeholder={t('filter_max_price')}
            value={filters.maxPrice}
            aria-invalid={invalidRange || undefined}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className={CONTROL_CLASS}
          />
        </div>
      </div>

      {invalidRange && (
        <p role='alert' className='text-xs font-bold text-rose-600'>
          {t('filter_invalid_price')}
        </p>
      )}

      {chips.length > 0 && (
        <div className='flex flex-wrap items-center gap-2'>
          {chips.map((chip) => {
            const label = t(chip.labelKey);
            return (
              <span
                key={chip.key}
                className='inline-flex max-w-full items-center gap-1 rounded-full border border-purple-100 bg-purple-50 py-1 pl-3 pr-1 text-xs font-bold text-purple-700'
              >
                <span className='truncate'>{label}: {chip.value}</span>
                <button
                  type='button'
                  onClick={() => onChange(chip.clear)}
                  aria-label={t('filter_remove', { label, value: chip.value })}
                  className='shrink-0 flex h-7 w-7 items-center justify-center rounded-full hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 cursor-pointer'
                >
                  <IoCloseOutline size={16} aria-hidden='true' />
                </button>
              </span>
            );
          })}
          <button
            type='button'
            onClick={onClearAll}
            className='px-2 py-1 text-xs font-black uppercase tracking-wider text-purple-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 cursor-pointer'
          >
            {t('filter_clear_all')}
          </button>
        </div>
      )}
    </section>
  )
}
