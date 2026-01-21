import React from 'react'
import ActivityCard from './ActivityCard'
import { FaBuilding } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

// 1. განვსაზღვროთ მონაცემების ტიპი
interface ActivityProps {
  data: {
    id: string;
    street: string;
    createdAt: Date;
    price: number;
  }[];
}

// 2. მივიღოთ data როგორც პროპი (აღარ გვჭირდება async/await აქ)
export default function Activity({ data }: ActivityProps) {
  return (
    <div className='flex flex-col w-full xl:w-auto md:flex-1'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-black'>Recent Activity</h2>
        <button className='bg-none border-none text-blue-500 text-sm font-semibold hover:underline cursor-pointer'>
          View All Activity
        </button>
      </div>

      <div className='border my-5 border-gray-300 bg-white rounded-xl flex flex-col items-start w-full overflow-hidden shadow-sm'>
        {data && data.length > 0 ? (
          data.map((item) => (
            <ActivityCard
              key={item.id}
              icon={FaBuilding}
              text={`New listing created: ${item.street}`}
              time={formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
            />
          ))
        ) : (
            <div className="p-10 text-center w-full">
              <p className="text-gray-400">No recent activity found.</p>
            </div>
        )}
      </div>
    </div>
  )
}
