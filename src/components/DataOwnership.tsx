import React from "react";
import { Card } from "./Card";
import { Database, FileText, FileSpreadsheet } from "lucide-react";

const DataOwnership: React.FC = () => {
  return (
    <Card className="bg-slate-50 dark:bg-[var(--bg-secondary)]/50">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-slate-900 dark:text-slate-50" />
          <h3 className="font-semibold text-slate-900 dark:text-[var(--text-primary)]">
            Your Data Is Yours
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-[var(--text-paragraph)]">
          You can export your data anytime in multiple formats. No vendor lock-in.
        </p>
        <div className="text-xs text-slate-600 dark:text-[var(--text-paragraph)] space-y-2">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-slate-900 dark:text-slate-50" />
            <span><span className="font-medium">CSV Format:</span> Import to Excel, Sheets, or any spreadsheet</span>
          </div>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-slate-900 dark:text-slate-50" />
            <span><span className="font-medium">PDF Format:</span> Beautiful reports for analysis (Pro only)</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataOwnership;
