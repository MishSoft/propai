"use client"
import Image from 'next/image';
import { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTrashCan } from "react-icons/fa6";

interface Props {
  images: string[];
  street: string;
  category: string; // <-- დავამატეთ ეს
  onDelete: (e: React.MouseEvent) => void;
  isDeleting: boolean;
  showDelete: boolean;
}

import { useTranslations } from 'next-intl';

export default function ListingCardMedia({
  images,
  street,
  category,
  onDelete,
  isDeleting,
  showDelete
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const t = useTranslations('Listings');

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isSale = category === "Buy" || category === "Sale";
  const label = isSale ? t('for_sale') : t('for_rent');

  return (
    <div className='relative h-64 overflow-hidden bg-slate-100 shrink-0'>
      <Image
        fill
        src={images[currentImageIndex] || '/placeholder.jpg'}
        alt={street}
        className='w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110'
      />

      {showDelete && (
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className='absolute top-4 right-4 p-3 bg-white/90 hover:bg-white text-red-600 rounded-xl shadow-2xl transition-all duration-300 z-20 cursor-pointer active:scale-90 border border-slate-100 backdrop-blur-md'
          title="Delete Listing"
        >
          <FaTrashCan size={14} />
        </button>
      )}

      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className='absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/20 hover:bg-white/90 backdrop-blur-xl rounded-full text-slate-900 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/50 cursor-pointer shadow-lg'
          >
            <FaChevronLeft size={14} />
          </button>
          <button
            onClick={nextImage}
            className='absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/20 hover:bg-white/90 backdrop-blur-xl rounded-full text-slate-900 transition-all opacity-0 group-hover:opacity-100 z-10 border border-white/50 cursor-pointer shadow-lg'
          >
            <FaChevronRight size={14} />
          </button>
        </>
      )}

      {/* დინამიკური Label */}
      <div className='absolute top-4 left-4 bg-purple-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest z-10 shadow-lg shadow-purple-600/20'>
        {label}
      </div>
    </div>
  );
}
