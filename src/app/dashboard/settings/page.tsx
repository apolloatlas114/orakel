"use client";

import { GlowCard } from "@/components/ui/glow";
import { GlowButton } from "@/components/ui/glow";
import { logoutAction } from "@/lib/auth/actions";

export default function SettingsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
              ACCOUNT SETTINGS
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Settings
            </h1>
          </div>
        </div>
      </header>

      <div className="p-8 max-w-2xl">
        <div className="space-y-6">
          {/* Account Section */}
          <GlowCard className="p-6">
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)] mb-4">
              ACCOUNT
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-[var(--muted)] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2.5 text-sm text-[var(--muted)]"
                  placeholder="Loading..."
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--muted)] mb-2">
                  Plan
                </label>
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium">
                    Free
                  </span>
                  <GlowButton variant="secondary" className="h-9">
                    Upgrade to Pro
                  </GlowButton>
                </div>
              </div>
            </div>
          </GlowCard>

          {/* API Keys Section */}
          <GlowCard className="p-6">
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)] mb-4">
              API KEYS
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              Connect your Polymarket / Kalshi API keys for execution features.
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <div>
                  <div className="font-medium">Polymarket</div>
                  <div className="text-xs text-[var(--muted)]">Not connected</div>
                </div>
                <GlowButton variant="secondary" className="h-9">
                  Connect
                </GlowButton>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <div>
                  <div className="font-medium">Kalshi</div>
                  <div className="text-xs text-[var(--muted)]">Not connected</div>
                </div>
                <GlowButton variant="secondary" className="h-9">
                  Connect
                </GlowButton>
              </div>
            </div>
          </GlowCard>

          {/* Danger Zone */}
          <GlowCard className="p-6 border-red-500/30">
            <div className="text-[10px] tracking-[0.25em] text-red-400 mb-4">
              DANGER ZONE
            </div>
            <form action={logoutAction}>
              <button
                type="submit"
                className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </GlowCard>
        </div>
      </div>
    </div>
  );
}

