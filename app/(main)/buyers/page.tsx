"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BuyerList } from "../components/BuyerList/BuyerList";
import { BuyerModal } from "../components/BuyerModal/BuyerModal";
import { Buyer } from '@/types/buyer';

function BuyersPageContent() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const buyerIdParam = searchParams.get('buyerId');

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await fetch('/api/buyers');
        const data = await res.json();
        setBuyers(data as Buyer[]);
      } catch (err) {
        console.error("Failed to fetch buyers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  useEffect(() => {
    if (!buyerIdParam) return;

    let ignore = false;
    const openBuyerFromUrl = async () => {
      try {
        const res = await fetch(`/api/buyers/${encodeURIComponent(buyerIdParam)}`);
        if (ignore) return;

        if (!res.ok) {
          // Missing, deleted, or not owned by the current user: drop the stale param.
          router.replace('/buyers');
          return;
        }

        const data = (await res.json()) as Buyer;
        if (ignore) return;
        setSelectedBuyer(data);
        setIsModalOpen(true);
      } catch (err) {
        if (!ignore) console.error("Failed to fetch buyer from notification", err);
      }
    };
    openBuyerFromUrl();

    return () => {
      ignore = true;
    };
  }, [buyerIdParam, router]);

  const handleViewDetails = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (buyerIdParam) router.replace('/buyers');
  };

  const handleDeleteBuyer = (id: string) => {
    setBuyers((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    /* შევცვალეთ p-6 -> px-4 py-6 და დავამატეთ overflow-x-hidden */
    <section className="px-4 sm:px-6 py-6 w-full overflow-x-hidden">

      {/* Header: მობილურზე ტექსტი ცენტრში რომ არ აირიოს */}
      <header className="flex flex-col  sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex  flex-col gap-1 min-w-0 flex-1 overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight wrap-break-word [hyphens:auto]">
            დაინტერესებული კლიენტები
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium truncate">
            {loading ? "მიმდინარეობს ძებნა..." : `ნაპოვნია ${buyers.length} აქტიური კლიენტი`}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center items-center p-20">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
          <div className="w-full bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100">
            <div className="overflow-x-auto custom-scrollbar">
              <BuyerList
                buyers={buyers}
                onViewDetails={handleViewDetails}
                onDelete={handleDeleteBuyer}
              />
            </div>
          </div>
      )}

      <BuyerModal
        buyer={selectedBuyer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
}

export default function BuyersPage() {
  return (
    <Suspense fallback={null}>
      <BuyersPageContent />
    </Suspense>
  );
}
