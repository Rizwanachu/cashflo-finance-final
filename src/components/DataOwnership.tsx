import React from "react";
import { Card } from "./Card";

const DataOwnership: React.FC = () => {
  return (
    <Card className="bg-slate-50 dark:bg-slate-800/50">
      <div className="space-y-3">
        <h3 className="font-semibold text-slate-900 dark:text-slate-50">
          📦 Your Data Is Yours
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          You can export your data anytime in multiple formats. No vendor lock-in.
        </p>
        <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <div>
            <span className="font-medium">📄 CSV Format:</span> Import to Excel, Sheets, or any spreadsheet
          </div>
          <div>
            <span className="font-medium">📊 PDF Format:</span> Beautiful reports for analysis (Pro only)
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DataOwnership;
