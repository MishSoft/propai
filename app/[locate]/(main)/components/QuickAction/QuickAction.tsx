import React from 'react'
import ListingCard from './ListingCard'
import AiBioAgent from '../AIBioAgent/AiBioAgent'

export default function QuickAction() {
  return (
    <section className='flex flex-col w-full justify-center xl:w-auto'>
      <h2 className='text-2xl font-semibold text-black'>Quick Actions</h2>
      <div className='flex  justify-between gap-2 flex-col md:flex-row xl:flex-col items-center my-5'>
        <ListingCard/>
        <AiBioAgent/>
      </div>
    </section>
  )
}
