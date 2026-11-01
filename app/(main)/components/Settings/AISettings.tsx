"use client"
import React, { useState } from 'react'
import { FaRobot, FaMagic } from 'react-icons/fa'
import { useTranslations } from 'next-intl'
import { AiTone, DEFAULT_AI_TONE } from '@/lib/ai-tone'

const AI_TONES = [
  { id: "professional", label: "Professional", desc: "Formal, clear, and business-oriented." },
  { id: "friendly", label: "Friendly", desc: "Warm, inviting, and conversational." },
  { id: "luxury", label: "Luxury", desc: "Sophisticated, elegant, and high-end." }
] as const;

interface AISettingsProps {
  initialTone?: AiTone;
}

export default function AISettings({ initialTone }: AISettingsProps) {
  const t = useTranslations('Settings');
  const common = useTranslations('Common');
  const [selectedTone, setSelectedTone] = useState<AiTone>(initialTone ?? DEFAULT_AI_TONE);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('/api/user/update', {
        method: 'PATCH',
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
    <div className="bg-white/90 p-10 rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 animate-in fade-in duration-500">
      <div className="flex items-center gap-5 mb-10">
        <div className="p-4 bg-purple-600 text-white rounded-2xl shadow-lg shadow-purple-600/20">
          <FaRobot size={24} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{t('ai_personalization') || 'AI Personalization'}</h3>
          <p className="text-sm font-bold text-slate-500 opacity-70 tracking-tight">{t('ai_desc') || 'How should PropAI write your listing descriptions?'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 mb-10">
        {AI_TONES.map((tone) => (
          <button
            key={tone.id}
            onClick={() => setSelectedTone(tone.id)}
            className={`flex items-start gap-5 p-6 rounded-3xl border-2 transition-all duration-300 text-left relative overflow-hidden group ${selectedTone === tone.id
                ? "border-purple-600 bg-purple-50/30"
                : "border-slate-50 bg-slate-50/50 hover:border-slate-200"
              }`}
          >
            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${selectedTone === tone.id ? "border-purple-600 bg-purple-600" : "border-slate-300 bg-white"
              }`}>
              {selectedTone === tone.id && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-black uppercase tracking-widest mb-1 transition-colors ${selectedTone === tone.id ? "text-purple-600" : "text-slate-900"}`}>{tone.label}</p>
              <p className="text-xs font-bold text-slate-500 opacity-80 leading-relaxed italic">"{tone.desc}"</p>
            </div>
            {selectedTone === tone.id && (
                <div className="absolute top-0 right-0 p-4 opacity-10"><FaMagic size={40} className="text-purple-600" /></div>
            )}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 bg-slate-50/80 rounded-[2rem] border border-slate-100 shadow-inner">
        <div className="flex items-center gap-3 text-slate-500 font-bold text-xs uppercase tracking-tight">
          <FaMagic className="text-purple-600" size={16} />
          <span>{t('ai_apply_notice') || 'Changes apply to new generations.'}</span>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full sm:w-auto bg-slate-900 text-white px-10 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 disabled:opacity-50 transition-all duration-300 shadow-xl shadow-slate-900/10 active:scale-95 cursor-pointer"
        >
          {loading ? common('saving') : success ? "Saved!" : (t('update_ai_tone') || "Update AI Tone")}
        </button>
      </div>
    </div>
  )
}
