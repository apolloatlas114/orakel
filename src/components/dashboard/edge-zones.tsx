"use client";

import type { EdgeZone } from "@/app/dashboard/page";

interface EdgeZonesProps {
  title: string;
  zones: EdgeZone[];
  type: "positive" | "negative";
}

export function EdgeZones({ title, zones, type }: EdgeZonesProps) {
  const isPositive = type === "positive";

  return (
    <div className="bg-[#12121a] border border-white/10 rounded-2xl overflow-hidden">
      {/* Header */}
      <div
        className={`px-6 py-4 border-b border-white/5 ${
          isPositive ? "bg-emerald-500/5" : "bg-red-500/5"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={isPositive ? "text-emerald-400" : "text-red-400"}>
              {isPositive ? "↑" : "↓"}
            </span>
            <h3 className="font-semibold text-white">{title}</h3>
          </div>
          <span className="text-xs text-white/40">Pattern Discovery</span>
        </div>
      </div>

      {/* Zones List */}
      <div className="p-4 space-y-3">
        {zones.map((zone, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${
              isPositive
                ? "bg-emerald-500/5 border-emerald-500/20"
                : "bg-red-500/5 border-red-500/20"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-white">{zone.condition}</span>
              <span
                className={`text-sm font-bold ${
                  isPositive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {zone.impact > 0 ? "+" : ""}{zone.impact}%
              </span>
            </div>
            <p className="text-sm text-white/50">{zone.description}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 border-t border-white/5 bg-white/[0.02]">
        <p className="text-xs text-white/40">
          {isPositive
            ? "These conditions historically improve your decision quality."
            : "These conditions consistently reduce your accuracy."}
        </p>
      </div>
    </div>
  );
}

