import React, { useState } from "react";
import { Share2, Check } from "lucide-react";

const ShareButton: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const url = window.location.origin;
    const text = "Track your money privately with Spendory - no signup, no ads, no cloud.";
    
    if (navigator.share) {
      navigator.share({
        title: "Spendory",
        text,
        url
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text}\n\n${url}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium transition-colors"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5" />
      ) : (
        <Share2 className="w-3.5 h-3.5" />
      )}
      <span>{copied ? "Copied!" : "Share with someone who values privacy"}</span>
    </button>
  );
};

export default ShareButton;
