"use client";

import React, { useEffect, useState } from 'react';
import { BuyerList } from "../components/BuyerList/BuyerList";
import { BuyerModal } from "../components/BuyerModal/BuyerModal"; // დააიმპორტე მოდალი
import { Buyer } from '@/types/buyer'; // გამოიყენე ერთიანი ტიპი

export default function BuyersPage() {
  // 1. მიუთითე ტიპი მასივისთვის, რომ "never[]" ერორი გაქრეს
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. დაამატე სთეითი არჩეული კლიენტისთვის და მოდალისთვის
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await fetch('/api/buyers');
        const data = await res.json();
        // Casting, რომ TypeScript-ი დაწყნარდეს
        setBuyers(data as Buyer[]);
      } catch (err) {
        console.error("Failed to fetch buyers", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  // 3. ფუნქცია, რომელიც გადაეცემა BuyerList-ს
  const handleViewDetails = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  const handleDeleteBuyer = (id: string) => {
    setBuyers((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <section className="max-w-6xl mx-auto p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">დაინტერესებული კლიენტები</h1>
          <p className="text-gray-500 text-sm">
            {loading ? "მიმდინარეობს ძებნა..." : `სულ ნაპოვნია ${buyers.length} კლიენტი`}
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex justify-center p-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        /* 4. აუცილებლად მიაწოდე onViewDetails */
        <BuyerList
          buyers={buyers}
          onViewDetails={handleViewDetails}
          onDelete={handleDeleteBuyer}
        />
      )}

      {/* 5. დაამატე მოდალის კომპონენტი აქ */}
      <BuyerModal
        buyer={selectedBuyer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}

      />
    </section>
  );
}
