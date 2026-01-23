import React from 'react'
import { HiOutlineDownload } from "react-icons/hi";

export default function ExportData() {
  return (
    <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 active:scale-95 cursor-pointer">
      <HiOutlineDownload size={18} className="text-gray-500" />
      <span>Export Data</span>
    </button>
  )
}
