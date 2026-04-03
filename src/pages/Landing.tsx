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
  Lock,
  TrendingUp,
  Mail,
  ChevronDown,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

const FEATURES = [
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Visualise your income, expenses, and savings trends with beautiful charts and monthly breakdowns.",
  },
  {
    icon: Target,
    title: "Budget & Goals",
    desc: "Set category budgets and savings goals, then track your progress in real time.",
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
    desc: "Export your full transaction history as CSV or PDF at any time — your data, your call.",
  },
  {
    icon: Moon,
    title: "Dark & Light Mode",
    desc: "A beautiful interface that looks great day or night, on any device.",
  },
  {
    icon: Smartphone,
    title: "Works Offline",
    desc: "No internet? No problem. Spendory works fully offline as a progressive web app.",
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

const FaqItem: React.FC<{ q: string; a: string }> = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-200 last:border-0">
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4 group"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
          {q}
        </span>
        <ChevronDown
          size={18}
          className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-5 text-slate-600 text-sm leading-relaxed">{a}</p>
      )}
    </div>
  );
};

const Landing: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => navigate("/login");

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Spendory</span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                onClick={() => scrollTo(l.href.slice(1))}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {l.label}
              </button>
            ))}
          </nav>

          <button
            onClick={handleGetStarted}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors"
          >
            Get Started <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-4 sm:px-6">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
        <div
          className="absolute inset-0 -z-10 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, #e0e7ff 0%, transparent 50%), radial-gradient(circle at 75% 70%, #ede9fe 0%, transparent 50%)",
          }}
        />

        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold mb-6">
            <Lock size={11} />
            Privacy-first · No account required to try
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Smart money,{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              clear decisions
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Spendory is a beautifully simple personal finance tracker. Log
            expenses, set budgets, visualise trends — all without giving up
            your data.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
            >
              Get Started — it's free <ArrowRight size={16} />
            </button>
            <button
              onClick={() => scrollTo("features")}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-base hover:border-slate-300 hover:bg-slate-50 transition-all"
            >
              See features
            </button>
          </div>

          <p className="mt-5 text-xs text-slate-400">
            No credit card required · Works in your browser · 100% private
          </p>
        </div>
      </section>

      {/* ── Social proof strip ── */}
      <section className="bg-slate-900 py-10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { stat: "100%", label: "Data privacy" },
            { stat: "₹0", label: "To get started" },
            { stat: "Offline", label: "Ready" },
            { stat: "1×", label: "Pay for Pro" },
          ].map((item) => (
            <div key={item.label}>
              <div className="text-2xl font-extrabold text-white">{item.stat}</div>
              <div className="text-sm text-slate-400 mt-1">{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Everything you need, nothing you don't
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Spendory keeps things simple. Powerful features without the
              complexity of traditional finance apps.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-slate-100 p-6 hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition-colors">
                  <f.icon size={20} className="text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Privacy callout ── */}
      <section className="py-20 px-4 sm:px-6 bg-gradient-to-br from-indigo-600 to-purple-700">
        <div className="max-w-3xl mx-auto text-center text-white">
          <ShieldCheck size={40} className="mx-auto mb-5 opacity-90" />
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Your data never leaves your device
          </h2>
          <p className="text-indigo-100 text-lg leading-relaxed max-w-xl mx-auto">
            Every transaction, budget, and goal is stored exclusively in your
            browser. We have no servers holding your financial information —
            ever.
          </p>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="py-24 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Simple, honest pricing
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Start for free. Upgrade once for lifetime access to Pro features
              — no subscriptions, no surprises.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col">
              <div className="mb-6">
                <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold mb-4">
                  FREE
                </span>
                <div className="text-4xl font-extrabold text-slate-900">
                  ₹0
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  Always free, no credit card
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-indigo-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
              >
                Get started free
              </button>
            </div>

            {/* Pro */}
            <div className="rounded-2xl border-2 border-indigo-600 bg-white p-8 flex flex-col relative overflow-hidden shadow-xl shadow-indigo-100">
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 rounded-full bg-indigo-600 text-white text-xs font-bold">
                  BEST VALUE
                </span>
              </div>
              <div className="mb-6">
                <span className="inline-block px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-4">
                  PRO
                </span>
                <div className="text-4xl font-extrabold text-slate-900">
                  ₹249
                </div>
                <div className="text-slate-500 text-sm mt-1">
                  One-time · Lifetime access
                </div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {PRO_FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-indigo-600 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
              >
                Upgrade to Pro — ₹249
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                30-day refund guarantee
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
              Frequently asked questions
            </h2>
          </div>
          <div>
            {FAQ.map((item) => (
              <FaqItem key={item.q} {...item} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center">
          <Zap size={36} className="mx-auto text-indigo-400 mb-5" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to take control of your finances?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of users who manage their money smarter with
            Spendory. Free to start. Private by design.
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold text-base hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-900/30"
          >
            Get Started Free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* ── Contact ── */}
      <section id="contact" className="py-16 px-4 sm:px-6 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">
            Get in touch
          </h2>
          <p className="text-slate-500 mb-6">
            Have a question or feedback? We'd love to hear from you.
          </p>
          <a
            href="mailto:support@spendory.app"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 font-medium hover:border-indigo-300 hover:text-indigo-600 transition-colors"
          >
            <Mail size={16} />
            support@spendory.app
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-50 border-t border-slate-100 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <TrendingUp size={13} className="text-white" />
            </div>
            <span className="font-bold text-slate-800">Spendory</span>
            <span className="text-slate-400 text-sm">
              · Smart money, clear decisions
            </span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-500">
            <Link to="/privacy" className="hover:text-slate-800 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-800 transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="hover:text-slate-800 transition-colors">
              Refund Policy
            </Link>
          </nav>

          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} Spendory. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
