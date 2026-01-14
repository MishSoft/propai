import React from 'react'
import NotificationBtn from './NotificationBtn'
import AddListing from '../AddListing/AddListing'

export default function Header() {
  return (
    <header className="flex items-center justify-between w-full  bg-transparent">
      <div className="flex flex-col gap-1">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
          Property Listings
        </h2>
        <p className="text-sm md:text-base text-gray-500 font-medium">
          Manage your active portfolio and AI-generated content.
        </p>
      </div>

      <div className="fixed md:relative bottom-8 right-6 md:bottom-auto md:right-auto z-50 md:z-auto">
        <div className="flex flex-col md:flex-row items-center gap-3 bg-white md:bg-transparent p-3 md:p-0 rounded-2xl shadow-lg md:shadow-none border md:border-none border-gray-100">
          <NotificationBtn />
          <AddListing />
        </div>
      </div>
    </header>
  )
}
