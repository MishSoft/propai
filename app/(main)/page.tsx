import React from 'react'
import Header from './components/Header/Header'
import Hero from './components/Hero/Hero'
import Activity from './components/Activity/Activity'
import QuickAction from './components/QuickAction/QuickAction'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export default async function page() {
  const session = await getServerSession(authOptions);
  const agentId = session?.user?.id || "";
  return (
    <main>
      <Header agentId={agentId} />
      <Hero />
      <div className='flex w-full flex-col xl:flex-row justify-between gap-2 items-start'>
        <Activity />
        <QuickAction />
      </div>
    </main>
  )
}
