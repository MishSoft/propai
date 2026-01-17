"use client"
import React, { useState } from 'react'
import { FaArrowTrendUp, FaChevronLeft, FaChevronRight, FaTrashCan } from "react-icons/fa6"; // დაემატა FaTrashCan
import { MdArrowRightAlt } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import Image from 'next/image';
import { useUiStore, ListingType } from '@/store/useUiStore';

interface ListingProps {
  item: ListingType;
}

export default function ListingItem({ item }: ListingProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const openDetails = useUiStore((state) => state.openDetailsModal);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // რომ Details მოდალი არ გაიხსნას

    if (!confirm("დარწმუნებული ხართ, რომ გსურთ წაშლა?")) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/listings/${item.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        window.location.reload(); // მარტივი გზა სიის განახლებისთვის
      } else {
        const err = await res.json();
        alert(err.error || "წაშლა ვერ მოხერხდა");
      }
    } catch (error) {
      alert("კავშირის შეცდომა");
    } finally {
      setIsDeleting(false);
    }
  };

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  return (
    <article className={`group w-full bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col ${isDeleting ? 'opacity-50 grayscale' : ''}`}>

      {/* Carousel Area */}
      <div className='relative h-64 overflow-hidden bg-slate-100'>
        <Image
          fill
          src={item.images[currentImageIndex] || '/placeholder.jpg'}
          alt={item.street}
          className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
        />


        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className='absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer active:scale-90 border border-red-400'
          title="Delete Listing"
        >
          <FaTrashCan size={14} />
        </button>

        {item.images.length > 1 && (
          <>
            <button onClick={prevImage} className='absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full text-slate-800 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 cursor-pointer'>
              <FaChevronLeft size={14} />
            </button>
            <button onClick={nextImage} className='absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full text-slate-800 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 cursor-pointer'>
              <FaChevronRight size={14} />
            </button>
          </>
        )}

        <div className='absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest z-10'>
          For Sale
        </div>
      </div>

      {/* Content Area */}
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

        <div className='grid grid-cols-3 py-4 border-y border-slate-50 mb-6'>
          <div className='flex flex-col items-center border-r border-slate-50'>
            <span className='text-xs font-black text-slate-900'>{item.beds}</span>
            <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>Beds</span>
          </div>
          <div className='flex flex-col items-center border-r border-slate-50'>
            <span className='text-xs font-black text-slate-900'>{item.baths}</span>
            <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>Baths</span>
          </div>
          <div className='flex flex-col items-center'>
            <span className='text-xs font-black text-slate-900'>{item.sqft}</span>
            <span className='text-[9px] font-bold text-slate-400 uppercase tracking-tighter'>Sqft</span>
          </div>
        </div>

        <button
          onClick={() => openDetails(item)}
          className='mt-auto flex items-center justify-center gap-3 w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-[1.25rem] hover:bg-purple-600 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95 cursor-pointer group/btn'
        >
          {isDeleting ? 'Deleting...' : 'View Full Details'}
          <MdArrowRightAlt size={22} className='group-hover/btn:translate-x-1 transition-transform' />
        </button>
      </div>
    </article>
  )
}
