import React, { useState } from "react";

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
      className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
    >
      {copied ? "✓ Copied!" : "📤 Share with someone who values privacy"}
    </button>
  );
};

export default ShareButton;
