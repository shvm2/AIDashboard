"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { reviewItems } from "@/lib/mock-data/review-queue";
import type { ReviewItem, ReviewStatus, ReviewPriority } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Search,
  ChevronDown,
  Tag,
  Bot,
  FileText,
  ArrowUpRight,
  Info,
} from "lucide-react";

const priorityConfig: Record<ReviewPriority, { color: string; bg: string }> = {
  low: { color: "#71717a", bg: "#71717a15" },
  medium: { color: "#6366f1", bg: "#6366f115" },
  high: { color: "#f59e0b", bg: "#f59e0b15" },
  critical: { color: "#ef4444", bg: "#ef444415" },
};

const statusConfig: Record<ReviewStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending Review", color: "#f59e0b", bg: "#f59e0b15" },
  approved: { label: "Approved", color: "#22c55e", bg: "#22c55e15" },
  rejected: { label: "Rejected", color: "#ef4444", bg: "#ef444415" },
  escalated: { label: "Escalated", color: "#8b5cf6", bg: "#8b5cf615" },
};

function ConfidenceBadge({ confidence, threshold }: { confidence: number; threshold: number }) {
  const delta = confidence - threshold;
  const color = confidence >= threshold ? "#22c55e" : confidence >= threshold * 0.8 ? "#f59e0b" : "#ef4444";
  return (
    <div className="text-right">
      <div className="text-sm font-bold" style={{ color }}>{confidence.toFixed(1)}%</div>
      <div className="text-xs" style={{ color: "var(--muted)" }}>
        threshold {threshold}%
      </div>
    </div>
  );
}

