import React from 'react'
import Image from "next/image"
export default function ImageItem() {
  return (
    <div>
      <Image className='w-full object-cover rounded-t-xl' src={'https://media.istockphoto.com/id/1165384568/photo/europe-modern-complex-of-residential-buildings.jpg?s=612x612&w=0&k=20&c=iW4NBiMPKEuvaA7h8wIsPHikhS64eR-5EVPfjQ9GPOA='} width={100} height={100} alt='Image'/>
    </div>
  )
}
