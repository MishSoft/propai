import db from "@/lib/db";
import { notFound } from "next/navigation";
import ContactPageClient from "./components/ContactForm/ContactPageClient";

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

  return <ContactPageClient agentId={id} agentName={name} agentImage={image} />;
}