export default function ReviewPage() {
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<ReviewItem | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [rejectedIds, setRejectedIds] = useState<Set<string>>(new Set());

  const filtered = reviewItems.filter((r) => {
    if (filter === "all") return true;
    if (filter === "pending") return r.status === "pending";
    if (filter === "critical") return r.priority === "critical";
    if (filter === "escalated") return r.status === "escalated";
    return true;
  });

  const pendingCount = reviewItems.filter((r) => r.status === "pending").length;

  function handleApprove(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setApprovedIds((s) => new Set([...s, id]));
    setRejectedIds((s) => { const n = new Set(s); n.delete(id); return n; });
  }

  function handleReject(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    setRejectedIds((s) => new Set([...s, id]));
    setApprovedIds((s) => { const n = new Set(s); n.delete(id); return n; });
  }

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          {[
            { label: "All Items", value: "all", count: reviewItems.length },
            { label: "Pending", value: "pending", count: pendingCount },
            { label: "Critical", value: "critical", count: reviewItems.filter((r) => r.priority === "critical").length },
            { label: "Escalated", value: "escalated", count: reviewItems.filter((r) => r.status === "escalated").length },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={{
                background: filter === f.value ? "var(--accent-glow)" : "var(--card)",
                color: filter === f.value ? "var(--accent)" : "var(--muted)",
                border: `1px solid ${filter === f.value ? "var(--accent)" : "var(--card-border)"}`,
              }}
            >
              {f.label}
              <span
                className="px-1.5 py-0.5 rounded-full text-xs"
                style={{
                  background: filter === f.value ? "var(--accent)" : "var(--muted-bg)",
                  color: filter === f.value ? "#fff" : "var(--muted)",
                }}
              >
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {filtered.map((item, i) => {
          const priority = priorityConfig[item.priority];
          const statusCfg = statusConfig[item.status];
          const isApproved = approvedIds.has(item.id);
          const isRejected = rejectedIds.has(item.id);

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setSelected(selected?.id === item.id ? null : item)}
              className="rounded-xl p-4 cursor-pointer transition-colors hover:bg-white/3"
              style={{
                background: "var(--card)",
                border: `1px solid ${item.priority === "critical" && item.status === "pending" ? "#ef444430" : "var(--card-border)"}`,
              }}
            >
              <div className="flex items-start gap-4">
                {/* Left: icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: priority.bg, color: priority.color }}
                >
                  <FileText size={18} />
                </div>

                {/* Middle: content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
                      {item.title}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: priority.bg, color: priority.color }}
                    >
                      {item.priority}
                    </span>
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                      style={{ background: statusCfg.bg, color: statusCfg.color }}
                    >
                      {statusCfg.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs mb-2" style={{ color: "var(--muted)" }}>
                    <span>{item.id}</span>
                    <span>·</span>
                    <span>{item.documentType}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Bot size={10} />{item.assignedAgent}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock size={10} />{formatRelativeTime(item.submittedAt)}</span>
                  </div>

                  <div
                    className="flex items-start gap-2 p-2.5 rounded-lg text-xs"
                    style={{ background: "#f59e0b10", border: "1px solid #f59e0b20" }}
                  >
                    <AlertTriangle size={12} style={{ color: "#f59e0b", flexShrink: 0, marginTop: 1 }} />
                    <span style={{ color: "var(--foreground)" }}>{item.flaggedReason}</span>
                  </div>

                  {/* Flagged fields */}
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {item.flaggedFields.map((f) => (
                      <span
                        key={f}
                        className="text-xs px-2 py-0.5 rounded font-mono"
                        style={{ background: "var(--muted-bg)", color: "#f59e0b", border: "1px solid #f59e0b20" }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: confidence + actions */}
                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <ConfidenceBadge confidence={item.aiConfidence} threshold={item.confidenceThreshold} />

                  {item.status === "pending" && !isApproved && !isRejected && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleReject(item.id, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-red-500/20"
                        style={{ background: "#ef444415", color: "#ef4444", border: "1px solid #ef444430" }}
                      >
                        <XCircle size={12} /> Reject
                      </button>
                      <button
                        onClick={(e) => handleApprove(item.id, e)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-green-500/20"
                        style={{ background: "#22c55e15", color: "#22c55e", border: "1px solid #22c55e30" }}
                      >
                        <CheckCircle size={12} /> Approve
                      </button>
                    </div>
                  )}
                  {isApproved && (
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "#22c55e15", color: "#22c55e", border: "1px solid #22c55e30" }}>
                      ✓ Approved
                    </span>
                  )}
                  {isRejected && (
                    <span className="text-xs px-2 py-1 rounded-lg" style={{ background: "#ef444415", color: "#ef4444", border: "1px solid #ef444430" }}>
                      ✗ Rejected
                    </span>
                  )}
                </div>
              </div>

              {/* Expandable preview */}
              <AnimatePresence>
                {selected?.id === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
                      <div className="text-xs font-semibold mb-3" style={{ color: "var(--muted)" }}>
                        EXTRACTED DOCUMENT DATA
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(item.previewData).map(([k, v]) => (
                          <div key={k} className="rounded-lg p-2.5" style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
                            <div className="text-xs font-mono mb-0.5" style={{ color: "var(--muted)" }}>
                              {k.replace(/_/g, " ")}
                            </div>
                            <div
                              className="text-xs font-medium"
                              style={{
                                color: v.includes("flagged") || v.includes("FAIL") || v.includes("UNREDACTED") || v.includes("UNLIMITED")
                                  ? "#f59e0b"
                                  : "var(--foreground)",
                              }}
                            >
                              {v}
                            </div>
                          </div>
                        ))}
                      </div>
                      {item.reviewerNote && (
                        <div className="mt-3 p-3 rounded-lg" style={{ background: "#6366f110", border: "1px solid #6366f120" }}>
                          <span className="text-xs" style={{ color: "#6366f1" }}>Reviewer note: </span>
                          <span className="text-xs" style={{ color: "var(--foreground)" }}>{item.reviewerNote}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                        {item.auditTags.map((t) => (
                          <span key={t} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded" style={{ background: "var(--muted-bg)", color: "var(--muted)" }}>
                            <Tag size={10} />{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
