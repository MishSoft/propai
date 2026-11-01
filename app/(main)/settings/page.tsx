import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import SettingsClient from "../components/Settings/SettingsClient";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { DEFAULT_AI_TONE, isAiTone } from "@/lib/ai-tone";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const t = await getTranslations('Settings');

  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, image: true, aiTone: true },
  });
  const aiTone = isAiTone(dbUser?.aiTone) ? dbUser.aiTone : DEFAULT_AI_TONE;
  const freshUser = {
    ...session.user,
    name: dbUser?.name ?? session.user.name,
    image: dbUser?.image ?? session.user.image,
    aiTone,
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <header className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
          {t('title')}
        </h1>
        <p className="text-slate-500 mt-2 text-sm font-bold uppercase tracking-wide opacity-70">Update your account security and application preferences.</p>
      </header>

      {/* გადავცემთ სესიის იუზერს, სადაც ტიპები უკვე დაზუსტებულია */}
      <SettingsClient user={freshUser} />
    </div>
  );
}
