"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X, GitBranch, Clock, Zap, TrendingUp, AlertCircle, RefreshCw, CheckCircle, Circle, ChevronRight } from "lucide-react";
import type { Workflow } from "@/lib/types";
import { WorkflowStatusBadge } from "./WorkflowStatusBadge";
import { formatDuration, formatNumber, formatRelativeTime } from "@/lib/utils";

interface WorkflowDrawerProps {
  workflow: Workflow | null;
  onClose: () => void;
}

const stepStatusIcon = {
  completed: <CheckCircle size={14} style={{ color: "#22c55e" }} />,
  running: <RefreshCw size={14} style={{ color: "#6366f1" }} className="animate-spin" />,
  pending: <Circle size={14} style={{ color: "#3f3f46" }} />,
  failed: <AlertCircle size={14} style={{ color: "#ef4444" }} />,
};

export function WorkflowDrawer({ workflow, onClose }: WorkflowDrawerProps) {
  return (
    <AnimatePresence>
      {workflow && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg z-50 overflow-y-auto"
            style={{ background: "var(--card)", borderLeft: "1px solid var(--card-border)" }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b" style={{ background: "var(--card)", borderColor: "var(--card-border)" }}>
              <div>
                <div className="text-xs mb-0.5" style={{ color: "var(--muted)" }}>{workflow.id}</div>
                <h2 className="text-base font-semibold" style={{ color: "var(--foreground)" }}>{workflow.name}</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10">
                <X size={16} style={{ color: "var(--muted)" }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status row */}
              <div className="flex items-center gap-3 flex-wrap">
                <WorkflowStatusBadge status={workflow.status} />
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--muted-bg)", color: "var(--muted)" }}>
                  {workflow.trigger}
                </span>
                {workflow.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--muted-bg)", color: "var(--muted)" }}>
                    {t}
                  </span>
                ))}
              </div>

              <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{workflow.description}</p>

              {/* Key metrics */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Throughput", value: workflow.status === "running" ? `${formatNumber(workflow.throughput)}/hr` : "—", icon: Zap },
                  { label: "Avg Latency", value: formatDuration(workflow.avgProcessingTime), icon: Clock },
                  { label: "AI Confidence", value: workflow.aiConfidence > 0 ? `${workflow.aiConfidence}%` : "—", icon: TrendingUp },
                  { label: "Success Rate", value: `${workflow.successRate}%`, icon: CheckCircle },
                  { label: "Total Runs", value: workflow.totalRuns.toLocaleString(), icon: RefreshCw },
                  { label: "Failed Runs", value: workflow.failedRuns.toLocaleString(), icon: AlertCircle },
                ].map((m) => {
                  const Icon = m.icon;
                  return (
                    <div key={m.label} className="rounded-lg p-3" style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <Icon size={11} style={{ color: "var(--muted)" }} />
                        <span className="text-xs" style={{ color: "var(--muted)" }}>{m.label}</span>
                      </div>
                      <div className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{m.value}</div>
                    </div>
                  );
                })}
              </div>

              {/* Pipeline Steps */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Pipeline Steps</h3>
                <div className="space-y-2">
                  {workflow.steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
                      <span className="text-xs w-4 text-center flex-shrink-0" style={{ color: "var(--muted)" }}>{i + 1}</span>
                      {stepStatusIcon[step.status]}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium" style={{ color: "var(--foreground)" }}>{step.name}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{step.type} · {formatDuration(step.avgDurationMs)} avg</div>
                      </div>
                      {i < workflow.steps.length - 1 && (
                        <ChevronRight size={12} style={{ color: "var(--muted)", flexShrink: 0 }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Retry Policy */}
              <div>
                <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--foreground)" }}>Retry Policy</h3>
                <div className="rounded-lg p-4 space-y-2" style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Max Retries</span>
                    <span style={{ color: "var(--foreground)" }}>{workflow.retryPolicy.maxRetries}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Backoff</span>
                    <span style={{ color: "var(--foreground)" }}>{formatDuration(workflow.retryPolicy.backoffMs)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: "var(--muted)" }}>Strategy</span>
                    <span style={{ color: "var(--foreground)" }} className="capitalize">{workflow.retryPolicy.strategy}</span>
                  </div>
                </div>
              </div>

              {/* Dependencies */}
              {workflow.dependencies.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: "var(--foreground)" }}>Dependencies</h3>
                  <div className="flex flex-wrap gap-2">
                    {workflow.dependencies.map((dep) => (
                      <span key={dep} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--accent)" }}>
                        {dep}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Timing */}
              <div className="text-xs space-y-1 pt-2 border-t" style={{ borderColor: "var(--card-border)", color: "var(--muted)" }}>
                <div className="flex justify-between">
                  <span>Last Execution</span>
                  <span style={{ color: "var(--foreground)" }}>{formatRelativeTime(workflow.lastExecution)}</span>
                </div>
                {workflow.nextExecution && (
                  <div className="flex justify-between">
                    <span>Next Execution</span>
                    <span style={{ color: "var(--foreground)" }}>{formatRelativeTime(workflow.nextExecution)}</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
