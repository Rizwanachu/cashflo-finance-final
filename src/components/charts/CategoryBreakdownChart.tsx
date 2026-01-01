import React, { useMemo } from "react";
import { Transaction } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";

interface Props {
  transactions: Transaction[];
}

const LIGHT_COLORS = ["#10B981", "#EF4444", "#F59E0B", "#6366F1", "#0EA5E9"];
const DARK_COLORS = ["#10B981", "#EF4444", "#F59E0B", "#6366F1", "#0EA5E9"];

const categoryLabel: Record<string, string> = {
  rent: "Rent / Mortgage",
  food: "Food & Dining",
  transport: "Transport",
  utilities: "Utilities",
  misc: "Miscellaneous"
};

const CategoryBreakdownChart: React.FC<Props> = ({ transactions }) => {
  const { theme } = useTheme();
  const { symbol } = useCurrency();
  const data = useMemo(() => {
    const totals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        totals[t.category] = (totals[t.category] ?? 0) + t.amount;
      });

    const entries = Object.entries(totals).map(([cat, amt]) => ({
      name: categoryLabel[cat] ?? cat,
      value: Math.round(amt)
    }));

    return entries.length
      ? entries
      : [{ name: "No expenses yet", value: 1 }];
  }, [transactions]);

  return (
    <div className="rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[var(--text-primary)]">
          Category breakdown
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-[var(--text-muted)]">Expenses only</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={
                    (theme === "dark" ? DARK_COLORS : LIGHT_COLORS)[
                      index % LIGHT_COLORS.length
                    ]
                  }
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "var(--bg-secondary)" : "#FFFFFF",
                border: `1px solid ${
                  theme === "dark" ? "var(--border-subtle)" : "#CBD5E1"
                }`,
                borderRadius: "0.75rem",
                fontSize: "0.75rem",
                color: theme === "dark" ? "var(--text-primary)" : "#0F172A"
              }}
              itemStyle={{
                color: theme === "dark" ? "var(--text-primary)" : "#0F172A"
              }}
              formatter={(value: number) =>
                `${symbol}${value.toLocaleString(undefined, {
                  maximumFractionDigits: 0
                })}`
              }
            />
            <Legend
              wrapperStyle={{
                fontSize: "0.7rem",
                color: theme === "dark" ? "var(--text-secondary)" : "#334155"
              }}
              iconType="circle"
              verticalAlign="bottom"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CategoryBreakdownChart;



