"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useUiStore, type ListingType } from '@/store/useUiStore';
import { FaTimes, FaMagic, FaMapMarkerAlt, FaTag, FaBuilding } from "react-icons/fa";
import { MdOutlineBedroomParent, MdOutlineBathtub, MdOutlineSquareFoot } from "react-icons/md";
import ImageUpload from './ImageUpload';
import { ListingInput } from './ListingInput';
import FeatureInput from './FeatureInput';
import { ListingSelect } from './OptionSection'; // დარწმუნდი რომ ფაილის სახელი სწორია
import { useToast } from '@/app/components/feedback/ToastProvider';
import { useTranslations } from 'next-intl';
import { lockBodyScroll } from '@/lib/scroll-lock';

interface ListingProps {
  onCreated: (listing: ListingType) => void;
}

interface CreatedListingResponse extends Omit<ListingType, 'author'> {
  author: {
    name: string | null;
    phone: string | null;
    image: string | null;
    role: string | null;
  };
}

export default function Listing({ onCreated }: ListingProps) {
  const closeModal = useUiStore((state) => state.closeListingModal)
  const toast = useToast();
  const t = useTranslations('Listings');
  const common = useTranslations('Common');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  // 👇 1. დავამატეთ აკლებული სთეითები
  const [category, setCategory] = useState("buy");
  const [floor, setFloor] = useState("1");
  const [description, setDescription] = useState("");
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["Georgian"]);

  const menuRef = useRef<HTMLDivElement | null>(null)
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const submitInFlightRef = useRef(false);

  useEffect(() => lockBodyScroll(), []);

  useEffect(() => {
    const handleOutsidePointerDown = (event: PointerEvent) => {
      const eventPath = event.composedPath();
      const isListingSelectContent = eventPath.some(
        (target) => target instanceof Element && target.hasAttribute('data-listing-select-content'),
      );
      if (isListingSelectContent) return;
      if (menuRef.current && !eventPath.includes(menuRef.current)) closeModal();
    };
    document.addEventListener('pointerdown', handleOutsidePointerDown, true);
    return () => document.removeEventListener('pointerdown', handleOutsidePointerDown, true);
  }, [closeModal])

  const handleLangToggle = (lang: string) => {
    setSelectedLangs(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    );
  };

  // სართულების ოფციები (1-დან 20-მდე)
  const floorOptions = Array.from({ length: 20 }, (_, i) => ({
    label: (i + 1).toString(),
    value: (i + 1).toString(),
  }));
  const aiLanguages = [
    { value: 'Georgian', abbreviation: 'GE', label: t('language_georgian') },
    { value: 'English', abbreviation: 'EN', label: t('language_english') },
    { value: 'Russian', abbreviation: 'RU', label: t('language_russian') },
  ];

  const handleAiRewrite = async () => {
    if (!description) {
      setDescriptionError(t('description_required'));
      descriptionRef.current?.focus();
      return;
    }

    setDescriptionError(null);
    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/rewrite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description, languages: selectedLangs }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "AI-მ ვერ შეძლო ტექსტის დამუშავება");
      }
      if (data.rewrittenText) setDescription(data.rewrittenText);
    } catch (error) {
      console.error("AI rewrite failed:", error);
      toast.error(t('ai_rewrite_failed'));
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitInFlightRef.current) return;

    submitInFlightRef.current = true;
    setLoading(true);

    const getVal = (id: string) => (document.getElementById(id) as HTMLInputElement).value;

    const data = {
      city: getVal('city'),
      street: getVal('street'),
      price: Number(getVal('price')),
      rooms: parseInt(getVal('rooms')),
      baths: parseInt(getVal('baths')),
      sqft: Number(getVal('sqft')),
      description: description,
      images: selectedImages,
      floor: parseInt(floor),
      category: category,
    };

    try {
      const response = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const created = (await response.json()) as CreatedListingResponse;
        const listing: ListingType = {
          ...created,
          author: {
            fullName: created.author.name ?? '',
            phone: created.author.phone ?? '',
            ...(created.author.image ? { image: created.author.image } : {}),
            ...(created.author.role ? { role: created.author.role } : {}),
          },
        };
        onCreated(listing);
        toast.success(t('create_success'));
        closeModal();
      } else {
        const errorData = (await response.json()) as { error?: string };
        console.error("Listing submission rejected:", errorData.error || response.status);
        toast.error(response.status === 403 ? t('listing_limit_reached') : t('create_error'));
      }
    } catch (error) {
      console.error("Listing submission failed:", error);
      toast.error(t('create_error'));
    } finally {
      submitInFlightRef.current = false;
      setLoading(false);
    }
  };

  return (
    <section className='w-full h-screen bg-slate-900/60 backdrop-blur-md fixed top-0 left-0 z-50 flex items-center justify-center p-4 overflow-y-auto'>
      <div ref={menuRef} className='relative pointer-events-auto w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100 my-auto'>

        {/* Header */}
        <div className='flex items-center justify-between px-10 py-8 border-b border-slate-50'>
          <div>
            <h2 className='text-3xl font-black text-slate-900 tracking-tight'>{t('addNew')}</h2>
            <p className='text-sm text-slate-400 font-medium'>{t('form_subtitle')}</p>
          </div>
          <button
            type="button"
            onClick={closeModal}
            aria-label={common('close')}
            className='p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400 cursor-pointer'
          >
            <FaTimes size={20} aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className='p-10 flex flex-col gap-8 max-h-[75vh] overflow-y-auto custom-scrollbar'>

          <ImageUpload selectedImages={selectedImages} setSelectedImages={setSelectedImages} />

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            <ListingInput id="city" label={t('city')} placeholder={t('city_placeholder')} icon={<FaMapMarkerAlt />} />
            <ListingInput id="price" label={t('price_usd')} type="number" placeholder="85000" icon={<FaTag />} />
          </div>

          <ListingInput id="street" label={t('street_address')} placeholder={t('street_placeholder')} icon={<FaMapMarkerAlt />} />

          <div className='grid grid-cols-3 gap-6'>
            <FeatureInput id="rooms" label={t('rooms')} icon={<MdOutlineBedroomParent size={18} />} />
            <FeatureInput id="baths" label={t('baths')} icon={<MdOutlineBathtub size={18} />} />
            <FeatureInput id="sqft" label={t('sqft')} icon={<MdOutlineSquareFoot size={18} />} />
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 w-full'>
            <ListingSelect
              label={t('category')}
              name="category"
              value={category}
              onChange={setCategory}
              icon={<FaTag />}
              options={[
                { label: t('sale_option'), value: "buy" },
                { label: t('rent_option'), value: "rent" }
              ]}
            />

            <ListingSelect
              label={t('floor')}
              name="floor"
              value={floor}
              onChange={setFloor}
              icon={<FaBuilding />}
              options={floorOptions}
            />
          </div>

          {/* AI Description Section */}
          <div className='flex flex-col gap-4'>
            <div className='flex items-center justify-between'>
              <label htmlFor="description" className='text-[10px] font-black text-slate-400 uppercase tracking-widest'>{t('description')}</label>
              <div role="group" aria-label={t('ai_rewrite_languages')} className='flex gap-2'>
                {aiLanguages.map(({ value, abbreviation, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleLangToggle(value)}
                    aria-label={label}
                    aria-pressed={selectedLangs.includes(value)}
                    className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border ${selectedLangs.includes(value) ? 'bg-purple-100 border-purple-300 text-purple-700' : 'bg-white border-slate-200 text-slate-400'}`}
                  >
                    {abbreviation}
                  </button>
                ))}
              </div>
              <button
                type='button'
                onClick={handleAiRewrite}
                disabled={aiLoading}
                className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-[10px] font-black rounded-xl uppercase tracking-wider hover:shadow-lg disabled:opacity-50'
              >
                <FaMagic aria-hidden="true" /> {aiLoading ? t('processing') : t('ai_professionalize')}
              </button>
            </div>
            <textarea
              ref={descriptionRef}
              id="description"
              rows={6}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (e.target.value) setDescriptionError(null);
              }}
              placeholder={t('description_placeholder')}
              aria-invalid={Boolean(descriptionError)}
              aria-describedby={descriptionError ? "description-error" : undefined}
              className={`w-full p-5 bg-slate-50 border rounded-3xl outline-none focus:border-purple-400 resize-none text-slate-600 text-sm leading-relaxed ${
                descriptionError ? 'border-red-500' : 'border-slate-200'
              }`}
            />
            {descriptionError && (
              <p id="description-error" role="alert" className="text-sm text-red-600">
                {descriptionError}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className={`w-full py-5 rounded-[2rem] font-black transition-all ${loading ? 'bg-slate-200 text-slate-400' : 'bg-slate-900 text-white hover:bg-purple-600'} uppercase tracking-widest`}>
            {loading ? t('processing') : t('publish_listing')}
          </button>
        </form>
      </div>
    </section>
  )
}
