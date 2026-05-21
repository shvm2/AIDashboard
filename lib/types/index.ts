// ─── Types ────────────────────────────────────────────────────────────────────

export type WorkflowStatus =
  | "running"
  | "idle"
  | "error"
  | "paused"
  | "completed"
  | "queued";

export type WorkflowTrigger =
  | "schedule"
  | "event"
  | "manual"
  | "webhook"
  | "api";

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  throughput: number; // docs/hr
  avgProcessingTime: number; // ms
  lastExecution: string; // ISO
  nextExecution?: string;
  aiConfidence: number; // 0-100
  successRate: number; // 0-100
  totalRuns: number;
  failedRuns: number;
  tags: string[];
  dependencies: string[];
  retryPolicy: {
    maxRetries: number;
    backoffMs: number;
    strategy: "linear" | "exponential";
  };
  steps: WorkflowStep[];
}

export interface WorkflowStep {
  id: string;
  name: string;
  type: "ingestion" | "classification" | "validation" | "review" | "storage" | "notification";
  status: "completed" | "running" | "pending" | "failed";
  avgDurationMs: number;
}

// ─── Agent Types ──────────────────────────────────────────────────────────────

export type AgentStatus = "active" | "idle" | "degraded" | "offline";

export interface Agent {
  id: string;
  name: string;
  type: string;
  model: string;
  status: AgentStatus;
  health: number; // 0-100
  cpuUsage: number; // 0-100
  memoryUsage: number; // 0-100
  processingLoad: number; // 0-100
  avgResponseLatency: number; // ms
  p99Latency: number; // ms
  assignedTasks: number;
  completedToday: number;
  queueDepth: number;
  uptime: string;
  lastActivity: string;
  confidenceAvg: number;
  latencyHistory: number[]; // last 20 values
}

// ─── Pipeline Types ───────────────────────────────────────────────────────────

export type StageStatus = "healthy" | "degraded" | "critical" | "offline";

export interface PipelineStage {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  status: StageStatus;
  queueSize: number;
  throughput: number; // docs/min
  processingRate: number; // docs/min capacity
  rejectionRate: number; // 0-100
  confidenceAvg: number; // 0-100
  errorCount: number;
  avgLatencyMs: number;
  lastUpdated: string;
}

// ─── Review Queue Types ───────────────────────────────────────────────────────

export type ReviewStatus = "pending" | "approved" | "rejected" | "escalated";
export type ReviewPriority = "low" | "medium" | "high" | "critical";

export interface ReviewItem {
  id: string;
  taskId: string;
  documentId: string;
  documentType: string;
  title: string;
  description: string;
  aiConfidence: number;
  confidenceThreshold: number;
  status: ReviewStatus;
  priority: ReviewPriority;
  flaggedReason: string;
  flaggedFields: string[];
  assignedAgent: string;
  submittedAt: string;
  dueBy: string;
  reviewerNote?: string;
  auditTags: string[];
  previewData: Record<string, string>;
}

// ─── Log Types ────────────────────────────────────────────────────────────────

export type LogSeverity = "debug" | "info" | "warn" | "error" | "critical";

export interface LogEntry {
  id: string;
  timestamp: string;
  severity: LogSeverity;
  source: string;
  event: string;
  message: string;
  traceId?: string;
  workflowId?: string;
  taskId?: string;
  metadata?: Record<string, string | number>;
  expanded?: boolean;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────

export interface TimeSeriesPoint {
  timestamp: string;
  value: number;
}

export interface DailyStats {
  date: string;
  processed: number;
  approved: number;
  rejected: number;
  errors: number;
  avgLatency: number;
  avgConfidence: number;
}

// ─── KPI Types ────────────────────────────────────────────────────────────────

export interface KPIMetric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change: number; // percent
  changeLabel: string;
  trend: "up" | "down" | "neutral";
  sparkline?: number[];
}

// ─── Notification Types ───────────────────────────────────────────────────────

export interface Notification {
  id: string;
  title: string;
  message: string;
  severity: "info" | "warning" | "error" | "success";
  timestamp: string;
  read: boolean;
  source: string;
}

// ─── Activity Feed ────────────────────────────────────────────────────────────

export interface ActivityEvent {
  id: string;
  type: "workflow_started" | "task_completed" | "error_detected" | "agent_scaled" | "review_flagged" | "threshold_breach" | "model_updated";
  message: string;
  detail?: string;
  timestamp: string;
  severity: "info" | "warn" | "error" | "success";
  workflowId?: string;
}
