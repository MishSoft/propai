"use client"
import React from 'react'
import ExportData from './ExportData'
import dynamic from 'next/dynamic';
// import ShareLink from '../ShareLink';


const ShareLink = dynamic(() => import('../ShareLink'), {
  ssr: false,
  loading: () => <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-xl" />
});

interface HeaderProps {
  agentId: string;
}

export default function Header({ agentId }: HeaderProps) {
  return (
    <header className="w-full pb-6 mb-6 border-b border-gray-100 flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

        {/* მარცხენა მხარე: ტექსტი */}
        <div className="flex flex-col gap-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Agent Dashboard
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            Your business at a glance. Manage listings and AI workflows.
          </p>
        </div>

        {/* მარჯვენა მხარე: ღილაკები და ლინკი */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <ShareLink agentId={agentId} />
          <div className="h-10 w-px bg-gray-200 hidden sm:block"></div> {/* გამყოფი ხაზი */}
          <ExportData />
        </div>

      </div>
    </header>
  )
}
