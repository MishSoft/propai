import React from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Activity from './components/Activity/Activity'
import QuickAction from './components/QuickAction/QuickAction'

export default function page() {
  return (
    <main>
      <Header/>
      <Hero />
      <div className='flex w-full flex-col xl:flex-row justify-between gap-2 items-start'>
        <Activity />
        <QuickAction />
      </div>
    </main>
  )
}
