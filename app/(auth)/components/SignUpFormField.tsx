"use client"
import React, { FormEvent, useState, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'
import { getCredentialsSignInError } from '@/lib/auth-shared'
import { signIn } from "next-auth/react" // აუცილებელი იმპორტი
import FormHeader from './FormHeader'
import Separator from './Separator'
import AuthWith from './AuthWith'
import { FaEyeSlash, FaEye, FaCheckCircle } from 'react-icons/fa'
import SignUpBtn from './SignUpBtn'
import { isValidPhoneNumber, PHONE_MAX_LENGTH } from '@/lib/phone'

const plans = [
  { id: 'lite', name: 'Lite', price: 10, limit: 5, features: ['5 Listings Max', 'AI Basic'] },
  { id: 'pro', name: 'Pro', price: 20, limit: 'Unlimited', features: ['Unlimited Listings', 'AI Advanced', 'Priority Support'] },
  { id: 'ultimate', name: 'Ultimate', price: 25, limit: 'Unlimited', features: ['All Pro Features', '7 Days Free Trial', 'Featured Badges'], trial: true },
]

export default function SignUpFormField() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const selectedPlan = 'lite'

  const [inputFields, setInputFields] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    repeat: ""
  })

  const [isShowPassword, setIsShowPassword] = useState({ pass: false, confirm: false })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError('');
    setInputFields(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (inputFields.password !== inputFields.repeat) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }

    if (!isValidPhoneNumber(inputFields.phone)) {
      setError("Enter a valid phone number (7 to 15 digits).")
      setLoading(false)
      return
    }

    let accountCreated = false

    try {
      // 1. რეგისტრაციის API-ს გამოძახება
      const response = await fetch('/api/register', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: inputFields.fullname,
          email: inputFields.email.trim().toLowerCase(),
          phone: inputFields.phone.trim(),
          password: inputFields.password,
        })
      })

      const data: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        const message =
          data && typeof data === "object" && "message" in data && typeof data.message === "string"
            ? data.message
            : "Registration failed. Please check your details and try again."
        setError(message)
        return
      }

      accountCreated = true

      // 2. 🔥 აი ეს არის რამაც "აურია" - ავტომატური ლოგინი რეგისტრაციის მერე
      const loginRes = await signIn("credentials", {
        email: inputFields.email.trim().toLowerCase(),
        password: inputFields.password,
        redirect: false,
        callbackUrl: "/",
      })

      if (getCredentialsSignInError(loginRes) === null) {
        window.location.href = '/'
      } else {
        router.push('/login?registered=true')
      }
    } catch {
      if (accountCreated) {
        router.push('/login?registered=true')
      } else {
        setError("Registration failed. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='flex mt-10 flex-col md:flex-row gap-10 w-full max-w-5xl p-6 md:p-10 border border-gray-100 rounded-4xl shadow-2xl bg-white animate-in fade-in zoom-in-95 duration-500'>

      {/* მარცხენა მხარე: რეგისტრაცია */}
      <div className='flex-1 flex flex-col gap-6'>
        <FormHeader title={"Create Account"} subTitle={"Join the elite real estate network"} />

        {error && (
          <span className='p-3 bg-red-50 text-red-500 text-xs font-bold rounded-xl border border-red-100 animate-shake'>
            {error}
          </span>
        )}

        <div className='grid grid-cols-1 gap-4'>
          <div className='flex flex-col gap-1.5'>
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Full Name</label>
            <input name="fullname" value={inputFields.fullname} onChange={handleChange} required className='p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all' type="text" placeholder='Jane Doe' />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Email Address</label>
            <input name="email" value={inputFields.email} onChange={handleChange} required className='p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all' type="email" placeholder='name@agency.com' />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label htmlFor="signup-phone" className="text-[10px] uppercase tracking-widest font-black text-slate-400">Phone Number</label>
            <input id="signup-phone" name="phone" value={inputFields.phone} onChange={handleChange} required maxLength={PHONE_MAX_LENGTH} className='p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-all' type="tel" placeholder='+995 555 123 456' />
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Password</label>
            <div className='bg-slate-50 border border-slate-200 rounded-xl flex items-center px-3 focus-within:border-blue-400 transition-all'>
              <input name="password" required minLength={8} maxLength={72} className='p-3 w-full bg-transparent outline-none text-sm' type={isShowPassword.pass ? "text" : "password"} value={inputFields.password} onChange={handleChange} placeholder='********' />
              <button type="button" onClick={() => setIsShowPassword(p => ({ ...p, pass: !p.pass }))} className="text-slate-400">{isShowPassword.pass ? <FaEye /> : <FaEyeSlash />}</button>
            </div>
          </div>

          <div className='flex flex-col gap-1.5'>
            <label className="text-[10px] uppercase tracking-widest font-black text-slate-400">Repeat Password</label>
            <div className='bg-slate-50 border border-slate-200 rounded-xl flex items-center px-3 focus-within:border-blue-400 transition-all'>
              <input name="repeat" required minLength={8} maxLength={72} className='p-3 w-full bg-transparent outline-none text-sm' type={isShowPassword.confirm ? "text" : "password"} value={inputFields.repeat} onChange={handleChange} placeholder='********' />
              <button type="button" onClick={() => setIsShowPassword(p => ({ ...p, confirm: !p.confirm }))} className="text-slate-400">{isShowPassword.confirm ? <FaEye /> : <FaEyeSlash />}</button>
            </div>
          </div>
        </div>

        <div className='mt-4 flex flex-col gap-4'>
          <SignUpBtn loading={loading} />
          <Separator />
          <AuthWith />
        </div>
      </div>

      {/* მარჯვენა მხარე: პაკეტის არჩევა */}
      <div className='flex-1 bg-slate-50 p-8 rounded-3xl border border-slate-100'>
        <h3 className='text-xl font-black text-slate-800 mb-6'>Choose Your Plan</h3>
        <div className='flex flex-col gap-4'>
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-5 rounded-2xl border-2 transition-all ${selectedPlan === plan.id
                ? 'border-blue-500 bg-white shadow-lg scale-[1.02]'
                : 'border-transparent bg-slate-100'
                }`}
            >
              <div className='flex justify-between items-center mb-2'>
                <span className='font-black text-slate-900'>{plan.name}</span>
                <span className='text-lg font-black text-blue-600'>${plan.price}<small className='text-[10px] text-slate-400'>/mo</small></span>
              </div>
              <ul className='flex flex-col gap-1'>
                {plan.features.map(f => (
                  <li key={f} className='text-[11px] text-slate-500 flex items-center gap-2'>
                    <FaCheckCircle className='text-blue-400' size={10} /> {f}
                  </li>
                ))}
              </ul>
              {plan.trial && (
                <div className='absolute -top-2 -right-2 bg-linear-to-r from-purple-600 to-blue-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-md uppercase'>
                  Free Trial Available
                </div>
              )}
            </div>
          ))}
        </div>
        <p className='mt-6 text-[10px] text-slate-400 text-center font-medium'>
          Plans can be upgraded or downgraded at any time.
        </p>
      </div>
    </form>
  )
}
