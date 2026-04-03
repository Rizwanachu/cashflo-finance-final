import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  BarChart3,
  Target,
  RefreshCcw,
  Download,
  Moon,
  Zap,
  CheckCircle2,
  ArrowRight,
  Smartphone,
  TrendingUp,
  ChevronDown,
  Lock,
  Instagram,
} from "lucide-react";

const FEATURES = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Visualise income, expenses, and savings trends with beautiful charts and monthly breakdowns.",
  },
  {
    icon: Target,
    title: "Budget & Goals",
    desc: "Set category budgets and savings goals, then track progress in real time.",
  },
  {
    icon: RefreshCcw,
    title: "Recurring Expenses",
    desc: "Track subscriptions and recurring bills so nothing sneaks up on you.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy First",
    desc: "All your data lives on your device. We never store, sell, or access your financial information.",
  },
  {
    icon: Download,
    title: "Export Anytime",
    desc: "Export your full transaction history as CSV or PDF — your data, your call.",
  },
  {
    icon: Moon,
    title: "Dark & Light Mode",
    desc: "A beautiful interface that looks great day or night, on any device.",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    desc: "No internet? No problem. Spendory is a fully offline-capable progressive web app.",
  },
  {
    icon: TrendingUp,
    title: "Tag & Categorise",
    desc: "Organise transactions with custom categories and tags for granular insights.",
  },
];

const FREE_FEATURES = [
  "Unlimited transactions",
  "Budget tracking",
  "Basic analytics & charts",
  "CSV import & export",
  "Dark / light mode",
  "Offline access",
  "Works on any device",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Advanced analytics dashboard",
  "Savings goals tracker",
  "Recurring expense manager",
  "PDF export & reports",
  "Bank statement import",
  "Priority support",
  "All future Pro features — forever",
];

const FAQ = [
  {
    q: "Is my financial data safe?",
    a: "Absolutely. All your transactions and budgets are stored exclusively in your browser's local storage. Nothing is sent to our servers. We have zero access to your financial data.",
  },
  {
    q: "Is the Pro upgrade a subscription?",
    a: "No — it is a one-time payment of ₹249. Pay once, use forever, including all future Pro updates.",
  },
  {
    q: "Can I use Spendory on my phone?",
    a: "Yes. Spendory is a fully responsive web app and can be installed on your phone as a PWA for an app-like experience.",
  },
  {
    q: "What happens to my data if I clear my browser?",
    a: "Because data is stored locally, clearing browser storage will erase it. We strongly recommend exporting your data as CSV regularly.",
  },
];

