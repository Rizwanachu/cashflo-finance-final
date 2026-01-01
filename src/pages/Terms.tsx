import React from "react";
import { Card } from "../components/Card";

const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
          Terms of Service
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
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing or using Spendory, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using this application.
                </p>
              </section>

              <section>
                <h2>2. Description of Service</h2>
                <p>
                  Spendory is a personal finance tracking application that operates locally on the user's device. We provide tools for recording transactions, setting budgets, and visualizing financial data.
                </p>
              </section>

              <section>
                <h2>3. License & Use</h2>
                <p>
                  We grant you a non-exclusive, non-transferable, revocable license to use Spendory for your personal, non-commercial use.
                </p>
                <ul>
                  <li>You must not decompile or reverse engineer the software.</li>
                  <li>You must not use the service for any illegal or unauthorized purpose.</li>
                </ul>
              </section>

              <section>
                <h2>4. Pro Purchase & Refunds</h2>
                <p>
                  Spendory Pro is a one-time purchase that unlocks advanced features.
                </p>
                <ul>
                  <li>The purchase is tied to the local installation on your device.</li>
                  <li>Due to the nature of local software activation, all sales are final and non-refundable.</li>
                  <li>We reserve the right to modify Pro features at any time.</li>
                </ul>
              </section>

              <section>
                <h2>5. Disclaimer of Warranties</h2>
                <p>
                  Spendory is provided "as is" and "as available". We make no warranties, expressed or implied, regarding the accuracy or reliability of the data stored within the app. <strong>You are solely responsible for backing up your data.</strong>
                </p>
              </section>

              <section>
                <h2>6. Limitation of Liability</h2>
                <p>
                  In no event shall Spendory or its creators be liable for any damages (including, without limitation, damages for loss of data or profit) arising out of the use or inability to use the application.
                </p>
              </section>
            </article>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6 bg-slate-100 text-slate-900 dark:bg-slate-900 dark:text-slate-100 border-none shadow-xl">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 opacity-90">Key Terms</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">1</span>
                <span className="opacity-90">One-time Pro payment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">2</span>
                <span className="opacity-90">Personal use only</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">3</span>
                <span className="opacity-90">User-managed backups</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-900/10 dark:bg-slate-100/10 flex items-center justify-center text-[10px] font-bold">4</span>
                <span className="opacity-90">No liability for data loss</span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50 mb-2">Notice</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              These terms are subject to change. Your continued use of the app constitutes acceptance of any updates.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Terms;
