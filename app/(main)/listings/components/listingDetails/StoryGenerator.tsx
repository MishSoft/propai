"use client"
import React, { useRef } from 'react';
import { toPng } from 'html-to-image';
import { ListingType } from '@/store/useUiStore';
import { FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { useTranslations } from 'next-intl';

interface StoryGeneratorProps {
  listing: ListingType;
}

export default function StoryGenerator({ listing }: StoryGeneratorProps) {
  const storyRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Listings');
  const normalizedCategory = listing.category.trim().toLowerCase();
  const categoryLabel =
    normalizedCategory === 'buy' || normalizedCategory === 'sale'
      ? t('for_sale')
      : normalizedCategory === 'rent'
        ? t('for_rent')
        : null;

  const downloadStory = async () => {
    if (storyRef.current === null) return;

    try {
      const dataUrl = await toPng(storyRef.current, { cacheBust: true, quality: 1 });
      const link = document.createElement('a');
      link.download = `story-${listing.id}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Story generation failed', err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* გადმოსაწერი ღილაკი */}
      <button
        onClick={downloadStory}
        className="w-full py-4 bg-linear-to-r from-purple-600 to-indigo-600 text-white font-black rounded-2xl shadow-lg hover:scale-105 transition-all active:scale-95 uppercase tracking-widest text-xs cursor-pointer"
      >
        {t('download_instagram_story')}
      </button>

      {/* თავად Story შაბლონი (ეკრანზე არ ჩანს, რადგან fixed და -left-full აქვს) */}
      <div aria-hidden="true" className="fixed -left-2499.75 top-0">
        <div
          ref={storyRef}
          className="w-270 h-480 bg-slate-900 relative overflow-hidden flex flex-col"
          style={{ fontFamily: 'sans-serif' }}
        >
          {/* Main Background Image */}
          <img
            src={listing.images[0]}
            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-105 blur-[2px]"
            alt=""
          />

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/40 to-slate-900" />

          {/* Content Container */}
          <div className="relative z-10 flex-1 flex flex-col justify-between p-20">

            {/* Top Section: Price & Logo */}
            <div className="flex justify-between items-start">
              <div className="bg-white px-12 py-6 rounded-[3rem] shadow-2xl">
                {categoryLabel && (
                  <p className="text-[30px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {categoryLabel}
                  </p>
                )}
                <h2 className="text-[80px] font-black text-slate-900">${listing.price.toLocaleString()}</h2>
              </div>
              <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-white text-5xl font-black">P</div>
            </div>

            {/* Middle Section: Main Photo Frame */}
            <div className="w-full aspect-[4/5] rounded-[5rem] overflow-hidden border-[15px] border-white shadow-2xl">
            <img src={listing.images[0]} className="w-full h-full object-cover" alt="" />
            </div>

            {/* Bottom Section: Details & Agent */}
            <div className="flex flex-col gap-10">
              <div>
                <h3 className="text-[70px] font-black text-white leading-tight mb-4">{listing.street}</h3>
                <p className="flex items-center gap-4 text-[40px] text-purple-300 font-bold">
                  <FaMapMarkerAlt /> {listing.city}, {t('country_georgia')}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl text-center">
                  <p className="text-white text-5xl font-black">{listing.beds}</p>
                  <p className="text-slate-400 text-2xl font-bold uppercase">{t('beds')}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl text-center">
                  <p className="text-white text-5xl font-black">{listing.baths}</p>
                  <p className="text-slate-400 text-2xl font-bold uppercase">{t('baths')}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl text-center">
                  <p className="text-white text-5xl font-black">{listing.sqft}</p>
                  <p className="text-slate-400 text-2xl font-bold uppercase">{t('sqft')}</p>
                </div>
              </div>

              {/* Agent Card */}
              <div className="bg-white p-10 rounded-[3.5rem] flex items-center gap-8 shadow-2xl">
                <div className="w-32 h-32 rounded-3xl overflow-hidden bg-slate-100">
                  <img src={listing.author?.image || "https://ui-avatars.com/api/?name=Agent"} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1">
                  <p className="text-slate-400 text-2xl font-black uppercase tracking-widest">{listing.author?.role || t('real_estate_agent')}</p>
                  <h4 className="text-5xl font-black text-slate-900">{listing.author?.fullName}</h4>
                </div>
                <div className="bg-slate-900 p-8 rounded-3xl text-white text-4xl">
                  <FaPhoneAlt />
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
