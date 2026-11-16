"use client"
import React, { useState } from 'react'
import { BiInfoCircle } from 'react-icons/bi';


interface SecuritySectionProps {
  authProviders: string[]
  hasLocalPassword: boolean
}

export default function SecuritySection({ authProviders, hasLocalPassword }: SecuritySectionProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ type: 'error', msg: "New passwords do not match" });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setStatus({ type: 'error', msg: "Password must be at least 8 characters" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to update");

      setStatus({ type: 'success', msg: "Password changed successfully!" });
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setStatus({ type: 'error', msg: msg });
    } finally {
      setLoading(false);
    }
  };


  const providerLabel = authProviders.includes("google") && authProviders.includes("facebook")
    ? "Google და Facebook" : authProviders.includes("facebook")
      ? "Facebook"
      : authProviders.includes("google") ? "Google" : null

  return (
    <div className="bg-white/90 p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {
        hasLocalPassword ? (
          <>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Security Settings</h3>
            <p className="text-slate-500 text-sm font-medium mb-10 opacity-70">Ensure your account is using a long, random password to stay secure.</p>

            {status && (
              <div className={`mb-8 p-5 rounded-2xl text-xs font-black uppercase tracking-widest border shadow-sm ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                {status.msg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-lg">
              <div className="flex flex-col gap-2.5">
                <label htmlFor='current_password' className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Current Password</label>
                <input
                  id='current_password'
                  type="password"
                  required
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all text-sm font-black text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label htmlFor='new_password' className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">New Password</label>
                <input
                  id='new_password'
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all text-sm font-black text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
              </div>

              <div className="flex flex-col gap-2.5">
                <label htmlFor='confirm_password' className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Confirm New Password</label>
                <input
                  id='confirm_password'
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 outline-none focus:border-purple-600 focus:ring-4 focus:ring-purple-600/10 transition-all text-sm font-black text-slate-900 placeholder:text-slate-400 shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 bg-slate-900 text-white px-12 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-purple-600 disabled:opacity-50 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer w-full md:w-fit"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          </>
        ) : (
          <div>
            <h2 className='px-5 py-4 rounded-xl text-xl font-semibold bg-slate-50 border border-slate-200 text-slate-900'>ანგარიშის უსაფრთხოება</h2>
            {providerLabel === null ? (
              <p className='text-sm text-slate-700 leading-relaxed mt-4'>
                თქვენი ანგარიშის ავტორიზაციის მეთოდის განსაზღვრა ვერ მოხერხდა. უსაფრთხოების პარამეტრების სამართავად მიმართეთ მხარდაჭერის გუნდს.
              </p>
            ) : (
              <>
                <p className='text-sm text-slate-700 leading-relaxed mt-4'>თქვენი ანგარიში დაკავშირებულია {providerLabel}-თან. PropAI-ში ცალკე პაროლი არ გაქვთ დაყენებული.</p>
                <div className='border border-violet-100 bg-violet-50 rounded-lg flex px-3 items-center mt-4'>
                  <BiInfoCircle size={30} className='text-violet-800' />
                  <p className=' p-4  text-sm text-violet-800 leading-relaxed'>პაროლის შესაცვლელად ან აღსადგენად გამოიყენეთ შესაბამისი პროვაიდერის ანგარიშის პარამეტრები.</p>
                </div>
              </>
            )}

          </div>
        )
      }
    </div>
  )
}
