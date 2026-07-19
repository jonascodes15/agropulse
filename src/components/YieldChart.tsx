import {
  Area,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { yieldCurve } from "../data/mockData";

export default function YieldChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={yieldCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="var(--color-line)" strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: "var(--color-parchment-faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={{ stroke: "var(--color-line)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--color-parchment-faint)", fontSize: 11, fontFamily: "var(--font-mono)" }}
            axisLine={false}
            tickLine={false}
            width={40}
            label={{ value: "t/ha", angle: -90, position: "insideLeft", fill: "var(--color-parchment-faint)", fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--color-panel-raised)",
              border: "1px solid var(--color-line)",
              borderRadius: 8,
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--color-parchment)",
            }}
            labelStyle={{ color: "var(--color-parchment-faint)" }}
          />
          <Area
            type="monotone"
            dataKey="high"
            stroke="none"
            fill="var(--color-signal)"
            fillOpacity={0.08}
            isAnimationActive
          />
          <Area
            type="monotone"
            dataKey="low"
            stroke="none"
            fill="var(--color-soil-950)"
            fillOpacity={1}
            isAnimationActive
          />
          <Line
            type="monotone"
            dataKey="mid"
            stroke="var(--color-chlorophyll-bright)"
            strokeWidth={2.5}
            dot={{ r: 3, fill: "var(--color-chlorophyll-bright)", strokeWidth: 0 }}
            activeDot={{ r: 5 }}
            isAnimationActive
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
