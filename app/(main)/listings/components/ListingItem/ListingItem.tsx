"use client"
import React, { useState } from 'react'
import { FaArrowTrendUp } from "react-icons/fa6";
import { MdArrowRightAlt } from "react-icons/md";
import { HiOutlineMapPin } from "react-icons/hi2";
import { useUiStore, ListingType } from '@/store/useUiStore';
import ListingCardMedia from './ListingCardMedia';
import ListingCardStats from './ListingCardStats';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';

export default function ListingItem({ item, isPublic = false }: { item: ListingType, isPublic?: boolean }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const openDetails = useUiStore((state) => state.openDetailsModal);
  const router = useRouter();
  const { data: session } = useSession();
  const t = useTranslations('Listings');
  const common = useTranslations('Common');

  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const isOwnerOrAdmin = userId === item.authorId || userRole === "Admin";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(common('confirm_delete'))) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/listings/${item.id}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.reload();
      } else {
        const errorData = await res.json();
        alert(`წაშლა ვერ მოხერხდა: ${errorData.error || res.statusText}`);
      }
    } catch (error) {
      alert("კავშირის შეცდომა");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <article className={`group w-full glass-card overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col bg-white/90 shadow-2xl shadow-slate-200/50 border-slate-100 ${isDeleting ? 'opacity-50 grayscale' : ''}`}>

      <ListingCardMedia
        category={item.category}
        images={item.images}
        street={item.street}
        onDelete={handleDelete}
        isDeleting={isDeleting}
        showDelete={!isPublic && isOwnerOrAdmin}
      />

      <div className='p-4 sm:p-6 flex flex-col flex-1 min-w-0'>
        <div className='flex flex-wrap items-center justify-between gap-2 mb-4 min-w-0'>
          <h2 className='min-w-0 truncate text-xl sm:text-2xl font-black text-slate-900 tracking-tighter'>
            ${item.price.toLocaleString()}
          </h2>
          <div className='shrink-0 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100'>
            <FaArrowTrendUp size={10} />
            <span className='text-[10px] font-black uppercase tracking-wider whitespace-nowrap'>{t('market_value')}</span>
          </div>
        </div>

        <div className='flex items-center gap-2 text-slate-500 mb-6 min-w-0'>
          <HiOutlineMapPin size={18} className='text-purple-600 shrink-0' />
          <p className='min-w-0 text-sm font-bold truncate tracking-tight' title={`${item.street}, ${item.city}`}>{item.street}, {item.city}</p>
        </div>

        <ListingCardStats beds={item.beds} baths={item.baths} sqft={item.sqft} />

        <button
          onClick={() => {
            if (isPublic) {
              router.push(`/listings/${item.id}`);
            } else {
              openDetails(item);
            }
          }}
          className='mt-auto flex items-center justify-center gap-3 w-full py-4 bg-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all duration-300 shadow-xl shadow-purple-600/20 active:scale-95 cursor-pointer group/btn'
        >
          {isDeleting ? common('deleting') : t('view_full_details')}
          <MdArrowRightAlt size={22} className='group-hover/btn:translate-x-1 transition-transform' />
        </button>
      </div>
    </article>
  )
}
