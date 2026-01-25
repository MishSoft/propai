"use client"
import React, { useEffect, useState } from 'react'
import { UserSettings } from '@/types/settings'

interface ProfileSectionProps {
  user: UserSettings;
}

export default function ProfileSection({ user }: ProfileSectionProps) {
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update");

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
    <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 mb-6 tracking-tight">
        Profile Settings
      </h3>

      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm font-semibold border ${status.type === 'success'
          ? 'bg-green-50 text-green-700 border-green-100'
          : 'bg-red-50 text-red-700 border-red-100'
          }`}>
          {status.msg}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-3 rounded-xl border border-slate-200 outline-none focus:border-purple-500 transition-all text-sm font-medium"
            placeholder="Enter your name"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user.email ?? ""}
            className="p-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed text-sm font-medium"
          />
          <p className="text-[10px] text-slate-400 px-1">Email cannot be changed</p>
        </div>

        <button
          onClick={handleUpdate}
          disabled={loading || !name || name === user.name}
          className="w-full md:w-fit bg-purple-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </section>
  )
}
