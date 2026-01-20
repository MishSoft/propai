"use client";
import { useState, useEffect } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function ShareLink({ agentId }: { agentId: string }) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // ეს კოდი გაეშვება მხოლოდ ბრაუზერში
    setShareUrl(`${window.location.origin}/agent/${agentId}/contact`);
  }, [agentId]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between gap-4 w-full md:w-auto">
      <div className="hidden sm:block">
        <h3 className="text-blue-900 font-semibold text-xs">Public Link</h3>
        <p className="text-blue-700 text-[10px] opacity-75 whitespace-nowrap">Share with clients</p>
      </div>

      <button
        onClick={handleCopy}
        className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all font-medium text-xs border border-blue-100"
      >
        {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
        {copied ? "Copied!" : "Copy Invite Link"}
      </button>
    </div>
  );
}
