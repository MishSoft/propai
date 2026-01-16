"use client"
import React, { FormEvent, useState, ChangeEvent } from 'react'
import FormHeader from './FormHeader'
import Separator from './Separator'
import AuthWith from './AuthWith'
import { FaEyeSlash, FaEye } from 'react-icons/fa'
import SignUpBtn from './SignUpBtn'
import { useRouter } from 'next/navigation'

export default function SignUpFormField() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [inputFields, setInputFields] = useState({
    fullname: "",
    email: "",
    password: "",
    repeat: ""
  })

  const [isShowPassword, setIsShowPassword] = useState({
    pass: false,
    confirm: false
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError('')
    setInputFields(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (inputFields.password !== inputFields.repeat) {
      setError("Password do not match!")
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/register', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: inputFields.fullname,
          email: inputFields.email,
          password: inputFields.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message)
      }

      router.push('/')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = (field: "pass" | 'confirm') => {
    setIsShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className='flex mt-10 flex-col gap-10 w-full max-w-md p-10 border border-gray-300 rounded-xl shadow-md bg-white'>

      <FormHeader title={"Create Account"} subTitle={"Manage your listings and AI content"} />
      {
        error && (
          <span className='p-2 bg-red-50 text-red-500 text-sm rounded-lg border-red-100 animate-shake'>
            {error}
          </span>
        )
      }
      <div className='flex flex-col gap-5'>
        {/* Full Name */}
        <div className='flex flex-col items-start gap-2 w-full'>
          <label htmlFor="fullname" className="text-sm font-medium">Full Name</label>
          <input
            name="fullname"
            value={inputFields.fullname}
            onChange={handleChange}
            id='fullname'
            required
            className='p-2 w-full focus:border-blue-400 focus:ring-1 focus:ring-blue-300 outline-none rounded-md border border-gray-300'
            type="text"
            placeholder='Jane Doe'
          />
        </div>

        {/* Email */}
        <div className='flex flex-col items-start gap-2 w-full'>
          <label htmlFor="email" className="text-sm font-medium">Email Address</label>
          <input
            name="email"
            value={inputFields.email}
            onChange={handleChange}
            id='email'
            required
            className='p-2 w-full focus:border-blue-400 focus:ring-1 focus:ring-blue-300 outline-none rounded-md border border-gray-300'
            type="email"
            placeholder='name@agency.com'
          />
        </div>

        {/* Password */}
        <div className='flex flex-col items-start gap-2 w-full'>
          <label htmlFor="password" className="text-sm font-medium">Password</label>
          <div className='rounded-md border flex items-center justify-between border-gray-300 w-full px-2 focus-within:border-blue-400'>
            <input
              name="password"
              id='password'
              className='p-2 w-full outline-none'
              type={isShowPassword.pass ? "text" : "password"}
              placeholder='********'
              required
              value={inputFields.password}
              onChange={handleChange}
            />
            <button type="button" onClick={() => toggleVisibility("pass")} className="text-gray-500">
              {isShowPassword.pass ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        {/* Repeat Password */}
        <div className='flex flex-col items-start gap-2 w-full'>
          <label htmlFor="repeat" className="text-sm font-medium">Repeat Password</label>
          <div className='rounded-md border flex items-center justify-between border-gray-300 w-full px-2 focus-within:border-blue-400'>
            <input
              name="repeat"
              id='repeat'
              className='p-2 w-full outline-none'
              type={isShowPassword.confirm ? "text" : "password"}
              placeholder='********'
              required
              value={inputFields.repeat}
              onChange={handleChange}
            />
            <button type="button" onClick={() => toggleVisibility("confirm")} className="text-gray-500">
              {isShowPassword.confirm ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-5'>
        <SignUpBtn loading={loading} />
        <Separator />
        <AuthWith />
      </div>
    </form>
  )
}
