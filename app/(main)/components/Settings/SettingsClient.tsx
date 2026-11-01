"use client"
import React, { useState } from 'react'
import { SettingsTab, UserSettings } from '@/types/settings'
import { FaUser, FaLock, FaRobot, FaCreditCard, FaGlobe } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import LocaleSwitcher from '../../settings/LocaleSwitcher'

// იმპორტები (დარწმუნდი რომ გზები სწორია)
import ProfileSection from './ProfileSection'
import SecuritySection from './SecuritySection'
import AISettings from './AISettings'
import BillingSection from './BillingSection'

interface SettingsClientProps {
  user?: UserSettings; // გავხადოთ optional უსაფრთხოებისთვის
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const t = useTranslations('Settings');

  // თუ იუზერი არ არის, ვაჩვენებთ ლოუდერს, რომ არაფერმა დააეროროს
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const menuItems = [
    { id: "profile", label: t('profile'), icon: <FaUser /> },
    { id: "general", label: t('language'), icon: <FaGlobe /> },
    { id: "security", label: t('security'), icon: <FaLock /> },
    { id: "ai", label: t('ai_preferences'), icon: <FaRobot /> },
    { id: "billing", label: t('billing'), icon: <FaCreditCard /> },
  ] as const;

  return (
    <div className="flex flex-col md:flex-row gap-8 mt-8">
      <aside className="w-full md:w-72 flex flex-col gap-3">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeTab === item.id
                ? "bg-purple-600 text-white shadow-xl shadow-purple-600/30 active:scale-95"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </aside>

      <main className="flex-1 min-h-[500px]">
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          {activeTab === "profile" && <ProfileSection user={user} />}
          {(activeTab as string) === "general" && (
            <section className="glass-card p-10 bg-white/90 shadow-2xl shadow-slate-200/50 border-slate-100">
               <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">
                {t('language')}
              </h3>
              <LocaleSwitcher />
            </section>
          )}
          {activeTab === "security" && <SecuritySection />}
          {activeTab === "ai" && <AISettings initialTone={user.aiTone} />}
          {activeTab === "billing" && <BillingSection plan={user?.plan ?? "free"} />}
        </div>
      </main>
    </div>
  );
}
