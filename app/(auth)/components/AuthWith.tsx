import React from 'react'
import { FaFacebook, FaGoogle } from 'react-icons/fa'

export default function AuthWith() {
  return (
    <div className='flex items-center w-full text-gray-500 justify-between gap-2'>
      <button type='button' className='border border-gray-300 flex items-center justify-center gap-2 rounded-md w-full py-2 cursor-pointer'>
        <FaGoogle />
        Google</button>
      <button type='button' className='border border-gray-300 flex items-center justify-center gap-2 rounded-md w-full py-2 cursor-pointer'>
        <FaFacebook />
        Facebook</button>
    </div>
  )
}
