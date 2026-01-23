"use client"
import React, { useState, useEffect } from 'react'
import { BuyerList } from '../BuyerList/BuyerList'
import { BuyerModal } from '../BuyerModal/BuyerModal'
import { Buyer } from '@/types/buyer';
 // გამოიყენე შენი გენერირებული ტიპი

export default function BuyerInfo() {
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<Buyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // მონაცემების წამოღება
  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await fetch('/api/buyers');
        const data = await res.json();

        // სწორედ აქ ვიყენებთ "as Buyer[]", რომ TS-მა ხაზი აღარ გაუსვას
        setBuyers(data as Buyer[]);
      } catch (error) {
        console.error("Error fetching buyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  // მოდალის გახსნის ფუნქცია
  const handleViewDetails = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  // მოდალის დახურვის ფუნქცია
  const handleCloseModal = () => {
    setIsModalOpen(false);
    // მცირე დაყოვნება, რომ ანიმაცია დასრულდეს და მერე გავასუფთავოთ სთეითი
    setTimeout(() => setSelectedBuyer(null), 300);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <section className="w-full">
      {/* კლიენტების სია - გადავცემთ მონაცემებს და ფუნქციას */}
      <BuyerList
        buyers={buyers}
        onViewDetails={(buyer) => handleViewDetails(buyer as any)}
      />

      {/* პოპაპი (მოდალი) */}
      <BuyerModal
        buyer={selectedBuyer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}
