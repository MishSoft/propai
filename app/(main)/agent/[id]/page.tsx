"use client"
import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUiStore, ListingType } from '@/store/useUiStore';
import { FaPhoneAlt, FaWhatsapp, FaArrowLeft } from "react-icons/fa";
import Link from 'next/link';
// დარწმუნდი, რომ გზა სწორია
import ListingItem from '../../listings/components/ListingItem/ListingItem';

export default function AgentPortfolio() {
  const { id } = useParams();
  const { listings } = useUiStore();

  // 1. შეცვალე agentId -> authorId-ით (როგორც პრისმაშია)
  const agentListings = useMemo(() => {
    return listings.filter((item: ListingType) => item.authorId === id);
  }, [listings, id]);

  const firstListing = agentListings[0];

  // ლოგიკური შესწორება: თუ listings ცარიელია, ჯერ ჩატვირთვას უნდა ველოდოთ
  if (listings.length === 0) {
    return <div className="p-20 text-center text-slate-400">Loading listings...</div>;
  }

  if (agentListings.length === 0) {
    return (
      <div className="p-20 text-center font-bold">
        ამ მაკლერს განცხადებები არ აქვს.
        <br />
        <Link href="/" className="text-purple-600 underline text-sm mt-4 inline-block">მთავარზე დაბრუნება</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-sm mb-8">
          <FaArrowLeft /> მთავარზე დაბრუნება
        </Link>

        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm mb-16">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="relative w-40 h-40 rounded-[2.5rem] overflow-hidden bg-slate-100 shadow-inner">
              <Image
                fill
                // თუ Prisma-ს იყენებ, სურათი იქნება author.image-ში
                src={firstListing?.author?.image || "/default-avatar.png"}
                alt="Agent"
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black text-slate-900 mb-2">
                {/* Prisma-ს სტრუქტურით: firstListing.author.fullName */}
                {firstListing?.author?.fullName || "აგენტი"}
              </h1>
              <p className="text-purple-600 font-bold uppercase tracking-widest text-xs mb-8">
                {firstListing?.author?.role || "პროფესიონალი მაკლერი"}
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <div className="bg-slate-50 px-6 py-3 rounded-2xl">
                  <p className="text-xl font-black text-slate-900">{agentListings.length}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">განცხადება</p>
                </div>

                <div className="flex gap-2">
                  {/* ტელეფონი: firstListing.author.phone */}
                  <a href={`tel:${firstListing?.author?.phone}`} className="p-4 bg-slate-900 text-white rounded-2xl hover:scale-105 transition-transform">
                    <FaPhoneAlt />
                  </a>
                  <a href={`https://wa.me/${firstListing?.author?.phone?.replace(/\s/g, '')}`} className="p-4 bg-emerald-500 text-white rounded-2xl hover:scale-105 transition-transform">
                    <FaWhatsapp />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agentListings.map((listing: ListingType) => (
            <ListingItem key={listing.id} item={listing} />
          ))}
        </div>
      </div>
    </main>
  );
}
