/*
 * PieChar — Reusable pie chart component built on Recharts.
 *
 * Usage:
 *   import PieChar from "../../shared/component/PieChar";
 *
 *   <PieChar
 *     data={[
 *       { name: "Food", value: 400, color: "#ef4444" },
 *       { name: "Transport", value: 200, color: "#3b82f6" },
 *       { name: "Shopping", value: 300, color: "#f59e0b" },
 *     ]}
 *   />
 */
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export type PieDataItem = {
  name: string;
  value: number;
  color: string;
};

type PieCharProps = {
  data: PieDataItem[];
};

const PieChar = ({ data }: PieCharProps) => {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          iconType="circle"
          iconSize={10}
          formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChar;
