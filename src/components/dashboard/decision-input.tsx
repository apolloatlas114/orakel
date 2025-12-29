"use client";

import { useState } from "react";
import type { EdgeStatus, UserState, Decision } from "@/app/dashboard/page";

interface DecisionInputProps {
  onSubmit: (decision: Omit<Decision, "id" | "state" | "edgeStatus" | "timestamp">) => void;
  userState: UserState | null;
  edgeStatus: EdgeStatus;
}

export function DecisionInput({ onSubmit, userState, edgeStatus }: DecisionInputProps) {
  const [context, setContext] = useState("");
  const [expectedOutcome, setExpectedOutcome] = useState("");
  const [confidence, setConfidence] = useState(50);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!context || !expectedOutcome) return;

    onSubmit({
      context,
      expectedOutcome,
      confidence,
    });

    setSubmitted(true);
    setTimeout(() => {
      setContext("");
      setExpectedOutcome("");
      setConfidence(50);
      setSubmitted(false);
    }, 2000);
  };

  const confidenceZone = confidence > 85 ? "danger" : confidence >= 62 && confidence <= 74 ? "optimal" : "neutral";

  return (
    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Log a Decision</h3>
          <span className="text-xs text-white/40">Optional</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Context */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Context / Topic
          </label>
          <input
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g., Tech sector momentum"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-colors"
          />
        </div>

        {/* Expected Outcome */}
        <div>
          <label className="block text-xs text-white/50 uppercase tracking-wider mb-2">
            Expected Outcome
          </label>
          <input
            type="text"
            value={expectedOutcome}
            onChange={(e) => setExpectedOutcome(e.target.value)}
            placeholder="e.g., Continued uptrend"
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/50 transition-colors"
          />
        </div>

        {/* Confidence Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-white/50 uppercase tracking-wider">
              Confidence
            </label>
            <span
              className={`text-sm font-semibold ${
                confidenceZone === "danger"
                  ? "text-red-400"
                  : confidenceZone === "optimal"
                  ? "text-emerald-400"
                  : "text-white"
              }`}
            >
              {confidence}%
            </span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(Number(e.target.value))}
              className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:cursor-pointer"
            />
            {/* Optimal zone indicator */}
            <div
              className="absolute top-1/2 -translate-y-1/2 h-2 bg-emerald-500/30 rounded-full pointer-events-none"
              style={{ left: "62%", width: "12%" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-white/30">0%</span>
            <span className="text-xs text-emerald-400/50">Optimal: 62-74%</span>
            <span className="text-xs text-white/30">100%</span>
          </div>
        </div>

        {/* Warning if in negative edge */}
        {edgeStatus === "EDGE_NEGATIVE" && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-xs text-red-400">
              ⚠️ Your current edge is negative. Logging decisions in this state helps track patterns.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!context || !expectedOutcome || submitted}
          className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-white/10 disabled:text-white/30 rounded-xl font-medium transition-colors"
        >
          {submitted ? "✓ Decision Logged" : "Log Decision"}
        </button>

        {/* Helper text */}
        <p className="text-xs text-white/30 text-center">
          Logging decisions improves your personal edge model. No action is required.
        </p>
      </form>
    </div>
  );
}

