import { Transaction } from "../types";

export interface ColumnMapping {
  date: number | null;
  amount: number | null;
  type: number | null;
  category: number | null;
  description: number | null;
}

export interface ParsedRow {
  [key: string]: string;
}

export interface ImportResult {
  success: boolean;
  importedCount: number;
  errors: ImportError[];
  preview: Transaction[];
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
  value?: string;
}

const VALID_TYPES = ["income", "expense"];
const DEFAULT_CATEGORIES = [
  "housing", "utilities", "transport", "groceries", "dining", "personal",
  "health", "insurance", "debt", "savings", "entertainment", "subscriptions",
  "clothing", "household", "gifts", "travel", "income", "other"
];

/**
 * Parse CSV text into rows
 */
export function parseCsvText(csvText: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = "";
      }
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
    } else {
      currentCell += char;
    }
  }

  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Auto-detect column mapping from header row
 */
export function autoDetectMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    date: null,
    amount: null,
    type: null,
    category: null,
    description: null
  };

  const lowerHeaders = headers.map(h => h.toLowerCase());

  lowerHeaders.forEach((header, index) => {
    if (!header) return;

    if (
      header.includes("date") ||
      header.includes("transaction date") ||
      header === "posted"
    ) {
      mapping.date = index;
    } else if (
      header.includes("amount") ||
      header.includes("value") ||
      header === "price"
    ) {
      mapping.amount = index;
    } else if (
      header.includes("type") ||
      header.includes("transaction type")
    ) {
      mapping.type = index;
    } else if (
      header.includes("category") ||
      header.includes("merchant") ||
      header.includes("tag")
    ) {
      mapping.category = index;
    } else if (
      header.includes("description") ||
      header.includes("note") ||
      header.includes("memo") ||
      header.includes("details")
    ) {
      mapping.description = index;
    }
  });

  return mapping;
}

/**
 * Validate and parse date string
 */
function parseDate(dateStr: string): string | null {
  if (!dateStr) return null;

  // Try common date formats
  const formats = [
    // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}$/,
    // DD/MM/YYYY or MM/DD/YYYY
    /^\d{1,2}[/\-]\d{1,2}[/\-]\d{4}$/,
    // DD-MM-YYYY
    /^\d{2}-\d{2}-\d{4}$/
  ];

  for (const format of formats) {
    if (format.test(dateStr)) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0];
      }
    }
  }

  // Try parsing flexible format
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  return null;
}

/**
 * Validate and parse amount
 */
function parseAmount(amountStr: string): number | null {
  const cleaned = amountStr.replace(/[^\d\.\-]/g, "");
  const num = parseFloat(cleaned);
  return !isNaN(num) && num !== 0 ? Math.abs(num) : null;
}

/**
 * Normalize category
 */
function normalizeCategory(categoryStr: string): string {
  const normalized = categoryStr.toLowerCase().trim();

  if (DEFAULT_CATEGORIES.includes(normalized)) {
    return normalized;
  }

  // Try to find closest match
  for (const cat of DEFAULT_CATEGORIES) {
    if (normalized.includes(cat) || cat.includes(normalized)) {
      return cat;
    }
  }

  return "other";
}

/**
 * Import CSV with column mapping
 */
export function importCsv(
  csvText: string,
  mapping: ColumnMapping,
  accountId: string,
  currency: string,
  maxTransactions: number = 50
): ImportResult {
  const rows = parseCsvText(csvText);
  const errors: ImportError[] = [];
  const transactions: Transaction[] = [];

  if (rows.length === 0) {
    return {
      success: false,
      importedCount: 0,
      errors: [{ row: 0, field: "general", message: "CSV file is empty" }],
      preview: []
    };
  }

  // Check if we have required mappings
  if (
    mapping.date === null ||
    mapping.amount === null ||
    mapping.category === null
  ) {
    return {
      success: false,
      importedCount: 0,
      errors: [
        {
          row: 0,
          field: "mapping",
          message:
            "Please map Date, Amount, and Category columns"
        }
      ],
      preview: []
    };
  }

  // Process data rows (skip header)
  for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];

    try {
      const dateStr = row[mapping.date];
      const amountStr = row[mapping.amount];
      const categoryStr = row[mapping.category];
      const typeStr = mapping.type !== null ? row[mapping.type] : "";
      const descStr = mapping.description !== null ? row[mapping.description] : "";

      // Validate required fields
      if (!dateStr) {
        errors.push({
          row: rowIndex + 1,
          field: "date",
          message: "Date is required"
        });
        continue;
      }

      if (!amountStr) {
        errors.push({
          row: rowIndex + 1,
          field: "amount",
          message: "Amount is required"
        });
        continue;
      }

      if (!categoryStr) {
        errors.push({
          row: rowIndex + 1,
          field: "category",
          message: "Category is required"
        });
        continue;
      }

      // Parse and validate values
      const date = parseDate(dateStr);
      if (!date) {
        errors.push({
          row: rowIndex + 1,
          field: "date",
          message: `Invalid date format: ${dateStr}`,
          value: dateStr
        });
        continue;
      }

      const amount = parseAmount(amountStr);
      if (amount === null || amount <= 0) {
        errors.push({
          row: rowIndex + 1,
          field: "amount",
          message: `Invalid amount: ${amountStr}`,
          value: amountStr
        });
        continue;
      }

      const type = typeStr &&
        VALID_TYPES.includes(typeStr.toLowerCase())
        ? (typeStr.toLowerCase() as "income" | "expense")
        : "expense";

      const category = normalizeCategory(categoryStr);

      const transaction: Transaction = {
        id: `import-${Date.now()}-${rowIndex}`,
        type,
        amount,
        category,
        date,
        description: descStr || "",
        accountId,
        currency,
        tags: []
      };

      transactions.push(transaction);

      // Check free tier limit
      if (transactions.length >= maxTransactions) {
        break;
      }
    } catch (error) {
      errors.push({
        row: rowIndex + 1,
        field: "general",
        message: `Error processing row: ${error instanceof Error ? error.message : "Unknown error"}`
      });
    }
  }

  return {
    success: transactions.length > 0,
    importedCount: transactions.length,
    errors,
    preview: transactions
  };
}
