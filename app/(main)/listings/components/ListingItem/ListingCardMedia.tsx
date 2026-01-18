"use client"
import Image from 'next/image';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashCan } from "react-icons/fa6";

interface Props {
  images: string[];
  street: string;
  onDelete: (e: React.MouseEvent) => void;
  isDeleting: boolean;
  showDelete: boolean;
}

export default function ListingCardMedia({
  images,
  street,
  onDelete,
  isDeleting,
  showDelete
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className='relative h-64 overflow-hidden bg-slate-100 shrink-0'>
      <Image
        fill
        src={images[currentImageIndex] || '/placeholder.jpg'}
        alt={street}
        className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
      />

      {showDelete && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className='absolute top-4 right-4 p-3 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 cursor-pointer active:scale-90 border border-red-400'
          title="Delete Listing"
        >
          <FaTrashCan size={14} />
        </button>
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className='absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full text-slate-800 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 cursor-pointer'
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={nextImage}
            className='absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 hover:bg-white/90 backdrop-blur-md rounded-full text-slate-800 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/20 cursor-pointer'
          >
            <FaChevronRight size={14} />
          </button>
        </>
      )}

      {/* Status Badge */}
      <div className='absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest z-10'>
        For Sale
      </div>
    </div>
  );
}
