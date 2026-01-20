import React from 'react'
import ActivityCard from './ActivityCard'
import db from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FaBuilding } from 'react-icons/fa';
import { redirect } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';

export default async function Activity() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/login");
  }

  const activities = await db.post.findMany({
    // @ts-ignore
    where: { authorId: session.user.id },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  return (
    <div className='flex flex-col w-full xl:w-auto md:flex-1'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-black'>Recent Activity</h2>
        <button className='bg-none border-none text-blue-500 text-sm font-semibold'>
          View All Activity
        </button>
      </div>

      <div className='border my-5 border-gray-300 bg-white rounded-xl flex flex-col items-start w-full overflow-hidden'>
        {activities.length > 0 ? (
          activities.map((item) => (
            <ActivityCard
              key={item.id}
              icon={FaBuilding}
              text={`New listing created: ${item.street}`}
              time={formatDistanceToNow(new Date(item.createdAt))}
            />
          ))
        ) : (
          <p className="p-10 text-center w-full text-gray-400">No recent activity found.</p>
        )}
      </div>
    </div>
  )
}
