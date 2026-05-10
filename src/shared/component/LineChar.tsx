/*
 * LineChar — Reusable line chart component built on Recharts.
 *
 * Usage:
 *   import LineChar from "../../shared/component/LineChar";
 *
 *   <LineChar
 *     period="month"          // "day" | "week" | "month" | "year"
 *     data={[
 *       { date: "01", income: 3000, expense: 1200 },
 *       { date: "02", income: 2500, expense: 900 },
 *     ]}
 *     lines={[
 *       { dataKey: "income", name: "Income", color: "#22c55e" },
 *       { dataKey: "expense", name: "Expense", color: "#ef4444" },
 *     ]}
 *   />
 */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { Period } from "./BarChar";

export type LineConfig = {
  dataKey: string;
  name: string;
  color: string;
};

type LineCharProps = {
  lines: LineConfig[];
  data: Record<string, unknown>[];
  period: Period;
};

const xAxisKeyMap: Record<Period, string> = {
  day: "hour",
  week: "day",
  month: "date",
  year: "month",
};

const LineChar = ({ lines, data, period }: LineCharProps) => {
  const xAxisKey = xAxisKeyMap[period];

  return (
    <div className="mb-4">
      <div className="flex justify-end gap-4 mb-4">
        {lines.map((line) => (
          <span key={line.dataKey} className="flex items-center gap-1.5 text-sm text-gray-600">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: line.color }} />
            {line.name}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          {lines.map((line) => (
            <Line
              key={line.dataKey}
              type="monotone"
              dataKey={line.dataKey}
              name={line.name}
              stroke={line.color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChar;
