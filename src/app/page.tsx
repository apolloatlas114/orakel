import Link from "next/link";

export default function Home() {
  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 orakel-grid opacity-70" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div>
          <div className="text-xs tracking-[0.22em] text-[var(--muted)]">
            ORAKEL
          </div>
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-white">ORAKEL</span>{" "}
            <span className="text-[var(--accent)]">CORE</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/demo"
            className="h-10 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 text-sm font-semibold leading-10 text-white/90 hover:bg-white/[0.05]"
          >
            View demo
          </Link>
          <Link
            href="/auth/register"
            className="h-10 rounded-xl bg-[var(--accent)] px-4 text-sm font-semibold leading-10 text-black hover:brightness-110"
          >
            Create free account
          </Link>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 pb-16 pt-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="text-xs tracking-[0.22em] text-[var(--muted)]">
            PREDICTION & CONTENT INTELLIGENCE
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            A premium dashboard for{" "}
            <span className="text-[var(--accent)]">best-odds</span> prediction
            opportunities.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--muted)]">
            Orakel aggregates Polymarket + Kalshi markets and enriches them with
            signals from X, Reddit, and news RSS. Orakel Core explains{" "}
            <span className="text-white">why</span> an event is likely and ranks
            opportunities by edge and confidence.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/demo"
              className="orakel-glow h-11 rounded-xl border border-[var(--border)] bg-[var(--panel)] px-5 text-sm font-semibold leading-[44px] text-white/90 hover:text-white"
            >
              Explore the ZEUS‑X demo dashboard
            </Link>
            <Link
              href="/auth/register"
              className="h-11 rounded-xl bg-[var(--accent)] px-5 text-sm font-semibold leading-[44px] text-black hover:brightness-110"
            >
              Start free (10 executions/month)
            </Link>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Full visibility", v: "All predictions and reasoning" },
              { k: "Edge-ranked", v: "Market odds vs Oracle probability" },
              { k: "Execution", v: "API-only on your account" },
            ].map((x) => (
              <div
                key={x.k}
                className="orakel-glow rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-4"
              >
                <div className="text-xs tracking-[0.18em] text-[var(--muted)]">
                  {x.k.toUpperCase()}
                </div>
                <div className="mt-2 text-sm font-medium text-white/90">
                  {x.v}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="orakel-glow rounded-3xl border border-[var(--border)] bg-[var(--panel)] p-6">
            <div className="text-xs tracking-[0.22em] text-[var(--muted)]">
              QUICK START
            </div>
            <div className="mt-2 text-xl font-semibold tracking-tight">
              Go live in minutes
            </div>
            <ol className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              <li>
                <span className="text-white/90">1.</span> Create a free account
              </li>
              <li>
                <span className="text-white/90">2.</span> Connect Polymarket /
                Kalshi API keys (encrypted)
              </li>
              <li>
                <span className="text-white/90">3.</span> Get ranked bets +
                explanations; execute within limits
              </li>
            </ol>
            <div className="mt-6 rounded-2xl border border-[rgba(255,106,0,0.25)] bg-[rgba(255,106,0,0.08)] p-4 text-sm text-white/80">
              <div className="font-semibold text-[var(--accent-2)]">
                No custody. No funds handled.
              </div>
              <div className="mt-1">
                Executions happen only via your API keys on your own accounts.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
