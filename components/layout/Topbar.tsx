"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Bell, ChevronDown, Circle, Command, X, AlertCircle, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { notifications } from "@/lib/mock-data/dashboard";
import { cn, formatRelativeTime } from "@/lib/utils";

const pageLabels: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/workflows": "Workflow Management",
  "/agents": "AI Agents",
  "/pipelines": "Document Pipeline",
  "/review": "Human Review Queue",
  "/analytics": "Analytics & Reporting",
  "/logs": "System Logs",
  "/settings": "Settings & Configuration",
};

const severityIcon = {
  info: <Info size={14} style={{ color: "#6366f1" }} />,
  warning: <AlertTriangle size={14} style={{ color: "#f59e0b" }} />,
  error: <AlertCircle size={14} style={{ color: "#ef4444" }} />,
  success: <CheckCircle size={14} style={{ color: "#22c55e" }} />,
};

export function Topbar() {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const label = pageLabels[pathname] ?? "NeuralOps";
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      className="flex items-center justify-between px-6 border-b h-14 flex-shrink-0"
      style={{ borderColor: "var(--card-border)", background: "var(--card)" }}
    >
      {/* Left: Page title */}
      <div>
        <h1 className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>
          {label}
        </h1>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
          <span className="text-xs" style={{ color: "var(--muted)" }}>
            All systems operational
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Search trigger */}
        <button
          onClick={() => setShowSearch(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
          style={{ border: "1px solid var(--card-border)", color: "var(--muted)" }}
        >
          <Search size={13} />
          <span>Search...</span>
          <kbd className="flex items-center gap-0.5 px-1 py-0.5 rounded text-xs" style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)" }}>
            <Command size={10} />K
          </kbd>
        </button>

        {/* Workspace */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors hover:bg-white/5"
          style={{ border: "1px solid var(--card-border)", color: "var(--foreground)" }}
        >
          <Circle size={8} fill="#22c55e" style={{ color: "#22c55e" }} />
          Production
          <ChevronDown size={12} style={{ color: "var(--muted)" }} />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-white/5"
            style={{ border: "1px solid var(--card-border)" }}
            aria-label="Notifications"
          >
            <Bell size={15} style={{ color: "var(--muted)" }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: "#ef4444", color: "#fff" }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-10 w-80 rounded-xl overflow-hidden z-50"
                  style={{ background: "var(--card)", border: "1px solid var(--card-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--card-border)" }}>
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>Notifications</span>
                    <button onClick={() => setShowNotifications(false)}>
                      <X size={14} style={{ color: "var(--muted)" }} />
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={cn(
                          "px-4 py-3 border-b transition-colors hover:bg-white/5",
                          !n.read && "bg-white/2"
                        )}
                        style={{ borderColor: "var(--card-border)" }}
                      >
                        <div className="flex items-start gap-3">
                          {severityIcon[n.severity]}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold truncate" style={{ color: "var(--foreground)" }}>
                                {n.title}
                              </span>
                              {!n.read && (
                                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "#6366f1" }} />
                              )}
                            </div>
                            <p className="text-xs mt-0.5 leading-relaxed" style={{ color: "var(--muted)" }}>
                              {n.message}
                            </p>
                            <span className="text-xs mt-1 block" style={{ color: "var(--muted)" }}>
                              {formatRelativeTime(n.timestamp)} · {n.source}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Search Modal */}
      <AnimatePresence>
        {showSearch && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
              onClick={() => setShowSearch(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.15 }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-xl z-50 rounded-xl overflow-hidden"
              style={{ background: "var(--card)", border: "1px solid var(--card-border)", boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: "var(--card-border)" }}>
                <Search size={16} style={{ color: "var(--muted)" }} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search workflows, agents, tasks, logs..."
                  className="flex-1 bg-transparent text-sm outline-none"
                  style={{ color: "var(--foreground)" }}
                />
                <kbd className="text-xs px-2 py-1 rounded" style={{ background: "var(--muted-bg)", color: "var(--muted)", border: "1px solid var(--card-border)" }}>
                  ESC
                </kbd>
              </div>
              <div className="p-4">
                <div className="text-xs mb-2" style={{ color: "var(--muted)" }}>Quick Links</div>
                {["WF-2847 — Invoice Classification", "AGT-002 — Support Triage", "REV-10469 — PHI Redaction Review", "LOG-84921 — Orchestrator tick"].map((item) => (
                  <div
                    key={item}
                    onClick={() => setShowSearch(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors hover:bg-white/5"
                  >
                    <Search size={13} style={{ color: "var(--muted)" }} />
                    <span className="text-sm" style={{ color: "var(--foreground)" }}>{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
