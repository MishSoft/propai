"use client"
import { CldUploadWidget } from 'next-cloudinary';
import { FaImage, FaTrash } from "react-icons/fa";

interface Props {
  selectedImages: string[];
  setSelectedImages: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ImageUpload({ selectedImages, setSelectedImages }: Props) {
  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className='flex flex-col gap-4'>
      <CldUploadWidget
        uploadPreset="propai_preset"
        onSuccess={(result: any) => {
          const url = result?.info?.secure_url;
          if (url) setSelectedImages((prev) => [...prev, url]);
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
        <div className='grid grid-cols-4 gap-4'>
          {selectedImages.map((image, index) => (
            <div key={index} className='relative aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group shadow-sm'>
              <img src={image} alt="preview" className='w-full h-full object-cover' />
              <button type="button" onClick={() => removeImage(index)} className='absolute cursor-pointer top-2 right-2 p-2 bg-red-500/90 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all'>
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
