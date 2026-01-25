"use client"
import React, { useState } from 'react'

export default function SecuritySection() {
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

    // მარტივი ვალიდაცია ფრონტზე
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
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Failed to update");

      setStatus({ type: 'success', msg: "Password changed successfully!" });
      // ფორმის გასუფთავება
      setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });

    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setStatus({ type: 'error', msg: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h3 className="text-lg font-bold text-slate-800 mb-2">Change Password</h3>
      <p className="text-sm text-slate-500 mb-6">Ensure your account is using a long, random password to stay secure.</p>

      {status && (
        <div className={`mb-4 p-3 rounded-xl text-xs font-bold ${status.type === 'success' ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'
          }`}>
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Current Password</label>
          <input
            type="password"
            required
            value={formData.currentPassword}
            onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
            className="p-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">New Password</label>
          <input
            type="password"
            required
            value={formData.newPassword}
            onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
            className="p-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 text-sm"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-500 uppercase">Confirm New Password</label>
          <input
            type="password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="p-2.5 rounded-xl border border-slate-200 outline-none focus:border-purple-500 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 transition-all text-sm"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  )
}
