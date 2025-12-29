import { GlowCard } from "@/components/ui/glow";

function fmtPctBps(bps: number) {
  return `${(bps / 100).toFixed(2)}%`;
}

export function MetricGrid({
  tier = "free",
}: {
  tier?: "free" | "pro";
}) {
  const cards = [
    { k: "Active Predictions", v: "32", sub: "Open markets with edge" },
    { k: "Engine Confidence", v: fmtPctBps(7820), sub: "avg across top 10" },
    { k: "Expected Value", v: "+3.4%", sub: "model vs market mean" },
    { k: "Bets Used (month)", v: tier === "free" ? "0 / 10" : "0 / ∞", sub: "execution limit" },
    { k: "Subscription", v: tier.toUpperCase(), sub: "upgrade for auto-exec" },
    { k: "Referral Discount", v: "Inactive", sub: "50% when both Pro" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((c) => (
        <GlowCard key={c.k} className="p-5">
          <div className="text-xs tracking-[0.18em] text-[var(--muted)]">
            {c.k.toUpperCase()}
          </div>
          <div className="mt-2 flex items-end justify-between">
            <div className="text-3xl font-semibold tracking-tight">
              {c.v}
            </div>
            <div className="h-8 w-8 rounded-full border border-[rgba(255,106,0,0.25)] bg-[rgba(255,106,0,0.08)] shadow-[0_0_35px_var(--glow-2)]" />
          </div>
          <div className="mt-2 text-sm text-[var(--muted)]">{c.sub}</div>
        </GlowCard>
      ))}
    </div>
  );
}



