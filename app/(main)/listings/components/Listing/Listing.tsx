"use client"
import React, { useState } from 'react'
import { FaImage, FaTimes, FaMagic, FaTrash } from "react-icons/fa";
import { MdOutlineBedroomParent, MdOutlineBathtub, MdOutlineSquareFoot, MdDescription } from "react-icons/md";

export default function Listing() {
  const [showAiOptions, setShowAiOptions] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setSelectedImages((prevImages) => prevImages.concat(filesArray));
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <section className='w-full h-screen bg-slate-900/20 backdrop-blur-md fixed top-0 left-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div className='relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200 my-auto'>

        {/* Header */}
        <div className='flex items-center justify-between px-8 py-6 border-b border-slate-50'>
          <div>
            <h2 className='text-2xl font-bold text-slate-800'>Add New Listing</h2>
            <p className='text-sm text-slate-500'>Fill in the details to list your apartment</p>
          </div>
          <button className='p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400'>
            <FaTimes size={20} />
          </button>
        </div>

        <form className='p-8 flex flex-col gap-6'>

          {/* Image Upload & Preview Area */}
          <div className='flex flex-col gap-4'>
            <label htmlFor="image" className='flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 hover:bg-purple-50/50 hover:border-purple-300 transition-all cursor-pointer group'>
              <div className='flex flex-col items-center justify-center gap-2'>
                <FaImage className='text-purple-500' size={24} />
                <p className='text-sm font-semibold text-slate-700'>Add apartment images</p>
              </div>
              <input id='image' type="file" multiple className='hidden' onChange={handleImageChange} />
            </label>

            {/* Image Preview Gallery */}
            {selectedImages.length > 0 && (
              <div className='grid grid-cols-4 gap-4 animate-in fade-in duration-300'>
                {selectedImages.map((image, index) => (
                  <div key={index} className='relative aspect-square rounded-xl overflow-hidden border border-slate-200 group'>
                    <img src={image} alt="preview" className='w-full h-full object-cover' />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className='absolute cursor-pointer top-1 right-1 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg'
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex flex-col gap-2'>
              <label className='flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider' htmlFor="rooms">
                <MdOutlineBedroomParent size={16} /> Rooms
              </label>
              <input className='w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-400 transition-all text-slate-700' id='rooms' type="number" placeholder='3' />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider' htmlFor="baths">
                <MdOutlineBathtub size={16} /> Baths
              </label>
              <input className='w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-400 transition-all text-slate-700' id='baths' type="number" placeholder='2' />
            </div>

            <div className='flex flex-col gap-2'>
              <label className='flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider' htmlFor="sqft">
                <MdOutlineSquareFoot size={16} /> Sqft
              </label>
              <input className='w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-400 transition-all text-slate-700' id='sqft' type="number" placeholder='1200' />
            </div>
          </div>

          {/* Description Field with AI */}
          <div className='flex flex-col gap-2 relative'>
            <div className='flex items-center justify-between'>
              <label className='flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider' htmlFor="description">
                <MdDescription size={16} /> Description
              </label>

              <div className='relative'>
                <button
                  type='button'
                  onClick={() => setShowAiOptions(!showAiOptions)}
                  className='flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-500 to-indigo-600 text-white text-[10px] font-bold uppercase rounded-lg hover:shadow-lg transition-all'
                >
                  <FaMagic size={10} /> AI Generate
                </button>

                {showAiOptions && (
                  <div className='absolute right-0 bottom-full mb-2 w-32 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-10'>
                    {['Georgian', 'English', 'Russian'].map((lang) => (
                      <button key={lang} type='button' className='w-full text-left px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-purple-50' onClick={() => setShowAiOptions(false)}>
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <textarea
              id="description"
              rows={3}
              className='w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-purple-50 focus:border-purple-400 transition-all text-slate-700 resize-none'
              placeholder='Describe the highlights...'
            ></textarea>
          </div>

          <button type="submit" className='w-full cursor-pointer py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98]'>
            Create Listing
          </button>
        </form>
      </div>
    </section>
  )
}
