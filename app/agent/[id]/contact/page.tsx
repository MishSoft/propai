import db from "@/lib/db";
import { notFound } from "next/navigation";
import ContactForm from "../../components/ContactForms/ContactForms";

export default async function AgentContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. მაკლერის მონაცემების წამოღება
  const agent = await db.user.findUnique({
    where: { id },
    select: { name: true, image: true, role: true }
  });

  if (!agent) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-xl mx-auto">

        {/* მაკლერის ჰედერი */}
        <div className="text-center mb-10">
          <div className="inline-block relative mb-4">
            <img
              src={agent.image || "/default-avatar.png"}
              alt={agent.name || ""}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Contact {agent.name}</h1>
          <p className="text-gray-500">გაგვიზიარეთ რას ეძებთ და დაგიკავშირდებით</p>
        </div>

        {/* ფორმის კომპონენტი */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <ContactForm agentId={id} />
        </div>

      </div>
    </div>
  );
}
