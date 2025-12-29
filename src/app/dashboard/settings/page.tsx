"use client";

import { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/glow";
import { GlowButton } from "@/components/ui/glow";
import { logoutAction } from "@/lib/auth/actions";

interface UserProfile {
  email: string;
  tier: "free" | "pro";
  referralCode: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  }

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
                  value={loading ? "Loading..." : profile?.email || ""}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2.5 text-sm text-[var(--muted)]"
                />
              </div>
              <div>
                <label className="block text-xs text-[var(--muted)] mb-2">
                  Plan
                </label>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                    profile?.tier === "pro" 
                      ? "bg-[var(--accent)] text-black" 
                      : "bg-[var(--accent)]/10 text-[var(--accent)]"
                  }`}>
                    {profile?.tier === "pro" ? "Pro" : "Free"}
                  </span>
                  {profile?.tier === "free" && (
                    <GlowButton variant="secondary" className="h-9">
                      Upgrade to Pro
                    </GlowButton>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-xs text-[var(--muted)] mb-2">
                  Member Since
                </label>
                <div className="text-sm text-[var(--muted)]">
                  {profile?.createdAt 
                    ? new Date(profile.createdAt).toLocaleDateString("en-US", { 
                        year: "numeric", 
                        month: "long", 
                        day: "numeric" 
                      })
                    : "—"
                  }
                </div>
              </div>
            </div>
          </GlowCard>

          {/* Preferences Section */}
          <GlowCard className="p-6">
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)] mb-4">
              PREFERENCES
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-xs text-[var(--muted)]">Get updates about Edge Found events</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-[var(--panel-2)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Auto-refresh Markets</div>
                  <div className="text-xs text-[var(--muted)]">Automatically refresh market data</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-[var(--panel-2)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--accent)]"></div>
                </label>
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

          {/* Referral Section */}
          <GlowCard className="p-6">
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)] mb-4">
              REFERRAL PROGRAM
            </div>
            <p className="text-sm text-[var(--muted)] mb-4">
              Share your referral link and earn 50% off when friends upgrade to Pro.
            </p>
            {profile?.referralCode && (
              <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
                <div className="text-xs text-[var(--muted)] mb-2">Your Referral Code</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 rounded-lg bg-[var(--bg)] text-sm font-mono">
                    {profile.referralCode}
                  </code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/auth/register?ref=${profile.referralCode}`);
                    }}
                    className="px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] text-sm hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            )}
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

