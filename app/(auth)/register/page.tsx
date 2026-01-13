import React from 'react'
import SignUpFormField from '../components/SignUpFormField'
import Footer from '../components/Footer'
import GoToAuth from '../components/GoToAuth'

export default function Page() {
  return (
    <section className='bg-white w-full flex-col min-h-screen flex items-center justify-center p-4'>
      <SignUpFormField/>
      <GoToAuth text={'Already have an account?'} link={'/login'} where={'Sign In'}/>
      <Footer/>
    </section>
  )
}
