"use client"
import React from 'react'

interface BillingProps {
  plan: string;
}

export default function BillingSection({ plan }: BillingProps) {
  return (
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">Subscription Plan</h3>
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">
          {plan}
        </span>
      </div>
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
        <p className="text-sm text-slate-600 mb-4">Your current plan gives you access to 10 AI generations per month.</p>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-purple-700 transition-all">
          Upgrade to Pro
        </button>
      </div>
    </section>
  )
}
