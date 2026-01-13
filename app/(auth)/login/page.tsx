"use client"
import Link from 'next/link'
import FormField from '../components/SignInFormField'
import Footer from '../components/Footer'
import GoToAuth from '../components/GoToAuth'
import SignInFormField from '../components/SignInFormField'

export default function Page() {


  return (
    <section className='bg-white w-full flex-col min-h-screen flex items-center justify-center p-4'>
      <SignInFormField/>
      <GoToAuth text={"Don't have an account?"} link={"/register"} where={"Create one for free"}/>
      <Footer/>
    </section>
  )
}
