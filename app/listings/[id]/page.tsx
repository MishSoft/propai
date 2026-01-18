import { notFound } from "next/navigation";
import prisma from "@/lib/db";

import Link from "next/link";
import { FaArrowLeft, FaWhatsapp, FaPhoneAlt } from "react-icons/fa";
import DetailsInfo from "@/app/(main)/listings/components/listingDetails/DetailsInfo";
import Gallery from "@/app/(main)/listings/components/listingDetails/Gallery";
// შემოვიტანოთ სტატისტიკის კომპონენტი
import ListingCardStats from "@/app/(main)/listings/components/ListingItem/ListingCardStats";

export default async function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const listing = await prisma.post.findUnique({
    where: { id: id },
    include: { author: true },
  });

  if (!listing) return notFound();

  return (
    <div className="min-h-screen bg-white">
      {/* ზედა ნავიგაცია */}
      <nav className="h-20 border-b border-slate-50 px-8 flex items-center bg-white/80 backdrop-blur-md sticky top-0 z-50 justify-between">
        <Link
          href={`/agent/${listing.authorId}`}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <FaArrowLeft />
        </Link>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">PropAI Property View</span>
      </nav>

      <main className="grid grid-cols-1 lg:grid-cols-10 h-[calc(100vh-80px)] overflow-hidden">
        <div className="lg:col-span-6 h-[50vh] lg:h-full bg-slate-50 border-r border-slate-50 overflow-hidden">
          <Gallery images={listing.images} />
        </div>

        {/* მარჯვენა მხარე: დეტალური ინფორმაცია */}
        <div className="lg:col-span-4 h-full overflow-y-auto px-8 md:px-12 py-12 custom-scrollbar flex flex-col">

          <DetailsInfo item={listing as any} isPublic={true} />

          {/* დამატებული სტატისტიკა: საძინებლები, აბაზანა, კვადრატულობა */}
          <div className=" border-t border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Property Features</p>
            <ListingCardStats
              beds={listing.beds}
              baths={listing.baths}
              sqft={listing.sqft}
            />
          </div>

          {/* აგენტის საკონტაქტო ბლოკი */}
          <div className="mt-auto pt-8 border-t border-slate-100 bg-white sticky bottom-0">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">დაინტერესდით? დაუკავშირდით აგენტს</p>
            <h3 className="text-xl font-black text-slate-900 mb-6">{listing.author?.fullName}</h3>

            <div className="flex gap-3">
              <a
                href={`tel:${listing.author?.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
              >
                <FaPhoneAlt size={14} /> დარეკვა
              </a>
              <a
                href={`https://wa.me/${listing.author?.phone?.replace(/\s/g, '')}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-xl shadow-emerald-100"
              >
                <FaWhatsapp size={18} /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
