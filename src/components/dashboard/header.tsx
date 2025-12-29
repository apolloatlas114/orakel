"use client";

import type { EdgeStatus, Mode } from "@/app/dashboard/page";

interface DashboardHeaderProps {
  edgeStatus: EdgeStatus;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
}

const edgeStatusConfig = {
  EDGE_FOUND: {
    label: "EDGE FOUND",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: "🟢",
    description: "Your historical data shows a statistically favorable decision setup.",
  },
  NO_EDGE: {
    label: "NO EDGE",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: "🟡",
    description: "No statistically meaningful edge detected for you at this time.",
  },
  EDGE_NEGATIVE: {
    label: "EDGE NEGATIVE",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: "🔴",
    description: "In similar situations, your decisions historically underperform.",
  },
};

const modes: { value: Mode; label: string }[] = [
  { value: "markets", label: "Markets" },
  { value: "sports", label: "Sports" },
  { value: "politics", label: "Politics & Events" },
];

export function DashboardHeader({ edgeStatus, mode, onModeChange }: DashboardHeaderProps) {
  const config = edgeStatusConfig[edgeStatus];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm">
              E
            </div>
            <span className="font-semibold text-lg tracking-tight">Edge Engine</span>
          </div>

          {/* Mode Switch */}
          <div className="hidden sm:flex items-center gap-1 p-1 rounded-lg bg-white/5 border border-white/10">
            {modes.map((m) => (
              <button
                key={m.value}
                onClick={() => onModeChange(m.value)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                  mode === m.value
                    ? "bg-white/10 text-white"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* User Menu Placeholder */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600" />
          </div>
        </div>

        {/* Edge Status Bar */}
        <div
          className={`flex items-center justify-between py-3 px-4 -mx-4 border-t border-white/5 ${config.bgColor}`}
        >
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-white/50 uppercase tracking-wider">
              Today&apos;s Edge Status
            </span>
            <div
              className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} border ${config.borderColor}`}
            >
              <span>{config.icon}</span>
              <span className={`font-semibold text-sm ${config.color}`}>
                {config.label}
              </span>
            </div>
          </div>
          <p className="hidden md:block text-sm text-white/60 max-w-md">
            {config.description}
          </p>
        </div>
      </div>
    </header>
  );
}

