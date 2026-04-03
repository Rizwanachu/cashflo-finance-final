import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/landing" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight">Spendory</span>
          </Link>
          <Link
            to="/landing"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft size={14} /> Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Refund Policy
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none prose-h2:text-xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          <section>
            <h2>30-Day Money-Back Guarantee</h2>
            <p>
              We want you to be completely happy with Spendory Pro. If you
              upgrade to Pro and feel it isn't right for you, we offer a full
              refund within <strong>30 days</strong> of your purchase — no
              questions asked.
            </p>
          </section>

          <section>
            <h2>How to Request a Refund</h2>
            <p>To request a refund, email us at:</p>
            <p>
              <a
                href="mailto:support@spendory.app"
                className="text-indigo-600 font-medium hover:underline"
              >
                support@spendory.app
              </a>
            </p>
            <p>Please include:</p>
            <ul>
              <li>Your payment transaction ID or order number</li>
              <li>The email address used during purchase</li>
              <li>A brief reason for the refund (optional but appreciated)</li>
            </ul>
            <p>
              We will process approved refunds within <strong>5–7 business days</strong> back to your original payment method.
            </p>
          </section>

          <section>
            <h2>Eligibility</h2>
            <ul>
              <li>Refund requests must be submitted within 30 days of purchase.</li>
              <li>Only the most recent Pro purchase is eligible per account.</li>
              <li>
                Refunds are not available for purchases made more than 30 days
                ago.
              </li>
            </ul>
          </section>

          <section>
            <h2>After a Refund</h2>
            <p>
              Once your refund is processed, your account will revert to the
              Free tier. You will retain access to all your data (which is
              stored locally on your device) and all Free features.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this policy, please reach out to
              us at{" "}
              <a
                href="mailto:support@spendory.app"
                className="text-indigo-600 font-medium hover:underline"
              >
                support@spendory.app
              </a>
              . We're happy to help.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <span>© {new Date().getFullYear()} Spendory. All rights reserved.</span>
          <nav className="flex gap-5">
            <Link to="/privacy" className="hover:text-slate-700 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-slate-700 transition-colors">
              Terms of Service
            </Link>
            <Link to="/refund" className="hover:text-slate-700 transition-colors">
              Refund Policy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default RefundPolicy;
