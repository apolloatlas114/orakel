"use client";

import { useState } from "react";
import type { AISignal } from "@/app/dashboard/page";

interface AIContextSignalProps {
  signal: AISignal;
}

const signalConfig = {
  BULLISH: { label: "Bullish", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  SLIGHTLY_BULLISH: { label: "Slightly Bullish", color: "text-emerald-300", bg: "bg-emerald-500/10" },
  NEUTRAL: { label: "Neutral", color: "text-white/70", bg: "bg-white/5" },
  SLIGHTLY_BEARISH: { label: "Slightly Bearish", color: "text-amber-400", bg: "bg-amber-500/10" },
  BEARISH: { label: "Bearish", color: "text-red-400", bg: "bg-red-500/10" },
};

const confidenceConfig = {
  low: { label: "Low", color: "text-white/50" },
  moderate: { label: "Moderate", color: "text-amber-400" },
  high: { label: "High", color: "text-emerald-400" },
};

export function AIContextSignal({ signal }: AIContextSignalProps) {
  const [expanded, setExpanded] = useState(false);
  const config = signalConfig[signal.signal];
  const confConfig = confidenceConfig[signal.confidence];

  return (
    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
            <h3 className="font-semibold text-white">AI Context Signal</h3>
          </div>
          <span className="text-xs text-white/40">Public Information Flow</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Signal Status */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Current Signal</p>
            <p className={`text-xl font-bold ${config.color}`}>{config.label}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Confidence</p>
            <p className={`text-lg font-semibold ${confConfig.color}`}>{confConfig.label}</p>
          </div>
        </div>

        {/* Reasons */}
        <div className="space-y-3">
          <p className="text-xs text-white/50 uppercase tracking-wider">Analysis</p>
          <ul className="space-y-2">
            {signal.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Source Breakdown (collapsed by default) */}
        <div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 text-xs text-white/40 hover:text-white/60 transition-colors"
          >
            <span>{expanded ? "▼" : "▶"}</span>
            <span>Source Breakdown</span>
          </button>
          
          {expanded && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {/* X/Twitter */}
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-white/50 mb-1">X / Twitter</p>
                <p className={`text-sm font-medium ${signal.sources.x.sentiment < 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {(signal.sources.x.sentiment * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-white/40 mt-1">
                  Velocity: {signal.sources.x.velocity.toFixed(1)}x
                </p>
              </div>
              
              {/* Reddit */}
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-white/50 mb-1">Reddit</p>
                <p className={`text-sm font-medium ${signal.sources.reddit.sentiment < 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {(signal.sources.reddit.sentiment * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-white/40 mt-1 truncate">
                  {signal.sources.reddit.topics.slice(0, 2).join(", ")}
                </p>
              </div>
              
              {/* News */}
              <div className="p-3 rounded-lg bg-white/5">
                <p className="text-xs text-white/50 mb-1">News RSS</p>
                <p className={`text-sm font-medium ${signal.sources.news.sentiment < 0 ? "text-red-400" : "text-emerald-400"}`}>
                  {(signal.sources.news.sentiment * 100).toFixed(0)}%
                </p>
                <p className="text-xs text-white/40 mt-1">
                  {signal.sources.news.headlines.length} headlines
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-white/30 pt-2 border-t border-white/5">
          This signal reflects aggregated public information. It is not a recommendation or forecast.
        </p>
      </div>
    </div>
  );
}

