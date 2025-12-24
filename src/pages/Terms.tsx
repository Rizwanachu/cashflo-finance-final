import React from "react";
import { Card } from "../components/Card";

const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
          Terms of Service
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Last updated: December 2025
        </p>
      </div>

      <Card className="prose dark:prose-invert prose-sm max-w-none">
        <h2>Acceptance of Terms</h2>
        <p>
          By using Spendory, you accept these terms. If you don't agree, please don't use the app.
        </p>

        <h2>License</h2>
        <p>
          We grant you a personal, non-transferable license to use Spendory for your own financial tracking.
        </p>

        <h2>User Responsibilities</h2>
        <ul>
          <li>You are responsible for backing up your data</li>
          <li>You are responsible for maintaining the security of your device</li>
          <li>You agree not to use the app for illegal purposes</li>
        </ul>

        <h2>No Warranty</h2>
        <p>
          Spendory is provided "as is" without any guarantees. We are not responsible for data loss due to device failures, browser issues, or other technical problems.
        </p>

        <h2>Limitation of Liability</h2>
        <p>
          We are not liable for any indirect or consequential damages related to your use of Spendory.
        </p>

        <h2>Pro Purchase</h2>
        <ul>
          <li>Pro unlock is a one-time purchase</li>
          <li>Pro features include unlimited transactions and history</li>
          <li>Pro purchases are non-refundable</li>
          <li>We maintain the right to update Pro features</li>
        </ul>

        <h2>Changes to Terms</h2>
        <p>
          We may update these terms. Continued use means you accept the changes.
        </p>
      </Card>
    </div>
  );
};

export default Terms;
