"use client";

import { motion } from "framer-motion";
import { pipelineStages } from "@/lib/mock-data/pipelines";
import type { PipelineStage, StageStatus } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import {
  Upload,
  Brain,
  ShieldCheck,
  UserCheck,
  Database,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

const stageIcons: Record<string, React.ReactNode> = {
  upload: <Upload size={20} />,
  brain: <Brain size={20} />,
  "shield-check": <ShieldCheck size={20} />,
  "user-check": <UserCheck size={20} />,
  database: <Database size={20} />,
};

const statusConfig: Record<StageStatus, { color: string; bg: string; label: string; icon: React.ReactNode }> = {
  healthy: { color: "#22c55e", bg: "#22c55e15", label: "Healthy", icon: <CheckCircle size={12} /> },
  degraded: { color: "#f59e0b", bg: "#f59e0b15", label: "Degraded", icon: <AlertTriangle size={12} /> },
  critical: { color: "#ef4444", bg: "#ef444415", label: "Critical", icon: <XCircle size={12} /> },
  offline: { color: "#71717a", bg: "#71717a15", label: "Offline", icon: <XCircle size={12} /> },
};

function SaturationBar({ current, capacity }: { current: number; capacity: number }) {
  const pct = Math.min(100, Math.round((current / capacity) * 100));
  const color = pct > 85 ? "#ef4444" : pct > 65 ? "#f59e0b" : "#22c55e";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
        <span>Queue saturation</span>
        <span style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted-bg)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
    </div>
  );
}

export default function PipelinesPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Summary bar */}
      <div
        className="rounded-xl p-4 flex items-center gap-6 flex-wrap"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        {[
          { label: "Total Queue", value: pipelineStages.reduce((s, p) => s + p.queueSize, 0).toLocaleString(), color: "var(--foreground)" },
          { label: "Healthy Stages", value: pipelineStages.filter((p) => p.status === "healthy").length + "/5", color: "#22c55e" },
          { label: "Degraded", value: pipelineStages.filter((p) => p.status === "degraded").length, color: "#f59e0b" },
          { label: "Critical", value: pipelineStages.filter((p) => p.status === "critical").length, color: "#ef4444" },
          { label: "Total Errors (1h)", value: pipelineStages.reduce((s, p) => s + p.errorCount, 0), color: "#ef4444" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
            <div className="text-xl font-bold" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pipeline visualization */}
      <div className="flex flex-col lg:flex-row items-stretch gap-3">
        {pipelineStages.map((stage, i) => {
          const status = statusConfig[stage.status];
          const Icon = stageIcons[stage.icon] || <Database size={20} />;

          return (
            <div key={stage.id} className="flex flex-col lg:flex-row items-center flex-1 gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="w-full lg:flex-1 rounded-xl p-4 space-y-3"
                style={{
                  background: "var(--card)",
                  border: `1px solid ${stage.status !== "healthy" ? status.color + "40" : "var(--card-border)"}`,
                }}
              >
                {/* Stage header */}
                <div className="flex items-start justify-between">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ background: status.bg, color: status.color }}
                  >
                    {Icon}
                  </div>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ background: status.bg, color: status.color }}
                  >
                    {status.icon}
                    {status.label}
                  </span>
                </div>

                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{stage.name}</div>
                  <div className="text-xs" style={{ color: "var(--muted)" }}>{stage.id}</div>
                </div>

                {/* Metrics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Queue Size</span>
                    <span
                      className="font-semibold"
                      style={{
                        color: stage.queueSize > 2000 ? "#ef4444" : stage.queueSize > 1000 ? "#f59e0b" : "var(--foreground)",
                      }}
                    >
                      {stage.queueSize.toLocaleString()}
                    </span>
                  </div>

                  {stage.avgLatencyMs > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1" style={{ color: "var(--muted)" }}>
                        <Clock size={10} /> Avg Latency
                      </span>
                      <span style={{ color: "var(--foreground)" }}>{stage.avgLatencyMs}ms</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Throughput</span>
                    <span style={{ color: "var(--foreground)" }}>{stage.throughput}/min</span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Rejection Rate</span>
                    <span style={{ color: stage.rejectionRate > 15 ? "#ef4444" : stage.rejectionRate > 8 ? "#f59e0b" : "#22c55e" }}>
                      {stage.rejectionRate}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>AI Confidence</span>
                    <span style={{ color: stage.confidenceAvg >= 90 ? "#22c55e" : stage.confidenceAvg >= 75 ? "#f59e0b" : "#ef4444" }}>
                      {stage.confidenceAvg}%
                    </span>
                  </div>

                  {stage.errorCount > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span style={{ color: "var(--muted)" }}>Errors (1h)</span>
                      <span style={{ color: "#ef4444" }}>{stage.errorCount}</span>
                    </div>
                  )}
                </div>

                {/* Queue saturation */}
                <SaturationBar current={stage.queueSize} capacity={stage.processingRate * 20} />
              </motion.div>

              {i < pipelineStages.length - 1 && (
                <div className="hidden lg:flex flex-col items-center flex-shrink-0">
                  <div className="flex items-center gap-1" style={{ color: "var(--muted)" }}>
                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    >
                      <ArrowRight size={16} style={{ color: "var(--accent)" }} />
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Critical alerts */}
      {pipelineStages.filter((p) => p.status !== "healthy").length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Active Alerts</h3>
          {pipelineStages
            .filter((p) => p.status !== "healthy")
            .map((stage) => {
              const s = statusConfig[stage.status];
              return (
                <div
                  key={stage.id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: s.bg, border: `1px solid ${s.color}30` }}
                >
                  <span style={{ color: s.color }}>{s.icon}</span>
                  <div className="flex-1">
                    <span className="text-sm font-medium" style={{ color: s.color }}>{stage.name}</span>
                    <span className="text-sm" style={{ color: "var(--foreground)" }}>
                      {" "}— Queue at {stage.queueSize.toLocaleString()} items
                      {stage.status === "critical" ? ", saturation critical" : ", performance degraded"}
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: s.color + "20", color: s.color }}>
                    {s.label}
                  </span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
