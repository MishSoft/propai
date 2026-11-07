"use client"
import React, { useState } from 'react';
import { ListingType } from '@/store/useUiStore';
import { FaCopy, FaUserTie, FaWandMagicSparkles, FaCheck } from "react-icons/fa6";
import { useTranslations } from 'next-intl';
import StoryGenerator from './StoryGenerator';

export default function DetailsInfo({ item, isPublic = false }: { item: ListingType, isPublic?: boolean }) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const t = useTranslations('Listings');

  const handleCopy = (path: string, section: string) => {
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}${path}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="flex flex-col h-full max-h-full">
      <div className="mb-4 md:mb-6 shrink-0">
        <h2 className="text-2xl md:text-4xl font-black text-slate-900 mb-1 tracking-tight">
          ${item.price.toLocaleString()}
        </h2>
        <p className="text-slate-500 text-sm font-medium">{item.street}, {item.city}</p>
      </div>

      {/* AI Description Section */}
      <div className="mb-6 shrink-0 md:shrink md:min-h-0 md:flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h4 className="text-slate-900 font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <FaWandMagicSparkles className="text-purple-500" /> AI Description
          </h4>
        </div>

        <div className="md:overflow-y-auto md:min-h-0 md:flex-1 pr-2 custom-scrollbar italic bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
          <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
            {item.description?.trim() ? item.description : t('no_description')}
          </p>
        </div>
      </div>

      {!isPublic && (
        <div className="bg-slate-50 p-4 md:p-6 rounded-4xl border border-slate-100 space-y-4 shrink-0 shadow-sm">
          <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
            Marketing Toolkit
          </h4>

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => handleCopy(`/listings/${item.id}`, 'listing')}
              className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 transition-all group cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-tighter">
                <FaCopy className="text-slate-400 group-hover:text-purple-500" size={12} />
                Copy Link
              </div>
              {copiedSection === 'listing' && <FaCheck className="text-emerald-500" />}
            </button>

            <button
              onClick={() => handleCopy(`/agent/${item.authorId}`, 'portfolio')}
              className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-xl hover:border-purple-300 transition-all group cursor-pointer text-xs"
            >
              <div className="flex items-center gap-2 text-slate-700 font-bold uppercase tracking-tighter">
                <FaUserTie className="text-slate-400 group-hover:text-purple-500" size={12} />
                My Portfolio
              </div>
              {copiedSection === 'portfolio' && <FaCheck className="text-emerald-500" />}
            </button>
          </div>

          <div className="pt-4 border-t border-slate-200/60">
            <StoryGenerator listing={item} />
          </div>
        </div>
      )}
    </div>
  );
}
