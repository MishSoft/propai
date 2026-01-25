"use client"
import React, { useState, useEffect } from 'react'
import { BuyerList } from '../BuyerList/BuyerList'
import { BuyerModal } from '../BuyerModal/BuyerModal'
import { Buyer } from '@/types/buyer';

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
        setBuyers(data as Buyer[]);
      } catch (error) {
        console.error("Error fetching buyers:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBuyers();
  }, []);

  // 1. დავამატოთ წაშლის ფუნქცია
  const handleDeleteBuyer = (id: string) => {
    setBuyers((prev) => prev.filter((b) => b.id !== id));
  };

  // მოდალის გახსნის ფუნქცია
  const handleViewDetails = (buyer: Buyer) => {
    setSelectedBuyer(buyer);
    setIsModalOpen(true);
  };

  // მოდალის დახურვის ფუნქცია
  const handleCloseModal = () => {
    setIsModalOpen(false);
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
      {/* 2. აქ გადავცემთ onDelete ფუნქციას */}
      <BuyerList
        buyers={buyers}
        onViewDetails={handleViewDetails}
        onDelete={handleDeleteBuyer}
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
