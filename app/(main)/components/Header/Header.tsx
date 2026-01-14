import React from 'react'
import ExportData from './ExportData'

export default function Header() {
  return (
    <header className="w-full pb-6 mb-6 border-b border-gray-100 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">

        <div className="flex flex-col gap-1">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Agent Dashboard
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg">
            Your business at a glance. Manage listings and AI workflows.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ExportData />
        </div>

      </div>
    </header>
  )
}
