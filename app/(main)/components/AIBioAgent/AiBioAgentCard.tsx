import React from 'react'
import { BsRobot } from "react-icons/bs";


export default function AiBioAgentCard() {
  return (
    <div className='p-6 flex flex-col w-full xl:w-auto items-start gap-6 border border-gray-100 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow duration-300 xl:max-w-sm'>

          <div className='w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center'>
            <BsRobot size={24} className='text-blue-600' />
          </div>

          <div className='flex flex-col gap-2'>
            <h2 className='text-xl font-bold text-gray-900'>AI Agent Bio</h2>
            <p className='text-gray-500 text-sm leading-relaxed'>
              Refresh your professional bio using our real-estate fine-tuned LLM.
            </p>
          </div>

          <button className='w-full py-3 px-4 font-semibold text-sm text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors duration-200 shadow-sm active:scale-[0.98]'>
            Generate Bio
          </button>

        </div>
  )
}
