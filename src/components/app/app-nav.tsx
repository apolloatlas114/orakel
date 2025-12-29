import Link from "next/link";

import { GlowButton } from "@/components/ui/glow";

const items = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/predictions", label: "Predictions" },
  { href: "/bot", label: "Bot" },
  { href: "/analytics", label: "Analytics" },
  { href: "/referral", label: "Referral" },
  { href: "/settings", label: "Settings" },
];

export function AppNav({
  tier = "free",
  demo = false,
}: {
  tier?: "free" | "pro";
  demo?: boolean;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[rgba(7,8,10,0.65)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href={demo ? "/demo" : "/dashboard"} className="group">
            <div className="text-xs tracking-[0.22em] text-[var(--muted)]">
              ORAKEL
            </div>
            <div className="text-lg font-semibold tracking-tight">
              <span className="text-white">ORAKEL</span>{" "}
              <span className="text-[var(--accent)]">CORE</span>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 text-sm text-[var(--muted)] md:flex">
            {items.map((it) => (
              <Link
                key={it.href}
                href={demo ? "/demo" : it.href}
                className="hover:text-white"
              >
                {it.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel-2)] px-3 py-1 text-xs text-[var(--muted)] sm:flex">
            <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_20px_var(--glow)]" />
            <span className="capitalize">{demo ? "demo" : tier}</span>
          </div>
          <Link href="/auth/login">
            <GlowButton variant="secondary" className="h-9 px-3">
              Sign in
            </GlowButton>
          </Link>
        </div>
      </div>
    </header>
  );
}



