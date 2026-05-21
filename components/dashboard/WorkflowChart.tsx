"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { DailyStats } from "@/lib/types";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs space-y-1"
      style={{ background: "#0f0f12", border: "1px solid #1c1c24", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
    >
      <div style={{ color: "#71717a" }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span style={{ color: "#fafafa" }}>{p.name}:</span>
          <span style={{ color: p.color }}>{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

interface WorkflowChartProps {
  data: DailyStats[];
}

export function WorkflowChart({ data }: WorkflowChartProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
            Processing Throughput
          </h3>
          <p className="text-xs" style={{ color: "var(--muted)" }}>14-day document processing trends</p>
        </div>
        <div className="flex items-center gap-2">
          {["14d", "30d"].map((t) => (
            <button
              key={t}
              className="text-xs px-2 py-1 rounded"
              style={{
                background: t === "14d" ? "var(--accent-glow)" : "transparent",
                color: t === "14d" ? "var(--accent)" : "var(--muted)",
                border: `1px solid ${t === "14d" ? "var(--accent)" : "var(--card-border)"}`,
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="processedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="approvedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="errorsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c1c24" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="processed" name="Processed" stroke="#6366f1" strokeWidth={2} fill="url(#processedGrad)" dot={false} />
          <Area type="monotone" dataKey="approved" name="Approved" stroke="#22c55e" strokeWidth={1.5} fill="url(#approvedGrad)" dot={false} />
          <Area type="monotone" dataKey="errors" name="Errors" stroke="#ef4444" strokeWidth={1.5} fill="url(#errorsGrad)" dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
