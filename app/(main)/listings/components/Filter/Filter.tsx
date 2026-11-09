"use client"
import React, { useId } from 'react'
import { useTranslations } from 'next-intl'
import { IoCloseOutline } from 'react-icons/io5'
import * as Select from '@radix-ui/react-select'
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
const SELECT_TRIGGER_CLASS = 'group/trigger relative inline-flex min-h-[50px] w-full min-w-0 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm font-black text-slate-900 shadow-xl shadow-slate-200/50 outline-none transition-all hover:border-purple-300 focus-visible:border-purple-600 focus-visible:ring-4 focus-visible:ring-purple-600/10 data-[state=open]:border-purple-400 data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50';
const SELECT_CONTENT_CLASS = 'z-[1300] max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 text-slate-700 shadow-2xl shadow-slate-900/15 backdrop-blur-xl data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95 duration-150 ease-out';

function getAllOptionValue(options: string[]): string {
  let value = '__all__';
  while (options.includes(value)) value = `_${value}`;
  return value;
}

export default function Filter({ filters, cityOptions, streetOptions, onChange, onClearAll }: FilterProps) {
  const t = useTranslations('Listings');
  const id = useId();
  const invalidRange = isPriceRangeInvalid(filters);
  const chips = getActiveFilterChips(filters);
  const allCitiesValue = getAllOptionValue(cityOptions);
  const allStreetsValue = getAllOptionValue(streetOptions);

  return (
    <section
      aria-label={t('filters_label')}
      className='w-full my-10 border-t pt-10 border-slate-100 flex flex-col gap-4'
    >
      <div className='grid grid-cols-2 gap-3 sm:grid-cols-4'>
        <div className='col-span-2 sm:col-span-1 min-w-0'>
          <label id={`${id}-city-label`} htmlFor={`${id}-city`} className={LABEL_CLASS}>{t('filter_city')}</label>
          <Select.Root
            value={filters.city || allCitiesValue}
            onValueChange={(value) => onChange({ city: value === allCitiesValue ? '' : value })}
          >
            <Select.Trigger
              id={`${id}-city`}
              aria-labelledby={`${id}-city-label`}
              className={SELECT_TRIGGER_CLASS}
            >
              <Select.Value />
              <Select.Icon aria-hidden='true' className='shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180'>
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m19 9-7 7-7-7' />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position='popper'
                align='start'
                sideOffset={6}
                collisionPadding={8}
                className={SELECT_CONTENT_CLASS}
              >
                <Select.Viewport className='max-h-[var(--radix-select-content-available-height)] overflow-y-auto overscroll-contain p-1'>
                  <Select.Item
                    value={allCitiesValue}
                    className='relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-9 text-sm font-semibold outline-none transition-colors data-[highlighted]:bg-purple-50 data-[highlighted]:text-purple-800 data-[state=checked]:text-purple-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  >
                    <Select.ItemText>{t('filter_all_cities')}</Select.ItemText>
                    <Select.ItemIndicator className='absolute right-3 inline-flex items-center text-purple-700'>
                      <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m5 12 4 4L19 6' />
                      </svg>
                    </Select.ItemIndicator>
                  </Select.Item>
                  {cityOptions.map((city) => (
                    <Select.Item
                      key={city}
                      value={city}
                      className='relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-9 text-sm font-semibold outline-none transition-colors data-[highlighted]:bg-purple-50 data-[highlighted]:text-purple-800 data-[state=checked]:text-purple-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    >
                      <Select.ItemText>{city}</Select.ItemText>
                      <Select.ItemIndicator className='absolute right-3 inline-flex items-center text-purple-700'>
                        <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m5 12 4 4L19 6' />
                        </svg>
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        <div className='col-span-2 sm:col-span-1 min-w-0'>
          <label id={`${id}-street-label`} htmlFor={`${id}-street`} className={LABEL_CLASS}>{t('filter_street')}</label>
          <Select.Root
            value={filters.street || allStreetsValue}
            onValueChange={(value) => onChange({ street: value === allStreetsValue ? '' : value })}
          >
            <Select.Trigger
              id={`${id}-street`}
              aria-labelledby={`${id}-street-label`}
              className={SELECT_TRIGGER_CLASS}
            >
              <Select.Value />
              <Select.Icon aria-hidden='true' className='shrink-0 text-slate-400 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180'>
                <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m19 9-7 7-7-7' />
                </svg>
              </Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                position='popper'
                align='start'
                sideOffset={6}
                collisionPadding={8}
                className={SELECT_CONTENT_CLASS}
              >
                <Select.Viewport className='max-h-[var(--radix-select-content-available-height)] overflow-y-auto overscroll-contain p-1'>
                  <Select.Item
                    value={allStreetsValue}
                    className='relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-9 text-sm font-semibold outline-none transition-colors data-[highlighted]:bg-purple-50 data-[highlighted]:text-purple-800 data-[state=checked]:text-purple-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                  >
                    <Select.ItemText>{t('filter_all_streets')}</Select.ItemText>
                    <Select.ItemIndicator className='absolute right-3 inline-flex items-center text-purple-700'>
                      <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m5 12 4 4L19 6' />
                      </svg>
                    </Select.ItemIndicator>
                  </Select.Item>
                  {streetOptions.map((street) => (
                    <Select.Item
                      key={street}
                      value={street}
                      className='relative flex min-h-11 w-full cursor-pointer select-none items-center rounded-xl py-2 pl-3 pr-9 text-sm font-semibold outline-none transition-colors data-[highlighted]:bg-purple-50 data-[highlighted]:text-purple-800 data-[state=checked]:text-purple-700 data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                    >
                      <Select.ItemText>{street}</Select.ItemText>
                      <Select.ItemIndicator className='absolute right-3 inline-flex items-center text-purple-700'>
                        <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' aria-hidden='true'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m5 12 4 4L19 6' />
                        </svg>
                      </Select.ItemIndicator>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
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
