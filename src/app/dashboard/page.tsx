"use client";

import { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/glow";
import { StateCheckModal } from "@/components/dashboard/state-check-modal";
import { ReferralModal } from "@/components/dashboard/referral-modal";

export type EdgeStatus = "EDGE_FOUND" | "NO_EDGE" | "EDGE_NEGATIVE";
export type EnergyLevel = "low" | "normal" | "high";
export type MentalClarity = "distracted" | "focused";
export type EmotionalPressure = "calm" | "impulsive";
export type UrgeToAct = "low" | "high";

export interface UserState {
  energy: EnergyLevel;
  clarity: MentalClarity;
  pressure: EmotionalPressure;
  urge: UrgeToAct;
  timestamp: Date;
}

const edgeConfig = {
  EDGE_FOUND: {
    label: "EDGE FOUND",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    description: "Your historical data shows a statistically favorable decision setup.",
  },
  NO_EDGE: {
    label: "NO EDGE",
    color: "text-[var(--accent)]",
    bg: "bg-[var(--accent)]/10",
    border: "border-[var(--accent)]/30",
    description: "No statistically meaningful edge detected for you at this time.",
  },
  EDGE_NEGATIVE: {
    label: "EDGE NEGATIVE",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    description: "In similar situations, your decisions historically underperform.",
  },
};

export default function DashboardPage() {
  const [showStateCheck, setShowStateCheck] = useState(true);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [userState, setUserState] = useState<UserState | null>(null);
  const [edgeStatus, setEdgeStatus] = useState<EdgeStatus>("NO_EDGE");

  useEffect(() => {
    if (!userState) return;
    let score = 0;
    if (userState.energy === "normal") score += 1;
    if (userState.energy === "low") score -= 1;
    if (userState.clarity === "focused") score += 2;
    if (userState.clarity === "distracted") score -= 2;
    if (userState.pressure === "calm") score += 1;
    if (userState.pressure === "impulsive") score -= 2;
    if (userState.urge === "low") score += 1;
    if (userState.urge === "high") score -= 2;

    if (score >= 3) setEdgeStatus("EDGE_FOUND");
    else if (score <= -2) setEdgeStatus("EDGE_NEGATIVE");
    else setEdgeStatus("NO_EDGE");
  }, [userState]);

  const handleStateSubmit = (state: UserState) => {
    setUserState(state);
    setShowStateCheck(false);
  };

  const config = edgeConfig[edgeStatus];

  return (
    <div className="min-h-screen">
      {/* State Check Modal */}
      {showStateCheck && <StateCheckModal onSubmit={handleStateSubmit} />}

      {/* Referral Modal */}
      <ReferralModal isOpen={showReferralModal} onClose={() => setShowReferralModal(false)} />

      <div className={showStateCheck ? "blur-sm pointer-events-none" : ""}>
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-8 py-4">
            {/* Left: Title */}
            <div>
              <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
                DECISION INTELLIGENCE
              </div>
              <h1 className="text-xl font-semibold tracking-tight">
                Edge Engine
              </h1>
            </div>

            {/* Center: Referral Button */}
            <button
              onClick={() => setShowReferralModal(true)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2 text-sm font-medium text-[var(--muted)] hover:text-white transition-colors"
            >
              <span>🔗</span>
              Referral
            </button>

            {/* Right: Status */}
            <div className={`flex items-center gap-3 rounded-xl px-4 py-2 ${config.bg} border ${config.border}`}>
              <div className={`h-2 w-2 rounded-full ${edgeStatus === "EDGE_FOUND" ? "bg-emerald-400" : edgeStatus === "EDGE_NEGATIVE" ? "bg-red-400" : "bg-[var(--accent)]"}`} 
                style={{ boxShadow: `0 0 12px currentColor` }} />
              <span className={`text-sm font-semibold ${config.color}`}>{config.label}</span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="p-8">
          {/* Status Banner - Compact */}
          <div className="mb-6 flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2.5">
            <div className="flex items-center gap-3">
              <div className={`text-lg font-bold ${config.color}`}>
                {edgeStatus === "EDGE_FOUND" ? "✓" : edgeStatus === "EDGE_NEGATIVE" ? "✕" : "○"}
              </div>
              <div>
                <div className={`text-sm font-semibold ${config.color}`}>{config.label}</div>
                <div className="text-xs text-[var(--muted)]">{config.description}</div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Left Column */}
            <div className="space-y-6 lg:col-span-7">
              {/* AI Context Signal */}
              <GlowCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
                      AI CONTEXT SIGNAL
                    </div>
                    <div className="mt-1 text-lg font-semibold">Public Information Flow</div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-1 text-xs text-[var(--muted)]">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--glow)]" />
                    Live
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                    <div className="text-xs text-[var(--muted)]">Current Signal</div>
                    <div className="mt-1 text-xl font-bold text-[var(--accent)]">SLIGHTLY BEARISH</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                    <div className="text-xs text-[var(--muted)]">Confidence Range</div>
                    <div className="mt-1 text-xl font-bold">Moderate</div>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  {[
                    "Increased negative sentiment detected on X within the last 4 hours",
                    "Reddit discussions show rising uncertainty",
                    "Recent news headlines emphasize downside risks",
                  ].map((reason, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm text-[var(--muted)]">
                      <span className="text-[var(--accent)]">•</span>
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-[var(--border)] text-xs text-[var(--muted)]">
                  This signal reflects aggregated public information. It is not a recommendation or forecast.
                </div>
              </GlowCard>

              {/* Edge Zones */}
              <div className="grid gap-4 sm:grid-cols-2">
                <GlowCard className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-emerald-400">↑</span>
                    <span className="text-[10px] tracking-[0.2em] text-[var(--muted)]">POSITIVE EDGE ZONES</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { cond: "Confidence 62–74%", impact: "+18%" },
                      { cond: "Focused state", impact: "+11%" },
                      { cond: "Low urge to act", impact: "+8%" },
                    ].map((z) => (
                      <div key={z.cond} className="flex items-center justify-between rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2">
                        <span className="text-sm">{z.cond}</span>
                        <span className="text-sm font-bold text-emerald-400">{z.impact}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>

                <GlowCard className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-red-400">↓</span>
                    <span className="text-[10px] tracking-[0.2em] text-[var(--muted)]">NEGATIVE EDGE ZONES</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { cond: "Confidence above 85%", impact: "–23%" },
                      { cond: "Impulsive state", impact: "–19%" },
                      { cond: "High urge to act", impact: "–14%" },
                    ].map((z) => (
                      <div key={z.cond} className="flex items-center justify-between rounded-lg bg-red-500/5 border border-red-500/20 px-3 py-2">
                        <span className="text-sm">{z.cond}</span>
                        <span className="text-sm font-bold text-red-400">{z.impact}</span>
                      </div>
                    ))}
                  </div>
                </GlowCard>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6 lg:col-span-5">
              {/* Current State */}
              {userState && (
                <GlowCard className="p-5">
                  <div className="text-[10px] tracking-[0.25em] text-[var(--muted)] mb-3">
                    CURRENT STATE
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Energy", value: userState.energy },
                      { label: "Clarity", value: userState.clarity },
                      { label: "Pressure", value: userState.pressure },
                      { label: "Urge", value: userState.urge },
                    ].map((s) => {
                      const isNegative = s.value === "distracted" || s.value === "impulsive" || s.value === "high" || s.value === "low";
                      return (
                        <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3">
                          <div className="text-xs text-[var(--muted)]">{s.label}</div>
                          <div className={`mt-1 text-sm font-medium capitalize ${isNegative ? "text-[var(--accent)]" : "text-emerald-400"}`}>
                            {s.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => setShowStateCheck(true)}
                    className="mt-3 w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] py-2 text-sm text-[var(--muted)] hover:text-white transition-colors"
                  >
                    Update State
                  </button>
                </GlowCard>
              )}

              {/* Confidence Calibration */}
              <GlowCard className="p-5">
                <div className="text-[10px] tracking-[0.25em] text-[var(--muted)] mb-3">
                  CONFIDENCE CALIBRATION
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3 text-center">
                    <div className="text-xs text-[var(--muted)]">Your Confidence</div>
                    <div className="mt-1 text-2xl font-bold">78%</div>
                  </div>
                  <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-3 text-center">
                    <div className="text-xs text-[var(--muted)]">Historical Accuracy</div>
                    <div className="mt-1 text-2xl font-bold text-[var(--accent)]">57%</div>
                  </div>
                </div>
                <div className="rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 p-3">
                  <p className="text-sm text-[var(--accent)]">
                    You tend to overestimate accuracy at higher confidence levels.
                  </p>
                </div>
              </GlowCard>

              {/* Log Decision */}
              <GlowCard className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
                    LOG A DECISION
                  </div>
                  <span className="text-xs text-[var(--muted)]">Optional</span>
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Context / Topic"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2.5 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]/50"
                  />
                  <input
                    type="text"
                    placeholder="Expected Outcome"
                    className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2.5 text-sm placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]/50"
                  />
                  <div>
                    <div className="flex justify-between text-xs text-[var(--muted)] mb-1">
                      <span>Confidence</span>
                      <span>50%</span>
                    </div>
                    <input
                      type="range"
                      className="w-full h-1.5 bg-[var(--panel-2)] rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent)]"
                    />
                  </div>
                  <button className="w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-black hover:brightness-110 transition">
                    Log Decision
                  </button>
                </div>
                <p className="mt-3 text-xs text-[var(--muted)] text-center">
                  Logging decisions improves your personal edge model.
                </p>
              </GlowCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
