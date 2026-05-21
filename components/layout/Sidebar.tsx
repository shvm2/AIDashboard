"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  GitBranch,
  Bot,
  Workflow,
  ClipboardCheck,
  BarChart3,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  Building2,
  Bell,
  ChevronDown,
  Circle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "Operations",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/workflows", label: "Workflows", icon: GitBranch },
      { href: "/agents", label: "AI Agents", icon: Bot },
      { href: "/pipelines", label: "Pipelines", icon: Workflow },
    ],
  },
  {
    label: "Review & Analysis",
    items: [
      { href: "/review", label: "Human Review", icon: ClipboardCheck, badge: 6 },
      { href: "/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/logs", label: "System Logs", icon: ScrollText },
    ],
  },
  {
    label: "Platform",
    items: [{ href: "/settings", label: "Settings", icon: Settings }],
  },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 60 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative flex flex-col h-full overflow-hidden border-r flex-shrink-0"
      style={{ borderColor: "var(--card-border)", background: "var(--card)" }}
    >
      {/* Logo / Org */}
      <div className="flex items-center gap-3 px-4 border-b h-14 flex-shrink-0" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent-glow)", border: "1px solid var(--accent)" }}>
          <Zap size={14} style={{ color: "var(--accent)" }} />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden whitespace-nowrap"
            >
              <div className="text-sm font-semibold tracking-tight" style={{ color: "var(--foreground)" }}>
                NeuralOps
              </div>
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                AI Workflow Platform
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Org Selector */}
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-3 mt-3 mb-2 px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2 transition-colors hover:bg-white/5"
          style={{ border: "1px solid var(--card-border)" }}
        >
          <Building2 size={14} style={{ color: "var(--muted)" }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
              Acme Corp
            </div>
            <div className="text-xs" style={{ color: "var(--muted)" }}>
              Production
            </div>
          </div>
          <ChevronDown size={12} style={{ color: "var(--muted)" }} />
        </motion.div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <div className="px-2 py-1 mb-1">
                <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                  {section.label}
                </span>
              </div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "sidebar-link flex items-center gap-3 px-3 py-2 rounded-lg mb-0.5 transition-all duration-150 relative",
                    isActive ? "active" : ""
                  )}
                  style={{
                    background: isActive ? "var(--accent-glow)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--muted)",
                  }}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-sm font-medium whitespace-nowrap flex-1"
                        style={{ color: isActive ? "var(--accent)" : "var(--foreground)" }}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {"badge" in item && item.badge && !collapsed && (
                    <span
                      className="text-xs font-medium px-1.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: "#ef444420", color: "#ef4444" }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {"badge" in item && item.badge && collapsed && (
                    <span
                      className="absolute top-1 right-1 w-2 h-2 rounded-full"
                      style={{ background: "#ef4444" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="border-t px-3 py-3 flex-shrink-0" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-3">
          <div className="relative flex-shrink-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ background: "var(--accent-glow)", border: "1px solid var(--accent)", color: "var(--accent)" }}
            >
              AS
            </div>
            <span
              className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
              style={{ background: "#22c55e", borderColor: "var(--card)" }}
            />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <div className="text-xs font-medium truncate" style={{ color: "var(--foreground)" }}>
                  Aiden Scott
                </div>
                <div className="text-xs truncate" style={{ color: "var(--muted)" }}>
                  Ops Engineer · Admin
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 rounded-full flex items-center justify-center border transition-colors hover:bg-zinc-700 z-10"
        style={{ background: "var(--card)", borderColor: "var(--card-border)" }}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight size={12} style={{ color: "var(--muted)" }} />
        ) : (
          <ChevronLeft size={12} style={{ color: "var(--muted)" }} />
        )}
      </button>
    </motion.aside>
  );
}
