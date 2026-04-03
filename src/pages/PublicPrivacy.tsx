import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DARK = {
  bg: "#000000",
  bgSecondary: "#0A0A0A",
  card: "#111111",
  border: "#1F1F23",
  borderSubtle: "#27272A",
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textDim: "#52525B",
  brand: "#14b8a6",
};

const PublicPrivacy: React.FC = () => {
  return (
    <div
      className="min-h-screen antialiased"
      style={{
        backgroundColor: DARK.bg,
        color: DARK.textPrimary,
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      }}
    >
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{ backgroundColor: "rgba(0,0,0,0.85)", borderBottom: `1px solid ${DARK.border}` }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Spendory" width={32} height={32} style={{ borderRadius: 8 }} />
            <span className="text-base font-bold tracking-tight">Spendory</span>
          </Link>
          <Link
            to="/landing"
            className="inline-flex items-center gap-1.5 text-sm transition-colors"
            style={{ color: DARK.textMuted }}
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3" style={{ color: DARK.textPrimary }}>
            Privacy Policy
          </h1>
          <p className="text-sm font-medium" style={{ color: DARK.textDim }}>
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-10">
          {[
            {
              title: "Our Commitment to Privacy",
              content: (
                <p style={{ color: DARK.textMuted }}>
                  Spendory is designed from the ground up to respect your privacy. We believe that your financial life is private and should remain so. Our architecture ensures that you are in total control of your data at all times.
                </p>
              ),
            },
            {
              title: "Data Storage & Ownership",
              content: (
                <>
                  <p style={{ color: DARK.textMuted }}>
                    <strong style={{ color: DARK.textSecondary }}>All your financial information is stored exclusively on your device.</strong> Spendory uses your browser's local storage to save your transactions, budgets, and settings.
                  </p>
                  <ul className="mt-4 space-y-2">
                    {["We do not collect your data.", "We do not transmit your data to any servers.", "We do not have access to your financial history.", "Your data stays with you, even when you're offline."].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: DARK.textMuted }}>
                        <span style={{ color: DARK.brand, marginTop: 2 }}>·</span> {item}
                      </li>
                    ))}
                  </ul>
                </>
              ),
            },
            {
              title: "Sign In & Tracking",
              content: (
                <>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: DARK.textMuted }}>
                    Spendory uses Google Sign-In to verify your identity and protect your Pro access.
                  </p>
                  <ul className="space-y-2">
                    {[
                      ["Google Sign-In:", "Required to use the app. We receive your Google account name and email to identify your session."],
                      ["No Passwords:", "We never store passwords — authentication is handled entirely by Google."],
                      ["No Default Tracking:", "We don't use cookies or third-party trackers to follow you across the web."],
                    ].map(([bold, rest]) => (
                      <li key={bold} className="text-sm" style={{ color: DARK.textMuted }}>
                        <strong style={{ color: DARK.textSecondary }}>{bold}</strong> {rest}
                      </li>
                    ))}
                  </ul>
                </>
              ),
            },
            {
              title: "Optional Analytics",
              content: (
                <p style={{ color: DARK.textMuted }}>
                  We offer a completely optional analytics feature disabled by default. If you enable it in Settings, we only collect high-level, anonymized usage metrics to help us improve the app. This information is never linked to your identity.
                </p>
              ),
            },
            {
              title: "Data Portability",
              content: (
                <p style={{ color: DARK.textMuted }}>
                  Because your data is yours, you can take it with you at any time. Spendory provides built-in tools to export your entire history as a CSV file. We encourage you to make regular backups.
                </p>
              ),
            },
            {
              title: "Contact",
              content: (
                <p style={{ color: DARK.textMuted }}>
                  Questions? Reach us at{" "}
                  <a href="mailto:support@spendory.app" style={{ color: DARK.brand }}>
                    support@spendory.app
                  </a>
                  .
                </p>
              ),
            },
          ].map((section) => (
            <div
              key={section.title}
              className="rounded-xl p-6"
              style={{ backgroundColor: DARK.card, border: `1px solid ${DARK.border}` }}
            >
              <h2 className="text-base font-bold mb-4" style={{ color: DARK.textPrimary }}>
                {section.title}
              </h2>
              {section.content}
            </div>
          ))}
        </div>
      </main>

      <footer
        className="py-8 px-4 sm:px-6"
        style={{ backgroundColor: DARK.bgSecondary, borderTop: `1px solid ${DARK.border}` }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm" style={{ color: DARK.textDim }}>
          <span>© {new Date().getFullYear()} Spendory. All rights reserved.</span>
          <nav className="flex gap-5">
            {[["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Refund Policy", "/refund"]].map(([label, to]) => (
              <Link key={label} to={to} className="transition-colors hover:text-white" style={{ color: DARK.textDim }}>
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default PublicPrivacy;
