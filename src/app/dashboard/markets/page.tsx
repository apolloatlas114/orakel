"use client";

import { useState, useEffect } from "react";
import { GlowCard } from "@/components/ui/glow";
import type { MarketEdgeData } from "@/lib/signals/types";
import { sentimentLabel, sentimentColor } from "@/lib/signals/types";

interface EnrichedMarket {
  id: string;
  question: string;
  slug: string;
  image: string;
  endDate: string;
  outcomes: { outcome: string; probability: number }[];
  volume: number;
  liquidity: number;
  active: boolean;
  closed: boolean;
  edge: MarketEdgeData;
}

interface MarketsResponse {
  success: boolean;
  count: number;
  markets: EnrichedMarket[];
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<EnrichedMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "edge" | "high_volume">("all");

  useEffect(() => {
    fetchMarkets();
  }, []);

  async function fetchMarkets() {
    setLoading(true);
    setError(null);
    try {
      console.log("[Markets Page] Fetching markets...");
      const res = await fetch("/api/markets?limit=30", {
        cache: "no-store", // Force fresh data
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data: MarketsResponse = await res.json();
      console.log("[Markets Page] Response:", { success: data.success, count: data.count });
      
      if (!data.success) {
        throw new Error((data as any).error || "Failed to fetch markets");
      }
      
      if (!data.markets || data.markets.length === 0) {
        setError("No markets found. The Polymarket API might be unavailable or returning empty results.");
        setMarkets([]);
        return;
      }
      
      setMarkets(data.markets);
    } catch (e) {
      console.error("[Markets Page] Error:", e);
      setError(e instanceof Error ? e.message : "Failed to load markets");
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }

  const filteredMarkets = markets.filter((m) => {
    if (filter === "edge") return m.edge.edgeType === "positive";
    if (filter === "high_volume") return m.volume > 100000;
    return true;
  });

  const positiveEdgeCount = markets.filter(m => m.edge.edgeType === "positive").length;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
              POLYMARKET INTEGRATION
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Live Markets
            </h1>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            {[
              { value: "all", label: "All Markets" },
              { value: "edge", label: `Edge Found (${positiveEdgeCount})` },
              { value: "high_volume", label: "High Volume" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value as typeof filter)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                  filter === f.value
                    ? "bg-[var(--accent)] text-black"
                    : "text-[var(--muted)] hover:text-white border border-[var(--border)] bg-[var(--panel-2)]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchMarkets}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] px-4 py-2 text-sm text-[var(--muted)] hover:text-white transition-colors disabled:opacity-50"
          >
            <span className={loading ? "animate-spin" : ""}>↻</span>
            Refresh
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Markets", value: markets.length },
            { label: "Edge Opportunities", value: positiveEdgeCount, highlight: true },
            { label: "Total Volume", value: formatCurrency(markets.reduce((sum, m) => sum + m.volume, 0)) },
            { label: "Total Liquidity", value: formatCurrency(markets.reduce((sum, m) => sum + m.liquidity, 0)) },
          ].map((stat) => (
            <GlowCard key={stat.label} className="p-4">
              <div className="text-xs text-[var(--muted)]">{stat.label}</div>
              <div className={`mt-1 text-2xl font-bold ${stat.highlight ? "text-[var(--accent)]" : ""}`}>
                {stat.value}
              </div>
            </GlowCard>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              <p className="mt-4 text-[var(--muted)]">Loading markets from Polymarket...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <GlowCard className="p-6 border-red-500/30">
            <div className="text-red-400 font-medium">Error loading markets</div>
            <p className="mt-1 text-sm text-[var(--muted)]">{error}</p>
            <button
              onClick={fetchMarkets}
              className="mt-4 rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-black"
            >
              Retry
            </button>
          </GlowCard>
        )}

        {/* Markets Grid */}
        {!loading && !error && (
          <div className="grid gap-4 lg:grid-cols-2">
            {filteredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filteredMarkets.length === 0 && (
          <div className="text-center py-20 text-[var(--muted)]">
            No markets found matching your filter.
          </div>
        )}
      </div>
    </div>
  );
}

function MarketCard({ market }: { market: EnrichedMarket }) {
  const { edge } = market;
  const yesOutcome = market.outcomes.find(o => o.outcome.toLowerCase() === "yes");
  const noOutcome = market.outcomes.find(o => o.outcome.toLowerCase() === "no");
  
  const edgeColor = edge.edgeType === "positive" 
    ? "border-emerald-500/30 bg-emerald-500/5" 
    : edge.edgeType === "negative"
    ? "border-red-500/30 bg-red-500/5"
    : "";

  return (
    <GlowCard className={`p-5 ${edgeColor}`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {market.image && (
          <img 
            src={market.image} 
            alt="" 
            className="w-12 h-12 rounded-lg object-cover bg-[var(--panel-2)]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white leading-tight line-clamp-2">
            {market.question}
          </h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-[var(--muted)]">
            <span>Vol: {formatCurrency(market.volume)}</span>
            <span>•</span>
            <span>Liq: {formatCurrency(market.liquidity)}</span>
          </div>
        </div>
      </div>

      {/* Outcomes */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-3">
          <div className="text-xs text-[var(--muted)]">YES</div>
          <div className="text-xl font-bold text-emerald-400">
            {yesOutcome?.probability || 0}%
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-3">
          <div className="text-xs text-[var(--muted)]">NO</div>
          <div className="text-xl font-bold text-red-400">
            {noOutcome?.probability || 0}%
          </div>
        </div>
      </div>

      {/* Edge Signal */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] tracking-[0.2em] text-[var(--muted)]">
            EDGE ENGINE SIGNAL
          </span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            edge.edgeType === "positive" 
              ? "bg-emerald-500/20 text-emerald-400"
              : edge.edgeType === "negative"
              ? "bg-red-500/20 text-red-400"
              : "bg-[var(--accent)]/20 text-[var(--accent)]"
          }`}>
            {edge.edgeType === "positive" ? "EDGE FOUND" : edge.edgeType === "negative" ? "AVOID" : "NEUTRAL"}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm">Sentiment</span>
          <span className={`text-sm font-medium ${sentimentColor(edge.signal.overall)}`}>
            {sentimentLabel(edge.signal.overall)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm">Confidence</span>
          <span className="text-sm capitalize">{edge.signal.confidence}</span>
        </div>

        {/* Reasons */}
        <div className="space-y-1 pt-2 border-t border-[var(--border)]">
          {edge.signal.reasons.slice(0, 2).map((reason, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-[var(--muted)]">
              <span className="text-[var(--accent)]">•</span>
              <span>{reason}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action suggestion */}
      {edge.suggestedAction !== "wait" && (
        <div className={`mt-3 p-2 rounded-lg text-center text-sm font-medium ${
          edge.suggestedAction === "consider_yes"
            ? "bg-emerald-500/10 text-emerald-400"
            : edge.suggestedAction === "consider_no"
            ? "bg-red-500/10 text-red-400"
            : "bg-[var(--accent)]/10 text-[var(--accent)]"
        }`}>
          {edge.suggestedAction === "consider_yes" && "↑ Signal suggests YES"}
          {edge.suggestedAction === "consider_no" && "↓ Signal suggests NO"}
          {edge.suggestedAction === "avoid" && "⚠ Negative edge - avoid"}
        </div>
      )}
    </GlowCard>
  );
}

function formatCurrency(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

