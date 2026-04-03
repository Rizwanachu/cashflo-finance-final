import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const DARK = {
  bg: "#000000",
  bgSecondary: "#0A0A0A",
  card: "#111111",
  border: "#1F1F23",
  textPrimary: "#FFFFFF",
  textSecondary: "#A1A1AA",
  textMuted: "#71717A",
  textDim: "#52525B",
  brand: "#14b8a6",
};

const PublicTerms: React.FC = () => {
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
          <Link to="/home" className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Spendory" width={32} height={32} style={{ borderRadius: 8 }} />
            <span className="text-base font-bold tracking-tight">Spendory</span>
          </Link>
          <Link
            to="/home"
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
            Terms of Service
          </h1>
          <p className="text-sm font-medium" style={{ color: DARK.textDim }}>
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "1. Acceptance of Terms",
              body: "By accessing or using Spendory, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using this application.",
              list: null,
            },
            {
              title: "2. Description of Service",
              body: "Spendory is a personal finance tracking application that operates locally on the user's device. We provide tools for recording transactions, setting budgets, and visualising financial data.",
              list: null,
            },
            {
              title: "3. License & Use",
              body: "We grant you a non-exclusive, non-transferable, revocable license to use Spendory for your personal, non-commercial use.",
              list: ["You must not decompile or reverse engineer the software.", "You must not use the service for any illegal or unauthorized purpose."],
            },
            {
              title: "4. Pro Purchase & Refunds",
              body: "Spendory Pro is a one-time payment of ₹249 that unlocks advanced features permanently.",
              list: ["All sales are final and non-refundable.", "We reserve the right to modify Pro features at any time."],
            },
            {
              title: "5. Disclaimer of Warranties",
              body: 'Spendory is provided "as is" and "as available". We make no warranties regarding the accuracy or reliability of data stored within the app. You are solely responsible for backing up your data.',
              list: null,
            },
            {
              title: "6. Limitation of Liability",
              body: "In no event shall Spendory or its creators be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the application.",
              list: null,
            },
            {
              title: "7. Changes to Terms",
              body: "These terms are subject to change. Your continued use of the app constitutes acceptance of any updates.",
              list: null,
            },
          ].map((section) => (
            <div
              key={section.title}
              className="rounded-xl p-6"
              style={{ backgroundColor: DARK.card, border: `1px solid ${DARK.border}` }}
            >
              <h2 className="text-base font-bold mb-3" style={{ color: DARK.textPrimary }}>
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: DARK.textMuted }}>
                {section.body}
              </p>
              {section.list && (
                <ul className="mt-3 space-y-1.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: DARK.textMuted }}>
                      <span style={{ color: DARK.brand, marginTop: 2 }}>·</span> {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          <div
            className="rounded-xl p-6"
            style={{ backgroundColor: DARK.card, border: `1px solid ${DARK.border}` }}
          >
            <h2 className="text-base font-bold mb-3" style={{ color: DARK.textPrimary }}>
              Contact
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: DARK.textMuted }}>
              Questions? Reach us at{" "}
              <a href="mailto:support@spendory.app" style={{ color: DARK.brand }}>
                support@spendory.app
              </a>
              .
            </p>
          </div>
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

export default PublicTerms;
