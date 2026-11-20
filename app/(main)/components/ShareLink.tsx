"use client";
import { useState, useEffect } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { useTranslations } from "next-intl";

export default function ShareLink({ agentId }: { agentId: string }) {
  const t = useTranslations("Dashboard");
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    if(!agentId) return
    setShareUrl(`${window.location.origin}/agent/${agentId}/contact`);
  }, [agentId]);

  const handleCopy = async () => {
    try {
      if (!shareUrl) return;
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(`Failed to copy the share link to clipboard: ${error}`)
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center justify-between gap-4 w-full md:w-auto">
      <div className="hidden min-w-0 flex-1 sm:block">
        <h3 className="text-blue-900 font-semibold text-xs">{t("public_link")}</h3>
        <p className="text-blue-700 text-[10px] opacity-75">{t("share_with_clients")}</p>
      </div>

      <button
        onClick={handleCopy}
        className="flex min-w-0 max-w-full items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-xl shadow-sm hover:bg-blue-600 hover:text-white transition-all font-medium text-xs border border-blue-100"
      >
        {copied ? <FiCheck className="shrink-0 text-green-500" /> : <FiCopy className="shrink-0" />}
        <span className="min-w-0 break-words">
          {copied ? t("copied") : t("copy_invite_link")}
        </span>
      </button>
    </div>
  );
}
