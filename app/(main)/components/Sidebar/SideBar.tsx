import React from 'react'
import Logo from './Logo'
import SideLinks from './SideLinks'
import SignOutBtn from './SignOutBtn'

export default function SideBar() {
  return (
    <section className='flex flex-col justify-between w-12 xl:w-64 fixed top-0 left-0 h-screen bg-white border-r border-slate-200'>
     <SideLinks/>
     <SignOutBtn/>
    </section>
  )
}
