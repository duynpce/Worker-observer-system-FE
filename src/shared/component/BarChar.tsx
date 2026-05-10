import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export type BarConfig = {
  dataKey: string;
  name: string;
  color: string;
};

export type Period = "day" | "week" | "month" | "year";

type BarCharProps = {
  bars: BarConfig[];
  data: object[];
  period: Period;
  xAxisDataKey?: string;
};

const xAxisKeyMap: Record<Period, string> = {
  day: "hour",
  week: "day",
  month: "date",
  year: "month",
};

const BarChar = ({ bars, data, period, xAxisDataKey }: BarCharProps) => {
  const xAxisKey = xAxisDataKey ?? xAxisKeyMap[period];

  return (
    <div className="mb-4">
      <div className="flex justify-end gap-4 mb-4">
        {bars.map((bar) => (
          <span key={bar.dataKey} className="flex items-center gap-1.5 text-sm text-gray-600">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: bar.color }} />
            {bar.name}
          </span>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} barCategoryGap="30%" barGap={4}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} />
          <YAxis axisLine={false} tickLine={false} />
          <Tooltip />
          {bars.map((bar) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name}
              fill={bar.color}
              radius={[6, 6, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChar;
