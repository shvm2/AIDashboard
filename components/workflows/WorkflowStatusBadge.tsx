"use client";

import { cn } from "@/lib/utils";
import type { WorkflowStatus } from "@/lib/types";

const statusConfig: Record<WorkflowStatus, { label: string; bg: string; color: string; dot: string }> = {
  running: { label: "Running", bg: "#22c55e15", color: "#22c55e", dot: "#22c55e" },
  idle: { label: "Idle", bg: "#6366f115", color: "#6366f1", dot: "#6366f1" },
  error: { label: "Error", bg: "#ef444415", color: "#ef4444", dot: "#ef4444" },
  paused: { label: "Paused", bg: "#f59e0b15", color: "#f59e0b", dot: "#f59e0b" },
  completed: { label: "Completed", bg: "#22c55e15", color: "#22c55e", dot: "#22c55e" },
  queued: { label: "Queued", bg: "#71717a15", color: "#71717a", dot: "#71717a" },
};

interface WorkflowStatusBadgeProps {
  status: WorkflowStatus;
  className?: string;
}

export function WorkflowStatusBadge({ status, className }: WorkflowStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0", className)}
      style={{ background: config.bg, color: config.color }}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", status === "running" ? "pulse-dot" : "")}
        style={{ background: config.dot }}
      />
      {config.label}
    </span>
  );
}
