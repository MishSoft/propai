"use client"
import React, { useState } from 'react';
import { ListingType } from '@/store/useUiStore';
import { FaCopy, FaUserTie, FaWandMagicSparkles, FaCheck, FaRotate } from "react-icons/fa6";
import StoryGenerator from './StoryGenerator';

export default function DetailsInfo({ item, isPublic = false }: { item: ListingType, isPublic?: boolean }) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  // AI-სთვის საჭირო სთეითები
  const [isRewriting, setIsRewriting] = useState(false);
  const [selectedLangs, setSelectedLangs] = useState<string[]>(['geo']); // დეფოლტად ქართული
  const [displayedDescription, setDisplayedDescription] = useState(item.description);

  const handleCopy = (path: string, section: string) => {
    const baseUrl = window.location.origin;
    const fullLink = `${baseUrl}${path}`;
    navigator.clipboard.writeText(fullLink);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const toggleLang = (lang: string) => {
    setSelectedLangs(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleRewrite = async () => {
    if (selectedLangs.length === 0) return alert("გთხოვთ აირჩიოთ მინიმუმ ერთი ენა");

    setIsRewriting(true);
    try {
      const res = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: item.description,
          languages: selectedLangs
        }),
      });

      const data = await res.json();
      if (data.rewrittenText) {
        setDisplayedDescription(data.rewrittenText);
      } else {
        alert("AI-მ ტექსტი ვერ დაამუშავა");
      }
    } catch (error) {
      alert("კავშირის შეცდომა");
    } finally {
      setIsRewriting(false);
    }
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
      <div className="mb-6 min-h-0 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-2 shrink-0">
          <h4 className="text-slate-900 font-bold flex items-center gap-2 text-[10px] uppercase tracking-widest">
            <FaWandMagicSparkles className="text-purple-500" /> AI Description
          </h4>

          {/* ენების ასარჩევი (მხოლოდ მაკლერისთვის) */}
          {!isPublic && (
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {[
                { id: 'geo', label: 'GE' },
                { id: 'eng', label: 'EN' },
                { id: 'rus', label: 'RU' }
              ].map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => toggleLang(lang.id)}
                  className={`px-2 py-0.5 rounded md text-[8px] font-black transition-all ${selectedLangs.includes(lang.id)
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="overflow-y-auto pr-2 custom-scrollbar italic bg-slate-50/50 p-4 rounded-2xl border border-slate-100 relative group">
          <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-line">
            {displayedDescription}
          </p>

          {/* Rewrite ღილაკი, რომელიც ტექსტზე "ცურავს" */}
          {!isPublic && (
            <button
              onClick={handleRewrite}
              disabled={isRewriting}
              className="absolute top-3 right-3 p-2 bg-white border border-slate-200 rounded-xl text-purple-600 shadow-sm hover:shadow-md transition-all active:scale-90 disabled:opacity-50"
              title="Rewrite with AI"
            >
              <FaRotate className={`${isRewriting ? 'animate-spin' : ''}`} size={14} />
            </button>
          )}
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
