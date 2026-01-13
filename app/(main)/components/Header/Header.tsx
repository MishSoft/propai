import React from 'react'
import ExportData from './ExportData'

export default function Header() {
  return (
    <header className='flex flex-col gap-2 md:gap-1 items-start w-full justify-between'>
      <h2 className='text-4xl font-semibold text-black'>Agent Dashboard</h2>
      <div className='flex md:items-center flex-col gap-5 md:gap-1 md:flex-row items-start justify-between w-full'>
        <h3 className='text-gray-600'>Your business at a glace. Manage listings and AI workflows.</h3>
        <ExportData/>
      </div>
    </header>
  )
}
