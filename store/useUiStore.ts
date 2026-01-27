import { create } from "zustand"

export interface ListingType {
  id: string;
  images: string[];
  price: number;
  street: string;
  city: string;
  beds: number;
  baths: number;
  sqft: number;
  description: string;
  createdAt?: string;
  category: string;

  // დაამატე ეს ორი ველი აუცილებლად:
  authorId: string;
  author: {
    fullName: string;
    phone: string;
    image?: string;
    role?: string;
  };
}

interface useUiStoreProps {
  // listings მასივი აუცილებელია, რომ AgentPortfolio-მ შეძლოს მონაცემების წაკითხვა
  listings: ListingType[];

  isListingModalOpen: boolean;
  openListingModal: () => void;
  closeListingModal: () => void;
  toggleListingModal: () => void;

  isDetailsModalOpen: boolean;
  selectedListing: ListingType | null;
  openDetailsModal: (listing: ListingType) => void;
  closeDetailsModal: () => void;
}

export const useUiStore = create<useUiStoreProps>((set) => ({
  // სატესტო მონაცემები (აქ რეალურ პროექტში თავიდან ცარიელი [] იქნება)
  listings: [
    {
      id: "1",
      price: 150000,
      street: "ჭავჭავაძის 37",
      city: "თბილისი",
      beds: 2,
      baths: 1,
      sqft: 85,
      images: ["/house1.jpg"],
      description: "ლამაზი ბინა ვაკეში...",
      category: "Sale",
      authorId: "agent_123",
      author: {
        fullName: "Agent Name",
        phone: "+995 123 456 789",
        image: "/agent.jpg",
        role: "agent"
      }
    }
  ],

  // Listing Modal
  isListingModalOpen: false,
  openListingModal: () => set({ isListingModalOpen: true }),
  closeListingModal: () => set({ isListingModalOpen: false }),
  toggleListingModal: () => set((state) => ({ isListingModalOpen: !state.isListingModalOpen })),

  // Details Modal
  isDetailsModalOpen: false,
  selectedListing: null,
  openDetailsModal: (listing: ListingType) => set({
    selectedListing: listing,
    isDetailsModalOpen: true
  }),
  closeDetailsModal: () => set({
    selectedListing: null,
    isDetailsModalOpen: false
  }),
}))
