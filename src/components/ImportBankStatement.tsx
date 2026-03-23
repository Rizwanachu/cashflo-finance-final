import React, { useState, useRef, useCallback } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import * as pdfjs from "pdfjs-dist";
import { useTransactionsContext } from "../context/TransactionsContext";
import { useTheme } from "../context/ThemeContext";
import { useCurrency } from "../context/CurrencyContext";
import { useToast } from "../context/ToastContext";
import { useAccounts } from "../context/AccountsContext";
import { Transaction, TransactionCategory, TransactionType } from "../types";
import { AlertTriangle, CheckCircle2, ChevronDown, Eye, EyeOff, FileSpreadsheet, FileText, KeyRound, X } from "lucide-react";

pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

interface Props {
  onClose: () => void;
}

interface ParsedRow {
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: TransactionCategory;
}

interface PreviewRow extends ParsedRow {
  uid: string;
  checked: boolean;
  isDuplicate: boolean;
}

interface ColumnMap {
  dateCol: number | null;
  descCol: number | null;
  debitCol: number | null;
  creditCol: number | null;
  amountCol: number | null;
}

type Step = "upload" | "mapping" | "preview" | "done";

const CATEGORIES: TransactionCategory[] = [
  "Food/Groceries",
  "Transportation",
  "Housing",
  "Shopping",
  "Entertainment",
  "Healthcare",
  "Education",
  "Income",
  "Utilities",
  "Other",
  "Uncategorized",
];

function autoCategory(desc: string): { category: TransactionCategory; type: TransactionType } {
  const d = desc.toLowerCase();
  if (/swiggy|zomato|food|restaurant|cafe|hotel|blinkit|grocer/.test(d)) return { category: "Food/Groceries", type: "expense" };
  if (/uber|ola|rapido|metro|bus|irctc|flight|indigo|spicejet|train|cab/.test(d)) return { category: "Transportation", type: "expense" };
  if (/rent|housing|maintenance|society|pg |hostel/.test(d)) return { category: "Housing", type: "expense" };
  if (/amazon|flipkart|myntra|meesho|nykaa|ajio|tatacliq/.test(d)) return { category: "Shopping", type: "expense" };
  if (/netflix|spotify|prime|hotstar|youtube|jio cinema|zee5/.test(d)) return { category: "Entertainment", type: "expense" };
  if (/hospital|clinic|pharmacy|medplus|apollo|health/.test(d)) return { category: "Healthcare", type: "expense" };
  if (/school|college|university|course|udemy|coursera|fees/.test(d)) return { category: "Education", type: "expense" };
  if (/salary|credited by|neft cr|imps cr|credit by|sal cr|opening bal/.test(d)) return { category: "Income", type: "income" };
  if (/atm|cash withdrawal|cash wdl/.test(d)) return { category: "Other", type: "expense" };
  if (/electric|water|gas|broadband|internet|jio|airtel|bsnl/.test(d)) return { category: "Utilities", type: "expense" };
  return { category: "Uncategorized", type: "expense" };
}

function detectColumns(headers: string[]): ColumnMap {
  const h = headers.map((s) => s.toLowerCase().trim());
  const find = (keywords: string[]) => {
    for (const kw of keywords) {
      const idx = h.findIndex((col) => col.includes(kw));
      if (idx !== -1) return idx;
    }
    return null;
  };
  return {
    dateCol: find(["txn date", "value date", "transaction date", "date"]),
    descCol: find(["narration", "particulars", "description", "remarks", "details", "trans details"]),
    debitCol: find(["debit", "withdrawal", "dr", "amount (dr)", "amount(dr)"]),
    creditCol: find(["credit", "deposit", "cr", "amount (cr)", "amount(cr)"]),
    amountCol: find(["amount"]),
  };
}

