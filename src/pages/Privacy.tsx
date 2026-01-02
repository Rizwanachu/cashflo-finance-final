import React from "react";
import { Card } from "../components/Card";

const Privacy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          Effective Date: January 1, 2026
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 sm:p-8">
            <article className="prose dark:prose-invert prose-slate max-w-none prose-h2:text-lg prose-h2:font-bold prose-h2:mt-8 prose-h2:mb-4 prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-li:text-slate-600 dark:prose-li:text-slate-400">
              <section>
                <h2>Our Commitment to Privacy</h2>
                <p>
                  Spendory is designed from the ground up to respect your privacy. We believe that your financial life is private and should remain so. Our architecture ensures that you are in total control of your data at all times.
                </p>
              </section>

              <section>
                <h2>Data Storage & Ownership</h2>
                <p>
                  <strong>All your financial information is stored exclusively on your device.</strong> Spendory uses your browser's local storage to save your transactions, budgets, and settings. 
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
                  We have eliminated the most common privacy risks by removing the need for accounts.
                </p>
                <ul>
                  <li><strong>No Sign-up:</strong> You don't need to provide an email or phone number.</li>
                  <li><strong>No Login:</strong> No passwords to manage or lose.</li>
                  <li><strong>No Default Tracking:</strong> We don't use cookies or third-party trackers to follow you across the web.</li>
                </ul>
              </section>

              <section>
                <h2>Optional Analytics</h2>
                <p>
                  We offer a completely optional analytics feature that is disabled by default. If you choose to enable it in the Settings, we only collect high-level, anonymized usage metrics to help us improve the app.
                </p>
                <p>
                  This data includes basic interactions like app launches and feature usage. This information is also stored locally first and is never linked to your identity.
                </p>
              </section>

              <section>
                <h2>Data Portability</h2>
                <p>
                  Because your data is yours, you can take it with you at any time. Spendory provides built-in tools to export your entire history as a CSV file. We encourage you to make regular backups of your data.
                </p>
              </section>
            </article>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-slate-100 text-slate-900 dark:bg-black dark:text-slate-100 border-none shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Privacy at a Glance</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">1</span>
                <span className="opacity-90">Zero server-side data storage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">2</span>
                <span className="opacity-90">Works 100% offline</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">3</span>
                <span className="opacity-90">No third-party data sharing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">4</span>
                <span className="opacity-90">Instant data deletion</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-3">Questions?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If you have any questions about how your data is handled, remember: if it's on your screen, it's on your device, and nowhere else.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
