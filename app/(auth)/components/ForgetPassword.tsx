import Link from 'next/link'
import React from 'react'

export default function ForgetPassword() {
  return (
    <>
      <Link className='text-blue-500 text-xs' href={'/forgot-password'}>Forgot Password?</Link>
    </>
  )
}
