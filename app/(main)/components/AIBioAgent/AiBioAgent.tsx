import React from 'react'
import AiBioAgentCard from './AiBioAgentCard'

export default function AiBioAgent() {
  return (
     <section className='flex flex-col w-full xl:w-auto '>
        <div className='flex items-center my-5'>
            <AiBioAgentCard/>
        </div>
    </section>
  )
}
