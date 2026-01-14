import React from 'react'
import Header from './components/Header/Header'
import Filter from './components/Filter/Filter'
import PriceRange from './components/PriceRange/PriceRange'
import ListingItem from './components/ListingItem/ListingItem'

export default function page() {
  return (
    <section>
      <Header/>
      <Filter/>

      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-20'>

        {[...Array(6)].map((_, index) => (
          <div key={index} className="flex justify-center">
            <ListingItem />
          </div>
        ))}
      </div>
    </section>
  )
}
