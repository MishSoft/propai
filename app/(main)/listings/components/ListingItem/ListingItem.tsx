"use client"
import React, { useState } from 'react'
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdArrowRightAlt } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { useUiStore, ListingType } from '@/store/useUiStore';
import ListingCardMedia from './ListingCardMedia';
import ListingCardStats from './ListingCardStats';
import { useRouter } from 'next/navigation';

// დავამატეთ isPublic? პროპსი
export default function ListingItem({ item, isPublic = false }: { item: ListingType, isPublic?: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const openDetails = useUiStore((state) => state.openDetailsModal);
  const router = useRouter()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/listings/${item.id}`, { method: 'DELETE' });
      if (res.ok) window.location.reload();
      else alert("წაშლა ვერ მოხერხდა");
    } catch (error) {
      alert("კავშირის შეცდომა");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className={`group w-full bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col ${isDeleting ? 'opacity-50 grayscale' : ''}`}>

      <ListingCardMedia
        images={item.images}
        street={item.street}
        // თუ საჯაროა, onDelete ფუნქცია არ გადაეცემა, შესაბამისად ღილაკი არ გამოჩნდება
        onDelete={!isPublic ? handleDelete : () => { }}
        isDeleting={isDeleting}
        showDelete={!isPublic} // ListingCardMedia-შიც დაგვჭირდება ამის გათვალისწინება
      />

      <div className='p-6 flex flex-col flex-1'>
        <div className='flex items-center justify-between mb-4'>
          <h2 className='text-2xl font-black text-slate-900'>
            ${item.price.toLocaleString()}
          </h2>
          <div className='flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100'>
            <FaArrowTrendUp size={10} />
            <span className='text-[10px] font-black uppercase'>Market Value</span>
          </div>
        </div>

        <div className='flex items-center gap-2 text-slate-500 mb-4'>
          <HiOutlineMapPin size={18} className='text-purple-500 shrink-0' />
          <p className='text-sm font-bold truncate tracking-tight'>{item.street}, {item.city}</p>
        </div>

        <ListingCardStats beds={item.beds} baths={item.baths} sqft={item.sqft} />

        <button
          onClick={() => {
            if (isPublic) {
              router.push(`/listings/${item.id}`); // გადადის დეტალურ გვერდზე
            } else {
              openDetails(item); // ხსნის მოდალს მაკლერისთვის
            }
          }}
          className='mt-auto flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-[1.25rem] hover:bg-purple-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95 cursor-pointer group/btn'
        >
          {isDeleting ? 'Deleting...' : 'View Full Details'}
          <MdArrowRightAlt size={22} className='group-hover/btn:translate-x-1 transition-transform' />
        </button>
      </div>
    </article>
  )
}
