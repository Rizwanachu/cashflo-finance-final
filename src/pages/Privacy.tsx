import React from "react";
import { Card } from "../components/Card";

const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Privacy Policy
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Last updated: December 2025
        </p>
      </div>

      <Card className="prose dark:prose-invert prose-sm max-w-none">
        <h2>Our Commitment to Privacy</h2>
        <p>
          Spendory is built with privacy as the foundation. Your financial data is yours alone.
        </p>

        <h2>Data Storage</h2>
        <p>
          All your financial information is stored exclusively on your device in your browser's local storage. We do not collect, transmit, or store any of your data on our servers.
        </p>

        <h2>No Tracking</h2>
        <p>
          We do not track your behavior, use third-party analytics by default, or sell your data. Analytics collection is optional and disabled by default.
        </p>

        <h2>No Signup Required</h2>
        <p>
          You do not need to create an account, provide an email, or login. The app works completely offline after the first load.
        </p>

        <h2>Optional Analytics</h2>
        <p>
          If you choose to enable analytics in settings, we only track:
        </p>
        <ul>
          <li>App opens</li>
          <li>Pro upgrade clicks</li>
          <li>Pro unlock success</li>
        </ul>
        <p>
          This data is stored locally only and helps us understand feature usage. You can disable it anytime.
        </p>

        <h2>Data Backup</h2>
        <p>
          You can export your data at any time as a CSV file. We recommend backing up your data regularly.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about privacy? Your data is yours and always stays on your device.
        </p>
      </Card>
    </div>
  );
};

export default Privacy;
