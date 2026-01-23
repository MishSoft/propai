"use client"
import React, { useState } from 'react'
import { SettingsTab, UserSettings } from '@/types/settings'
import { FaUser, FaLock, FaRobot, FaCreditCard, FaCog } from 'react-icons/fa'

// იმპორტები (დარწმუნდი რომ გზები სწორია)
import ProfileSection from './ProfileSection'
import SecuritySection from './SecuritySection'
import AISettings from './AISettings'
import BillingSection from './BillingSection'
import AppearanceSection from './AppearanceSection'
import LanguageSection from './LanguageSection'

interface SettingsClientProps {
  user?: UserSettings; // გავხადოთ optional უსაფრთხოებისთვის
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  // თუ იუზერი არ არის, ვაჩვენებთ ლოუდერს, რომ არაფერმა დააეროროს
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "security", label: "Security", icon: <FaLock /> },
    { id: "ai", label: "AI Preferences", icon: <FaRobot /> },
    { id: "billing", label: "Billing", icon: <FaCreditCard /> },
    { id: "general", label: "General", icon: <FaCog /> },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <aside className="w-full md:w-64 flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id
                ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400"
              }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 min-h-[500px]">
        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
          {activeTab === "profile" && <ProfileSection user={user} />}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "ai" && <AISettings />}
          {/* უსაფრთხო გადაწოდება ?. ოპერატორით */}
          {activeTab === "billing" && <BillingSection plan={user?.plan ?? "free"} />}

          {activeTab === "general" && (
            <div className="flex flex-col gap-6">
              <AppearanceSection />
              <LanguageSection />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
