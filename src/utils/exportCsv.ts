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
    case "INR": return "₹";
    case "JPY": return "¥";
    case "BRL": return "R$";
    case "CAD": return "C$";
    case "AUD": return "A$";
    default: return "$";
  }
}

/**
 * Export transactions to CSV with properly formatted dates
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

  const rows = transactions.map((t) => [
    formatDateForCsv(t.date),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category.charAt(0).toUpperCase() + t.category.slice(1),
    t.amount.toString(),
    t.description || ""
  ]);

  const symbolStr = `Amount (${symbol})`;
  const finalHeader = ["Date", "Type", "Category", symbolStr, "Note"];

  const csvContent =
    [finalHeader, ...rows]
      .map((row) => row.map((cell) => escapeCsvValue(String(cell))).join(","))
      .join("\n");

  // Add BOM for UTF-8 to help Excel recognize encoding
  const BOM = "\uFEFF";
  const blob = new Blob([BOM + csvContent], {
    type: "text/csv;charset=utf-8"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `transactions-${datePart}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export transactions to PDF
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
  const textColor: [number, number, number] = theme === "dark" ? [248, 250, 252] : [15, 23, 42];
  const bgColor: [number, number, number] = theme === "dark" ? [2, 6, 23] : [255, 255, 255];
  const headerBgColor: [number, number, number] = theme === "dark" ? [30, 41, 59] : [241, 245, 249];
  const borderColor: [number, number, number] = theme === "dark" ? [51, 65, 85] : [226, 232, 240];

  // Title
  doc.setFontSize(18);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Transaction Report", 14, 20);

  // Date generated
  doc.setFontSize(10);
  doc.setTextColor(textColor[0] - 50, textColor[1] - 50, textColor[2] - 50);
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

  // Prepare table data
  const tableData = transactions.map((t) => [
    new Date(t.date + "T00:00:00").toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }),
    t.type.charAt(0).toUpperCase() + t.type.slice(1),
    t.category.charAt(0).toUpperCase() + t.category.slice(1),
    `${getCurrencySymbol(currency)}${t.amount.toFixed(2)}`,
    t.description || "-"
  ]);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const currencySymbol = getCurrencySymbol(currency);

  // Add table
  autoTable(doc, {
    head: [["Date", "Type", "Category", "Amount", "Note"]],
    body: tableData,
    startY: 35,
    theme: "striped",
    headStyles: {
      fillColor: theme === "dark" ? [30, 41, 59] : [15, 23, 42],
      textColor: [255, 255, 255],
      fontStyle: "bold"
    },
    alternateRowStyles: {
      fillColor: theme === "dark" ? [15, 23, 42] : [248, 250, 252]
    }
  });

  // Add totals section
  const finalY = (doc as any).lastAutoTable?.finalY || 100;
  doc.setFontSize(12);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text("Summary", 14, finalY + 15);

  doc.setFontSize(10);
  doc.text(`Total Income: ${currencySymbol}${totalIncome.toFixed(2)}`, 14, finalY + 25);
  doc.text(`Total Expense: ${currencySymbol}${totalExpense.toFixed(2)}`, 14, finalY + 32);
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.text(`Balance: ${currencySymbol}${balance.toFixed(2)}`, 14, finalY + 40);
  doc.setFont("helvetica", "normal");

  // Save PDF
  doc.save(`transactions-${datePart}.pdf`);
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



