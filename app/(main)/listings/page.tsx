"use client"
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Header from './components/Header/Header'
import Filter from './components/Filter/Filter'
import {
  EMPTY_LISTING_FILTERS,
  ListingFilters,
  filterListings,
  getCityOptions,
  getStreetOptions,
} from './components/Filter/listingFilters'
import ListingItem from './components/ListingItem/ListingItem'
import ListingListSkeleton from './components/ListingListSkeleton/ListingListSkeleton'
import ListingHeaderSkeleton from './components/ListingHeaderSkeleton/ListingHeaderSkeleton'
import ListingFilterSkeleton from './components/ListingFilterSkeleton/ListingFilterSkeleton'
import Listing from './components/Listing/Listing'
import { useUiStore, ListingType } from '@/store/useUiStore'
import ListingDetails from './components/listingDetails/ListingDetails'
import { useTranslations } from 'next-intl';

type ListingsStatus = 'loading' | 'ready' | 'error';

export default function Page() {
  const isModalOpen = useUiStore((state) => state.isListingModalOpen)
  const isDetailsOpen = useUiStore((state) => state.isDetailsModalOpen)
  const t = useTranslations('Listings');
  const common = useTranslations('Common');

  const [listings, setListings] = useState<ListingType[]>([]);
  const [status, setStatus] = useState<ListingsStatus>('loading');
  const [filters, setFilters] = useState<ListingFilters>(EMPTY_LISTING_FILTERS);

  const cityOptions = useMemo(() => getCityOptions(listings), [listings]);
  const streetOptions = useMemo(() => getStreetOptions(listings, filters.city), [listings, filters.city]);
  const filteredListings = useMemo(() => filterListings(listings, filters), [listings, filters]);

  // Changing the city drops a selected street that does not exist in the new city.
  const updateFilters = useCallback((patch: Partial<ListingFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      if (patch.city !== undefined && next.street && !getStreetOptions(listings, next.city).includes(next.street)) {
        next.street = '';
      }
      return next;
    });
  }, [listings]);

  const clearFilters = useCallback(() => setFilters(EMPTY_LISTING_FILTERS), []);

  useEffect(() => {
    let ignore = false;

    const getListingsData = async () => {
      try {
        const response = await fetch('/api/listings');
        if (!response.ok) {
          throw new Error(`Listings request failed with status ${response.status}`);
        }
        const data: unknown = await response.json();
        if (!Array.isArray(data)) {
          throw new Error("Listings response is not an array");
        }
        if (!ignore) {
          setListings(data as ListingType[]);
          setStatus('ready');
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
        if (!ignore) {
          setStatus('error');
        }
      }
    };

    getListingsData();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section>
      {status === 'loading' ? <ListingHeaderSkeleton /> : <Header />}
      {status === 'loading' ? (
        <ListingFilterSkeleton />
      ) : (
        <Filter
          filters={filters}
          cityOptions={cityOptions}
          streetOptions={streetOptions}
          onChange={updateFilters}
          onClearAll={clearFilters}
        />
      )}

      <div className='max-w-7xl mx-auto px-4 sm:px-0'>
        {status === 'loading' && (
          <ListingListSkeleton label={common('loading')} />
        )}

        {status === 'error' && (
          <div role="alert" className="text-center py-32 text-rose-500 font-bold uppercase tracking-widest text-xs">
            {t('load_error')}
          </div>
        )}

        {status === 'ready' && listings.length === 0 && (
          <div role="status" className="text-center py-32 text-slate-400 font-bold uppercase tracking-widest text-xs">
            {t('no_listings')}
          </div>
        )}

        {status === 'ready' && listings.length > 0 && filteredListings.length === 0 && (
          <div role="status" className="text-center py-32 text-slate-400 font-bold uppercase tracking-widest text-xs">
            {t('no_matching_listings')}
          </div>
        )}

        {status === 'ready' && filteredListings.length > 0 && (
          <div className='w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8 pb-32'>
            {filteredListings.map((item) => (
              <div key={item.id} className="flex justify-center min-w-0">
                <ListingItem item={item} />
              </div>
            ))}
          </div>
        )}
      </div>


      {/* მოდალები */}
      {isModalOpen && <Listing />}
      {isDetailsOpen && <ListingDetails />}
    </section>
  )
}
