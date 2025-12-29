"use client";

import { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/glow";
import { GlowButton } from "@/components/ui/glow";

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
  const [referralCode, setReferralCode] = useState<string>("");
  const [referralLink, setReferralLink] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchReferralCode();
    }
  }, [isOpen]);

  async function fetchReferralCode() {
    setLoading(true);
    try {
      const res = await fetch("/api/referral/code");
      const data = await res.json();
      if (data.code) {
        setReferralCode(data.code);
        setReferralLink(`${window.location.origin}/auth/register?ref=${data.code}`);
      }
    } catch (error) {
      console.error("Failed to fetch referral code:", error);
    } finally {
      setLoading(false);
    }
  }

  async function createReferralLink() {
    setLoading(true);
    try {
      const res = await fetch("/api/referral/create", { method: "POST" });
      const data = await res.json();
      if (data.code) {
        setReferralCode(data.code);
        setReferralLink(`${window.location.origin}/auth/register?ref=${data.code}`);
      }
    } catch (error) {
      console.error("Failed to create referral link:", error);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard() {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <GlowCard className="w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
              REFERRAL PROGRAM
            </div>
            <h2 className="text-xl font-semibold mt-1">Invite Friends</h2>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--muted)] hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Benefits */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
            <div className="text-sm font-semibold mb-3">Benefits</div>
            <div className="space-y-2 text-sm text-[var(--muted)]">
              <div className="flex items-start gap-2">
                <span className="text-[var(--accent)]">•</span>
                <span>When your friend upgrades to Pro, you both get <strong className="text-white">50% off</strong></span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--accent)]">•</span>
                <span>Discount applies automatically when they sign up</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-[var(--accent)]">•</span>
                <span>Unlimited referrals - share with everyone!</span>
              </div>
            </div>
          </div>

          {/* Referral Link */}
          {referralLink ? (
            <div className="space-y-2">
              <label className="block text-xs text-[var(--muted)]">Your Referral Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={referralLink}
                  readOnly
                  className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] px-3 py-2 text-sm"
                />
                <GlowButton
                  onClick={copyToClipboard}
                  variant="secondary"
                  className="shrink-0"
                >
                  {copied ? "✓ Copied" : "Copy"}
                </GlowButton>
              </div>
              <div className="text-xs text-[var(--muted)]">
                Referral Code: <code className="px-1.5 py-0.5 rounded bg-[var(--panel-2)]">{referralCode}</code>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <GlowButton
                onClick={createReferralLink}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Creating..." : "Create Referral Link"}
              </GlowButton>
            </div>
          )}
        </div>
      </GlowCard>
    </div>
  );
}

