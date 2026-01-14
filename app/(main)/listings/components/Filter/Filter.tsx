import React from 'react'
import Status from './Status'
import PriceRange from '../PriceRange/PriceRange'
import PropertyType from '../PropertyType/PropertyType'
import Search from '../Search/Search'

export default function Filter() {
  return (
    <section className='w-full my-10 border-t pt-10 border-gray-300 flex items-center justify-between'>
      <Search/>
    </section>
  )
}
