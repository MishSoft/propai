"use client"
import React from 'react'
import { FaLanguage } from 'react-icons/fa'

// 1. განვაახლოთ ტიპი რუსული ენის კოდით 'ru'
type LanguageCode = 'en' | 'ka' | 'ru';

interface LanguageOption {
  code: LanguageCode;
  label: string;
  flag: string;
}

// 2. დავამატოთ რუსული ენა მასივში
const LANGUAGES: LanguageOption[] = [
  { code: 'ka', label: 'ქართული (GE)', flag: '🇬🇪' },
  { code: 'en', label: 'English (US)', flag: '🇺🇸' },
  { code: 'ru', label: 'Русский (RU)', flag: '🇷🇺' }
];

export default function LanguageSection() {
  const [currentLang, setCurrentLang] = React.useState<LanguageCode>('ka');

  const handleLanguageChange = (code: LanguageCode) => {
    setCurrentLang(code);
    // აქ მოგვიანებით ჩავწერთ i18n-ის გადართვის ფუნქციას
    console.log(`Language changed to: ${code}`);
  };

  return (
    <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
          <FaLanguage className="text-xl" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Language</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Select your preferred interface language.</p>
        </div>
      </div>

      {/* grid-cols-1 md:grid-cols-3 რომ სამივე ენა კარგად ჩაეტიოს */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${currentLang === lang.code
                ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600 shadow-md shadow-blue-50"
                : "border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200 dark:hover:border-slate-700"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl leading-none">{lang.flag}</span>
              <span className="font-bold text-sm tracking-tight">{lang.label}</span>
            </div>
            {currentLang === lang.code && (
              <div className="w-2.5 h-2.5 bg-blue-600 rounded-full animate-in zoom-in duration-300" />
            )}
          </button>
        ))}
      </div>
    </section>
  )
}