const BTN_GREEN = "#FFFFFF";
const BTN_GREEN_HOVER = "#E4E4E7";

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid #1F1F23" }}>
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen((v) => !v)}
      >
        <span
          className="font-semibold text-sm transition-colors"
          style={{ color: open ? "#14b8a6" : "#FFFFFF" }}
        >
          {q}
        </span>
        <ChevronDown
          size={16}
          className={`flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "#52525B" }}
        />
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed" style={{ color: "#71717A" }}>
          {a}
        </p>
      )}
    </div>
  );
};

const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <img
    src="/logo.png"
    alt="Spendory"
    width={size}
    height={size}
    style={{ borderRadius: 8, display: "block" }}
  />
);

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const handleGetStarted = () => navigate("/login");
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div
      className="min-h-screen antialiased"
      style={{
        backgroundColor: "#000000",
        color: "#FFFFFF",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", sans-serif',
      }}
    >
      {/* ── Navbar ── */}
      <header
        className="sticky top-0 z-50 backdrop-blur"
        style={{
          backgroundColor: "rgba(0,0,0,0.85)",
          borderBottom: "1px solid #1F1F23",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size={32} />
            <span className="text-base font-bold tracking-tight">Spendory</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
              { label: "Features", action: () => scrollTo("features") },
              { label: "Pricing", action: () => scrollTo("pricing") },
              { label: "Contact", action: () => scrollTo("contact") },
            ].map((l) => (
              <button
                key={l.label}
                onClick={l.action}
                className="text-sm font-medium transition-colors hover:text-white"
                style={{ color: "#71717A" }}
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleGetStarted}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            style={{ backgroundColor: BTN_GREEN, color: "#000000" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN)}
          >
            Get Started <ArrowRight size={13} />
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-24 pb-32 px-4 sm:px-6">
        <div
          className="absolute inset-0 -z-10 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(20,184,166,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{
              backgroundColor: "rgba(20,184,166,0.1)",
              color: "#14b8a6",
              border: "1px solid rgba(20,184,166,0.2)",
            }}
          >
            <Lock size={11} />
            Privacy-first · Your data never leaves your device
          </div>

          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6"
            style={{ color: "#FFFFFF" }}
          >
            Smart money,{" "}
            <span style={{ color: "#14b8a6" }}>clear decisions</span>
          </h1>

          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            style={{ color: "#71717A" }}
          >
            Spendory is a beautifully simple personal finance tracker. Log
            expenses, set budgets, visualise trends — all without giving up
            your data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-base transition-colors"
              style={{ backgroundColor: BTN_GREEN, color: "#000000" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN_HOVER)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN)}
            >
              Get Started — it's free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-semibold text-base transition-colors"
              style={{
                backgroundColor: "transparent",
                color: "#A1A1AA",
                border: "1px solid #27272A",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#3F3F46";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#27272A";
                e.currentTarget.style.color = "#A1A1AA";
              }}
            >
              See features
            </button>
          </div>

          <p className="mt-5 text-xs" style={{ color: "#3F3F46" }}>
            No credit card required · Works in your browser · 100% private
          </p>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section
        style={{
          borderTop: "1px solid #1F1F23",
          borderBottom: "1px solid #1F1F23",
          backgroundColor: "#0A0A0A",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { stat: "100%", label: "Data privacy" },
            { stat: "₹0", label: "To get started" },
            { stat: "Offline", label: "Capable" },
            { stat: "1×", label: "Pay for Pro" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-extrabold" style={{ color: "#14b8a6" }}>
                {item.stat}
              </div>
              <div className="text-sm mt-1" style={{ color: "#52525B" }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6" style={{ backgroundColor: "#000000" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Everything you need, nothing you don't
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#71717A" }}>
              Powerful features without the complexity of traditional finance apps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-6 transition-all"
                style={{ backgroundColor: "#111111", border: "1px solid #1F1F23" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor =
                    "rgba(20,184,166,0.3)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "#1F1F23";
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: "rgba(20,184,166,0.1)" }}
                >
                  <f.icon size={18} style={{ color: "#14b8a6" }} />
                </div>
                <h3 className="font-semibold text-sm mb-2" style={{ color: "#FFFFFF" }}>
                  {f.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "#52525B" }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy callout ── */}
      <section
        className="py-20 px-4 sm:px-6"
        style={{
          backgroundColor: "#0A0A0A",
          borderTop: "1px solid #1F1F23",
          borderBottom: "1px solid #1F1F23",
        }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: "rgba(20,184,166,0.1)",
              border: "1px solid rgba(20,184,166,0.2)",
            }}
          >
            <ShieldCheck size={28} style={{ color: "#14b8a6" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Your data never leaves your device
          </h2>
          <p className="text-lg leading-relaxed max-w-xl mx-auto" style={{ color: "#71717A" }}>
            Every transaction, budget, and goal is stored exclusively in your
            browser. We have no servers holding your financial information —
            ever.
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6" style={{ backgroundColor: "#000000" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
              style={{ color: "#FFFFFF" }}
            >
              Simple, honest pricing
            </h2>
            <p className="max-w-xl mx-auto" style={{ color: "#71717A" }}>
              Start for free. Upgrade once for lifetime access to Pro features
              — no subscriptions, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div
              className="rounded-2xl p-8 flex flex-col"
              style={{ backgroundColor: "#111111", border: "1px solid #1F1F23" }}
            >
              <div className="mb-6">
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ backgroundColor: "#1F1F23", color: "#A1A1AA" }}
                >
                  FREE
                </span>
                <div className="text-4xl font-extrabold" style={{ color: "#FFFFFF" }}>
                  ₹0
                </div>
                <div className="text-sm mt-1" style={{ color: "#52525B" }}>
                  Always free, no credit card
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#A1A1AA" }}>
                    <CheckCircle2 size={15} style={{ color: "#14b8a6", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ backgroundColor: BTN_GREEN, color: "#000000" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN)}
              >
                Get started free
              </button>
            </div>

            {/* Pro */}
            <div
              className="rounded-2xl p-8 flex flex-col relative overflow-hidden"
              style={{
                backgroundColor: "#111111",
                border: "1px solid rgba(5,150,105,0.4)",
                boxShadow: "0 0 40px rgba(5,150,105,0.06)",
              }}
            >
              <div className="absolute top-4 right-4">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: BTN_GREEN, color: "#000000" }}
                >
                  BEST VALUE
                </span>
              </div>
              <div className="mb-6">
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-bold mb-4"
                  style={{ backgroundColor: "rgba(5,150,105,0.1)", color: "#10b981" }}
                >
                  PRO
                </span>
                <div className="text-4xl font-extrabold" style={{ color: "#FFFFFF" }}>
                  ₹249
                </div>
                <div className="text-sm mt-1" style={{ color: "#52525B" }}>
                  One-time · Lifetime access
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm" style={{ color: "#A1A1AA" }}>
                    <CheckCircle2 size={15} style={{ color: "#10b981", flexShrink: 0 }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 rounded-xl font-semibold text-sm transition-colors"
                style={{ backgroundColor: BTN_GREEN, color: "#000000" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN_HOVER)}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN)}
              >
                Upgrade to Pro — ₹249
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section
        className="py-24 px-4 sm:px-6"
        style={{ backgroundColor: "#0A0A0A", borderTop: "1px solid #1F1F23" }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: "#FFFFFF" }}
            >
              Frequently asked questions
            </h2>
          </div>
          {FAQ.map((item) => (
            <FaqItem key={item.q} {...item} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        className="py-20 px-4 sm:px-6"
        style={{ backgroundColor: "#000000", borderTop: "1px solid #1F1F23" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-6"
            style={{
              backgroundColor: "rgba(5,150,105,0.1)",
              border: "1px solid rgba(5,150,105,0.2)",
            }}
          >
            <Zap size={22} style={{ color: "#10b981" }} />
          </div>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4"
            style={{ color: "#FFFFFF" }}
          >
            Ready to take control of your finances?
          </h2>
          <p className="mb-8" style={{ color: "#71717A" }}>
            Join thousands of users who manage their money smarter with
            Spendory. Free to start. Private by design.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-colors"
            style={{ backgroundColor: BTN_GREEN, color: "#000000" }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN_HOVER)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BTN_GREEN)}
          >
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Contact / Instagram ── */}
      <section
        id="contact"
        className="py-16 px-4 sm:px-6"
        style={{ backgroundColor: "#0A0A0A", borderTop: "1px solid #1F1F23" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-5"
            style={{
              backgroundColor: "rgba(20,184,166,0.08)",
              border: "1px solid rgba(20,184,166,0.15)",
            }}
          >
            <Instagram size={22} style={{ color: "#14b8a6" }} />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight mb-3" style={{ color: "#FFFFFF" }}>
            Get in touch
          </h2>
          <p className="mb-6 max-w-sm mx-auto text-sm leading-relaxed" style={{ color: "#71717A" }}>
            Have questions or need help? Follow us on Instagram for updates and support.
          </p>
          <a
            href="https://www.instagram.com/spendoryapp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            style={{
              border: "1px solid #27272A",
              color: "#A1A1AA",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor =
                "rgba(20,184,166,0.4)";
              (e.currentTarget as HTMLAnchorElement).style.color = "#14b8a6";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#27272A";
              (e.currentTarget as HTMLAnchorElement).style.color = "#A1A1AA";
            }}
          >
            <Instagram size={16} />
            @spendoryapp
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-10 px-4 sm:px-6"
        style={{ backgroundColor: "#000000", borderTop: "1px solid #1F1F23" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-bold text-sm" style={{ color: "#FFFFFF" }}>
              Spendory
            </span>
            <span className="text-sm" style={{ color: "#3F3F46" }}>
              · Smart money, clear decisions
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {[
              ["Privacy Policy", "/privacy"],
              ["Terms of Service", "/terms"],
              ["Refund Policy", "/refund"],
            ].map(([label, to]) => (
              <Link
                key={label}
                to={to}
                className="transition-colors hover:text-white"
                style={{ color: "#52525B" }}
              >
                {label}
              </Link>
            ))}
          </nav>

          <p className="text-xs" style={{ color: "#3F3F46" }}>
            © {new Date().getFullYear()} Spendory. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
