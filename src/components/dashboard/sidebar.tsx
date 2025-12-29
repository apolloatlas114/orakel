"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/auth/actions";

const navItems = [
  { href: "/dashboard", label: "Edge Engine", icon: "◈", exact: true },
  { href: "/dashboard/markets", label: "Markets", icon: "◉" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "◐" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

interface DashboardSidebarProps {
  tier: "free" | "pro";
}

export function DashboardSidebar({ tier }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-xl">
      {/* Logo */}
      <div className="border-b border-[var(--border)] px-6 py-5">
        <Link href="/dashboard">
          <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
            ORAKEL
          </div>
          <div className="text-lg font-semibold tracking-tight">
            <span className="text-white">EDGE</span>{" "}
            <span className="text-[var(--accent)]">ENGINE</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
                  active
                    ? "bg-[var(--accent)]/10 text-white border border-[var(--accent)]/30"
                    : "text-[var(--muted)] hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className={active ? "text-[var(--accent)]" : "text-[var(--muted)]"}>
                  {item.icon}
                </span>
                {item.label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--glow)]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Pro Badge */}
        {tier === "free" && (
          <div className="mt-6 mx-1">
            <div className="rounded-xl border border-[var(--accent)]/30 bg-[var(--accent)]/5 p-4">
              <div className="text-[10px] tracking-[0.2em] text-[var(--accent)] mb-1">
                UPGRADE
              </div>
              <div className="text-sm font-medium mb-2">Unlock Pro Features</div>
              <ul className="text-xs text-[var(--muted)] space-y-1 mb-3">
                <li>• Real-time edge signals</li>
                <li>• State-based blocking</li>
                <li>• Detailed AI breakdown</li>
              </ul>
              <button className="w-full rounded-lg bg-[var(--accent)] py-2 text-sm font-semibold text-black hover:brightness-110 transition">
                Upgrade to Pro
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* User / Logout */}
      <div className="border-t border-[var(--border)] p-4 space-y-3">
        <div className="flex items-center gap-3 rounded-xl bg-[var(--panel)] p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]">
            <span className="text-sm font-bold text-black">
              {tier === "pro" ? "P" : "F"}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-[var(--muted)]">Current plan</div>
            <div className="text-sm font-medium capitalize">{tier}</div>
          </div>
          <div className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--glow)]" />
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm text-[var(--muted)] hover:text-white hover:border-red-500/30 transition-colors"
          >
            <span>↪</span>
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}

