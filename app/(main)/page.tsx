import React from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Activity from './components/Activity/Activity'
import QuickAction from './components/QuickAction/QuickAction'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import db from '@/lib/db'

export default async function Page() {
  const session = await getServerSession(authOptions);
  const agentId = session?.user?.id || "";

  // პირდაპირ სერვერზე წამოვიღოთ მონაცემები
  const recentListings = agentId ? await db.post.findMany({
    where: { authorId: agentId },
    orderBy: { createdAt: 'desc' },
    take: 3,
    select: { id: true, street: true, price: true, createdAt: true }
  }) : [];

  return (
    <main>
      <Header agentId={agentId} />
      <Hero />
      <div className='flex w-full flex-col xl:flex-row justify-between gap-2 items-start'>
        <Activity data={recentListings} />
        <QuickAction />
      </div>
    </main>
  )
}
