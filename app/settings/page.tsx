"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Save, RotateCcw, Settings, Bot, Sliders, Bell, ShieldCheck, Users } from "lucide-react";

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}

function Toggle({ checked, onChange, id }: ToggleProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative w-9 h-5 rounded-full transition-colors flex-shrink-0"
      style={{ background: checked ? "var(--accent)" : "var(--muted-bg)", border: `1px solid ${checked ? "var(--accent)" : "var(--card-border)"}` }}
    >
      <span
        className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
        style={{
          background: "#fff",
          left: checked ? "calc(100% - 18px)" : "1px",
        }}
      />
    </button>
  );
}

function SliderInput({ value, onChange, min, max, step, id }: { value: number; onChange: (v: number) => void; min: number; max: number; step: number; id: string }) {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
      style={{ accentColor: "var(--accent)" }}
    />
  );
}

const sections = [
  { id: "model", label: "AI Model Settings", icon: Bot },
  { id: "automation", label: "Automation Thresholds", icon: Sliders },
  { id: "queue", label: "Queue & Retry", icon: Settings },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security & Compliance", icon: ShieldCheck },
  { id: "roles", label: "Role Configuration", icon: Users },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState("model");
  const [saved, setSaved] = useState(false);

  // Model settings
  const [temperature, setTemperature] = useState(0.2);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [primaryModel, setPrimaryModel] = useState("gpt-4o");

  // Automation thresholds
  const [autoApproveThreshold, setAutoApproveThreshold] = useState(95);
  const [escalationThreshold, setEscalationThreshold] = useState(60);
  const [humanReviewEnabled, setHumanReviewEnabled] = useState(true);
  const [autoScaleEnabled, setAutoScaleEnabled] = useState(true);

  // Queue settings
  const [maxQueueDepth, setMaxQueueDepth] = useState(5000);
  const [maxRetries, setMaxRetries] = useState(3);
  const [retryBackoff, setRetryBackoff] = useState(2000);
  const [queueSaturationAlert, setQueueSaturationAlert] = useState(80);

  // Notifications
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [slackAlerts, setSlackAlerts] = useState(true);
  const [pagerDutyEnabled, setPagerDutyEnabled] = useState(false);
  const [criticalOnly, setCriticalOnly] = useState(false);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const roles = [
    { name: "Ops Engineer", permissions: ["View All", "Edit Workflows", "Manage Agents", "Review Queue"], count: 4 },
    { name: "ML Engineer", permissions: ["View All", "Edit Model Settings", "View Logs"], count: 6 },
    { name: "Compliance Reviewer", permissions: ["View All", "Review Queue", "Export Reports"], count: 3 },
    { name: "Admin", permissions: ["Full Access"], count: 2 },
    { name: "Read Only", permissions: ["View All"], count: 8 },
  ];

  return (
    <div className="flex h-full">
      {/* Sidebar nav */}
      <div
        className="w-56 flex-shrink-0 border-r p-3 space-y-1"
        style={{ borderColor: "var(--card-border)", background: "var(--card)" }}
      >
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm"
              style={{
                background: activeSection === s.id ? "var(--accent-glow)" : "transparent",
                color: activeSection === s.id ? "var(--accent)" : "var(--muted)",
              }}
            >
              <Icon size={14} />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* AI Model Settings */}
          {activeSection === "model" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>AI Model Settings</h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Configure inference parameters for AI pipeline models.</p>
              </div>

              <div className="rounded-xl divide-y" style={{ background: "var(--card)", border: "1px solid var(--card-border)", borderColor: "var(--card-border)" }}>
                <div className="p-4 space-y-3">
                  <label className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Primary Model</label>
                  <select
                    id="primary-model"
                    value={primaryModel}
                    onChange={(e) => setPrimaryModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                    style={{ background: "var(--muted-bg)", border: "1px solid var(--card-border)", color: "var(--foreground)" }}
                  >
                    <option>gpt-4o</option>
                    <option>gpt-4o-mini-2024-07-18</option>
                    <option>claude-3-5-sonnet-20241022</option>
                    <option>claude-3-haiku-20240307</option>
                  </select>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>Used for classification and extraction tasks.</p>
                </div>

                {[
                  { label: "Temperature", id: "temperature-slider", value: temperature, setValue: setTemperature, min: 0, max: 1, step: 0.05, desc: "Higher = more creative, Lower = more deterministic" },
                  { label: "AI Confidence Threshold", id: "confidence-slider", value: confidenceThreshold, setValue: setConfidenceThreshold, min: 50, max: 99, step: 1, desc: "Documents below this threshold are routed to human review", unit: "%" },
                ].map((s) => (
                  <div key={s.id} className="p-4 space-y-3" style={{ borderTop: "1px solid var(--card-border)" }}>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium" htmlFor={s.id} style={{ color: "var(--foreground)" }}>{s.label}</label>
                      <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{s.value}{s.unit ?? ""}</span>
                    </div>
                    <SliderInput id={s.id} value={s.value} onChange={s.setValue} min={s.min} max={s.max} step={s.step} />
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{s.desc}</p>
                  </div>
                ))}

                <div className="p-4 space-y-3" style={{ borderTop: "1px solid var(--card-border)" }}>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium" htmlFor="max-tokens-slider" style={{ color: "var(--foreground)" }}>Max Output Tokens</label>
                    <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{maxTokens.toLocaleString()}</span>
                  </div>
                  <SliderInput id="max-tokens-slider" value={maxTokens} onChange={setMaxTokens} min={512} max={8192} step={256} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Automation Thresholds */}
          {activeSection === "automation" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>Automation Thresholds</h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Control when the system auto-approves, escalates, or routes to human review.</p>
              </div>
              <div className="rounded-xl divide-y" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                {[
                  { label: "Auto-Approve Threshold", id: "auto-approve-slider", value: autoApproveThreshold, setValue: setAutoApproveThreshold, min: 80, max: 100, step: 1, desc: "Documents above this confidence are automatically approved", unit: "%" },
                  { label: "Escalation Threshold", id: "escalation-slider", value: escalationThreshold, setValue: setEscalationThreshold, min: 40, max: 85, step: 1, desc: "Documents below this confidence are escalated immediately", unit: "%" },
                ].map((s, i) => (
                  <div key={s.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium" htmlFor={s.id} style={{ color: "var(--foreground)" }}>{s.label}</label>
                      <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{s.value}{s.unit}</span>
                    </div>
                    <SliderInput id={s.id} value={s.value} onChange={s.setValue} min={s.min} max={s.max} step={s.step} />
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{s.desc}</p>
                  </div>
                ))}
                {[
                  { label: "Enable Human Review Queue", id: "human-review-toggle", value: humanReviewEnabled, setValue: setHumanReviewEnabled, desc: "Automatically route low-confidence documents to human reviewers" },
                  { label: "Enable Agent Auto-Scaling", id: "auto-scale-toggle", value: autoScaleEnabled, setValue: setAutoScaleEnabled, desc: "Automatically scale agent instances based on queue depth" },
                ].map((s) => (
                  <div key={s.id} className="p-4 flex items-start justify-between gap-4" style={{ borderTop: "1px solid var(--card-border)" }}>
                    <div>
                      <label className="text-sm font-medium" htmlFor={s.id} style={{ color: "var(--foreground)" }}>{s.label}</label>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.desc}</p>
                    </div>
                    <Toggle id={s.id} checked={s.value} onChange={s.setValue} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Queue & Retry */}
          {activeSection === "queue" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>Queue & Retry Configuration</h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Configure queue limits, retry policies, and saturation alerts.</p>
              </div>
              <div className="rounded-xl divide-y" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                {[
                  { label: "Max Queue Depth", id: "max-queue-slider", value: maxQueueDepth, setValue: setMaxQueueDepth, min: 1000, max: 20000, step: 500, desc: "Maximum items per stage before rejection" },
                  { label: "Max Retries", id: "max-retries-slider", value: maxRetries, setValue: setMaxRetries, min: 0, max: 10, step: 1, desc: "Maximum retry attempts per failed task" },
                  { label: "Retry Backoff (ms)", id: "retry-backoff-slider", value: retryBackoff, setValue: setRetryBackoff, min: 500, max: 30000, step: 500, desc: "Base backoff duration between retry attempts" },
                  { label: "Queue Saturation Alert (%)", id: "saturation-slider", value: queueSaturationAlert, setValue: setQueueSaturationAlert, min: 50, max: 95, step: 5, desc: "Send alert when queue exceeds this saturation level", unit: "%" },
                ].map((s) => (
                  <div key={s.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium" htmlFor={s.id} style={{ color: "var(--foreground)" }}>{s.label}</label>
                      <span className="text-sm font-bold" style={{ color: "var(--accent)" }}>{s.value.toLocaleString()}{("unit" in s) ? s.unit : ""}</span>
                    </div>
                    <SliderInput id={s.id} value={s.value} onChange={s.setValue} min={s.min} max={s.max} step={s.step} />
                    <p className="text-xs" style={{ color: "var(--muted)" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeSection === "notifications" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>Notification Settings</h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>Configure alert channels and severity thresholds.</p>
              </div>
              <div className="rounded-xl divide-y" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                {[
                  { label: "Email Alerts", id: "email-alerts", value: emailAlerts, setValue: setEmailAlerts, desc: "Send critical alerts to ops@neuralops.ai" },
                  { label: "Slack Notifications", id: "slack-alerts", value: slackAlerts, setValue: setSlackAlerts, desc: "Post alerts to #ai-ops-alerts channel" },
                  { label: "PagerDuty Integration", id: "pager-duty", value: pagerDutyEnabled, setValue: setPagerDutyEnabled, desc: "Trigger PagerDuty incidents for critical failures" },
                  { label: "Critical Failures Only", id: "critical-only", value: criticalOnly, setValue: setCriticalOnly, desc: "Suppress warning-level notifications" },
                ].map((s) => (
                  <div key={s.id} className="p-4 flex items-start justify-between gap-4">
                    <div>
                      <label className="text-sm font-medium" htmlFor={s.id} style={{ color: "var(--foreground)" }}>{s.label}</label>
                      <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{s.desc}</p>
                    </div>
                    <Toggle id={s.id} checked={s.value} onChange={s.setValue} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Roles */}
          {(activeSection === "roles" || activeSection === "security") && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
              <div>
                <h2 className="text-base font-semibold mb-1" style={{ color: "var(--foreground)" }}>
                  {activeSection === "roles" ? "Role Configuration" : "Security & Compliance"}
                </h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  {activeSection === "roles" ? "View and manage role permissions across the platform." : "Compliance and security posture settings."}
                </p>
              </div>
              {activeSection === "roles" && (
                <div className="rounded-xl overflow-hidden" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                  <div className="grid text-xs font-medium px-4 py-2.5 border-b" style={{ gridTemplateColumns: "1fr 2fr 60px", borderColor: "var(--card-border)", color: "var(--muted)", background: "var(--muted-bg)" }}>
                    <div>Role</div>
                    <div>Permissions</div>
                    <div className="text-right">Users</div>
                  </div>
                  <div className="divide-y" style={{ borderColor: "var(--card-border)" }}>
                    {roles.map((role) => (
                      <div key={role.name} className="grid items-center px-4 py-3 gap-4" style={{ gridTemplateColumns: "1fr 2fr 60px" }}>
                        <div className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{role.name}</div>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.map((p) => (
                            <span key={p} className="text-xs px-2 py-0.5 rounded" style={{ background: "var(--muted-bg)", color: "var(--muted)", border: "1px solid var(--card-border)" }}>{p}</span>
                          ))}
                        </div>
                        <div className="text-sm text-right" style={{ color: "var(--muted)" }}>{role.count}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === "security" && (
                <div className="rounded-xl divide-y" style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}>
                  {[
                    { key: "SOC 2 Type II", value: "Compliant", color: "#22c55e" },
                    { key: "HIPAA", value: "Compliant", color: "#22c55e" },
                    { key: "GDPR", value: "Review Required", color: "#f59e0b" },
                    { key: "Data Encryption", value: "AES-256 at rest, TLS 1.3 in transit", color: "var(--foreground)" },
                    { key: "Audit Log Retention", value: "90 days", color: "var(--foreground)" },
                    { key: "SSO Provider", value: "Okta (configured)", color: "var(--foreground)" },
                  ].map((row) => (
                    <div key={row.key} className="flex items-center justify-between px-4 py-3">
                      <span className="text-sm" style={{ color: "var(--muted)" }}>{row.key}</span>
                      <span className="text-sm font-medium" style={{ color: row.color }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Save button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{ background: saved ? "#22c55e" : "var(--accent)", color: "#fff" }}
            >
              <Save size={14} />
              {saved ? "Saved!" : "Save Changes"}
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-white/5"
              style={{ background: "var(--card)", color: "var(--muted)", border: "1px solid var(--card-border)" }}
            >
              <RotateCcw size={14} />
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
