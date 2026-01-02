import React, { useState } from "react";
import {
  parseCsvText,
  autoDetectMapping,
  importCsv,
  ColumnMapping,
  ImportResult
} from "../utils/importCsv";
import { useTransactions } from "../context/TransactionsContext";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { usePro } from "../context/ProContext";
import { useToast } from "../context/ToastContext";
import { useAccounts } from "../context/AccountsContext";

interface Props {
  onImportComplete?: () => void;
}

type ImportStep = "upload" | "mapping" | "preview" | "complete";

const CsvImport: React.FC<Props> = ({ onImportComplete }) => {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const { addTransaction } = useTransactions();
  const { pushToast } = useToast();
  const { isProUser } = usePro();
  const { accounts } = useAccounts();

  const [step, setStep] = useState<ImportStep>("upload");
  const [csvText, setCsvText] = useState("");
  const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    date: null,
    amount: null,
    type: null,
    category: null,
    description: null
  });
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(
    accounts[0]?.id || ""
  );

  const maxTransactions = isProUser ? Infinity : 50;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const rows = parseCsvText(text);

        if (rows.length < 2) {
          pushToast("CSV must have header and data rows", "warning");
          return;
        }

        setCsvText(text);
        setCsvHeaders(rows[0]);
        const detectedMapping = autoDetectMapping(rows[0]);
        setMapping(detectedMapping);
        setStep("mapping");
      } catch (error) {
        pushToast(
          `Error reading file: ${error instanceof Error ? error.message : "Unknown error"}`,
          "warning"
        );
      }
    };
    reader.readAsText(file);
  };

  const handleMappingChange = (field: keyof ColumnMapping, colIndex: number | null) => {
    setMapping((prev) => ({
      ...prev,
      [field]: colIndex
    }));
  };

  const handlePreview = () => {
    setIsProcessing(true);
    try {
      const result = importCsv(
        csvText,
        mapping,
        selectedAccountId,
        currency,
        maxTransactions
      );
      setImportResult(result);
      setStep("preview");
    } catch (error) {
      pushToast(
        `Error parsing CSV: ${error instanceof Error ? error.message : "Unknown error"}`,
        "warning"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    if (!importResult || !importResult.success) {
      pushToast("No valid transactions to import", "warning");
      return;
    }

    setIsProcessing(true);
    try {
      importResult.preview.forEach((tx) => {
        addTransaction(tx);
      });

      pushToast(
        `Successfully imported ${importResult.importedCount} transactions`,
        "success"
      );

      setStep("complete");
      if (onImportComplete) {
        setTimeout(() => onImportComplete(), 1500);
      }
    } catch (error) {
      pushToast(
        `Error importing transactions: ${error instanceof Error ? error.message : "Unknown error"}`,
        "warning"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const resetImport = () => {
    setStep("upload");
    setCsvText("");
    setCsvHeaders([]);
    setMapping({ date: null, amount: null, type: null, category: null, description: null });
    setImportResult(null);
  };

  const bgColor = theme === "dark" ? "bg-slate-900" : "bg-white";
  const borderColor = theme === "dark" ? "border-slate-700" : "border-slate-200";
  const textColor = theme === "dark" ? "text-slate-100" : "text-slate-900";
  const labelColor = theme === "dark" ? "text-slate-400" : "text-slate-600";

  return (
    <div className={`rounded-lg border ${borderColor} p-6 ${bgColor}`}>
      {step === "upload" && (
        <div>
          <h2 className={`mb-4 text-lg font-semibold ${textColor}`}>
            Import Transactions from CSV
          </h2>

          {!isProUser && (
            <div className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-200">
              Free tier: Limited to 50 transactions per import
            </div>
          )}

          <div className={`rounded-lg border-2 border-dashed ${borderColor} p-8 text-center`}>
            <div className={`mx-auto mb-3 h-8 w-8 ${labelColor} text-center`}>📤</div>
            <label className="cursor-pointer">
              <span className={`font-medium ${textColor}`}>
                Click to upload CSV
              </span>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <p className={`mt-2 text-sm ${labelColor}`}>
              or drag and drop your CSV file
            </p>
          </div>

          <div className={`mt-4 p-3 rounded-lg ${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}>
            <p className={`text-sm ${labelColor}`}>
              <strong>CSV Format:</strong> Include columns for Date, Amount, Type, Category, and Description
            </p>
          </div>
        </div>
      )}

      {step === "mapping" && (
        <div>
          <h2 className={`mb-4 text-lg font-semibold ${textColor}`}>
            Map CSV Columns
          </h2>

          <div className="mb-4 space-y-3">
            <div>
              <label className={`block text-sm font-medium ${textColor} mb-1`}>
                Select Account
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className={`w-full rounded-lg border ${borderColor} px-3 py-2 ${textColor} ${
                  theme === "dark" ? "bg-slate-800" : "bg-white"
                }`}
              >
                {accounts.map((acc) => (
                  <option key={acc.id} value={acc.id}>
                    {acc.name}
                  </option>
                ))}
              </select>
            </div>

            {["date", "amount", "type", "category", "description"].map((field) => (
              <div key={field}>
                <label className={`block text-sm font-medium ${textColor} mb-1 capitalize`}>
                  {field === "type" ? "Transaction Type" : field}
                  {["date", "amount", "category"].includes(field) && " *"}
                </label>
                <select
                  value={mapping[field as keyof ColumnMapping] ?? ""}
                  onChange={(e) =>
                    handleMappingChange(
                      field as keyof ColumnMapping,
                      e.target.value ? parseInt(e.target.value) : null
                    )
                  }
                  className={`w-full rounded-lg border ${borderColor} px-3 py-2 ${textColor} ${
                    theme === "dark" ? "bg-slate-800" : "bg-white"
                  }`}
                >
                  <option value="">-- Select Column --</option>
                  {csvHeaders.map((header, index) => (
                    <option key={index} value={index}>
                      {header || `Column ${index + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={resetImport}
              className={`flex-1 rounded-lg border ${borderColor} px-4 py-2 font-medium ${textColor} hover:opacity-80`}
            >
              Back
            </button>
            <button
              onClick={handlePreview}
              disabled={isProcessing}
              className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isProcessing ? "Loading..." : "Preview"}
            </button>
          </div>
        </div>
      )}

      {step === "preview" && importResult && (
        <div>
          <h2 className={`mb-4 text-lg font-semibold ${textColor}`}>
            Preview Import
          </h2>

          {importResult.errors.length > 0 && (
            <div className="mb-4 rounded-lg bg-red-50 p-3 dark:bg-red-900/30">
              <div className="flex gap-2 text-sm text-red-800 dark:text-red-300">
                <span className="h-4 w-4 flex-shrink-0 mt-0.5">⚠️</span>
                <div>
                  <p className="font-medium">
                    {importResult.errors.length} row(s) had errors
                  </p>
                  <ul className="mt-1 ml-4 list-disc text-xs">
                    {importResult.errors.slice(0, 5).map((err, i) => (
                      <li key={i}>
                        Row {err.row}: {err.field} - {err.message}
                      </li>
                    ))}
                    {importResult.errors.length > 5 && (
                      <li>+{importResult.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {importResult.importedCount > 0 && (
            <div className="mb-4 rounded-lg bg-slate-100 p-3 dark:bg-slate-800">
              <div className="flex gap-2 text-sm text-slate-900 dark:text-slate-100">
                <span className="h-4 w-4 flex-shrink-0 mt-0.5">✓</span>
                <p>
                  <strong>{importResult.importedCount}</strong> transaction(s) ready to import
                </p>
              </div>
            </div>
          )}

          <div className={`mb-4 max-h-80 overflow-y-auto rounded-lg border ${borderColor}`}>
            <table className="w-full text-sm">
              <thead className={`${theme === "dark" ? "bg-slate-800" : "bg-slate-50"}`}>
                <tr>
                  <th className={`px-3 py-2 text-left font-medium ${labelColor}`}>
                    Date
                  </th>
                  <th className={`px-3 py-2 text-left font-medium ${labelColor}`}>
                    Type
                  </th>
                  <th className={`px-3 py-2 text-left font-medium ${labelColor}`}>
                    Amount
                  </th>
                  <th className={`px-3 py-2 text-left font-medium ${labelColor}`}>
                    Category
                  </th>
                  <th className={`px-3 py-2 text-left font-medium ${labelColor}`}>
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {importResult.preview.slice(0, 10).map((tx, i) => (
                  <tr
                    key={i}
                    className={`border-t ${borderColor} ${
                      i % 2 === 0 && theme === "dark" ? "bg-slate-800" : ""
                    }`}
                  >
                    <td className={`px-3 py-2 ${textColor}`}>{tx.date}</td>
                    <td className={`px-3 py-2 capitalize ${textColor}`}>
                      {tx.type}
                    </td>
                    <td className={`px-3 py-2 ${textColor}`}>{tx.amount}</td>
                    <td className={`px-3 py-2 capitalize ${textColor}`}>
                      {tx.category}
                    </td>
                    <td className={`px-3 py-2 ${textColor}`}>
                      {tx.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep("mapping")}
              className={`flex-1 rounded-lg border ${borderColor} px-4 py-2 font-medium ${textColor} hover:opacity-80`}
            >
              Edit Mapping
            </button>
            <button
              onClick={handleImport}
              disabled={!importResult.success || isProcessing}
              className="flex-1 rounded-lg bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isProcessing ? "Importing..." : "Import"}
            </button>
          </div>
        </div>
      )}

      {step === "complete" && (
        <div className="text-center">
          <div className="mx-auto mb-3 text-4xl">✅</div>
          <h2 className={`mb-2 text-lg font-semibold ${textColor}`}>
            Import Complete
          </h2>
          <p className={`mb-4 ${labelColor}`}>
            {importResult?.importedCount} transactions have been imported
          </p>
          <button
            onClick={resetImport}
            className="rounded-lg bg-slate-900 px-6 py-2 font-medium text-white hover:bg-slate-800"
          >
            Import More
          </button>
        </div>
      )}
    </div>
  );
};

export default CsvImport;
