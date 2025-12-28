import { GlowCard } from "@/components/ui/glow";

function Dot({ color }: { color: string }) {
  return (
    <span
      className="h-2.5 w-2.5 rounded-full"
      style={{ background: color, boxShadow: `0 0 18px ${color}` }}
    />
  );
}

export function FlowPanel() {
  return (
    <GlowCard className="relative overflow-hidden p-6">
      <div className="absolute inset-0 opacity-60">
        <div className="absolute -left-24 top-10 h-64 w-64 rounded-full bg-[var(--glow-2)] blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[var(--glow-2)] blur-3xl" />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-6">
          <div>
            <div className="text-xs tracking-[0.2em] text-[var(--muted)]">
              PREDICTION FLOW
            </div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight">
              Streams → Orakel Core → Opportunities → Execution
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
              Real-time signals are normalized and scored into an oracle probability,
              confidence, and edge vs market odds. Free users can view everything;
              executions are limited to 10/month.
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-3 text-xs text-[var(--muted)] lg:flex">
            <Dot color="#ff6a00" />
            <span>Live</span>
            <span className="opacity-50">·</span>
            <span>Last update: just now</span>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
              <div className="text-xs tracking-[0.2em] text-[var(--muted)]">
                INPUT STREAMS
              </div>
              <div className="mt-3 grid gap-2 text-sm">
                {[
                  { name: "Polymarket", ok: true },
                  { name: "Kalshi", ok: true },
                  { name: "X / Twitter", ok: false },
                  { name: "Reddit", ok: true },
                  { name: "News RSS", ok: true },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={[
                          "h-2 w-2 rounded-full",
                          s.ok ? "bg-[var(--accent)]" : "bg-white/20",
                        ].join(" ")}
                        style={{
                          boxShadow: s.ok ? "0 0 18px var(--glow)" : "none",
                        }}
                      />
                      <span>{s.name}</span>
                    </div>
                    <span className="text-xs text-[var(--muted)]">
                      {s.ok ? "Healthy" : "Mock"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="relative h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
              <div className="text-xs tracking-[0.2em] text-[var(--muted)]">
                FLOW MAP
              </div>

              <svg
                className="mt-4 h-[240px] w-full"
                viewBox="0 0 900 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="rgba(255,255,255,0.12)" />
                    <stop offset="0.45" stopColor="rgba(255,106,0,0.85)" />
                    <stop offset="1" stopColor="rgba(255,255,255,0.12)" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* streams */}
                {[
                  { y: 40 },
                  { y: 80 },
                  { y: 120 },
                  { y: 160 },
                  { y: 200 },
                ].map((p, i) => (
                  <path
                    key={i}
                    d={`M 40 ${p.y} C 160 ${p.y}, 220 120, 320 120`}
                    stroke="rgba(255,255,255,0.12)"
                    strokeWidth="3"
                  />
                ))}

                {/* core */}
                <rect
                  x="320"
                  y="70"
                  width="220"
                  height="100"
                  rx="18"
                  stroke="rgba(255,106,0,0.35)"
                  fill="rgba(13,15,20,1)"
                />
                <text
                  x="430"
                  y="112"
                  textAnchor="middle"
                  fontSize="14"
                  fill="rgba(232,234,240,0.85)"
                  style={{ letterSpacing: "0.22em" }}
                >
                  ORAKEL CORE
                </text>
                <text
                  x="430"
                  y="142"
                  textAnchor="middle"
                  fontSize="12"
                  fill="rgba(232,234,240,0.55)"
                >
                  scoring · ranking · reasoning
                </text>

                {/* out */}
                <path
                  d="M 540 120 C 640 120, 720 70, 860 70"
                  stroke="url(#g)"
                  strokeWidth="4"
                  filter="url(#glow)"
                />
                <path
                  d="M 540 120 C 640 120, 720 120, 860 120"
                  stroke="url(#g)"
                  strokeWidth="4"
                  filter="url(#glow)"
                  opacity="0.8"
                />
                <path
                  d="M 540 120 C 640 120, 720 170, 860 170"
                  stroke="url(#g)"
                  strokeWidth="4"
                  filter="url(#glow)"
                  opacity="0.7"
                />

                {/* nodes */}
                {[
                  { x: 860, y: 70, label: "Top picks" },
                  { x: 860, y: 120, label: "EV ranked" },
                  { x: 860, y: 170, label: "Execution" },
                ].map((n) => (
                  <g key={n.label}>
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r="10"
                      fill="rgba(255,106,0,1)"
                      filter="url(#glow)"
                    />
                    <text
                      x={n.x - 18}
                      y={n.y + 4}
                      textAnchor="end"
                      fontSize="12"
                      fill="rgba(232,234,240,0.65)"
                    >
                      {n.label}
                    </text>
                  </g>
                ))}
              </svg>

              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                {[
                  { k: "Streams", v: "5 sources" },
                  { k: "Model", v: "Oracle probability" },
                  { k: "Output", v: "Ranked opportunities" },
                ].map((x) => (
                  <div
                    key={x.k}
                    className="rounded-xl border border-[var(--border)] bg-[var(--panel)] px-3 py-2"
                  >
                    <div className="text-xs text-[var(--muted)]">{x.k}</div>
                    <div className="text-sm font-medium">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </GlowCard>
  );
}


