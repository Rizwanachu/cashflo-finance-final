import React, { useMemo } from "react";
import { Transaction } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { useCurrency } from "../../context/CurrencyContext";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  Legend as RechartsLegend,
  XAxis,
  YAxis
} from "recharts";

interface Props {
  transactions: Transaction[];
}

const MonthlyComparisonChart: React.FC<Props> = ({ transactions }) => {
  const { theme } = useTheme();
  const { symbol } = useCurrency();
  const data = useMemo(() => {
    const now = new Date();
    const months: { key: string; label: string }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now);
      d.setMonth(now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
        2,
        "0"
      )}`;
      const label = d.toLocaleDateString(undefined, {
        month: "short",
        year: i === 0 ? undefined : "2-digit"
      });
      months.push({ key, label });
    }

    const byMonth: Record<
      string,
      { income: number; expenses: number }
    > = {};
    months.forEach((m) => {
      byMonth[m.key] = { income: 0, expenses: 0 };
    });

    transactions.forEach((t) => {
      const key = t.date.slice(0, 7);
      if (!byMonth[key]) return;
      if (t.type === "income") {
        byMonth[key].income += t.amount;
      } else {
        byMonth[key].expenses += t.amount;
      }
    });

    return months.map((m) => ({
      month: m.label,
      income: Math.round(byMonth[m.key]?.income ?? 0),
      expenses: Math.round(byMonth[m.key]?.expenses ?? 0)
    }));
  }, [transactions]);

  return (
    <div className="rounded-2xl bg-white dark:bg-[var(--bg-tertiary)] border border-slate-200 dark:border-[var(--border-subtle)] p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[var(--text-primary)]">
          Monthly income vs expenses
        </h3>
        <span className="text-[11px] text-slate-500 dark:text-[var(--text-muted)]">Last 6 months</span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === "dark" ? "#1F2A27" : "#E2E8F0"}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke={theme === "dark" ? "#A8B8B2" : "#334155"}
              tick={{ fill: theme === "dark" ? "#A8B8B2" : "#334155" }}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis
              stroke={theme === "dark" ? "#A8B8B2" : "#334155"}
              tick={{ fill: theme === "dark" ? "#A8B8B2" : "#334155" }}
              tickLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                `${symbol}${Number(value).toLocaleString(undefined, {
                  maximumFractionDigits: 0
                })}`
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: theme === "dark" ? "#121817" : "#FFFFFF",
                border: `1px solid ${
                  theme === "dark" ? "#1F2A27" : "#CBD5E1"
                }`,
                borderRadius: "0.75rem",
                fontSize: "0.75rem",
                color: theme === "dark" ? "#E6F1EC" : "#0F172A"
              }}
              itemStyle={{
                color: theme === "dark" ? "#E6F1EC" : "#0F172A"
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
                color: theme === "dark" ? "#A8B8B2" : "#334155"
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#EF4444"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlyComparisonChart;



