import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";

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
          <Link to="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: DARK.brand }}>
              <TrendingUp size={15} className="text-white" />
            </div>
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
            Refund Policy
          </h1>
          <p className="text-sm font-medium" style={{ color: DARK.textDim }}>
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="space-y-4">
          {[
            {
              title: "30-Day Money-Back Guarantee",
              body: "We want you to be completely happy with Spendory Pro. If you upgrade to Pro and feel it isn't right for you, we offer a full refund within 30 days of your purchase — no questions asked.",
              list: null,
            },
            {
              title: "How to Request a Refund",
              body: null,
              custom: (
                <>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: DARK.textMuted }}>
                    Email us at{" "}
                    <a href="mailto:support@spendory.app" style={{ color: DARK.brand }}>
                      support@spendory.app
                    </a>{" "}
                    and include:
                  </p>
                  <ul className="space-y-1.5">
                    {[
                      "Your payment transaction ID or order number",
                      "The email address used during purchase",
                      "A brief reason for the refund (optional but appreciated)",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm" style={{ color: DARK.textMuted }}>
                        <span style={{ color: DARK.brand, marginTop: 2 }}>·</span> {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm leading-relaxed mt-3" style={{ color: DARK.textMuted }}>
                    Approved refunds are processed within <strong style={{ color: DARK.textSecondary }}>5–7 business days</strong> back to your original payment method.
                  </p>
                </>
              ),
            },
            {
              title: "Eligibility",
              body: null,
              list: [
                "Refund requests must be submitted within 30 days of purchase.",
                "Only the most recent Pro purchase is eligible per account.",
                "Refunds are not available for purchases made more than 30 days ago.",
              ],
            },
            {
              title: "After a Refund",
              body: "Once your refund is processed, your account will revert to the Free tier. You will retain access to all your data (stored locally on your device) and all Free features.",
              list: null,
            },
            {
              title: "Contact",
              body: null,
              custom: (
                <p className="text-sm leading-relaxed" style={{ color: DARK.textMuted }}>
                  Questions about this policy?{" "}
                  <a href="mailto:support@spendory.app" style={{ color: DARK.brand }}>
                    support@spendory.app
                  </a>
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
