import React from 'react'
import ActivityCard from './ActivityCard'
import { AiFillGoogleCircle } from "react-icons/ai";


export default function Activity() {
  return (
    <div className='flex flex-col w-full xl:w-auto md:flex-1'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-black'>Recent Activity</h2>
        <button className='bg-none border-none text-blue-500 text-sm font-semibold'>
          View All Activity
        </button>
      </div>

      <div className='border my-5 border-gray-300 bg-white rounded-xl flex flex-col items-start w-full'>
        <ActivityCard icon={AiFillGoogleCircle} text={"AI Agent generated a listing description for 123 Maple St."} time={'2 hours'} />
        <ActivityCard icon={AiFillGoogleCircle} text={"AI Agent generated a listing description for 123 Maple St."} time={'2 hours'} />
        <ActivityCard icon={AiFillGoogleCircle} text={"AI Agent generated a listing description for 123 Maple St."} time={'2 hours'} />
        <ActivityCard icon={AiFillGoogleCircle} text={"AI Agent generated a listing description for 123 Maple St."} time={'2 hours'} />
      </div>
    </div>
  )
}
