"use client";

import { motion } from "framer-motion";
import type { Agent, AgentStatus } from "@/lib/types";
import { formatRelativeTime, formatDuration } from "@/lib/utils";
import { Cpu, HardDrive, Zap, Clock, CheckCircle, ListTodo, Activity } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";

const statusConfig: Record<AgentStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Active", color: "#22c55e", bg: "#22c55e15" },
  idle: { label: "Idle", color: "#6366f1", bg: "#6366f115" },
  degraded: { label: "Degraded", color: "#f59e0b", bg: "#f59e0b15" },
  offline: { label: "Offline", color: "#ef4444", bg: "#ef444415" },
};

function GaugeBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--muted-bg)" }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <span className="text-xs w-8 text-right" style={{ color: "var(--foreground)" }}>{value}%</span>
    </div>
  );
}

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const status = statusConfig[agent.status];
  const sparkData = agent.latencyHistory.map((v, i) => ({ i, v }));

  return (
    <div
      className="rounded-xl p-5 space-y-4"
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              {agent.name}
            </span>
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-xs font-medium"
              style={{ background: status.bg, color: status.color }}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${agent.status === "active" ? "pulse-dot" : ""}`}
                style={{ background: status.color }}
              />
              {status.label}
            </span>
          </div>
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            {agent.id} · {agent.type} · <span className="font-mono">{agent.model}</span>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xs" style={{ color: "var(--muted)" }}>Health</div>
          <div
            className="text-lg font-bold"
            style={{ color: agent.health >= 90 ? "#22c55e" : agent.health >= 70 ? "#f59e0b" : "#ef4444" }}
          >
            {agent.health}%
          </div>
        </div>
      </div>

      {/* System metrics */}
      <div className="space-y-2.5">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1" style={{ color: "var(--muted)" }}>
              <Cpu size={11} /> CPU
            </span>
          </div>
          <GaugeBar value={agent.cpuUsage} color={agent.cpuUsage > 85 ? "#ef4444" : agent.cpuUsage > 70 ? "#f59e0b" : "#6366f1"} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1" style={{ color: "var(--muted)" }}>
              <HardDrive size={11} /> Memory
            </span>
          </div>
          <GaugeBar value={agent.memoryUsage} color={agent.memoryUsage > 85 ? "#ef4444" : agent.memoryUsage > 70 ? "#f59e0b" : "#8b5cf6"} />
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="flex items-center gap-1" style={{ color: "var(--muted)" }}>
              <Activity size={11} /> Load
            </span>
          </div>
          <GaugeBar value={agent.processingLoad} color={agent.processingLoad > 90 ? "#ef4444" : agent.processingLoad > 75 ? "#f59e0b" : "#22c55e"} />
        </div>
      </div>

      {/* Latency sparkline */}
      <div className="rounded-lg p-3" style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: "var(--muted)" }}>Response Latency</span>
          <div className="text-right">
            <span className="text-xs font-semibold" style={{ color: "var(--foreground)" }}>
              {agent.avgResponseLatency}ms
            </span>
            <span className="text-xs ml-1" style={{ color: "var(--muted)" }}>avg</span>
            <span className="text-xs ml-2" style={{ color: "#ef4444" }}>
              {agent.p99Latency}ms p99
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={40}>
          <LineChart data={sparkData}>
            <Line
              type="monotone"
              dataKey="v"
              stroke="#6366f1"
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
            />
            <Tooltip
              content={({ payload }) =>
                payload?.[0] ? (
                  <div className="text-xs px-2 py-1 rounded" style={{ background: "#0f0f12", border: "1px solid #1c1c24" }}>
                    {payload[0].value}ms
                  </div>
                ) : null
              }
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Task stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: "Active Tasks", value: agent.assignedTasks, icon: ListTodo, color: "var(--accent)" },
          { label: "Done Today", value: agent.completedToday.toLocaleString(), icon: CheckCircle, color: "#22c55e" },
          { label: "Queue Depth", value: agent.queueDepth, icon: Zap, color: agent.queueDepth > 200 ? "#f59e0b" : "var(--muted)" },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-lg p-2.5 text-center"
              style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}
            >
              <Icon size={13} style={{ color: s.color, margin: "0 auto 4px" }} />
              <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs pt-1 border-t" style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}>
        <span className="flex items-center gap-1">
          <Clock size={11} /> Uptime: {agent.uptime}
        </span>
        <span>Active {formatRelativeTime(agent.lastActivity)}</span>
      </div>
    </div>
  );
}
