"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { KPIMetric } from "@/lib/types";

interface KPICardProps {
  metric: KPIMetric;
}

export function KPICard({ metric }: KPICardProps) {
  const trendColor =
    metric.trend === "up"
      ? metric.id === "failed-tasks" || metric.id === "queued-jobs"
        ? "#ef4444"
        : "#22c55e"
      : metric.trend === "down"
      ? metric.id === "failed-tasks" || metric.id === "queued-jobs"
        ? "#22c55e"
        : "#ef4444"
      : "var(--muted)";

  const TrendIcon =
    metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus;

  return (
    <div
      className="rounded-xl p-4 h-full flex flex-col gap-3"
      style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
    >
      <div className="text-xs font-medium" style={{ color: "var(--muted)" }}>
        {metric.label}
      </div>

      <div className="text-2xl font-bold tracking-tight" style={{ color: "var(--foreground)" }}>
        {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
      </div>

      <div className="flex items-center gap-1.5 text-xs">
        <TrendIcon size={12} style={{ color: trendColor }} />
        <span style={{ color: trendColor }}>
          {metric.change > 0 ? "+" : ""}{metric.change}%
        </span>
        <span style={{ color: "var(--muted)" }}>{metric.changeLabel}</span>
      </div>

      {/* Mini sparkline */}
      {metric.sparkline && (
        <div className="h-8 flex items-end gap-0.5">
          {metric.sparkline.map((v, i) => {
            const max = Math.max(...metric.sparkline!);
            const min = Math.min(...metric.sparkline!);
            const height = max === min ? 50 : ((v - min) / (max - min)) * 100;
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${Math.max(4, height)}%`,
                  background: i === metric.sparkline!.length - 1 ? "var(--accent)" : "var(--muted-bg)",
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
