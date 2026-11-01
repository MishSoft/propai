"use client"
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import FormHeader from './FormHeader';
import ForgetPassword from './ForgetPassword';
import Separator from './Separator';
import AuthWith from './AuthWith';
import SignInBtn from './SignInBtn';
import { signIn } from 'next-auth/react';

export default function SignInFormField() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const errorCode = new URLSearchParams(window.location.search).get("error");
    if (errorCode === "OAuthAccountNotLinked") {
      setError("We couldn't complete sign-in with this provider. If you have an account, sign in using your original method.");
    }
  }, []);

  const [inputFields, setInputFields] = useState({
    email: "",
    password: ""
  });

  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError("");
    setInputFields(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ნაცვლად fetch-ისა, ვიყენებთ NextAuth-ის signIn ფუნქციას
      const result = await signIn("credentials", {
        redirect: false, // false, რომ შეცდომა ხელით დავიჭიროთ აქ
        email: inputFields.email,
        password: inputFields.password,
      });

      if (result?.error) {
        // თუ NextAuth-მა დააბრუნა შეცდომა (მაგ. არასწორი პაროლი)
        setError("Invalid email or password");
      } else {
        // წარმატების შემთხვევაში გადავდივართ მთავარ გვერდზე
        window.location.href = '/';
      }

    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex mt-10 flex-col gap-8 w-full max-w-md p-10 border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 bg-white transition-all'>

      <FormHeader title={"Welcome Back"} subTitle={"Manage your listings and AI content"} />

      {/* Error Message Display */}
      {error && (
        <div className='bg-red-50 text-red-500 text-xs p-3 rounded-lg border border-red-100 animate-in fade-in slide-in-from-top-1'>
          {error}
        </div>
      )}

      <div className='flex flex-col gap-4'>
        {/* Email Field */}
        <div className='flex flex-col items-start gap-1.5 w-full'>
          <label htmlFor="email" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Email Address</label>
          <input
            onChange={handleInputChange}
            value={inputFields.email}
            name='email'
            id='email'
            className='p-2.5 w-full focus:border-purple-500 focus:ring-4 focus:ring-purple-50 outline-none rounded-xl border border-slate-200 transition-all placeholder:text-slate-300 text-sm'
            type="email"
            placeholder='name@agency.com'
            required
          />
        </div>

        {/* Password Field */}
        <div className='flex flex-col items-start gap-1.5 w-full'>
          <div className='flex items-center justify-between w-full'>
            <label htmlFor="password" className="text-xs font-bold uppercase text-slate-500 tracking-wider">Password</label>
            <ForgetPassword />
          </div>
          <div className='rounded-xl border flex items-center justify-between border-slate-200 w-full px-3 focus-within:border-purple-500 focus-within:ring-4 focus-within:ring-purple-50 transition-all'>
            <input
              onChange={handleInputChange}
              name='password'
              id='password'
              className='py-2.5 w-full outline-none bg-transparent text-sm'
              type={isShowPassword ? "text" : "password"}
              placeholder='********'
              value={inputFields.password}
              required
            />
            <button
              type="button"
              onClick={() => setIsShowPassword(!isShowPassword)}
              className="text-slate-400 hover:text-purple-600 transition-colors"
            >
              {isShowPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>

      <div className='flex flex-col gap-6'>
        <SignInBtn loading={loading} />
        <Separator />
        <AuthWith />
      </div>
    </form>
  )
}
