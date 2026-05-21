"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { workflows } from "@/lib/mock-data/workflows";
import { WorkflowStatusBadge } from "@/components/workflows/WorkflowStatusBadge";
import { WorkflowDrawer } from "@/components/workflows/WorkflowDrawer";
import type { Workflow, WorkflowStatus } from "@/lib/types";
import { formatRelativeTime, formatNumber, formatDuration } from "@/lib/utils";
import {
  Search,
  Filter,
  GitBranch,
  Clock,
  Zap,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const statusFilters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Running", value: "running" },
  { label: "Idle", value: "idle" },
  { label: "Error", value: "error" },
  { label: "Paused", value: "paused" },
  { label: "Queued", value: "queued" },
];

const triggerColors: Record<string, string> = {
  schedule: "#6366f1",
  event: "#22c55e",
  manual: "#71717a",
  webhook: "#f59e0b",
  api: "#8b5cf6",
};

export default function WorkflowsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  const filtered = workflows.filter((wf) => {
    const matchesStatus = statusFilter === "all" || wf.status === statusFilter;
    const matchesSearch =
      !search ||
      wf.name.toLowerCase().includes(search.toLowerCase()) ||
      wf.id.toLowerCase().includes(search.toLowerCase()) ||
      wf.tags.some((t) => t.includes(search.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 space-y-4">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Workflows", value: workflows.length, color: "var(--foreground)" },
          { label: "Currently Running", value: workflows.filter((w) => w.status === "running").length, color: "#22c55e" },
          { label: "In Error State", value: workflows.filter((w) => w.status === "error").length, color: "#ef4444" },
          { label: "Queued", value: workflows.filter((w) => w.status === "queued").length, color: "#f59e0b" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>{stat.label}</div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <Search size={14} style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search workflows, IDs, tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--foreground)" }}
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: statusFilter === f.value ? "var(--accent-glow)" : "var(--card)",
                color: statusFilter === f.value ? "var(--accent)" : "var(--muted)",
                border: `1px solid ${statusFilter === f.value ? "var(--accent)" : "var(--card-border)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        <div
          className="grid gap-0 text-xs font-medium px-4 py-3 border-b"
          style={{
            gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 40px",
            borderColor: "var(--card-border)",
            color: "var(--muted)",
          }}
        >
          <div>Workflow</div>
          <div>Status</div>
          <div>Trigger</div>
          <div>Throughput</div>
          <div>Avg Time</div>
          <div>AI Confidence</div>
          <div />
        </div>

        <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <GitBranch size={32} style={{ color: "var(--muted)" }} />
              <div className="text-sm" style={{ color: "var(--muted)" }}>No workflows match your filters</div>
            </div>
          ) : (
            filtered.map((wf, i) => (
              <motion.div
                key={wf.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => setSelectedWorkflow(wf)}
                className="grid items-center gap-0 px-4 py-3 cursor-pointer transition-colors hover:bg-white/3"
                style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 40px" }}
              >
                <div className="min-w-0 pr-4">
                  <div className="text-sm font-medium truncate" style={{ color: "var(--foreground)" }}>
                    {wf.name}
                  </div>
                  <div className="text-xs mt-0.5 flex items-center gap-2" style={{ color: "var(--muted)" }}>
                    <span>{wf.id}</span>
                    <span>·</span>
                    <span>{formatRelativeTime(wf.lastExecution)}</span>
                  </div>
                </div>

                <div>
                  <WorkflowStatusBadge status={wf.status} />
                </div>

                <div>
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      background: `${triggerColors[wf.trigger]}15`,
                      color: triggerColors[wf.trigger],
                    }}
                  >
                    {wf.trigger}
                  </span>
                </div>

                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--foreground)" }}>
                  {wf.status === "running" ? (
                    <>
                      <Zap size={11} style={{ color: "#22c55e" }} />
                      {formatNumber(wf.throughput)}/hr
                    </>
                  ) : (
                    <span style={{ color: "var(--muted)" }}>—</span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--foreground)" }}>
                  <Clock size={11} style={{ color: "var(--muted)" }} />
                  {formatDuration(wf.avgProcessingTime)}
                </div>

                <div className="text-xs">
                  {wf.status === "error" ? (
                    <span style={{ color: "#ef4444" }}>—</span>
                  ) : (
                    <span style={{ color: wf.aiConfidence >= 90 ? "#22c55e" : wf.aiConfidence >= 80 ? "#f59e0b" : "#ef4444" }}>
                      {wf.aiConfidence}%
                    </span>
                  )}
                </div>

                <div className="flex justify-end">
                  <ChevronRight size={14} style={{ color: "var(--muted)" }} />
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Drawer */}
      <WorkflowDrawer workflow={selectedWorkflow} onClose={() => setSelectedWorkflow(null)} />
    </div>
  );
}
