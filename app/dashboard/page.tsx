"use client";

import { motion } from "framer-motion";
import { kpiMetrics, activityEvents, dailyStats, modelUsage, last7Days } from "@/lib/mock-data/dashboard";
import { workflows } from "@/lib/mock-data/workflows";
import { KPICard } from "@/components/dashboard/KPICard";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { WorkflowChart } from "@/components/dashboard/WorkflowChart";
import { ModelUsageChart } from "@/components/dashboard/ModelUsageChart";
import { WorkflowStatusBadge } from "@/components/workflows/WorkflowStatusBadge";
import { formatRelativeTime, formatNumber, formatDuration } from "@/lib/utils";
import { GitBranch, AlertTriangle, TrendingUp } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function DashboardPage() {
  const activeWorkflows = workflows.filter((w) => w.status === "running");
  const failedWorkflows = workflows.filter((w) => w.status === "error");

  return (
    <div className="p-6 space-y-6">
      {/* KPI Grid */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4"
      >
        {kpiMetrics.map((metric) => (
          <motion.div key={metric.id} variants={item}>
            <KPICard metric={metric} />
          </motion.div>
        ))}
      </motion.div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <WorkflowChart data={dailyStats.slice(-14)} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <ModelUsageChart data={modelUsage} />
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="lg:col-span-2"
        >
          <ActivityFeed events={activityEvents} />
        </motion.div>

        {/* Active Workflows */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-xl p-4 space-y-3"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
              Pipeline Status
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--accent-glow)", color: "var(--accent)" }}>
              Live
            </span>
          </div>

          {/* Failed alert */}
          {failedWorkflows.length > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ background: "#ef444412", border: "1px solid #ef444430" }}>
              <AlertTriangle size={14} style={{ color: "#ef4444" }} />
              <span className="text-xs" style={{ color: "#ef4444" }}>
                {failedWorkflows.length} workflow{failedWorkflows.length > 1 ? "s" : ""} in error state
              </span>
            </div>
          )}

          <div className="space-y-2">
            {workflows.slice(0, 6).map((wf) => (
              <div
                key={wf.id}
                className="flex items-center justify-between p-2.5 rounded-lg transition-colors hover:bg-white/5"
                style={{ border: "1px solid var(--card-border)" }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <GitBranch size={12} style={{ color: "var(--muted)", flexShrink: 0 }} />
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                      {wf.name.split(" ").slice(0, 2).join(" ")}
                    </div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {wf.id} · {wf.status === "running" ? `${formatNumber(wf.throughput)}/hr` : formatRelativeTime(wf.lastExecution)}
                    </div>
                  </div>
                </div>
                <WorkflowStatusBadge status={wf.status} />
              </div>
            ))}
          </div>

          <div className="pt-1 border-t" style={{ borderColor: "var(--card-border)" }}>
            <div className="flex items-center justify-between text-xs" style={{ color: "var(--muted)" }}>
              <span className="flex items-center gap-1">
                <TrendingUp size={11} />
                Today&apos;s throughput
              </span>
              <span style={{ color: "var(--foreground)" }}>84.3K docs</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
