"use client";

import { motion } from "framer-motion";
import { agents } from "@/lib/mock-data/agents";
import { AgentCard } from "@/components/agents/AgentCard";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export default function AgentsPage() {
  const activeCount = agents.filter((a) => a.status === "active").length;
  const degradedCount = agents.filter((a) => a.status === "degraded").length;

  return (
    <div className="p-6 space-y-6">
      {/* Header metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Agents", value: agents.length, color: "var(--foreground)" },
          { label: "Active", value: activeCount, color: "#22c55e" },
          { label: "Degraded", value: degradedCount, color: "#f59e0b" },
          {
            label: "Total Tasks Today",
            value: agents.reduce((s, a) => s + a.completedToday, 0).toLocaleString(),
            color: "var(--accent)",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl p-4"
            style={{ background: "var(--card)", border: "1px solid var(--card-border)" }}
          >
            <div className="text-xs mb-1" style={{ color: "var(--muted)" }}>
              {stat.label}
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Agent Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 xl:grid-cols-2 gap-4"
      >
        {agents.map((agent) => (
          <motion.div key={agent.id} variants={item}>
            <AgentCard agent={agent} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
