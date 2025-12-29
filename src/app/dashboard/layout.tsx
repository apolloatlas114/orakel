import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Edge Engine", icon: "◈" },
  { href: "/dashboard/decisions", label: "Decisions", icon: "○" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "◐" },
  { href: "/dashboard/settings", label: "Settings", icon: "⚙" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  return (
    <div className="min-h-screen">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 orakel-grid opacity-40" />

      {/* Sidebar */}
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
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-[var(--muted)] transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <span className="text-[var(--accent)]">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User / Tier */}
        <div className="border-t border-[var(--border)] p-4">
          <div className="flex items-center gap-3 rounded-xl bg-[var(--panel)] p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-2)]">
              <span className="text-sm font-bold text-black">
                {session.tier === "pro" ? "P" : "F"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-[var(--muted)]">Current plan</div>
              <div className="text-sm font-medium capitalize">{session.tier}</div>
            </div>
            <div className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--glow)]" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        {children}
      </main>
    </div>
  );
}

