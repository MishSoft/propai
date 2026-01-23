import React from 'react'
import SideBar from './components/Sidebar/SideBar'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex min-h-screen bg-slate-50'>
      <SideBar />
      <main className='flex-1 xl:ml-64 ml-10 min-h-screen'>
        <div className='max-w-350 mx-auto px-8 py-8 xl:px-12'>
          {children}
        </div>
      </main>
    </div>
  )
}
