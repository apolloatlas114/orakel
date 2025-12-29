"use client";

import type { Decision } from "@/app/dashboard/page";

interface DecisionHistoryProps {
  decisions: Decision[];
}

const edgeStatusConfig = {
  EDGE_FOUND: { label: "Edge Found", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  NO_EDGE: { label: "No Edge", color: "text-amber-400", bg: "bg-amber-500/10" },
  EDGE_NEGATIVE: { label: "Edge Negative", color: "text-red-400", bg: "bg-red-500/10" },
};

export function DecisionHistory({ decisions }: DecisionHistoryProps) {
  // Calculate weekly stats
  const weeklyStats = {
    total: decisions.length,
    correct: decisions.filter((d) => d.outcome === "correct").length,
    ignoredWarnings: decisions.filter(
      (d) => d.edgeStatus === "EDGE_NEGATIVE" && d.outcome === "incorrect"
    ).length,
  };

  const accuracy = weeklyStats.total > 0
    ? Math.round((weeklyStats.correct / weeklyStats.total) * 100)
    : 0;

  return (
    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Decision History</h3>
          <span className="text-xs text-white/40">Last 7 days</span>
        </div>
      </div>

      {/* Weekly Insight */}
      <div className="px-6 py-4 bg-violet-500/5 border-b border-white/5">
        <p className="text-xs text-violet-400 uppercase tracking-wider mb-2">
          Weekly Insight
        </p>
        <div className="space-y-2">
          {weeklyStats.ignoredWarnings > 0 && (
            <p className="text-sm text-white/70">
              • You ignored{" "}
              <span className="text-red-400 font-medium">
                {weeklyStats.ignoredWarnings} negative edge warning{weeklyStats.ignoredWarnings > 1 ? "s" : ""}
              </span>{" "}
              this week.
            </p>
          )}
          <p className="text-sm text-white/70">
            • When respecting edge signals, your accuracy improves by{" "}
            <span className="text-emerald-400 font-medium">14%</span>.
          </p>
          <p className="text-sm text-white/70">
            • Overall accuracy this week:{" "}
            <span
              className={`font-medium ${
                accuracy >= 60 ? "text-emerald-400" : accuracy >= 40 ? "text-amber-400" : "text-red-400"
              }`}
            >
              {accuracy}%
            </span>
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="divide-y divide-white/5">
        {decisions.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <p className="text-white/40">No decisions logged yet</p>
            <p className="text-xs text-white/30 mt-1">
              Start logging to build your edge model
            </p>
          </div>
        ) : (
          decisions.map((decision) => (
            <DecisionRow key={decision.id} decision={decision} />
          ))
        )}
      </div>

      {/* Footer */}
      {decisions.length > 0 && (
        <div className="px-6 py-3 border-t border-white/5 bg-white/[0.02]">
          <button className="text-xs text-violet-400 hover:text-violet-300 transition-colors">
            View full history →
          </button>
        </div>
      )}
    </div>
  );
}

function DecisionRow({ decision }: { decision: Decision }) {
  const edgeConfig = edgeStatusConfig[decision.edgeStatus];
  const outcomeConfig = decision.outcome
    ? decision.outcome === "correct"
      ? { label: "Correct", color: "text-emerald-400" }
      : { label: "Incorrect", color: "text-red-400" }
    : null;

  const qualityLabel = decision.qualityScore
    ? decision.qualityScore >= 70
      ? "Good"
      : decision.qualityScore >= 40
      ? "Fair"
      : "Poor"
    : null;

  return (
    <div className="px-6 py-4 hover:bg-white/[0.02] transition-colors">
      <div className="flex items-start justify-between gap-4">
        {/* Left: Context */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-white truncate">{decision.context}</p>
          <p className="text-sm text-white/50 truncate">{decision.expectedOutcome}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className={`text-xs px-2 py-0.5 rounded-full ${edgeConfig.bg} ${edgeConfig.color}`}>
              {edgeConfig.label}
            </span>
            <span className="text-xs text-white/40">
              Confidence: {decision.confidence}%
            </span>
          </div>
        </div>

        {/* Right: Outcome */}
        <div className="text-right shrink-0">
          {outcomeConfig ? (
            <>
              <p className={`font-medium ${outcomeConfig.color}`}>
                {outcomeConfig.label}
              </p>
              {qualityLabel && (
                <p className="text-xs text-white/40 mt-1">
                  Quality: {qualityLabel}
                </p>
              )}
            </>
          ) : (
            <span className="text-xs text-white/30 px-2 py-1 bg-white/5 rounded">
              Pending
            </span>
          )}
          <p className="text-xs text-white/30 mt-1">
            {formatDate(decision.timestamp)}
          </p>
        </div>
      </div>

      {/* Quality vs Outcome insight */}
      {decision.outcome && decision.qualityScore && (
        <div className="mt-3 p-2 rounded-lg bg-white/5">
          <p className="text-xs text-white/50">
            {decision.outcome === "correct" && decision.qualityScore < 50
              ? "Outcome correct. Decision quality: poor."
              : decision.outcome === "incorrect" && decision.qualityScore >= 70
              ? "Outcome incorrect. Decision quality: statistically sound."
              : null}
          </p>
        </div>
      )}
    </div>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

