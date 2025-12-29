import { AppNav } from "@/components/app/app-nav";
import { FlowPanel } from "@/components/dashboard/flow-panel";
import { MetricGrid } from "@/components/dashboard/metrics";
import { PredictionsTable } from "@/components/dashboard/predictions-table";
import { mockPredictions } from "@/lib/mock/predictions";

export default function DemoPage() {
  return (
    <div className="min-h-screen">
      <AppNav demo tier="free" />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <div className="text-xs tracking-[0.22em] text-[var(--muted)]">
            DEMO DASHBOARD
          </div>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            ZEUS‑X inspired Orakel UI (mock data)
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            This is the visual target. Next we’ll wire real ingestion + scoring +
            user execution rules. Create an account to unlock personal settings.
          </p>
        </div>

        <div className="grid gap-6">
          <FlowPanel />
          <MetricGrid tier="free" />
          <PredictionsTable predictions={mockPredictions} demo />
        </div>
      </main>
    </div>
  );
}



