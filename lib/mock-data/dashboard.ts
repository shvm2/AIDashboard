import type { DailyStats, KPIMetric, ActivityEvent, Notification } from "@/lib/types";

// 30-day daily stats
export const dailyStats: DailyStats[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date();
  date.setDate(date.getDate() - (29 - i));
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const base = isWeekend ? 3200 : 8400;
  const variance = isWeekend ? 400 : 1200;
  const processed = Math.round(base + (Math.random() - 0.5) * variance * 2);
  const approved = Math.round(processed * (0.88 + Math.random() * 0.06));
  const rejected = Math.round(processed * (0.04 + Math.random() * 0.03));
  const errors = Math.round(processed * (0.01 + Math.random() * 0.015));

  return {
    date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    processed,
    approved,
    rejected,
    errors,
    avgLatency: Math.round(1100 + (Math.random() - 0.5) * 400),
    avgConfidence: Math.round((89 + (Math.random() - 0.5) * 6) * 10) / 10,
  };
});

// Last 7 days for quick charts
export const last7Days = dailyStats.slice(-7);

// Hourly throughput for today
export const hourlyThroughput = Array.from({ length: 24 }, (_, i) => {
  const isPeakHour = i >= 9 && i <= 18;
  const base = isPeakHour ? 420 : 120;
  return {
    hour: `${i.toString().padStart(2, "0")}:00`,
    value: Math.round(base + (Math.random() - 0.5) * base * 0.4),
  };
});

// Latency percentiles over 7 days
export const latencyTimeSeries = last7Days.map((d) => ({
  date: d.date,
  p50: Math.round(d.avgLatency * 0.6),
  p95: Math.round(d.avgLatency * 1.4),
  p99: Math.round(d.avgLatency * 2.2),
}));

// Confidence distribution histogram
export const confidenceDistribution = [
  { range: "< 60%", count: 124 },
  { range: "60–70%", count: 287 },
  { range: "70–80%", count: 612 },
  { range: "80–85%", count: 1847 },
  { range: "85–90%", count: 3241 },
  { range: "90–95%", count: 5821 },
  { range: "95–99%", count: 7124 },
  { range: "99–100%", count: 2847 },
];

// Model usage breakdown
export const modelUsage = [
  { name: "gpt-4o", value: 38, color: "#6366f1" },
  { name: "gpt-4o-mini", value: 27, color: "#8b5cf6" },
  { name: "claude-3.5-sonnet", value: 22, color: "#a78bfa" },
  { name: "text-embedding-3-large", value: 9, color: "#c4b5fd" },
  { name: "other", value: 4, color: "#3f3f46" },
];

// Workflow performance by name
export const workflowPerformance = [
  { name: "Invoice Classification", throughput: 342, successRate: 97.8, avgLatency: 1240 },
  { name: "Support Triage", throughput: 1840, successRate: 99.1, avgLatency: 380 },
  { name: "Risk Analysis", throughput: 87, successRate: 95.2, avgLatency: 4200 },
  { name: "KB Sync", throughput: 0, successRate: 99.8, avgLatency: 2100 },
  { name: "Fraud Detection", throughput: 0, successRate: 87.3, avgLatency: 8400 },
  { name: "KYC Verification", throughput: 241, successRate: 96.1, avgLatency: 3600 },
];

// KPI metrics
export const kpiMetrics: KPIMetric[] = [
  {
    id: "total-processed",
    label: "Documents Processed Today",
    value: 84291,
    change: 12.4,
    changeLabel: "vs. yesterday",
    trend: "up",
    sparkline: last7Days.map((d) => d.processed),
  },
  {
    id: "active-workflows",
    label: "Active Workflows",
    value: 4,
    change: 0,
    changeLabel: "no change",
    trend: "neutral",
    sparkline: [3, 4, 4, 3, 4, 5, 4],
  },
  {
    id: "queued-jobs",
    label: "Queued Jobs",
    value: 6354,
    change: -8.2,
    changeLabel: "vs. 1hr ago",
    trend: "down",
    sparkline: [7200, 7100, 6800, 6500, 6400, 6354, 6354],
  },
  {
    id: "failed-tasks",
    label: "Failed Tasks (24h)",
    value: 127,
    change: 34.0,
    changeLabel: "vs. yesterday",
    trend: "up",
    sparkline: [89, 72, 104, 98, 81, 110, 127],
  },
  {
    id: "avg-latency",
    label: "Avg Orchestration Latency",
    value: "1.24s",
    change: -5.8,
    changeLabel: "vs. last hour",
    trend: "down",
  },
  {
    id: "ai-confidence",
    label: "Avg AI Confidence",
    value: "92.4%",
    change: 0.8,
    changeLabel: "vs. yesterday",
    trend: "up",
    sparkline: last7Days.map((d) => d.avgConfidence),
  },
];

