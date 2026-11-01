"use client"
import React, { useEffect, useState } from 'react'
import { UserSettings } from '@/types/settings'
import { useTranslations } from 'next-intl'

interface ProfileSectionProps {
  user: UserSettings;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
  const t = useTranslations('Settings');
  const common = useTranslations('Common');
  
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  if (!user) {
    return <div className="p-6 text-slate-500 animate-pulse">Loading profile...</div>;
  }

  const handleUpdate = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Failed to update");

      setStatus({ type: 'success', msg: "Profile updated successfully!" });
      setTimeout(() => window.location.reload(), 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error occurred";
      setStatus({ type: 'error', msg: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white/90 p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
      <h3 className="text-2xl font-black text-slate-900 mb-8 tracking-tighter uppercase">
        {t('profile')}
      </h3>

      {status && (
        <div className={`mb-8 p-5 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-sm ${status.type === 'success'
          ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
          : 'bg-rose-50 text-rose-600 border-rose-100'
          }`}>
          {status.msg}
        </div>
      )}

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2.5">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            {t('full_name') || 'Full Name'}
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all text-sm font-black text-slate-900 placeholder:text-slate-400 shadow-sm"
            placeholder={t('enter_name') || 'Enter your name'}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            {t('email_address') || 'Email Address'}
          </label>
          <input
            type="email"
            disabled
            value={user.email ?? ""}
            className="p-4 rounded-2xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-black italic shadow-inner"
          />
          <p className="text-[10px] text-slate-400 px-2 font-bold uppercase tracking-tight opacity-70">Email cannot be changed</p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading || !name || name === user.name}
          className="w-full md:w-fit bg-slate-900 text-white px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 disabled:opacity-50 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer"
        >
          {loading ? common('saving') : common('save')}
        </button>
      </div>
    </section>
  )
}
