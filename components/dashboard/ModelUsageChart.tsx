"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs" style={{ background: "#0f0f12", border: "1px solid #1c1c24" }}>
      <span style={{ color: payload[0].payload.color }}>{payload[0].name}</span>:
      <span style={{ color: "#fafafa" }}> {payload[0].value}%</span>
    </div>
  );
};

interface ModelUsageChartProps {
  data: { name: string; value: number; color: string }[];
}

export function ModelUsageChart({ data }: ModelUsageChartProps) {
  return (
    <div className="rounded-xl p-4 flex flex-col" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Model Usage</h3>
        <p className="text-xs" style={{ color: "var(--muted)" }}>Inference distribution</p>
      </div>
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="space-y-1.5 mt-2">
        {data.map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span style={{ color: "var(--muted)" }}>{d.name}</span>
            </div>
            <span style={{ color: "var(--foreground)" }}>{d.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
