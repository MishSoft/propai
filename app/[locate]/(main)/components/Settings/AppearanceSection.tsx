"use client"
import React, { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { FaMoon, FaSun, FaDesktop } from 'react-icons/fa'

export default function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  // Hydration error-ის თავიდან ასაცილებლად
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const themes = [
    { id: 'light', label: 'Light', icon: <FaSun /> },
    { id: 'dark', label: 'Dark', icon: <FaMoon /> },
    { id: 'system', label: 'System', icon: <FaDesktop /> },
  ] as const;

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Appearance</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
        Customize how PropAI looks on your device.
      </p>

      <div className="grid grid-cols-3 gap-3">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setTheme(t.id)}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${theme === t.id
                ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600"
                : "border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200"
              }`}
          >
            <span className="text-lg">{t.icon}</span>
            <span className="text-xs font-bold uppercase tracking-tight">{t.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
