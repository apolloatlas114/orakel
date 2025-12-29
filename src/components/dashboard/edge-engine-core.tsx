"use client";

import type { EdgeStatus, UserState } from "@/app/dashboard/page";

interface EdgeEngineCoreProps {
  edgeStatus: EdgeStatus;
  userState: UserState | null;
  stateImpact: string | null;
}

const edgeConfig = {
  EDGE_FOUND: {
    label: "EDGE FOUND",
    action: "CONDITIONS FAVORABLE",
    color: "text-emerald-400",
    borderColor: "border-emerald-500",
    bgGradient: "from-emerald-500/20 to-transparent",
    icon: "✓",
    description: "Your historical decision patterns align positively with current conditions.",
  },
  NO_EDGE: {
    label: "NO EDGE",
    action: "NO CLEAR ADVANTAGE",
    color: "text-amber-400",
    borderColor: "border-amber-500",
    bgGradient: "from-amber-500/20 to-transparent",
    icon: "○",
    description: "Your data does not show a reliable advantage in this setup.",
  },
  EDGE_NEGATIVE: {
    label: "EDGE NEGATIVE",
    action: "DO NOT ACT",
    color: "text-red-400",
    borderColor: "border-red-500",
    bgGradient: "from-red-500/20 to-transparent",
    icon: "✕",
    description: "Your historical data shows elevated risk of poor decisions here.",
  },
};

const stateReasons: Record<string, string> = {
  distracted: "Low mental clarity reduces decision accuracy",
  impulsive: "Your current state correlates with impulsive outcomes",
  high_urge: "High urge to act historically reduces your edge",
  low_energy: "Low energy levels affect decision quality",
  overconfident: "High confidence decisions reduce your accuracy",
};

export function EdgeEngineCore({ edgeStatus, userState, stateImpact }: EdgeEngineCoreProps) {
  const config = edgeConfig[edgeStatus];

  // Generate reasons based on user state
  const reasons: string[] = [];
  if (userState) {
    if (userState.clarity === "distracted") reasons.push(stateReasons.distracted);
    if (userState.pressure === "impulsive") reasons.push(stateReasons.impulsive);
    if (userState.urge === "high") reasons.push(stateReasons.high_urge);
    if (userState.energy === "low") reasons.push(stateReasons.low_energy);
  }
  // Add generic reason if no specific ones
  if (reasons.length === 0 && edgeStatus === "NO_EDGE") {
    reasons.push("No statistically significant patterns detected");
  }

  return (
    <div className={`bg-[#12121a] border ${config.borderColor}/30 rounded-2xl overflow-hidden`}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Decision Permission</h3>
          <span className="text-xs text-white/40">Edge Engine Core</span>
        </div>
      </div>

      {/* Main Status */}
      <div className={`p-6 bg-gradient-to-b ${config.bgGradient}`}>
        <div className="text-center mb-6">
          <div
            className={`inline-flex items-center justify-center w-16 h-16 rounded-full border-2 ${config.borderColor} mb-4`}
          >
            <span className={`text-2xl ${config.color}`}>{config.icon}</span>
          </div>
          <p className={`text-2xl font-bold ${config.color} mb-2`}>{config.action}</p>
          <p className="text-sm text-white/60">{config.description}</p>
        </div>

        {/* State Impact */}
        {stateImpact && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-4">
            <p className="text-sm text-white/70">{stateImpact}</p>
          </div>
        )}

        {/* Reasons */}
        {reasons.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-white/50 uppercase tracking-wider">Why This Result</p>
            <ul className="space-y-2">
              {reasons.slice(0, 3).map((reason, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white/60">
                  <span className={config.color}>•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Current State Summary */}
      {userState && (
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02]">
          <p className="text-xs text-white/40 mb-3">Current State</p>
          <div className="flex flex-wrap gap-2">
            <StateTag label="Energy" value={userState.energy} />
            <StateTag label="Clarity" value={userState.clarity} />
            <StateTag label="Pressure" value={userState.pressure} />
            <StateTag label="Urge" value={userState.urge} />
          </div>
        </div>
      )}
    </div>
  );
}

function StateTag({ label, value }: { label: string; value: string }) {
  const isNegative = value === "distracted" || value === "impulsive" || value === "high" || value === "low";
  
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
        isNegative ? "bg-red-500/10 text-red-400" : "bg-emerald-500/10 text-emerald-400"
      }`}
    >
      <span className="text-white/50">{label}:</span>
      <span className="capitalize">{value}</span>
    </span>
  );
}

