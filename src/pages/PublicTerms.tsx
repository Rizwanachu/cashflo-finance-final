import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";

const PublicTerms: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none prose-h2:text-xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Spendory, you agree to be bound by these
              Terms of Service. If you do not agree to all of these terms, you
              are prohibited from using this application.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Spendory is a personal finance tracking application that operates
              locally on the user's device. We provide tools for recording
              transactions, setting budgets, and visualising financial data.
            </p>
          </section>

          <section>
            <h2>3. License &amp; Use</h2>
            <p>
              We grant you a non-exclusive, non-transferable, revocable license
              to use Spendory for your personal, non-commercial use.
            </p>
            <ul>
              <li>You must not decompile or reverse engineer the software.</li>
              <li>
                You must not use the service for any illegal or unauthorized
                purpose.
              </li>
            </ul>
          </section>

          <section>
            <h2>4. Pro Purchase &amp; Refunds</h2>
            <p>
              Spendory Pro is a one-time payment of ₹249 that unlocks advanced
              features permanently.
            </p>
            <ul>
              <li>
                We offer a 30-day money-back guarantee — see our{" "}
                <Link to="/refund" className="text-indigo-600 hover:underline">
                  Refund Policy
                </Link>{" "}
                for details.
              </li>
              <li>
                We reserve the right to modify Pro features at any time.
              </li>
            </ul>
          </section>

          <section>
            <h2>5. Disclaimer of Warranties</h2>
            <p>
              Spendory is provided "as is" and "as available". We make no
              warranties regarding the accuracy or reliability of data stored
              within the app.{" "}
              <strong>You are solely responsible for backing up your data.</strong>
            </p>
          </section>

          <section>
            <h2>6. Limitation of Liability</h2>
            <p>
              In no event shall Spendory or its creators be liable for any
              damages (including, without limitation, damages for loss of data
              or profit) arising out of the use or inability to use the
              application.
            </p>
          </section>

          <section>
            <h2>7. Changes to Terms</h2>
            <p>
              These terms are subject to change. Your continued use of the app
              constitutes acceptance of any updates.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions? Reach us at{" "}
              <a
                href="mailto:support@spendory.app"
                className="text-indigo-600 hover:underline"
              >
                support@spendory.app
              </a>
              .
            </p>
          </section>
        </div>
      </main>

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

export default PublicTerms;
