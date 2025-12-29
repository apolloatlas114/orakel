"use client";

import { GlowCard } from "@/components/ui/glow";

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
              ANALYTICS & INSIGHTS
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Weekly Insights
            </h1>
          </div>
        </div>
      </header>

      <div className="p-8">
        <GlowCard className="p-8 text-center">
          <div className="text-[10px] tracking-[0.25em] text-[var(--muted)] mb-4">
            COMING SOON
          </div>
          <p className="text-[var(--muted)]">
            Analytics dashboard with charts, performance tracking, and weekly insights will be available soon.
          </p>
        </GlowCard>
      </div>
    </div>
  );
}

