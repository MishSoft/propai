import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import ListingItem from "@/app/(main)/listings/components/ListingItem/ListingItem";
import { FaUserTie, FaWhatsapp, FaViber, FaPhone } from "react-icons/fa6";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Post, User } from "@prisma/client";

// ვქმნით ტიპს, რომელიც აღწერს ბაზიდან წამოსულ მონაცემს
type PrismaPostWithAuthor = Post & {
  author: User;
};

export default async function AgentPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const agent = await prisma.user.findUnique({
    where: { id: id },
    include: {
      posts: {
        orderBy: { createdAt: 'desc' },
        include: { author: true }
      }
    },
  });

  if (!agent) return notFound();

  const formattedPhone = agent.phone?.replace(/\s/g, '') || "";

  return (
    <div className="min-h-screen bg-white">
      <nav className="h-16 border-b border-slate-50 px-8 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link href="/listings" className="text-slate-400 hover:text-slate-900 transition-all">
          <FaArrowLeft size={14} />
        </Link>
        <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Agent Portfolio</span>
        <div className="w-4" />
      </nav>

      <header className="py-10 px-8 border-b border-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-900 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-slate-200 shrink-0">
              <FaUserTie size={32} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{agent.name}</h1>
              <p className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">Verified Partner</p>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <a href={`tel:${formattedPhone}`} className="flex items-center gap-2 px-5 py-3 bg-slate-50 hover:bg-slate-100 rounded-2xl text-slate-700 text-xs font-bold transition-all border border-slate-100">
              <FaPhone size={12} className="text-slate-400" /> {agent.phone}
            </a>
            <a href={`https://wa.me/${formattedPhone}`} target="_blank" className="flex items-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 rounded-2xl text-emerald-700 text-xs font-bold transition-all border border-emerald-100">
              <FaWhatsapp size={16} /> WhatsApp
            </a>
            <a href={`viber://chat?number=%2B${formattedPhone.replace('+', '')}`} className="flex items-center gap-2 px-5 py-3 bg-indigo-50 hover:bg-indigo-100 rounded-2xl text-indigo-700 text-xs font-bold transition-all border border-indigo-100">
              <FaViber size={16} /> Viber
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Listing Collection ({agent.posts.length})</h2>
          <div className="h-px flex-1 bg-slate-100 mx-6" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* აქ მოხდა მთავარი ცვლილება: post-ს მიენიჭა ტიპი PrismaPostWithAuthor */}
          {agent.posts.map((post: any) => {
            const p = post as PrismaPostWithAuthor;

            // ვაკეთებთ ფორმატირებას ListingItem-ისთვის
            const formattedItem = {
              ...p,
              createdAt: p.createdAt.toISOString(),
              updatedAt: p.updatedAt.toISOString(),
              author: {
                fullName: p.author.name || "Unknown",
                phone: p.author.phone || "",
                image: p.author.image || undefined,
                role: p.author.role,
              }
            };

            return (
              <ListingItem
                key={formattedItem.id}
                item={formattedItem as any}
                isPublic={true}
              />
            );
          })}
        </div>
      </main>
    </div>
  );
}
