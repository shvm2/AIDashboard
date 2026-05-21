"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { logs, getLogsBySeverity, searchLogs } from "@/lib/mock-data/logs";
import type { LogEntry, LogSeverity } from "@/lib/types";
import { formatTimestamp, formatRelativeTime } from "@/lib/utils";
import { Search, ChevronDown, ChevronRight, AlertCircle, Info, AlertTriangle, Terminal, XCircle } from "lucide-react";

const severities: { value: string; label: string; color: string }[] = [
  { value: "all", label: "All Levels", color: "var(--muted)" },
  { value: "debug", label: "DEBUG", color: "#71717a" },
  { value: "info", label: "INFO", color: "#6366f1" },
  { value: "warn", label: "WARN", color: "#f59e0b" },
  { value: "error", label: "ERROR", color: "#ef4444" },
  { value: "critical", label: "CRITICAL", color: "#dc2626" },
];

const severityIcon: Record<string, React.ReactNode> = {
  debug: <Terminal size={12} style={{ color: "#71717a" }} />,
  info: <Info size={12} style={{ color: "#6366f1" }} />,
  warn: <AlertTriangle size={12} style={{ color: "#f59e0b" }} />,
  error: <AlertCircle size={12} style={{ color: "#ef4444" }} />,
  critical: <XCircle size={12} style={{ color: "#dc2626" }} />,
};

const severityBgColor: Record<LogSeverity, string> = {
  debug: "transparent",
  info: "transparent",
  warn: "#f59e0b08",
  error: "#ef444408",
  critical: "#dc262608",
};

const severityBorderColor: Record<LogSeverity, string> = {
  debug: "transparent",
  info: "transparent",
  warn: "#f59e0b20",
  error: "#ef444420",
  critical: "#dc262630",
};

export default function LogsPage() {
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = severityFilter === "all" ? logs : logs.filter((l) => l.severity === severityFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (l) =>
          l.message.toLowerCase().includes(q) ||
          l.event.toLowerCase().includes(q) ||
          l.source.toLowerCase().includes(q) ||
          (l.workflowId?.toLowerCase().includes(q) ?? false) ||
          (l.taskId?.toLowerCase().includes(q) ?? false)
      );
    }
    return result;
  }, [search, severityFilter]);

  return (
    <div className="p-6 space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div
          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-lg"
          style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
        >
          <Search size={14} style={{ color: "var(--muted)" }} />
          <input
            type="text"
            placeholder="Search logs, events, sources, workflow IDs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none font-mono"
            style={{ color: "var(--foreground)" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ color: "var(--muted)" }}>
              <XCircle size={14} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {severities.map((s) => (
            <button
              key={s.value}
              onClick={() => setSeverityFilter(s.value)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all"
              style={{
                background: severityFilter === s.value ? `${s.color}15` : "var(--card)",
                color: severityFilter === s.value ? s.color : "var(--muted)",
                border: `1px solid ${severityFilter === s.value ? `${s.color}40` : "var(--card-border)"}`,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs" style={{ color: "var(--muted)" }}>
        <span>{filtered.length} entries</span>
        {search && <span>· filtered by &quot;{search}&quot;</span>}
        <span className="flex items-center gap-1 ml-auto">
          <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "#22c55e" }} />
          Live ingestion
        </span>
      </div>

      {/* Log table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
      >
        {/* Table header */}
        <div
          className="grid text-xs font-medium px-4 py-2.5 border-b"
          style={{
            gridTemplateColumns: "140px 80px 120px 1fr 80px",
            borderColor: "var(--card-border)",
            color: "var(--muted)",
            background: "var(--muted-bg)",
          }}
        >
          <div>Timestamp</div>
          <div>Level</div>
          <div>Source</div>
          <div>Message</div>
          <div className="text-right">Trace ID</div>
        </div>

        <div className="divide-y overflow-y-auto max-h-[560px]" style={{ borderColor: "var(--card-border)" }}>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Terminal size={32} style={{ color: "var(--muted)" }} />
              <div className="text-sm" style={{ color: "var(--muted)" }}>No logs match your filters</div>
            </div>
          ) : (
            filtered.map((log, i) => (
              <div key={log.id}>
                <div
                  onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                  className="grid items-center gap-0 px-4 py-2.5 cursor-pointer transition-colors hover:bg-white/3"
                  style={{
                    gridTemplateColumns: "140px 80px 120px 1fr 80px",
                    background: severityBgColor[log.severity],
                    borderLeft: `2px solid ${severityBorderColor[log.severity]}`,
                  }}
                >
                  <div className="font-mono text-xs" style={{ color: "var(--muted)" }}>
                    {formatTimestamp(log.timestamp)}
                  </div>

                  <div className="flex items-center gap-1">
                    {severityIcon[log.severity]}
                    <span
                      className={`text-xs font-mono font-semibold severity-${log.severity}`}
                    >
                      {log.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="font-mono text-xs truncate pr-2" style={{ color: "#6366f1" }}>
                    {log.source}
                  </div>

                  <div className="min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-medium truncate" style={{ color: "var(--muted)" }}>
                        [{log.event}]
                      </span>
                      <span className="text-xs truncate" style={{ color: "var(--foreground)" }}>
                        {log.message}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-1">
                    {log.traceId && (
                      <span className="font-mono text-xs truncate" style={{ color: "var(--muted)" }}>
                        {log.traceId.split("-")[1]}
                      </span>
                    )}
                    {expandedId === log.id ? (
                      <ChevronDown size={12} style={{ color: "var(--muted)", flexShrink: 0 }} />
                    ) : (
                      <ChevronRight size={12} style={{ color: "var(--muted)", flexShrink: 0 }} />
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === log.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="px-4 py-3 border-b font-mono text-xs space-y-2"
                        style={{
                          background: "#0a0a0c",
                          borderColor: "var(--card-border)",
                          color: "#a1a1aa",
                        }}
                      >
                        <div className="flex gap-6 flex-wrap">
                          <div><span style={{ color: "#6366f1" }}>log_id:</span> {log.id}</div>
                          <div><span style={{ color: "#6366f1" }}>timestamp:</span> {log.timestamp}</div>
                          <div><span style={{ color: "#6366f1" }}>source:</span> {log.source}</div>
                          {log.traceId && <div><span style={{ color: "#6366f1" }}>trace_id:</span> {log.traceId}</div>}
                          {log.workflowId && <div><span style={{ color: "#6366f1" }}>workflow_id:</span> {log.workflowId}</div>}
                          {log.taskId && <div><span style={{ color: "#6366f1" }}>task_id:</span> {log.taskId}</div>}
                        </div>
                        <div>
                          <span style={{ color: "#6366f1" }}>message:</span>{" "}
                          <span style={{ color: "#fafafa" }}>{log.message}</span>
                        </div>
                        {log.metadata && (
                          <div>
                            <span style={{ color: "#6366f1" }}>metadata:</span>{" "}
                            <span style={{ color: "#22c55e" }}>
                              {JSON.stringify(log.metadata, null, 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
