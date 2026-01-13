import React from 'react'


interface FormHeaderProps {
  title: String,
  subTitle: String
}

export default function FormHeader({title, subTitle}: FormHeaderProps) {
  return (
    <div className='flex flex-col items-center gap-2 '>
      <h1 className='text-4xl font-semibold text-center'>{title}</h1>
      <p className='text-gray-500 font-semibold text-xs'>{subTitle}</p>
    </div>
  )
}
