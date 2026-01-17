"use client"
import { useUiStore } from '@/store/useUiStore';
import React, { useEffect, useRef, useState } from 'react'
import { FaImage, FaTimes, FaMagic, FaTrash, FaMapMarkerAlt, FaTag, FaUserTie, FaPhoneAlt } from "react-icons/fa";
import { MdOutlineBedroomParent, MdOutlineBathtub, MdOutlineSquareFoot } from "react-icons/md";
import { CldUploadWidget } from 'next-cloudinary';

export default function Listing() {
  const closeModal = useUiStore((state) => state.closeListingModal)
  const [showAiOptions, setShowAiOptions] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null)

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeModal();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [closeModal])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // ვაგროვებთ მონაცემებს და გარდავქმნით შესაბამის ტიპებად (Int)
    const data = {
      city: (document.getElementById('city') as HTMLInputElement).value,
      street: (document.getElementById('street') as HTMLInputElement).value,
      price: parseInt((document.getElementById('price') as HTMLInputElement).value),
      beds: parseInt((document.getElementById('rooms') as HTMLInputElement).value),
      baths: parseInt((document.getElementById('baths') as HTMLInputElement).value),
      sqft: parseInt((document.getElementById('sqft') as HTMLInputElement).value),
      description: (document.getElementById('description') as HTMLTextAreaElement).value,
      images: selectedImages,
      // აგენტის მონაცემები
      agentName: (document.getElementById('agentName') as HTMLInputElement).value,
      agentPhone: (document.getElementById('agentPhone') as HTMLInputElement).value,
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
      } else {
        const errorData = await response.json();
        alert(errorData.error || "Something went wrong");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Connection to server failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className='w-full h-screen bg-slate-900/60 backdrop-blur-md fixed top-0 left-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div ref={menuRef} className='relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 my-auto'>

        {/* Header */}
        <div className='flex items-center justify-between px-10 py-8 border-b border-slate-50'>
          <div>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>Add New Listing</h2>
            <p className='text-sm text-slate-400 font-medium'>Tell us more about your property</p>
          </div>
          <button onClick={closeModal} className='p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 cursor-pointer active:scale-90'>
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-10 flex flex-col gap-8 max-h-[75vh] overflow-y-auto'>

          {/* Cloudinary Image Upload Area */}
          <div className='flex flex-col gap-4'>
            <CldUploadWidget
              uploadPreset="propai_preset"
              onSuccess={(result: any) => {
                const url = result?.info?.secure_url;
                if (url) {
                  setSelectedImages((prev) => [...prev, url]);
                }
              }}
              options={{ maxFiles: 10 }}
            >
              {({ open }) => (
                <button
                  type="button"
                  onClick={() => open()}
                  className='flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50 hover:bg-purple-50 hover:border-purple-300 transition-all cursor-pointer group'
                >
                  <div className='w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-3 group-hover:scale-110 transition-transform'>
                    <FaImage className='text-purple-600' size={24} />
                  </div>
                  <p className='text-sm font-black text-slate-700'>Upload Property Photos</p>
                  <span className='text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1'>Cloudinary Secure Hosting</span>
                </button>
              )}
            </CldUploadWidget>

            {selectedImages.length > 0 && (
              <div className='grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2'>
                {selectedImages.map((image, index) => (
                  <div key={index} className='relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-sm'>
                    <img src={image} alt="preview" className='w-full h-full object-cover transition-transform group-hover:scale-110' />
                    <button type="button" onClick={() => removeImage(index)} className='absolute cursor-pointer top-2 right-2 p-2 bg-red-500/90 backdrop-blur-sm text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600'>
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Main Info */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <div className='flex flex-col gap-2.5'>
              <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest' htmlFor="city"><FaMapMarkerAlt /> City</label>
              <input required className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 font-bold text-slate-700' id='city' type="text" placeholder='Tbilisi' />
            </div>
            <div className='flex flex-col gap-2.5'>
              <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest' htmlFor="price"><FaTag /> Price (USD)</label>
              <input required className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 font-bold text-slate-700' id='price' type="number" placeholder='85000' />
            </div>
          </div>

          <div className='flex flex-col gap-2.5'>
            <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest' htmlFor="street"><FaMapMarkerAlt /> Street Address</label>
            <input required className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 font-bold text-slate-700' id='street' type="text" placeholder='Pekini Ave. 15' />
          </div>

          <div className='grid grid-cols-3 gap-6'>
            <InputWithIcon id="rooms" label="Rooms" icon={<MdOutlineBedroomParent size={18} />} />
            <InputWithIcon id="baths" label="Baths" icon={<MdOutlineBathtub size={18} />} />
            <InputWithIcon id="sqft" label="Sqft" icon={<MdOutlineSquareFoot size={18} />} />
          </div>

          {/* Description */}
          <div className='flex flex-col gap-2.5'>
            <div className='flex items-center justify-between'>
              <label className='text-[10px] font-black text-slate-400 uppercase tracking-widest' htmlFor="description">Property Description</label>
              <button type='button' onClick={() => setShowAiOptions(!showAiOptions)} className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black rounded-xl hover:shadow-lg hover:shadow-purple-200 transition-all cursor-pointer active:scale-95 uppercase tracking-wider'>
                <FaMagic /> AI Rewrite
              </button>
            </div>
            <textarea id="description" rows={4} className='w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none focus:border-purple-400 resize-none font-medium text-slate-600' placeholder='Tell potential buyers about the unique features...' />
          </div>

          {/* Agent Information - NEW SECTION */}
          <div className='pt-8 border-t border-slate-100 flex flex-col gap-6'>
            <h3 className='text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]'>Agent Contact Information</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='flex flex-col gap-2.5'>
                <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest' htmlFor="agentName"><FaUserTie /> Agent Full Name</label>
                <input required className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 font-bold text-slate-700' id='agentName' type="text" placeholder='Giorgi Makharashvili' />
              </div>
              <div className='flex flex-col gap-2.5'>
                <label className='flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest' htmlFor="agentPhone"><FaPhoneAlt /> Phone Number</label>
                <input required className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 font-bold text-slate-700' id='agentPhone' type="text" placeholder='+995 5xx xxx xxx' />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 ${loading ? 'bg-slate-200 cursor-not-allowed text-slate-400' : 'bg-slate-900 hover:bg-purple-600 text-white shadow-xl shadow-slate-200'} font-black rounded-4xl transition-all duration-300 active:scale-[0.98] cursor-pointer mt-4 text-sm uppercase tracking-widest`}
          >
            {loading ? 'Processing...' : 'Publish Listing'}
          </button>
        </form>
      </div>
    </section>
  )
}

// დამხმარე კომპონენტი ინფუთებისთვის
function InputWithIcon({ id, label, icon }: { id: string, label: string, icon: any }) {
  return (
    <div className='flex flex-col gap-2.5 text-center items-center'>
      <label className='flex items-center justify-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter' htmlFor={id}>
        {icon}
      </label>
      <input required className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-purple-400 text-center font-black text-slate-700' id={id} type="number" placeholder="0" />
      <span className='text-[10px] font-bold text-slate-400 uppercase'>{label}</span>
    </div>
  )
}
