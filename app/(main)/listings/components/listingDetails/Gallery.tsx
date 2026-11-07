"use client"
import { useRef, useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6';
import { useTranslations } from 'next-intl';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const t = useTranslations('Listings');

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      <div className="relative flex-1 w-full min-h-0 overflow-hidden">
        <Swiper
          style={{
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties}
          loop={true}
          spaceBetween={0}
          onSwiper={(instance) => {
            mainSwiperRef.current = instance;
          }}
          pagination={{ clickable: true, dynamicBullets: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Thumbs, Pagination]}
          className="w-full h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="relative w-full h-full">
                <Image
                  src={img}
                  alt={`Property image ${idx + 1}`}
                  fill
                  priority={idx === 0}
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => mainSwiperRef.current?.slidePrev()}
              aria-label={t('previous_image')}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-lg transition-colors hover:bg-white/90 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 cursor-pointer"
            >
              <FaChevronLeft size={16} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => mainSwiperRef.current?.slideNext()}
              aria-label={t('next_image')}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/30 text-white backdrop-blur-md border border-white/30 shadow-lg transition-colors hover:bg-white/90 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600 cursor-pointer"
            >
              <FaChevronRight size={16} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="hidden md:block p-3 bg-white border-t border-slate-100 h-24 shrink-0">
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={5}
            freeMode={true}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="h-full thumbs-swiper"
          >
            {images.map((img, idx) => (
              <SwiperSlide key={idx} className="cursor-pointer">
                <div className="thumb-inner relative h-full rounded-xl overflow-hidden border-2 border-transparent opacity-60 transition-all">
                  <Image
                    src={img}
                    alt="thumb"
                    fill
                    className="object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      <style jsx global>{`
        .swiper-pagination-bullet-active {
          background: #fff !important;
          width: 20px !important;
          border-radius: 5px !important;
        }
        .thumbs-swiper .swiper-slide-thumb-active .thumb-inner {
          border-color: #9333ea !important;
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
