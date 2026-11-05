"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BuyerList } from "../components/BuyerList/BuyerList";
import { BuyerListSkeleton } from "../components/BuyerList/BuyerListSkeleton";
import { BuyerModal } from "../components/BuyerModal/BuyerModal";
import { Buyer } from '@/types/buyer';
import { useTranslations } from 'next-intl';

function BuyersPageContent() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const t = useTranslations('Buyers');
  const common = useTranslations('Common');
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
    <section className="px-0 sm:px-6 py-0 sm:py-6 w-full overflow-x-hidden">

      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 mb-6 sm:mb-10">
        <div className="flex flex-col gap-1.5 sm:gap-2 min-w-0 flex-1 overflow-hidden">
          {loading ? (
            <>
              <h1 className="sr-only">{t('title')}</h1>
              <div aria-hidden="true" className="animate-pulse flex flex-col gap-1.5 sm:gap-2">
                <div className="h-7 sm:h-10 w-48 sm:w-72 rounded-md bg-slate-200" />
                <div className="h-3 sm:h-4 w-36 sm:w-48 rounded-md bg-slate-100" />
              </div>
            </>
          ) : (
            <>
              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter uppercase">
                {t('title')}
              </h1>
              <p className="min-h-4 text-slate-500 text-xs sm:text-sm font-bold uppercase tracking-wide opacity-70">
                {`Found ${buyers.length} active clients`}
              </p>
            </>
          )}
        </div>
      </header>

      <div className="w-full glass-card overflow-hidden bg-white/90 border-slate-100 shadow-2xl shadow-slate-200/50">
        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="p-4 sm:p-6">
              <BuyerListSkeleton label={common('loading')} />
            </div>
          ) : (
            <BuyerList
              buyers={buyers}
              onViewDetails={handleViewDetails}
              onDelete={handleDeleteBuyer}
            />
          )}
        </div>
      </div>

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
