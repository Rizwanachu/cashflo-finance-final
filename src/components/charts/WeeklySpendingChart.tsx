import React, { useMemo } from "react";
import { Transaction } from "../../types";
import { useTheme } from "../../context/ThemeContext";
import { usePrivacy } from "../../context/PrivacyContext";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface Props {
  transactions: Transaction[];
}

const WeeklySpendingChart: React.FC<Props> = ({ transactions }) => {
  const { resolvedTheme } = useTheme();
  const { privacyMode } = usePrivacy();

  const data = useMemo(() => {
    const daysBack = 6;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const map: Record<string, number> = {};
    for (let i = daysBack; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      map[key] = 0;
    }

    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        if (map[t.date] !== undefined) {
          map[t.date] += t.amount;
        }
      });

    return Object.entries(map).map(([date, amount]) => {
      const d = new Date(date + "T00:00:00");
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      return { date, day: label, amount: Math.round(amount) };
    });
  }, [transactions]);

  if (privacyMode) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-slate-400 dark:text-slate-600 text-sm font-medium">****</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full" style={{ paddingLeft: "8px", paddingRight: "8px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={resolvedTheme === "dark" ? "#1F2A27" : "#E2E8F0"}
            vertical={false}
          />
          <XAxis
            dataKey="day"
            stroke={resolvedTheme === "dark" ? "#A8B8B2" : "#334155"}
            tick={{ fill: resolvedTheme === "dark" ? "#A8B8B2" : "#334155", fontSize: 11 }}
            tickLine={false}
            tickMargin={8}
          />
          <YAxis
            stroke={resolvedTheme === "dark" ? "#A8B8B2" : "#334155"}
            tick={{ fill: resolvedTheme === "dark" ? "#A8B8B2" : "#334155", fontSize: 11 }}
            tickLine={false}
            tickMargin={8}
            width={60}
            tickFormatter={(value) =>
              `$${Number(value).toLocaleString(undefined, {
                maximumFractionDigits: 0
              })}`
            }
          />
          <Tooltip
            contentStyle={{
              backgroundColor: resolvedTheme === "dark" ? "#121817" : "#FFFFFF",
              border: `1px solid ${
                resolvedTheme === "dark" ? "#1F2A27" : "#CBD5E1"
              }`,
              borderRadius: "0.75rem",
              fontSize: "0.75rem",
              color: resolvedTheme === "dark" ? "#E6F1EC" : "#0F172A"
            }}
            itemStyle={{
              color: resolvedTheme === "dark" ? "#E6F1EC" : "#0F172A"
            }}
            formatter={(value: number) =>
              `$${value.toLocaleString(undefined, {
                maximumFractionDigits: 0
              })}`
            }
            labelFormatter={(label: string) =>
              new Date(label + "T00:00:00").toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric"
              })
            }
          />
          <Bar
            dataKey="amount"
            fill={resolvedTheme === "dark" ? "#BFEBD6" : "#EF4444"}
            radius={[8, 8, 4, 4]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklySpendingChart;



