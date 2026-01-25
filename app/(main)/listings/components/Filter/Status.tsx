"use client"
import React, { useState, useRef, useEffect } from 'react'
import { FaChevronDown } from "react-icons/fa6";

export default function Status() {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('All');
  const statusList = ['All', 'Draft', 'Ready', 'Shared', 'In Negotiation', 'Closed'];

  // მენიუს გარეთ დაჭერისას დახურვის ლოგიკა
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className='relative w-fit' ref={dropdownRef}>
      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`
          group flex items-center justify-between gap-8
          bg-white border px-4 py-2.5 rounded-xl
          transition-all duration-200 cursor-pointer min-w-40
          ${isOpen ? "border-purple-500 shadow-md ring-2 ring-purple-50" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"}
        `}
      >
        <div className='flex gap-2 items-center'>
          <span className='text-slate-400 text-sm uppercase font-bold tracking-wider leading-none'>
            Status:
          </span>
          <span className='text-slate-900 text-sm font-semibold'>
            {selected}
          </span>
        </div>

        <FaChevronDown
          size={12}
          className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-purple-600" : ""}`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className='
          absolute left-0 mt-2 w-full min-w-50 z-50
          bg-white border border-slate-100 rounded-xl shadow-xl shadow-slate-200/50
          p-1.5 animate-in fade-in zoom-in duration-150
        '>
          {statusList.map((item) => (
            <button
              key={item}
              onClick={() => {
                setSelected(item);
                setIsOpen(false);
              }}
              className={`
                flex items-center w-full px-3 py-2 text-sm rounded-lg transition-colors
                ${selected === item
                  ? "bg-purple-50 text-purple-700 font-medium"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"}
              `}
            >
              {item}
              {selected === item && (
                <div className='ml-auto w-1.5 h-1.5 rounded-full bg-purple-600' />
              )}
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