// Activity feed events
export const activityEvents: ActivityEvent[] = [
  {
    id: "EVT-001",
    type: "error_detected",
    message: "Workflow WF-2871 failed after 3 retries",
    detail: "OutOfMemoryError in Feature Engineering step",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    severity: "error",
    workflowId: "WF-2871",
  },
  {
    id: "EVT-002",
    type: "threshold_breach",
    message: "Human Review queue at 81% saturation",
    detail: "3,241 items pending. Consider scaling review team.",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    severity: "warn",
  },
  {
    id: "EVT-003",
    type: "task_completed",
    message: "Invoice batch processed: 47 documents",
    detail: "WF-2847 completed. Avg confidence: 94.2%.",
    timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
    severity: "success",
    workflowId: "WF-2847",
  },
  {
    id: "EVT-004",
    type: "agent_scaled",
    message: "AGT-002 auto-scaled to 3 instances",
    detail: "Queue depth exceeded threshold. Latency expected to improve 28%.",
    timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    severity: "info",
  },
  {
    id: "EVT-005",
    type: "review_flagged",
    message: "Critical PHI redaction confidence failure",
    detail: "MRN-847291 routed to human review. HIPAA compliance at risk.",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    severity: "error",
  },
  {
    id: "EVT-006",
    type: "model_updated",
    message: "AGT-003 model rotated to claude-3.5-sonnet",
    detail: "Cost optimization cycle. Confidence delta: +1.2%.",
    timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
    severity: "info",
  },
  {
    id: "EVT-007",
    type: "workflow_started",
    message: "WF-2839 Risk Document Analysis started",
    detail: "Scheduled trigger. 23 contracts queued for analysis.",
    timestamp: new Date(Date.now() - 31 * 60 * 1000).toISOString(),
    severity: "info",
    workflowId: "WF-2839",
  },
  {
    id: "EVT-008",
    type: "task_completed",
    message: "Knowledge Base sync completed",
    detail: "1,248 new vectors indexed. Total: 2.4M. Latency: 47m.",
    timestamp: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    severity: "success",
    workflowId: "WF-2864",
  },
];

// Notifications
export const notifications: Notification[] = [
  {
    id: "NOTIF-001",
    title: "Workflow Failure",
    message: "WF-2871 (Fraud Detection Sweep) failed after 3 retries. Manual intervention required.",
    severity: "error",
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    read: false,
    source: "orchestrator",
  },
  {
    id: "NOTIF-002",
    title: "Queue Saturation Warning",
    message: "Human Review queue at 81% saturation. 3,241 items pending.",
    severity: "warning",
    timestamp: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
    read: false,
    source: "pipeline-monitor",
  },
  {
    id: "NOTIF-003",
    title: "HIPAA Compliance Alert",
    message: "PHI redaction confidence below 95% threshold on MRN-847291.",
    severity: "error",
    timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    read: false,
    source: "AGT-006",
  },
  {
    id: "NOTIF-004",
    title: "Agent Auto-Scaled",
    message: "Support Triage Agent scaled from 2 → 3 instances.",
    severity: "info",
    timestamp: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
    read: true,
    source: "system",
  },
  {
    id: "NOTIF-005",
    title: "Model Rotation Complete",
    message: "AGT-003 now using claude-3.5-sonnet. Confidence improved by 1.2%.",
    severity: "success",
    timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    read: true,
    source: "model-manager",
  },
];
