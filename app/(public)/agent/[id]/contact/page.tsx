import db from "@/lib/db";
import { notFound } from "next/navigation";
import ContactForm from "./components/ContactForm/ContactForms";
import Image from "next/image";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BiUserCircle } from "react-icons/bi";

export default async function AgentContactPage(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params;
  const id = params.id;

  if (!id) return notFound();

  // 1. ვიღებთ იუზერს ყოველგვარი SELECT-ის გარეშე.
  // ეს აიძულებს Prisma-ს, რომ ვალიდაცია გამოტოვოს.
  const agent = await db.user.findUnique({
    where: { id: id },
  });

  if (!agent) return notFound();

  // 2. ხელით ამოვიღოთ მონაცემები ობიექტიდან
  const name = agent.name || "Agent";
  const image = agent.image;
  // (agent as any) გვჭირდება, რომ TypeScript-მა არ იჩხუბოს
  const floor = (agent as any).floor || 1;

  return (
    <div className="min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] bg-gray-50 py-16 px-4 font-sans">
      <div className="max-w-2xl mx-auto">

        {/* აგენტის ბლოკი */}
        <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2.5rem] border border-white shadow-sm mb-10 flex flex-col md:flex-row items-center gap-8">
          <div className="relative">
            <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-2xl border-4 border-white transition-transform hover:scale-105">
              {image ? (
                <Image src={image} alt={name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-indigo-600 flex items-center justify-center text-white text-4xl">
                  <BiUserCircle />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{name}</h1>
            <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start font-medium text-sm">
              <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-2xl border border-indigo-100/50">
                <BiUserCircle className="text-lg" />
                <span>Professional Agent</span>
              </div>
            </div>
          </div>
        </div>

        {/* ფორმის ბლოკი */}
        <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-100">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-800">დატოვეთ შეტყობინება</h2>
            <p className="text-gray-500 text-sm">აგენტი გიპასუხებთ რამდენიმე წუთში</p>
          </div>
          <ContactForm agentId={id} />
        </div>
      </div>
    </div>
  );
}
