"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  dailyStats,
  latencyTimeSeries,
  confidenceDistribution,
  workflowPerformance,
  modelUsage,
  last7Days,
} from "@/lib/mock-data/dashboard";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg px-3 py-2 text-xs space-y-1" style={{ background: "#0f0f12", border: "1px solid #1c1c24", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}>
      <div style={{ color: "#71717a" }}>{label}</div>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.stroke }} />
          <span style={{ color: "#fafafa" }}>{p.name}:</span>
          <span style={{ color: p.color || p.stroke }}>{typeof p.value === "number" ? p.value.toLocaleString() : p.value}</span>
        </div>
      ))}
    </div>
  );
};

const timeRanges = ["7d", "14d", "30d"] as const;
type TimeRange = typeof timeRanges[number];

export default function AnalyticsPage() {
  const [range, setRange] = useState<TimeRange>("30d");
  const data = range === "7d" ? dailyStats.slice(-7) : range === "14d" ? dailyStats.slice(-14) : dailyStats;

  const totalProcessed = data.reduce((s, d) => s + d.processed, 0);
  const totalErrors = data.reduce((s, d) => s + d.errors, 0);
  const avgLatency = Math.round(data.reduce((s, d) => s + d.avgLatency, 0) / data.length);
  const avgConfidence = (data.reduce((s, d) => s + d.avgConfidence, 0) / data.length).toFixed(1);

  return (
    <div className="p-6 space-y-6">
      {/* Time range selector */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
          {[
            { label: "Total Processed", value: totalProcessed.toLocaleString(), color: "#6366f1" },
            { label: "Total Errors", value: totalErrors.toLocaleString(), color: "#ef4444" },
            { label: "Avg Latency", value: `${avgLatency}ms`, color: "var(--foreground)" },
            { label: "Avg AI Confidence", value: `${avgConfidence}%`, color: "#22c55e" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl p-4" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
              <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{s.label}</div>
              <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {timeRanges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: range === r ? "var(--accent-glow)" : "var(--card)",
                color: range === r ? "var(--accent)" : "var(--muted)",
                border: `1px solid ${range === r ? "var(--accent)" : "var(--card-border)"}`,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Throughput chart */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Throughput Analytics</h3>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Processed, approved, rejected, and error volumes over time</p>
        </div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="grad1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="grad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c24" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} interval={Math.floor(data.length / 7)} />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="processed" name="Processed" stroke="#6366f1" strokeWidth={2} fill="url(#grad1)" dot={false} />
            <Area type="monotone" dataKey="approved" name="Approved" stroke="#22c55e" strokeWidth={1.5} fill="url(#grad2)" dot={false} />
            <Area type="monotone" dataKey="rejected" name="Rejected" stroke="#f59e0b" strokeWidth={1.5} fill="none" dot={false} />
            <Area type="monotone" dataKey="errors" name="Errors" stroke="#ef4444" strokeWidth={1.5} fill="none" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Latency chart */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-4"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Orchestration Latency</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>P50 / P95 / P99 percentiles (ms)</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latencyTimeSeries} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c24" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="p50" name="P50" stroke="#22c55e" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p95" name="P95" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
              <Line type="monotone" dataKey="p99" name="P99" stroke="#ef4444" strokeWidth={1.5} dot={false} strokeDasharray="4 2" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Confidence distribution */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-xl p-4"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div className="mb-4">
            <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>AI Confidence Distribution</h3>
            <p className="text-xs" style={{ color: "var(--muted)" }}>Document classification confidence histogram</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={confidenceDistribution} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c1c24" vertical={false} />
              <XAxis dataKey="range" tick={{ fontSize: 10, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Documents" radius={[3, 3, 0, 0]}>
                {confidenceDistribution.map((entry, index) => {
                  const pct = parseInt(entry.range.replace("< ", "").replace("–", "").replace("%", "").split("–")[0]);
                  const color = index >= 5 ? "#22c55e" : index >= 3 ? "#f59e0b" : "#ef4444";
                  return <Cell key={index} fill={color} fillOpacity={0.8} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Workflow performance */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl p-4"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        <div className="mb-4">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Workflow Performance</h3>
          <p className="text-xs" style={{ color: "var(--muted)" }}>Success rates and throughput by workflow</p>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={workflowPerformance} layout="vertical" margin={{ top: 4, right: 20, left: 80, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c24" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="successRate" name="Success Rate %" radius={[0, 3, 3, 0]} fill="#6366f1" fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
