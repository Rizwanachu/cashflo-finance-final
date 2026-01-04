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
 * Export analytics to CSV with Summary and Breakdown
 */
export function exportTransactionsToCsv(
  transactions: Transaction[],
  currency: CurrencyCode
) {
  if (transactions.length === 0) {
    return;
  }

  const symbol = getCurrencySymbol(currency);
  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Summary Data
  const totalIncome = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  
  const summaryHeader = ["Summary", "Value"];
  const summaryRows = [
    ["Total Income", `${symbol}${totalIncome.toFixed(2)}`],
    ["Total Expense", `${symbol}${totalExpense.toFixed(2)}`],
    ["Net Balance", `${symbol}${(totalIncome - totalExpense).toFixed(2)}`],
    ["", ""]
  ];

  // Category Breakdown
  const catTotals: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });
  
  const breakdownHeader = ["Category Breakdown", "Amount", "% of Total"];
  const breakdownRows = Object.entries(catTotals).map(([cat, amt]) => [
    cat.charAt(0).toUpperCase() + cat.slice(1),
    amt.toFixed(2),
    `${((amt / totalExpense) * 100).toFixed(1)}%`
  ]);
  breakdownRows.push(["", "", ""]);

  // Transactions Detail
  const detailHeader = ["Date", "Type", "Category", `Amount (${symbol})`, "Note"];
  const detailRows = transactions.map((t) => [
    formatDateForCsv(t.date),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category.charAt(0).toUpperCase() + t.category.slice(1),
    t.amount.toString(),
    t.description || ""
  ]);

  const csvContent = [
    summaryHeader.join(","),
    ...summaryRows.map(r => r.map(escapeCsvValue).join(",")),
    breakdownHeader.join(","),
    ...breakdownRows.map(r => r.map(escapeCsvValue).join(",")),
    detailHeader.join(","),
    ...detailRows.map(r => r.map(escapeCsvValue).join(","))
  ].join("\n");

  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `analytics-${datePart}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to PDF with Summary
 */
export function exportTransactionsToPdf(
  transactions: Transaction[],
  currency: CurrencyCode,
  theme: "light" | "dark"
) {
  if (transactions.length === 0) {
    return;
  }

  const doc = new jsPDF();
  const now = new Date();
  const datePart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Set theme colors
  const textColor: [number, number, number] = [15, 23, 42]; 
  const secondaryTextColor: [number, number, number] = [100, 116, 139];

  // Title
  doc.setFontSize(22);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Analytics Report", 14, 20);

  // Date generated
  doc.setFontSize(10);
  doc.setTextColor(secondaryTextColor[0], secondaryTextColor[1], secondaryTextColor[2]);
  doc.text(
    `Generated: ${now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })}`,
    14,
    28
  );

  // --- Summary Section ---
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;
  const currencySymbol = getCurrencySymbol(currency);

  doc.setFontSize(14);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Executive Summary", 14, 42);

  doc.setFontSize(10);
  doc.text(`Total Income:`, 14, 52);
  doc.text(`${currencySymbol}${totalIncome.toFixed(2)}`, 60, 52);
  
  doc.text(`Total Expenses:`, 14, 58);
  doc.text(`${currencySymbol}${totalExpense.toFixed(2)}`, 60, 58);

  doc.setFont("helvetica", "bold");
  doc.text(`Net Balance:`, 14, 66);
  doc.text(`${currencySymbol}${balance.toFixed(2)}`, 60, 66);
  doc.setFont("helvetica", "normal");

  // --- Category Breakdown ---
  const catTotals: Record<string, number> = {};
  transactions.filter(t => t.type === "expense").forEach(t => {
    catTotals[t.category] = (catTotals[t.category] || 0) + t.amount;
  });

  const breakdownData = Object.entries(catTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => [
      cat.charAt(0).toUpperCase() + cat.slice(1),
      `${currencySymbol}${amt.toFixed(2)}`,
      `${((amt / totalExpense) * 100).toFixed(1)}%`
    ]);

  autoTable(doc, {
    head: [["Category", "Amount", "% of Expenses"]],
    body: breakdownData,
    startY: 75,
    margin: { left: 14 },
    tableWidth: 100,
    headStyles: { fillColor: [51, 65, 85] },
    styles: { fontSize: 9 }
  });

  // --- Transactions Detail ---
  doc.addPage();
  doc.setFontSize(14);
  doc.text("Detailed Transactions", 14, 20);

  const tableData = transactions.map((t) => [
    new Date(t.date + "T00:00:00").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category.charAt(0).toUpperCase() + t.category.slice(1),
    `${currencySymbol}${t.amount.toFixed(2)}`,
    t.description || "-"
  ]);

  autoTable(doc, {
    head: [["Date", "Type", "Category", "Amount", "Note"]],
    body: tableData,
    startY: 25,
    theme: "striped",
    headStyles: { fillColor: [15, 23, 42] },
    styles: { fontSize: 8 }
  });

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



