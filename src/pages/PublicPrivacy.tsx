import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, TrendingUp } from "lucide-react";

const PublicPrivacy: React.FC = () => {
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
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Effective Date: January 1, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none prose-h2:text-xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-3 prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          <section>
            <h2>Our Commitment to Privacy</h2>
            <p>
              Spendory is designed from the ground up to respect your privacy.
              We believe that your financial life is private and should remain
              so. Our architecture ensures that you are in total control of
              your data at all times.
            </p>
          </section>

          <section>
            <h2>Data Storage &amp; Ownership</h2>
            <p>
              <strong>
                All your financial information is stored exclusively on your
                device.
              </strong>{" "}
              Spendory uses your browser's local storage to save your
              transactions, budgets, and settings.
            </p>
            <ul>
              <li>We do not collect your data.</li>
              <li>We do not transmit your data to any servers.</li>
              <li>We do not have access to your financial history.</li>
              <li>Your data stays with you, even when you're offline.</li>
            </ul>
          </section>

          <section>
            <h2>No Accounts, No Tracking</h2>
            <p>
              We have eliminated the most common privacy risks by removing the
              need for accounts.
            </p>
            <ul>
              <li>
                <strong>No Sign-up:</strong> You don't need to provide an email
                or phone number.
              </li>
              <li>
                <strong>No Login:</strong> No passwords to manage or lose.
              </li>
              <li>
                <strong>No Default Tracking:</strong> We don't use cookies or
                third-party trackers to follow you across the web.
              </li>
            </ul>
          </section>

          <section>
            <h2>Optional Analytics</h2>
            <p>
              We offer a completely optional analytics feature that is disabled
              by default. If you choose to enable it in the Settings, we only
              collect high-level, anonymized usage metrics to help us improve
              the app. This information is never linked to your identity.
            </p>
          </section>

          <section>
            <h2>Data Portability</h2>
            <p>
              Because your data is yours, you can take it with you at any time.
              Spendory provides built-in tools to export your entire history as
              a CSV file. We encourage you to make regular backups of your
              data.
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

export default PublicPrivacy;
