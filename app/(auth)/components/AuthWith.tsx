"use client"
import React from 'react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { signIn } from "next-auth/react"

export default function AuthWith() {

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // callbackUrl განსაზღვრავს სად გადავიდეს მომხმარებელი შესვლის შემდეგ
    signIn(provider, { callbackUrl: '/' });
  }

  return (
    <div className='flex items-center w-full text-slate-500 justify-between gap-4'>
      <button
        type='button'
        onClick={() => handleSocialLogin('google')}
        className='border border-slate-200 flex items-center justify-center gap-2 rounded-xl w-full py-3 cursor-pointer hover:bg-slate-50 transition-all font-medium text-sm'
      >
        <FaGoogle className='text-red-500' />
        Google
      </button>

      <button
        type='button'
        onClick={() => handleSocialLogin('facebook')}
        className='border border-slate-200 flex items-center justify-center gap-2 rounded-xl w-full py-3 cursor-pointer hover:bg-slate-50 transition-all font-medium text-sm'
      >
        <FaFacebook className='text-blue-600' />
        Facebook
      </button>
    </div>
  )
}
