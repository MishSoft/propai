"use client"
import React, { useEffect, useState } from 'react'
import Header from './components/Header/Header'
import Filter from './components/Filter/Filter'
import ListingItem from './components/ListingItem/ListingItem'
import Listing from './components/Listing/Listing'
import { useUiStore } from '@/store/useUiStore'
import ListingDetails from './components/listingDetails/ListingDetails'

export default function Page() {
  const isModalOpen = useUiStore((state) => state.isListingModalOpen)
  const isDetailsOpen = useUiStore((state) => state.isDetailsModalOpen) // <-- წამოიღე Details სთეითი

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getListings = async () => {
      try {
        const response = await fetch('/api/listings');
        const data = await response.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    getListings();
  }, []);

  return (
    <section>
      <Header />
      <Filter />

      <div className='max-w-7xl mx-auto'>
        {loading ? (
          <div className="flex justify-center items-center p-20">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        ) : (
            <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20'>
            {listings.map((item: any) => (
              <div key={item.id} className="flex justify-center">
                <ListingItem item={item} />
              </div>
            ))}
          </div>
        )}

        {!loading && listings.length === 0 && (
          <div className="text-center py-20 text-slate-400">
            No listings found. Be the first to add one!
          </div>
        )}
      </div>

      {/* მოდალები */}
      {isModalOpen && <Listing />}
      {isDetailsOpen && <ListingDetails />}
    </section>
  )
}
