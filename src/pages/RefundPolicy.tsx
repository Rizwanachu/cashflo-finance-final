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

const RefundPolicy: React.FC = () => {
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
            Refund Policy
          </h1>
          <p className="text-sm font-medium" style={{ color: DARK.textDim }}>
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "All Sales Are Final",
              body: "All purchases of Spendory Pro are non-refundable. By completing a purchase, you acknowledge and agree that the payment is final and no refunds will be issued.",
              list: null,
            },
            {
              title: "Why We Have This Policy",
              body: "Spendory Pro is a one-time payment for lifetime access to digital software features. Because the Pro features are unlocked and made available to you immediately upon purchase, we are unable to offer refunds.",
              list: null,
            },
            {
              title: "What You're Getting",
              body: null,
              list: [
                "Lifetime access to all current Pro features.",
                "All future Pro feature updates at no extra cost.",
                "Immediate activation — no waiting period.",
              ],
            },
            {
              title: "Questions",
              body: null,
              custom: (
                <p className="text-sm leading-relaxed" style={{ color: DARK.textMuted }}>
                  If you have questions about your purchase or need help with the app, reach us on Instagram at{" "}
                  <a
                    href="https://www.instagram.com/spendoryapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: DARK.brand }}
                  >
                    @spendoryapp
                  </a>
                  .
                </p>
              ),
            },
          ].map((section: any) => (
            <div
              key={section.title}
              className="rounded-xl p-6"
              style={{ backgroundColor: DARK.card, border: `1px solid ${DARK.border}` }}
            >
              <h2 className="text-base font-bold mb-3" style={{ color: DARK.textPrimary }}>
                {section.title}
              </h2>
              {section.body && (
                <p className="text-sm leading-relaxed" style={{ color: DARK.textMuted }}>
                  {section.body}
                </p>
              )}
              {section.list && (
                <ul className="space-y-1.5">
                  {section.list.map((item: string) => (
                    <li key={item} className="flex items-start gap-2 text-sm" style={{ color: DARK.textMuted }}>
                      <span style={{ color: DARK.brand, marginTop: 2 }}>·</span> {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.custom && section.custom}
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

export default RefundPolicy;
