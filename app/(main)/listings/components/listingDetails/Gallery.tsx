"use client"
import { useState } from 'react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

interface GalleryProps {
  images: string[];
}

export default function Gallery({ images }: GalleryProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* მთავარი სლაიდერი */}
      <div className="relative flex-1 w-full overflow-hidden">
        <Swiper
          style={{
            '--swiper-navigation-color': '#fff',
            '--swiper-pagination-color': '#fff',
          } as React.CSSProperties}
          loop={true}
          spaceBetween={0}
          navigation={true}
          pagination={{ clickable: true, dynamicBullets: true }}
          thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
          modules={[FreeMode, Navigation, Thumbs, Pagination]}
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
                  className="object-cover" // სურათი ყოველთვის შეავსებს კონტეინერს
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Thumbnails - მხოლოდ კომპიუტერზე, რომ მობილურზე ადგილი არ წაიღოს */}
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
        /* ისრების და პაგინაციის სტილები */
        .swiper-button-next, .swiper-button-prev {
          width: 35px !important;
          height: 35px !important;
          background: rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          color: #fff !important;
        }
        .swiper-button-next:after, .swiper-button-prev:after {
          font-size: 14px !important;
        }
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
