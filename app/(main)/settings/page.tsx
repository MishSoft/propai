import { getServerSession } from "next-auth";

import { redirect } from "next/navigation";
import SettingsClient from "../components/Settings/SettingsClient";
import { authOptions } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-6">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1 text-sm">Update your personal details and application preferences.</p>
      </header>

      {/* გადავცემთ სესიის იუზერს, სადაც ტიპები უკვე დაზუსტებულია */}
      <SettingsClient user={session.user} />
    </div>
  );
}