function parseDate(raw: string): string {
  if (!raw) return "";
  const cleaned = raw.trim();
  const ddmm = cleaned.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
  if (ddmm) {
    const [, d, m, y] = ddmm;
    const year = y.length === 2 ? `20${y}` : y;
    return `${year}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const yyyymmdd = cleaned.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
  if (yyyymmdd) {
    const [, y, m, d] = yyyymmdd;
    return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  try {
    const dt = new Date(cleaned);
    if (!isNaN(dt.getTime())) return dt.toISOString().split("T")[0];
  } catch {
    /* ignore */
  }
  return cleaned;
}

function parseAmount(raw: string): number {
  if (!raw) return 0;
  const cleaned = raw.replace(/[₹$€£,\s]/g, "").trim();
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : Math.abs(n);
}

function rowsToTransactions(rows: string[][], map: ColumnMap): ParsedRow[] {
  const result: ParsedRow[] = [];
  for (const row of rows) {
    const dateRaw = map.dateCol !== null ? row[map.dateCol] ?? "" : "";
    const date = parseDate(dateRaw);
    if (!date) continue;

    const descRaw = map.descCol !== null ? row[map.descCol] ?? "" : "";
    const description = descRaw.trim();

    let amount = 0;
    let type: TransactionType = "expense";

    if (map.amountCol !== null) {
      const raw = row[map.amountCol] ?? "";
      amount = parseAmount(raw);
      const signMatch = raw.replace(/[₹$€£,\s]/g, "").match(/^-/);
      if (signMatch) {
        type = "expense";
      } else {
        const { type: t } = autoCategory(description);
        type = t;
      }
    } else {
      const debitAmt = map.debitCol !== null ? parseAmount(row[map.debitCol] ?? "") : 0;
      const creditAmt = map.creditCol !== null ? parseAmount(row[map.creditCol] ?? "") : 0;
      if (debitAmt > 0) {
        amount = debitAmt;
        type = "expense";
      } else if (creditAmt > 0) {
        amount = creditAmt;
        type = "income";
      } else {
        continue;
      }
    }

    if (amount <= 0) continue;

    const { category } = autoCategory(description);
    result.push({ date, description, amount, type, category });
  }
  return result;
}

function stringSimilarity(a: string, b: string): number {
  a = a.toLowerCase().slice(0, 40);
  b = b.toLowerCase().slice(0, 40);
  if (a === b) return 1;
  const longer = a.length > b.length ? a : b;
  const shorter = a.length > b.length ? b : a;
  if (longer.length === 0) return 1;
  let matches = 0;
  for (let i = 0; i < shorter.length; i++) {
    if (longer.includes(shorter[i])) matches++;
  }
  return matches / longer.length;
}

function checkDuplicate(row: ParsedRow, existing: Transaction[]): boolean {
  return existing.some((t) => {
    if (t.date !== row.date) return false;
    if (Math.abs(t.amount - row.amount) > 0.01) return false;
    return stringSimilarity(t.description, row.description) >= 0.8;
  });
}

const ImportBankStatement: React.FC<Props> = ({ onClose }) => {
  const { theme } = useTheme();
  const { currency } = useCurrency();
  const { addTransaction, transactions } = useTransactionsContext();
  const { pushToast } = useToast();
  const { accounts } = useAccounts();

  const [step, setStep] = useState<Step>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState<"csv" | "excel" | "pdf" | "">("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rawRows, setRawRows] = useState<string[][]>([]);
  const [colMap, setColMap] = useState<ColumnMap>({ dateCol: null, descCol: null, debitCol: null, creditCol: null, amountCol: null });
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [importedCount, setImportedCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState(accounts[0]?.id || "");
  const [pdfError, setPdfError] = useState("");
  const [needsPassword, setNeedsPassword] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [pdfPassword, setPdfPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const pdfBufRef = useRef<ArrayBuffer | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const dark = theme === "dark";
  const bg = dark ? "bg-[var(--bg-primary)]" : "bg-white";
  const border = dark ? "border-[var(--border-subtle)]" : "border-slate-200";
  const text = dark ? "text-[var(--text-primary)]" : "text-slate-900";
  const sub = dark ? "text-[var(--text-paragraph)]" : "text-slate-500";
  const inputCls = `w-full rounded-lg border ${border} px-3 py-2 text-sm ${text} ${dark ? "bg-[var(--bg-secondary)]" : "bg-white"} focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]`;

  const processFile = useCallback(async (file: File) => {
    setFileName(file.name);
    setIsProcessing(true);
    setPdfError("");

    const ext = file.name.split(".").pop()?.toLowerCase();

    try {
      if (ext === "csv") {
        setFileType("csv");
        const text = await file.text();
        const result = Papa.parse<string[]>(text, { skipEmptyLines: true });
        const allRows = result.data as string[][];
        if (allRows.length < 2) { pushToast("CSV appears empty", "warning"); return; }
        const hdrs = allRows[0];
        const rows = allRows.slice(1);
        setHeaders(hdrs);
        setRawRows(rows);
        const detected = detectColumns(hdrs);
        setColMap(detected);
        setStep("mapping");

      } else if (ext === "xlsx" || ext === "xls") {
        setFileType("excel");
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: "array", cellDates: true });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const allRows: string[][] = XLSX.utils.sheet_to_json(ws, { header: 1, raw: false, dateNF: "yyyy-mm-dd" }) as string[][];
        if (allRows.length < 2) { pushToast("Excel appears empty", "warning"); return; }
        const hdrs = allRows[0].map(String);
        const rows = allRows.slice(1).map((r) => r.map(String));
        setHeaders(hdrs);
        setRawRows(rows);
        const detected = detectColumns(hdrs);
        setColMap(detected);
        setStep("mapping");

      } else if (ext === "pdf") {
        setFileType("pdf");
        const buf = await file.arrayBuffer();
        pdfBufRef.current = buf;
        setNeedsPassword(false);
        setWrongPassword(false);
        setPdfPassword("");
        await parsePdf(buf);

      } else {
        pushToast("Unsupported file type. Use CSV, XLSX, XLS, or PDF.", "warning");
      }
    } catch (err) {
      pushToast(`Error reading file: ${err instanceof Error ? err.message : "Unknown error"}`, "warning");
    } finally {
      setIsProcessing(false);
    }
  }, [pushToast]);

  const parsePdf = async (buf: ArrayBuffer, password?: string) => {
    setPdfError("");
    try {
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(buf),
        ...(password ? { password } : {}),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let pdf: any;
      try {
        pdf = await loadingTask.promise;
      } catch (err: unknown) {
        const e = err as { name?: string; code?: number; message?: string };
        if (e?.name === "PasswordException") {
          if (e.code === 1) {
            setNeedsPassword(true);
            setWrongPassword(false);
          } else {
            setWrongPassword(true);
          }
          setIsProcessing(false);
          return;
        }
        throw err;
      }

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const items = content.items as { str: string; transform: number[] }[];
        let lastY: number | null = null;
        for (const item of items) {
          const y = Math.round(item.transform[5]);
          if (lastY !== null && Math.abs(y - lastY) > 4) fullText += "\n";
          fullText += item.str + " ";
          lastY = y;
        }
        fullText += "\n";
      }

      const lines = fullText.split("\n").map((l) => l.trim()).filter((l) => l.length > 5);
      const rows = parsePdfLines(lines);
      if (rows.length === 0) {
        setPdfError("Could not extract transactions from this PDF. Please try CSV or Excel export from your bank.");
        return;
      }
      setNeedsPassword(false);
      setWrongPassword(false);
      buildPreview(rows);
    } catch (err) {
      setPdfError(`PDF parsing failed: ${err instanceof Error ? err.message : "Unknown error"}. Please use CSV/Excel instead.`);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!pdfBufRef.current || !pdfPassword.trim()) return;
    setIsProcessing(true);
    await parsePdf(pdfBufRef.current, pdfPassword.trim());
    setIsProcessing(false);
  };

  const parsePdfLines = (lines: string[]): ParsedRow[] => {
    const dateRe = /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/;
    const amountRe = /[\d,]+\.\d{2}/g;
    const result: ParsedRow[] = [];

    for (const line of lines) {
      const dateMatch = line.match(dateRe);
      if (!dateMatch) continue;
      const date = parseDate(dateMatch[0]);
      const amounts = [...line.matchAll(amountRe)].map((m) => parseFloat(m[0].replace(/,/g, "")));
      if (amounts.length === 0) continue;

      const descPart = line.replace(dateRe, "").replace(/[\d,]+\.\d{2}/g, "").replace(/\s+/g, " ").trim();
      const description = descPart.slice(0, 80).trim();
      if (!description) continue;

      if (amounts.length >= 2) {
        const debit = amounts[amounts.length - 2];
        const credit = amounts[amounts.length - 1];
        if (debit > 0 && debit < 1e7) {
          result.push({ date, description, amount: debit, type: "expense", category: autoCategory(description).category });
        } else if (credit > 0 && credit < 1e7) {
          result.push({ date, description, amount: credit, type: "income", category: autoCategory(description).category });
        }
      } else {
        const amt = amounts[0];
        if (amt > 0 && amt < 1e7) {
          const { category, type } = autoCategory(description);
          result.push({ date, description, amount: amt, type, category });
        }
      }
    }
    return result;
  };

  const buildPreview = (parsed: ParsedRow[]) => {
    const rows: PreviewRow[] = parsed.map((r, i) => {
      const isDuplicate = checkDuplicate(r, transactions);
      return {
        ...r,
        uid: `${i}-${r.date}-${r.amount}`,
        checked: !isDuplicate,
        isDuplicate,
      };
    });
    setPreview(rows);
    setStep("preview");
  };

  const applyMapping = () => {
    setIsProcessing(true);
    try {
      const parsed = rowsToTransactions(rawRows, colMap);
      if (parsed.length === 0) {
        pushToast("No valid transactions found with current mapping. Adjust column selection.", "warning");
        return;
      }
      buildPreview(parsed);
    } catch (err) {
      pushToast(`Parse error: ${err instanceof Error ? err.message : "Unknown"}`, "warning");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = () => {
    const selected = preview.filter((r) => r.checked);
    if (selected.length === 0) { pushToast("No transactions selected", "warning"); return; }
    setIsProcessing(true);
    try {
      selected.forEach((r) => {
        const tx: Omit<Transaction, "id"> = {
          type: r.type,
          amount: r.amount,
          category: r.category,
          date: r.date,
          description: r.description,
          accountId: selectedAccountId,
          currency,
        };
        addTransaction(tx);
      });
      setImportedCount(selected.length);
      setStep("done");
    } catch (err) {
      pushToast(`Import failed: ${err instanceof Error ? err.message : "Unknown"}`, "warning");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const dupeCount = preview.filter((r) => r.isDuplicate).length;
  const newCount = preview.length - dupeCount;
  const selectedCount = preview.filter((r) => r.checked).length;

  return (
    <div className={`rounded-xl border ${border} ${bg} p-5 space-y-5`}>
      {step === "upload" && (
        <>
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-semibold ${text}`}>Import Bank Statement</h2>
            <button onClick={onClose} className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[var(--bg-tertiary)] ${sub}`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors cursor-pointer ${
              isDragging
                ? "border-[var(--brand-primary)] bg-[var(--brand-primary)]/5"
                : `${border} ${dark ? "hover:border-slate-500" : "hover:border-slate-400"}`
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.pdf"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) processFile(f); e.target.value = ""; }}
            />
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-[var(--brand-primary)] border-t-transparent rounded-full animate-spin" />
                <p className={`text-sm ${sub}`}>Reading file…</p>
              </div>
            ) : (
              <>
                <div className="flex justify-center gap-3 mb-3">
                  <FileText className={`w-8 h-8 ${sub}`} />
                  <FileSpreadsheet className={`w-8 h-8 ${sub}`} />
                </div>
                <p className={`text-sm font-medium ${text}`}>Drop your bank statement here</p>
                <p className={`text-xs mt-1 ${sub}`}>Supports CSV, Excel (.xlsx / .xls), and PDF</p>
                <span className={`inline-block mt-3 px-4 py-1.5 rounded-lg text-xs font-medium border ${border} ${text} hover:opacity-80`}>
                  Browse file
                </span>
              </>
            )}
          </div>

          {needsPassword && (
            <div className={`rounded-xl border ${border} p-4 space-y-3 ${dark ? "bg-[var(--bg-secondary)]" : "bg-slate-50"}`}>
              <div className="flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-amber-500" />
                <p className={`text-sm font-medium ${text}`}>PDF is password protected</p>
              </div>
              <p className={`text-xs ${sub}`}>
                {wrongPassword
                  ? "⚠️ Incorrect password — please try again."
                  : "Enter the password your bank uses to protect this statement. It stays on your device."}
              </p>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={pdfPassword}
                  onChange={(e) => setPdfPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                  placeholder="Enter PDF password"
                  autoFocus
                  className={`w-full rounded-lg border ${wrongPassword ? "border-red-400 dark:border-red-600" : border} px-3 py-2 pr-10 text-sm ${text} ${dark ? "bg-[var(--bg-primary)]" : "bg-white"} focus:outline-none focus:ring-2 ${wrongPassword ? "focus:ring-red-400" : "focus:ring-[var(--brand-primary)]"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 ${sub} hover:opacity-80`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                onClick={handlePasswordSubmit}
                disabled={isProcessing || !pdfPassword.trim()}
                className="w-full px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
              >
                {isProcessing ? "Unlocking…" : "Unlock & Parse"}
              </button>
              <p className={`text-xs ${sub}`}>
                Tip: Most Indian bank PDFs use your date of birth (DDMMYYYY) or account number as the password.
              </p>
            </div>
          )}

          {pdfError && !needsPassword && (
            <div className="flex gap-2 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800 dark:text-amber-300">{pdfError}</p>
            </div>
          )}

          <div className={`rounded-lg p-3 text-xs ${sub} ${dark ? "bg-[var(--bg-secondary)]" : "bg-slate-50"} space-y-1`}>
            <p className="font-medium text-green-600 dark:text-green-400">🔒 Privacy first</p>
            <p>Your file is processed entirely on your device. Nothing is uploaded to any server.</p>
            <p className="mt-1">Works with statements from: <span className={`font-medium ${text}`}>HDFC, SBI, ICICI, Axis, Kotak, Yes Bank, IDFC First,</span> and most Indian banks that export CSV or Excel.</p>
          </div>
        </>
      )}

      {step === "mapping" && (
        <>
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-semibold ${text}`}>Map Columns</h2>
            <button onClick={onClose} className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[var(--bg-tertiary)] ${sub}`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className={`text-xs ${sub}`}>
            File: <span className={`font-medium ${text}`}>{fileName}</span>
            {" · "}We detected {rawRows.length} rows. Verify the column mappings below.
          </p>

          <div className="space-y-3">
            <div>
              <label className={`block text-xs font-medium ${text} mb-1`}>Account</label>
              <select value={selectedAccountId} onChange={(e) => setSelectedAccountId(e.target.value)} className={inputCls}>
                {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            {(
              [
                { label: "Date column *", key: "dateCol" },
                { label: "Description column *", key: "descCol" },
                { label: "Debit / Withdrawal column", key: "debitCol" },
                { label: "Credit / Deposit column", key: "creditCol" },
                { label: "Amount column (single, use instead of Debit/Credit)", key: "amountCol" },
              ] as { label: string; key: keyof ColumnMap }[]
            ).map(({ label, key }) => (
              <div key={key}>
                <label className={`block text-xs font-medium ${text} mb-1`}>{label}</label>
                <div className="relative">
                  <select
                    value={colMap[key] ?? ""}
                    onChange={(e) => setColMap((prev) => ({ ...prev, [key]: e.target.value !== "" ? parseInt(e.target.value) : null }))}
                    className={inputCls + " appearance-none pr-8"}
                  >
                    <option value="">— Not mapped —</option>
                    {headers.map((h, i) => <option key={i} value={i}>{h || `Column ${i + 1}`}</option>)}
                  </select>
                  <ChevronDown className={`absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 ${sub} pointer-events-none`} />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep("upload")}
              className={`flex-1 px-4 py-2 rounded-lg border ${border} text-sm font-medium ${text} hover:opacity-80`}
            >
              Back
            </button>
            <button
              onClick={applyMapping}
              disabled={isProcessing || colMap.dateCol === null || colMap.descCol === null}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? "Parsing…" : "Preview transactions"}
            </button>
          </div>
        </>
      )}

      {step === "preview" && (
        <>
          <div className="flex items-center justify-between">
            <h2 className={`text-base font-semibold ${text}`}>Preview</h2>
            <button onClick={onClose} className={`p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[var(--bg-tertiary)] ${sub}`}>
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className={`flex flex-wrap gap-3 p-3 rounded-lg text-xs ${dark ? "bg-[var(--bg-secondary)]" : "bg-slate-50"}`}>
            <span className={text}>Found <strong>{preview.length}</strong> transactions</span>
            <span className="text-green-600 dark:text-green-400">✓ {newCount} new</span>
            {dupeCount > 0 && <span className="text-amber-600 dark:text-amber-400">⚠ {dupeCount} possible duplicates</span>}
          </div>

          <div className={`rounded-lg border ${border} overflow-hidden`}>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-xs">
                <thead className={`sticky top-0 ${dark ? "bg-[var(--bg-tertiary)]" : "bg-slate-50"}`}>
                  <tr>
                    <th className={`px-3 py-2 text-left font-medium ${sub} w-8`}>
                      <input
                        type="checkbox"
                        checked={preview.length > 0 && preview.every((r) => r.checked)}
                        onChange={(e) => setPreview((prev) => prev.map((r) => ({ ...r, checked: e.target.checked })))}
                        className="rounded"
                      />
                    </th>
                    <th className={`px-3 py-2 text-left font-medium ${sub}`}>Date</th>
                    <th className={`px-3 py-2 text-left font-medium ${sub}`}>Description</th>
                    <th className={`px-3 py-2 text-left font-medium ${sub}`}>Amount</th>
                    <th className={`px-3 py-2 text-left font-medium ${sub}`}>Category</th>
                    <th className={`px-3 py-2 text-left font-medium ${sub}`}>Type</th>
                    <th className={`px-3 py-2 text-left font-medium ${sub}`}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr
                      key={row.uid}
                      className={`border-t ${border} ${
                        row.isDuplicate
                          ? dark ? "bg-amber-900/10" : "bg-amber-50"
                          : i % 2 === 0 ? "" : dark ? "bg-[var(--bg-secondary)]/40" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="px-3 py-1.5">
                        <input
                          type="checkbox"
                          checked={row.checked}
                          onChange={(e) => setPreview((prev) => prev.map((r) => r.uid === row.uid ? { ...r, checked: e.target.checked } : r))}
                          className="rounded"
                        />
                      </td>
                      <td className={`px-3 py-1.5 whitespace-nowrap ${text}`}>{row.date}</td>
                      <td className={`px-3 py-1.5 max-w-[160px] truncate ${text}`} title={row.description}>{row.description}</td>
                      <td className={`px-3 py-1.5 whitespace-nowrap font-medium ${row.type === "income" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
                        {row.type === "income" ? "+" : "-"}{row.amount.toFixed(2)}
                      </td>
                      <td className="px-3 py-1.5">
                        <div className="relative">
                          <select
                            value={row.category}
                            onChange={(e) => setPreview((prev) => prev.map((r) => r.uid === row.uid ? { ...r, category: e.target.value } : r))}
                            className={`rounded border ${border} px-1.5 py-0.5 text-xs ${text} ${dark ? "bg-[var(--bg-secondary)]" : "bg-white"} appearance-none pr-4 max-w-[110px]`}
                          >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </td>
                      <td className="px-3 py-1.5">
                        <select
                          value={row.type}
                          onChange={(e) => setPreview((prev) => prev.map((r) => r.uid === row.uid ? { ...r, type: e.target.value as TransactionType } : r))}
                          className={`rounded border ${border} px-1.5 py-0.5 text-xs ${text} ${dark ? "bg-[var(--bg-secondary)]" : "bg-white"} appearance-none`}
                        >
                          <option value="expense">Expense</option>
                          <option value="income">Income</option>
                        </select>
                      </td>
                      <td className="px-3 py-1.5">
                        {row.isDuplicate ? (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400">
                            <AlertTriangle className="w-3 h-3" /> Dupe
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400">
                            <CheckCircle2 className="w-3 h-3" /> New
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className={`text-xs ${sub}`}>
            {selectedCount} of {preview.length} transactions selected
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setStep(fileType === "pdf" ? "upload" : "mapping")}
              className={`flex-1 px-4 py-2 rounded-lg border ${border} text-sm font-medium ${text} hover:opacity-80`}
            >
              Back
            </button>
            <button
              onClick={handleImport}
              disabled={isProcessing || selectedCount === 0}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 disabled:opacity-50 transition-colors"
            >
              {isProcessing ? "Importing…" : `Import ${selectedCount} transaction${selectedCount !== 1 ? "s" : ""}`}
            </button>
          </div>
        </>
      )}

      {step === "done" && (
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />
          <div>
            <h2 className={`text-base font-semibold ${text}`}>Import complete!</h2>
            <p className={`text-sm mt-1 ${sub}`}>{importedCount} transaction{importedCount !== 1 ? "s" : ""} added to Spendory.</p>
          </div>
          <div className="flex gap-2 justify-center">
            <button
              onClick={() => { setStep("upload"); setPreview([]); setRawRows([]); setHeaders([]); setFileName(""); setPdfError(""); }}
              className={`px-4 py-2 rounded-lg border ${border} text-sm font-medium ${text} hover:opacity-80`}
            >
              Import more
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-medium hover:opacity-90 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportBankStatement;
