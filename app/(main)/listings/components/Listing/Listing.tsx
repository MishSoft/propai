"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useUiStore } from '@/store/useUiStore';
import { FaTimes, FaMagic, FaMapMarkerAlt, FaTag, FaUserTie, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineBedroomParent, MdOutlineBathtub, MdOutlineSquareFoot } from "react-icons/md";
import ImageUpload from './ImageUpload';
import { ListingInput } from './ListingInput';
import FeatureInput from './FeatureInput';

export default function Listing() {
  const closeModal = useUiStore((state) => state.closeListingModal)
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [description, setDescription] = useState("");
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["Georgian"]);

  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) closeModal();
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeModal])

  const handleLangToggle = (lang: string) => {
    setSelectedLangs(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  const handleAiRewrite = async () => {
    if (!description) return alert("გთხოვთ, ჯერ შეიყვანოთ მოკლე აღწერა");
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, languages: selectedLangs }),
      });
      const data = await response.json();
      if (data.rewrittenText) setDescription(data.rewrittenText);
    } catch (error) {
      alert("AI-მ ვერ შეძლო ტექსტის დამუშავება");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement).value;

    const data = {
      city: getVal('city'),
      street: getVal('street'),
      price: parseInt(getVal('price')),
      rooms: parseInt(getVal('rooms')),
      baths: parseInt(getVal('baths')),
      sqft: parseInt(getVal('sqft')),
      description: description,
      images: selectedImages,
      agentName: getVal('agentName'),
      agentPhone: getVal('agentPhone'),
    };

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("Listing created successfully!");
        closeModal();
        window.location.reload();
      }
    } catch (error) {
      alert("Error submitting listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='w-full h-screen bg-slate-900/60 backdrop-blur-md fixed top-0 left-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div ref={menuRef} className='relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 my-auto'>

        {/* Header */}
        <div className='flex items-center justify-between px-10 py-8 border-b border-slate-50'>
          <div>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>Add New Listing</h2>
            <p className='text-sm text-slate-400 font-medium'>Tell us more about your property</p>
          </div>
          <button onClick={closeModal} className='p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 cursor-pointer'><FaTimes size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className='p-10 flex flex-col gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar'>

          <ImageUpload selectedImages={selectedImages} setSelectedImages={setSelectedImages} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <ListingInput id="city" label="City" placeholder="Tbilisi" icon={<FaMapMarkerAlt />} />
            <ListingInput id="price" label="Price (USD)" type="number" placeholder="85000" icon={<FaTag />} />
          </div>

          <ListingInput id="street" label="Street Address" placeholder="Pekini Ave. 15" icon={<FaMapMarkerAlt />} />

          {/* ოთახები, აბაზანა, კვადრატულობა */}
          <div className='grid grid-cols-3 gap-6'>
            <FeatureInput id="rooms" label="Rooms" icon={<MdOutlineBedroomParent size={18} />} />
            <FeatureInput id="baths" label="Baths" icon={<MdOutlineBathtub size={18} />} />
            <FeatureInput id="sqft" label="Sqft" icon={<MdOutlineSquareFoot size={18} />} />
          </div>

          {/* AI Description Section */}
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>Description</label>
              <div className='flex gap-2'>
                {["Georgian", "English", "Russian"].map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleLangToggle(lang)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${selectedLangs.includes(lang) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    {lang === "Georgian" ? "GE" : lang === "English" ? "EN" : "RU"}
                  </button>
                ))}
              </div>
              <button
                type='button'
                onClick={handleAiRewrite}
                disabled={aiLoading}
                className='flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-wider hover:shadow-lg disabled:opacity-50'
              >
                <FaMagic /> {aiLoading ? 'Processing...' : 'AI Professionalize'}
              </button>
            </div>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="მაგ: ბინა არის კარგ მდგომარეობაში..."
              className='w-full p-5 bg-slate-50 border border-slate-200 rounded-3xl outline-none focus:border-purple-400 resize-none text-slate-600 text-sm leading-relaxed'
            />
          </div>

          {/* აგენტის ინფორმაცია */}
          <div className='pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6'>
            <ListingInput id="agentName" label="Agent Name" icon={<FaUserTie />} />
            <ListingInput id="agentPhone" label="Phone Number" icon={<FaPhoneAlt />} />
          </div>

          <button type="submit" disabled={loading} className={`w-full py-5 rounded-4xl font-black transition-all ${loading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-purple-600'} uppercase tracking-widest`}>
            {loading ? 'Processing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </section>
  )
}
