"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, AlertTriangle, Bot, GitBranch } from "lucide-react";
import type { ActivityEvent } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

const eventIcon = {
  workflow_started: <GitBranch size={13} style={{ color: "#6366f1" }} />,
  task_completed: <CheckCircle size={13} style={{ color: "#22c55e" }} />,
  error_detected: <AlertCircle size={13} style={{ color: "#ef4444" }} />,
  agent_scaled: <Bot size={13} style={{ color: "#6366f1" }} />,
  review_flagged: <AlertTriangle size={13} style={{ color: "#f59e0b" }} />,
  threshold_breach: <AlertTriangle size={13} style={{ color: "#f59e0b" }} />,
  model_updated: <Info size={13} style={{ color: "#6366f1" }} />,
};

const severityBg = {
  info: "rgba(99,102,241,0.08)",
  success: "rgba(34,197,94,0.08)",
  warn: "rgba(245,158,11,0.08)",
  error: "rgba(239,68,68,0.08)",
};

interface ActivityFeedProps {
  events: ActivityEvent[];
}

export function ActivityFeed({ events }: ActivityFeedProps) {
  return (
    <div
      className="rounded-xl p-4"
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          Live Activity Feed
        </span>
        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--muted)" }}>
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#22c55e" }} />
          Real-time
        </span>
      </div>

      <div className="space-y-2">
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-start gap-3 p-3 rounded-lg"
            style={{ background: severityBg[event.severity] }}
          >
            <div className="mt-0.5 flex-shrink-0">
              {eventIcon[event.type]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                  {event.message}
                </span>
                <span className="text-xs flex-shrink-0" style={{ color: "var(--muted)" }}>
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
              {event.detail && (
                <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                  {event.detail}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
