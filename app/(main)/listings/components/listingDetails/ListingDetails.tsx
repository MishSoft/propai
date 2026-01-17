"use client"
import React from 'react';
import { useUiStore } from '@/store/useUiStore';
import { IoCloseOutline } from "react-icons/io5";
import Gallery from './Gallery';
import DetailsInfo from './DetailsInfo';

export default function ListingDetails() {
  const { selectedListing: item, closeDetailsModal } = useUiStore();

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-8 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500"
        onClick={closeDetailsModal}
      />

      {/* Modal Content */}
      <div
        className="relative bg-white w-full max-w-6xl h-full md:h-[90vh] md:rounded-[2.5rem] shadow-2xl grid grid-cols-1 md:grid-cols-10 overflow-hidden animate-in zoom-in-95 duration-500"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Close Button - მობილურზე ყოველთვის ზემოდან ადევს ყველაფერს */}
        <div className="fixed md:absolute top-4 right-4 z-[110]">
          <button
            onClick={closeDetailsModal}
            className="p-3 bg-white/90 md:bg-slate-50 hover:bg-white text-slate-900 md:text-slate-400 rounded-full shadow-xl md:shadow-none border border-slate-200 transition-all cursor-pointer flex items-center justify-center"
          >
            <IoCloseOutline size={28} />
          </button>
        </div>

        {/* Left Side: Gallery (მობილურზე 35%, კომპიუტერზე 60%) */}
        <div className="md:col-span-6 h-[35vh] md:h-full bg-slate-50 border-r border-slate-100 relative shrink-0">
          <Gallery images={item.images} />
        </div>

        {/* Right Side: Info & Actions (მობილურზე 65%, კომპიუტერზე 40%) */}
        <div className="md:col-span-4 h-[65vh] md:h-full flex flex-col relative bg-white overflow-hidden">
          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 flex flex-col custom-scrollbar">
            <DetailsInfo item={item} />
          </div>
        </div>

      </div>
    </div>
  );
}
