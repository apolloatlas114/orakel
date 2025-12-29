"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
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
  category?: MarketCategory;
}

type MarketCategory = "crypto_stock" | "politics" | "global" | "sports" | "other";

interface MarketsResponse {
  success: boolean;
  count: number;
  markets: EnrichedMarket[];
}

interface SegmentStats {
  events: number;
  volume: number;
  edgeFound: number;
}

export default function MarketsPage() {
  const [markets, setMarkets] = useState<EnrichedMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | "all">("all");

  useEffect(() => {
    fetchMarkets();
  }, []);

  async function fetchMarkets() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/markets?limit=50", {
        cache: "no-store",
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }
      
      const data: MarketsResponse = await res.json();
      
      if (!data.success) {
        const errorData = data as { error?: string };
        throw new Error(errorData.error || "Failed to fetch markets");
      }
      
      if (!data.markets || data.markets.length === 0) {
        setError("No markets found.");
        setMarkets([]);
        return;
      }
      
      // Categorize markets
      const categorizedMarkets = data.markets.map(m => ({
        ...m,
        category: categorizeMarket(m.question),
      }));
      
      setMarkets(categorizedMarkets);
    } catch (e) {
      console.error("[Markets Page] Error:", e);
      setError(e instanceof Error ? e.message : "Failed to load markets");
      setMarkets([]);
    } finally {
      setLoading(false);
    }
  }

  // Calculate segment stats
  const segmentStats = useMemo(() => {
    const stats: Record<MarketCategory, SegmentStats> = {
      crypto_stock: { events: 0, volume: 0, edgeFound: 0 },
      politics: { events: 0, volume: 0, edgeFound: 0 },
      global: { events: 0, volume: 0, edgeFound: 0 },
      sports: { events: 0, volume: 0, edgeFound: 0 },
      other: { events: 0, volume: 0, edgeFound: 0 },
    };

    markets.forEach(m => {
      const cat = m.category || "other";
      stats[cat].events++;
      stats[cat].volume += m.volume;
      if (m.edge.edgeType === "positive") {
        stats[cat].edgeFound++;
      }
    });

    return stats;
  }, [markets]);

  // Filter markets by category
  const filteredMarkets = useMemo(() => {
    if (selectedCategory === "all") return markets;
    return markets.filter(m => m.category === selectedCategory);
  }, [markets, selectedCategory]);

  const categories: { value: MarketCategory | "all"; label: string }[] = [
    { value: "all", label: "All Markets" },
    { value: "crypto_stock", label: "Crypto & Stock" },
    { value: "politics", label: "Politics" },
    { value: "global", label: "Global" },
    { value: "sports", label: "Sports" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-8 py-4">
          <div>
            <div className="text-[10px] tracking-[0.25em] text-[var(--muted)]">
              LIVE MARKETS
            </div>
            <h1 className="text-xl font-semibold tracking-tight">
              Markets
            </h1>
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedCategory === cat.value
                    ? "bg-[var(--accent)] text-black"
                    : "text-[var(--muted)] hover:text-white border border-[var(--border)] bg-[var(--panel-2)]"
                }`}
              >
                {cat.label}
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
        {/* Segment Stats */}
        {selectedCategory === "all" && (
          <div className="grid grid-cols-5 gap-4 mb-8">
            {[
              { key: "crypto_stock" as MarketCategory, label: "Crypto & Stock" },
              { key: "politics" as MarketCategory, label: "Politics" },
              { key: "global" as MarketCategory, label: "Global" },
              { key: "sports" as MarketCategory, label: "Sports" },
              { key: "other" as MarketCategory, label: "Other" },
            ].map((segment) => {
              const stats = segmentStats[segment.key];
              return (
                <button
                  key={segment.key}
                  onClick={() => setSelectedCategory(segment.key)}
                  className="text-left"
                >
                  <GlowCard className="p-4 hover:border-[var(--accent)]/30 transition-colors">
                    <div className="text-xs text-[var(--muted)] mb-2">{segment.label}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">Events</span>
                        <span className="text-sm font-semibold">{stats.events}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">Volume</span>
                        <span className="text-sm font-semibold">{formatCurrency(stats.volume)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[var(--muted)]">Edge Found</span>
                        <span className="text-sm font-semibold text-[var(--accent)]">{stats.edgeFound}</span>
                      </div>
                    </div>
                  </GlowCard>
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
              <p className="mt-4 text-[var(--muted)]">Loading markets...</p>
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
            No markets found in this category.
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
  
  // Reduced orange glow - only subtle border
  const edgeColor = edge.edgeType === "positive" 
    ? "border-emerald-500/20" 
    : edge.edgeType === "negative"
    ? "border-red-500/20"
    : "border-[var(--border)]";

  return (
    <GlowCard className={`p-5 ${edgeColor}`}>
      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        {market.image && (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-[var(--panel-2)] shrink-0">
            <Image
              src={market.image}
              alt=""
              width={48}
              height={48}
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
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

      {/* Outcomes - Smaller */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-2.5">
          <div className="text-[10px] text-[var(--muted)]">YES</div>
          <div className="text-base font-bold text-emerald-400">
            {yesOutcome?.probability || 0}%
          </div>
        </div>
        <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-2.5">
          <div className="text-[10px] text-[var(--muted)]">NO</div>
          <div className="text-base font-bold text-red-400">
            {noOutcome?.probability || 0}%
          </div>
        </div>
      </div>

      {/* Edge Signal */}
      <div className="rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-3 mb-3">
        <div className="flex items-center justify-between mb-3">
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

        {/* Social Signals - Detailed */}
        <div className="space-y-2 pt-3 border-t border-[var(--border)]">
          {edge.signal.signals.map((signal, i) => {
            const sourceName = signal.source === "x" ? "X" : signal.source === "reddit" ? "Reddit" : "News";
            const dateStr = new Date(signal.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const rating = signal.sentiment > 0.1 ? "YES" : signal.sentiment < -0.1 ? "NO" : "NEUTRAL";
            const ratingColor = signal.sentiment > 0.1 ? "text-emerald-400" : signal.sentiment < -0.1 ? "text-red-400" : "text-[var(--muted)]";
            
            return (
              <div key={i} className="flex items-start justify-between gap-3 text-xs">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-medium">{sourceName}</span>
                    <span className="text-[var(--muted)]">•</span>
                    <span className="text-[var(--muted)]">{dateStr}</span>
                  </div>
                  <div className="text-[var(--muted)] line-clamp-1">{signal.summary}</div>
                </div>
                <div className={`font-semibold ${ratingColor} shrink-0`}>
                  {rating}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </GlowCard>
  );
}

/**
 * Categorize market based on question keywords
 */
function categorizeMarket(question: string): MarketCategory {
  const lower = question.toLowerCase();
  
  // Crypto & Stock
  const cryptoStockKeywords = [
    "bitcoin", "btc", "ethereum", "eth", "crypto", "cryptocurrency", "stock", "nasdaq", "s&p", "dow", 
    "dow jones", "trading", "market", "price", "share", "shares", "equity", "equities", "dollar", "usd",
    "eur", "euro", "gbp", "pound", "yen", "jpy", "forex", "fx", "coin", "token", "nft", "defi"
  ];
  if (cryptoStockKeywords.some(kw => lower.includes(kw))) {
    return "crypto_stock";
  }
  
  // Politics
  const politicsKeywords = [
    "president", "election", "vote", "voting", "senate", "congress", "parliament", "government", 
    "minister", "candidate", "campaign", "poll", "polls", "democrat", "republican", "party", "political",
    "trump", "biden", "biden", "kamala", "harris", "policy", "bill", "law", "legislation"
  ];
  if (politicsKeywords.some(kw => lower.includes(kw))) {
    return "politics";
  }
  
  // Sports
  const sportsKeywords = [
    "nfl", "nba", "mlb", "nhl", "soccer", "football", "basketball", "baseball", "hockey", "tennis",
    "golf", "olympics", "championship", "super bowl", "world cup", "match", "game", "team", "player",
    "champion", "win", "lose", "score", "tournament", "league", "sport"
  ];
  if (sportsKeywords.some(kw => lower.includes(kw))) {
    return "sports";
  }
  
  // Global
  const globalKeywords = [
    "war", "conflict", "peace", "treaty", "sanction", "embargo", "nato", "un", "united nations",
    "climate", "environment", "global warming", "pandemic", "virus", "disease", "health", "crisis",
    "disaster", "earthquake", "hurricane", "flood", "fire", "international", "world", "global"
  ];
  if (globalKeywords.some(kw => lower.includes(kw))) {
    return "global";
  }
  
  return "other";
}

function formatCurrency(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}
