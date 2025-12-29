import Link from "next/link";

import { GlowCard, GlowButton } from "@/components/ui/glow";
import type { Prediction } from "@/lib/mock/predictions";

function pct(bps: number) {
  return `${Math.round(bps / 100)}%`;
}

function badge(status: Prediction["status"]) {
  return status === "open"
    ? "border-[rgba(255,106,0,0.25)] bg-[rgba(255,106,0,0.08)] text-[var(--accent-2)]"
    : "border-white/10 bg-white/5 text-white/70";
}

export function PredictionsTable({
  predictions,
  demo = false,
}: {
  predictions: Prediction[];
  demo?: boolean;
}) {
  return (
    <GlowCard className="p-0 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5">
        <div>
          <div className="text-xs tracking-[0.18em] text-[var(--muted)]">
            LIVE PREDICTIONS
          </div>
          <div className="mt-1 text-lg font-semibold tracking-tight">
            Best odds ranked by edge & confidence
          </div>
        </div>
        <Link href={demo ? "/demo" : "/predictions"}>
          <GlowButton variant="secondary">Open list</GlowButton>
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-t border-[var(--border)] text-left text-sm">
          <thead className="bg-[rgba(255,255,255,0.02)] text-[var(--muted)]">
            <tr>
              <th className="px-6 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Market</th>
              <th className="px-4 py-3 font-medium">Odds</th>
              <th className="px-4 py-3 font-medium">ORAKEL</th>
              <th className="px-4 py-3 font-medium">Edge</th>
              <th className="px-4 py-3 font-medium">Confidence</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((p) => (
              <tr
                key={p.id}
                className="border-t border-[var(--border)] hover:bg-white/[0.02]"
              >
                <td className="px-6 py-4">
                  <div className="text-xs text-[var(--muted)]">{p.category}</div>
                  <div className="mt-1 font-semibold">{p.title}</div>
                </td>
                <td className="px-4 py-4">
                  <div className="inline-flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_18px_var(--glow)]" />
                    <span className="capitalize">{p.provider}</span>
                  </div>
                </td>
                <td className="px-4 py-4 tabular-nums text-white/80">
                  {pct(p.marketOddsBps)}
                </td>
                <td className="px-4 py-4 tabular-nums text-white">
                  {pct(p.oracleProbBps)}
                </td>
                <td className="px-4 py-4 tabular-nums">
                  <span
                    className={
                      p.edgeBps >= 0 ? "text-[var(--accent-2)]" : "text-white/60"
                    }
                  >
                    {p.edgeBps >= 0 ? "+" : ""}
                    {pct(p.edgeBps)}
                  </span>
                </td>
                <td className="px-4 py-4 tabular-nums text-white/80">
                  {pct(p.confidenceBps)}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={[
                      "inline-flex items-center rounded-full border px-3 py-1 text-xs",
                      badge(p.status),
                    ].join(" ")}
                  >
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlowCard>
  );
}



