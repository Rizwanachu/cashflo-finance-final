import { Transaction } from "../types";
import { CurrencyCode } from "../context/CurrencyContext";
import { RecurringPayment } from "../context/RecurringContext";
import { Budgets } from "../context/BudgetContext";
import { Category } from "../context/CategoriesContext";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Format date for CSV export (readable format for Excel/Sheets)
 */
function formatDateForCsv(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

/**
 * Escape CSV value (handles commas, quotes, newlines)
 */
function escapeCsvValue(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function getCurrencySymbol(currency: CurrencyCode): string {
  switch (currency) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    case "INR": return "Rs."; // Using "Rs." instead of "₹" for better PDF font support
    case "JPY": return "¥";
    case "BRL": return "R$";
    case "CAD": return "C$";
    case "AUD": return "A$";
    default: return "$";
  }
}

/**
 * Export transactions to CSV (Legacy wrapper for compatibility)
 */
export function exportTransactionsToCsv(
  transactions: Transaction[],
  currency: CurrencyCode
) {
  // Pass empty budgets and categories to the enhanced exporter
  exportAnalyticsToCsv(transactions, { overall: null, perCategory: {} }, [], currency);
}

/**
 * Export transactions to PDF (Legacy wrapper for compatibility)
 */
export function exportTransactionsToPdf(
  transactions: Transaction[],
  currency: CurrencyCode,
  theme: "light" | "dark"
) {
  // Pass empty budgets and categories to the enhanced exporter
  exportAnalyticsToPdf(transactions, { overall: null, perCategory: {} }, [], currency);
}

/**
 * Export analytics to CSV with multiple files simulated in one download
 * Since we can't easily trigger multiple downloads without browser interference,
 * we combine them into a single structured CSV with sections.
 */
export function exportAnalyticsToCsv(
  transactions: Transaction[],
  budgets: Budgets,
  categories: Category[],
  currency: CurrencyCode
) {
  if (transactions.length === 0) return;

  const symbol = getCurrencySymbol(currency);
  const now = new Date();
  const datePart = now.toISOString().split('T')[0];

  const escape = escapeCsvValue;

  // 0) Year-to-Date Summary
  const currentYear = now.getFullYear();
  const ytdTransactions = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
  const ytdIncome = ytdTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const ytdExpenses = ytdTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const ytdNet = ytdIncome - ytdExpenses;

  const ytdHeader = [`Year-to-Date Summary (${currentYear})`, "", ""];
  const ytdRows = [
    ["Total Income", symbol + ytdIncome.toFixed(2)],
    ["Total Expenses", symbol + ytdExpenses.toFixed(2)],
    ["Net Balance", symbol + ytdNet.toFixed(2)]
  ];

  // 1) Category Breakdown
  const catTotals: Record<string, { amt: number; count: number }> = {};
  const expenseTransactions = transactions.filter(t => t.type === "expense");
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  expenseTransactions.forEach(t => {
    if (!catTotals[t.category]) {
      catTotals[t.category] = { amt: 0, count: 0 };
    }
    catTotals[t.category].amt += t.amount;
    catTotals[t.category].count += 1;
  });

  const breakdownHeader = ["Category Breakdown", "", "", ""];
  const breakdownSubHeader = ["Category Name", "Amount Spent", "Percentage of Total Expenses", "Tags"];
  const breakdownRows = Object.entries(catTotals)
    .sort((a, b) => b[1].amt - a[1].amt)
    .map(([catId, data]) => {
      const catName = categories.find(c => c.id === catId)?.name || catId;
      return [
        catName,
        data.amt.toFixed(2),
        `${((data.amt / totalExpense) * 100).toFixed(1)}%`,
        "N/A"
      ];
    });
  breakdownRows.push(["Total Expenses", totalExpense.toFixed(2), "100.0%", "N/A"]);

  // 2) Monthly Summary
  const monthlyData: Record<string, { inc: number; exp: number }> = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) monthlyData[month] = { inc: 0, exp: 0 };
    if (t.type === "income") monthlyData[month].inc += t.amount;
    else monthlyData[month].exp += t.amount;
  });

  const monthlyHeader = ["Monthly Summary", "", "", ""];
  const monthlySubHeader = ["Month (YYYY-MM)", "Income", "Expenses", "Net"];
  const monthlyRows = Object.entries(monthlyData)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([month, data]) => [
      month,
      data.inc.toFixed(2),
      data.exp.toFixed(2),
      (data.inc - data.exp).toFixed(2)
    ]);
  const monthlyNote = ["Values are aggregated from recorded transactions.", "", "", ""];

  // 3) Budget Performance
  const budgetHeader = ["Budget Performance", "", "", "", "", "", ""];
  const budgetSubHeader = ["categoryId", "categoryName", "budgetLimit", "spent", "remaining", "status", "tags"];
  const budgetRows: string[][] = [];
  
  Object.entries(budgets.perCategory).forEach(([catId, limit]) => {
    if (limit !== null) {
      const cat = categories.find(c => c.id === catId);
      const spent = catTotals[catId]?.amt || 0;
      const remaining = limit - spent;
      budgetRows.push([
        catId,
        cat?.name || catId,
        limit.toFixed(2),
        spent.toFixed(2),
        remaining.toFixed(2),
        spent > limit ? "exceeded" : "within",
        "N/A"
      ]);
    }
  });

  const sections = [
    ["REPORT METADATA"],
    ["appName", "Spendory"],
    ["reportType", "Analytics Report"],
    ["generatedAt", now.toLocaleString()],
    ["currency", currency],
    [""],
    ytdHeader,
    ...ytdRows,
    [""],
    breakdownHeader,
    breakdownSubHeader,
    ...breakdownRows,
    [""],
    monthlyHeader,
    monthlySubHeader,
    ...monthlyRows,
    monthlyNote,
    [""],
    budgetHeader,
    budgetSubHeader,
    ...budgetRows,
    [""],
    ["FOOTER"],
    ["All data is stored locally on your device."],
    ["Charts visible in the app are not included in exports."]
  ];

  const csvContent = sections
    .map(row => row.map(cell => escape(String(cell))).join(","))
    .join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `analytics-report-${datePart}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Enhanced PDF Export based on spec
 */
export function exportAnalyticsToPdf(
  transactions: Transaction[],
  budgets: Budgets,
  categories: Category[],
  currency: CurrencyCode
) {
  if (transactions.length === 0) return;

  const doc = new jsPDF();
  const now = new Date();
  const datePart = now.toISOString().split('T')[0];
  const symbol = getCurrencySymbol(currency);

  // Data Processing
  const currentYear = now.getFullYear();
  const ytdTransactions = transactions.filter(t => new Date(t.date).getFullYear() === currentYear);
  const ytdIncome = ytdTransactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const ytdExpenses = ytdTransactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const ytdNet = ytdIncome - ytdExpenses;

  const expenseTransactions = transactions.filter(t => t.type === "expense");
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

  const dateOptions: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  };
  const formattedDate = now.toLocaleString("en-GB", dateOptions).replace(",", "");

  // Report Header
  doc.setFontSize(22);
  doc.setTextColor(0);
  doc.text("Spendory", 14, 20);
  doc.setFontSize(16);
  doc.setTextColor(100);
  doc.text("Analytics Report", 14, 30);
  doc.setFontSize(10);
  doc.text(`Generated: ${formattedDate} | Currency: ${currency}`, 14, 38);
  doc.setDrawColor(200);
  doc.line(14, 42, 196, 42);

  // 1. Year-to-Date Summary
  doc.setFontSize(16);
  doc.setTextColor(0);
  doc.text(`Year-to-Date Summary (${currentYear})`, 14, 55);

  autoTable(doc, {
    body: [
      ["Total Income", `${symbol}${ytdIncome.toFixed(2)}`],
      ["Total Expenses", `${symbol}${ytdExpenses.toFixed(2)}`],
      ["Net Balance", `${symbol}${ytdNet.toFixed(2)}`]
    ],
    startY: 60,
    theme: "grid",
    styles: { fontSize: 10 }
  });

  // 2. Category Breakdown
  doc.setFontSize(16);
  doc.text("Category Breakdown", 14, (doc as any).lastAutoTable.finalY + 15);

  const catTotals: Record<string, { amt: number }> = {};
  expenseTransactions.forEach(t => {
    if (!catTotals[t.category]) catTotals[t.category] = { amt: 0 };
    catTotals[t.category].amt += t.amount;
  });

  const breakdownTable = Object.entries(catTotals)
    .sort((a, b) => b[1].amt - a[1].amt)
    .map(([id, data]) => [
      categories.find(c => c.id === id)?.name || id,
      `${symbol}${data.amt.toFixed(2)}`,
      `${((data.amt / totalExpense) * 100).toFixed(1)}%`,
      "N/A"
    ]);
  breakdownTable.push(["Total Expenses", `${symbol}${totalExpense.toFixed(2)}`, "100.0%", "N/A"]);

  autoTable(doc, {
    head: [["Category Name", "Amount Spent", "Percentage of Total Expenses", "Tags"]],
    body: breakdownTable,
    startY: (doc as any).lastAutoTable.finalY + 20,
    theme: "grid",
    headStyles: { fillColor: [80, 80, 80] }
  });

  // 3. Monthly Summary
  doc.addPage();
  doc.setFontSize(16);
  doc.text("Monthly Summary", 14, 20);
  doc.setFontSize(9);
  doc.setTextColor(100);
  doc.text("Values are aggregated from recorded transactions.", 14, 26);
  doc.setTextColor(0);

  const monthlyData: Record<string, { inc: number; exp: number }> = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!monthlyData[month]) monthlyData[month] = { inc: 0, exp: 0 };
    if (t.type === "income") monthlyData[month].inc += t.amount;
    else monthlyData[month].exp += t.amount;
  });

  const monthlyTable = Object.entries(monthlyData)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 12)
    .map(([month, data]) => [
      month,
      `${symbol}${data.inc.toFixed(2)}`,
      `${symbol}${data.exp.toFixed(2)}`,
      `${symbol}${(data.inc - data.exp).toFixed(2)}`
    ]);

  autoTable(doc, {
    head: [["Month (YYYY-MM)", "Income", "Expenses", "Net"]],
    body: monthlyTable,
    startY: 32,
    theme: "grid",
    headStyles: { fillColor: [80, 80, 80] }
  });

  // 4. Budget Performance
  const budgetTable: string[][] = [];
  Object.entries(budgets.perCategory).forEach(([id, limit]) => {
    if (limit !== null) {
      const spent = catTotals[id]?.amt || 0;
      budgetTable.push([
        categories.find(c => c.id === id)?.name || id,
        `${symbol}${limit.toFixed(2)}`,
        `${symbol}${spent.toFixed(2)}`,
        `${spent > limit ? "Exceeded" : "Within"}`,
        "N/A"
      ]);
    }
  });

  if (budgetTable.length > 0) {
    doc.setFontSize(16);
    doc.text("Budget Performance", 14, (doc as any).lastAutoTable.finalY + 15);
    autoTable(doc, {
      head: [["Category", "Limit", "Spent", "Status", "Tags"]],
      body: budgetTable,
      startY: (doc as any).lastAutoTable.finalY + 20,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 80] }
    });
  }

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("All data is stored locally on your device. Charts visible in the app are not included in exports.", 105, 285, { align: "center" });
    doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: "center" });
  }

  doc.save(`analytics-report-${datePart}.pdf`);
}

/**
 * Export budgets to CSV
 */
export function exportBudgetsToCsv(
  budgets: Budgets,
  categories: Category[],
  spending: Record<string, number>,
  currency: CurrencyCode
) {
  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const header = ["Category", "Budget Limit", "Spent", "Remaining", "Status"];
  const rows: string[][] = [];

  // Overall budget
  if (budgets.overall !== null) {
    const spent = spending["overall"] ?? 0;
    const remaining = budgets.overall - spent;
    const status = spent >= budgets.overall ? "Over Budget" : spent >= budgets.overall * 0.8 ? "Near Limit" : "On Track";
    const symbol = getCurrencySymbol(currency);
    rows.push(["Overall", `${symbol}${budgets.overall}`, `${symbol}${spent}`, `${symbol}${remaining}`, status]);
  }

  // Category budgets
  Object.entries(budgets.perCategory).forEach(([catId, limit]) => {
    if (limit !== null) {
      const cat = categories.find(c => c.id === catId);
      const spent = spending[catId] ?? 0;
      const remaining = limit - spent;
      const status = spent >= limit ? "Over Budget" : spent >= limit * 0.8 ? "Near Limit" : "On Track";
      const symbol = getCurrencySymbol(currency);
      rows.push([cat?.name ?? catId, `${symbol}${limit}`, `${symbol}${spent}`, `${symbol}${remaining}`, status]);
    }
  });

  if (rows.length === 0) return;

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvValue(String(cell))).join(","))
    .join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `budgets-${datePart}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export recurring payments to CSV
 */
export function exportRecurringToCsv(
  payments: RecurringPayment[],
  currency: CurrencyCode
) {
  if (payments.length === 0) return;

  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const header = ["Description", "Amount", "Frequency", "Next Due Date", "Category", "Status"];
  const symbol = getCurrencySymbol(currency);
  const rows = payments.map((p) => [
    p.description,
    `${symbol}${p.amount}`,
    p.frequency.charAt(0).toUpperCase() + p.frequency.slice(1),
    formatDateForCsv(p.nextDueDate),
    p.category,
    p.isActive ? "Active" : "Paused"
  ]);

  const csvContent = [header, ...rows]
    .map((row) => row.map((cell) => escapeCsvValue(String(cell))).join(","))
    .join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `recurring-payments-${datePart}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}



