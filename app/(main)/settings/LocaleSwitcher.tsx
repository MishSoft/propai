"use client";

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(nextLocale: string) {
    startTransition(() => {
      // ვინახავთ ქუქიში და ვაკეთებთ სრულ გადატვირთვას
      document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
        Language Selection
      </label>
      <div className="relative max-w-sm group">
        <select
          defaultValue={locale}
          disabled={isPending}
          onChange={(e) => onSelectChange(e.target.value)}
          className="w-full p-4 pr-12 rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/40 text-slate-900 font-black text-xs uppercase tracking-widest focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 outline-none transition-all cursor-pointer appearance-none z-10"
        >
          <option value="ka">ქართული (KA)</option>
          <option value="en">English (EN)</option>
          <option value="ru">Русский (RU)</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-purple-600 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
        </div>
      </div>
    </div>
  );
}
