"use client"
import React, { useState } from 'react'
import { HiOutlineHome, HiOutlineOfficeBuilding } from "react-icons/hi";
import { MdOutlineWarehouse } from "react-icons/md";
import { RiLandscapeLine } from "react-icons/ri";

const types = [
  { id: 'house', label: 'House', icon: HiOutlineHome },
  { id: 'apartment', label: 'Apartment', icon: HiOutlineOfficeBuilding },
  { id: 'commercial', label: 'Commercial', icon: MdOutlineWarehouse },
  { id: 'land', label: 'Land', icon: RiLandscapeLine },
]

export default function PropertyType() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['house']);

  const toggleType = (id: string) => {
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <section className="flex flex-col gap-3">
      <h3 className="text-slate-500 text-[10px] uppercase font-bold tracking-wider px-1">
        Property Type
      </h3>

      <div className="flex flex-wrap gap-2">
        {types.map((type) => {
          const isActive = selectedTypes.includes(type.id);
          return (
            <button
              key={type.id}
              onClick={() => toggleType(type.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
                ${isActive
                  ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200"
                  : "bg-white border-slate-200 text-slate-600 hover:border-purple-300 hover:text-purple-600"}
              `}
            >
              <type.icon size={18} />
              {type.label}
            </button>
          )
        })}
      </div>
    </section>
  )
}
