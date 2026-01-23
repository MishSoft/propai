"use client"
import React, { useState } from 'react'
import { FaRobot, FaMagic } from 'react-icons/fa'

const AI_TONES = [
  { id: "professional", label: "Professional", desc: "Formal, clear, and business-oriented." },
  { id: "friendly", label: "Friendly", desc: "Warm, inviting, and conversational." },
  { id: "luxury", label: "Luxury", desc: "Sophisticated, elegant, and high-end." }
] as const;

type ToneType = typeof AI_TONES[number]["id"];

export default function AISettings() {
  const [selectedTone, setSelectedTone] = useState<ToneType>("professional");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aiTone: selectedTone }),
      });

      if (!response.ok) throw new Error("Failed to update");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
          <FaRobot />
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-800">AI Personalization</h3>
          <p className="text-sm text-slate-500">How should PropAI write your listing descriptions?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-8">
        {AI_TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => setSelectedTone(tone.id)}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all text-left ${selectedTone === tone.id
                ? "border-purple-600 bg-purple-50/50"
                : "border-slate-100 hover:border-slate-200"
              }`}
          >
            <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedTone === tone.id ? "border-purple-600" : "border-slate-300"
              }`}>
              {selectedTone === tone.id && <div className="w-2 h-2 bg-purple-600 rounded-full" />}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{tone.label}</p>
              <p className="text-xs text-slate-500">{tone.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
        <div className="flex items-center gap-2 text-slate-600">
          <FaMagic className="text-purple-500" />
          <span className="text-xs font-medium">Changes will apply to new generations.</span>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-purple-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 disabled:opacity-50 transition-all shadow-md shadow-purple-100"
        >
          {loading ? "Saving..." : success ? "Saved!" : "Update AI Tone"}
        </button>
      </div>
    </div>
  )
}
