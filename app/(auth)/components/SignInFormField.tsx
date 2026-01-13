"use client"
import Link from 'next/link';
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { FaEye, FaEyeSlash, FaGoogle, FaFacebook } from "react-icons/fa";
import FormHeader from './FormHeader';
import ForgetPassword from './ForgetPassword';
import Separator from './Separator';
import AuthWith from './AuthWith';
import SignInBtn from './SignInBtn';




export default function SignInFormField() {
  const [inputFields, setInputFields] = useState({
    email: "",
    password: ""
  })
  const [isShowPassword, setIsShowPassword] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target

    setInputFields(prev => ({
      ...prev,
      [name]: value
    }))
  }


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
  }


  return (
    <form onSubmit={handleSubmit} className='flex mt-10 flex-col gap-10 w-full max-w-md p-10 border border-gray-300 rounded-xl shadow-md'>

      <FormHeader title={"Helcome Back"} subTitle={"Manage your listings and AI content"} />

      <div className='flex flex-col gap-5 '>
        <div className='flex flex-col items-start gap-2 w-full'>
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input onChange={handleInputChange} value={inputFields.email} name='email' id='email' className='p-2 w-full focus:border-blue-400 focus:ring-1 focus:ring-blue-300 outline-none rounded-md border border-gray-300' type="email" placeholder='name@agency.com' required />
        </div>

        <div className='flex flex-col items-start gap-2 w-full'>
          <div className='flex items-center justify-between w-full'>
            <label htmlFor="password" className=" text-sm font-medium">Password</label>
            <ForgetPassword/>
          </div>
          <div className='rounded-md border flex items-center justify-between border-gray-300 w-full px-2 focus-within:border-blue-400'>
            <input
            onChange={handleInputChange}
            name='password'
              id='password'
              className='p-2 w-full outline-none'
              type={isShowPassword ? "text" : "password"}
              placeholder='********'
              value={inputFields.password}
              required
            />
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="text-gray-500 hover:text-gray-700"
            >
              {isShowPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-5'>
        <SignInBtn/>
        <Separator/>
        <AuthWith/>
      </div>
    </form>
  )
}
