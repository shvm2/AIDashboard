import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60_000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60_000).toFixed(1)}m`;
}

export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;

  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

export function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "running":
    case "active":
    case "healthy":
      return "#22c55e";
    case "idle":
    case "completed":
      return "#6366f1";
    case "error":
    case "critical":
    case "offline":
      return "#ef4444";
    case "paused":
    case "degraded":
    case "warn":
      return "#f59e0b";
    case "queued":
    case "pending":
      return "#71717a";
    default:
      return "#71717a";
  }
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "debug": return "#71717a";
    case "info": return "#6366f1";
    case "warn": return "#f59e0b";
    case "error": return "#ef4444";
    case "critical": return "#dc2626";
    default: return "#71717a";
  }
}

// Generate time-series data for charts
export function generateTimeSeries(
  days: number,
  baseValue: number,
  variance: number
): Array<{ date: string; value: number }> {
  const result = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const value = Math.max(
      0,
      Math.round(baseValue + (Math.random() - 0.5) * variance * 2)
    );
    result.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value,
    });
  }
  return result;
}

export function clampPercent(v: number): number {
  return Math.min(100, Math.max(0, v));
}
