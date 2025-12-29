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
  const [edgeFilter, setEdgeFilter] = useState<"all" | "edge" | "no_edge">("all");
  const [userTier, setUserTier] = useState<"free" | "pro">("free");

  useEffect(() => {
    fetchMarkets();
    fetchUserTier();
  }, []);
  
  async function fetchUserTier() {
    try {
      const res = await fetch("/api/user/tier");
      const data = await res.json();
      setUserTier(data.tier || "free");
    } catch {
      setUserTier("free");
    }
  }

  async function fetchMarkets() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/markets?limit=30", {
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

  // Filter markets by category and edge
  const filteredMarkets = useMemo(() => {
    let filtered = markets;
    
    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(m => m.category === selectedCategory);
    }
    
    // Edge filter
    if (edgeFilter === "edge") {
      filtered = filtered.filter(m => m.edge.edgeType === "positive");
    } else if (edgeFilter === "no_edge") {
      filtered = filtered.filter(m => m.edge.edgeType !== "positive");
    }
    
    // Free account: only show 3 edge found markets, rest blurred/limited
    if (userTier === "free") {
      const edgeMarkets = filtered.filter(m => m.edge.edgeType === "positive");
      const nonEdgeMarkets = filtered.filter(m => m.edge.edgeType !== "positive");
      
      // Show first 3 edge markets + all non-edge markets
      return [...edgeMarkets.slice(0, 3), ...nonEdgeMarkets];
    }
    
    return filtered;
  }, [markets, selectedCategory, edgeFilter, userTier]);
  
  // Calculate edge found stats
  const edgeStats = useMemo(() => {
    const edgeFound = markets.filter(m => m.edge.edgeType === "positive").length;
    const total = markets.length;
    const accuracy = total > 0 ? Math.round((edgeFound / total) * 100) : 0;
    return { edgeFound, total, accuracy };
  }, [markets]);

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

          {/* Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Edge Filter with Info */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] p-1">
                {[
                  { value: "all", label: "All" },
                  { value: "edge", label: `Edge Found (${edgeStats.edgeFound})` },
                  { value: "no_edge", label: "No Edge" },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setEdgeFilter(f.value as typeof edgeFilter)}
                    className={`rounded px-2 py-1 text-xs font-medium transition-all ${
                      edgeFilter === f.value
                        ? "bg-[var(--accent)] text-black"
                        : "text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              
              {/* Edge Logic Info Tooltip */}
              <div className="group relative">
                <button className="flex items-center justify-center w-5 h-5 rounded-full border border-[var(--border)] bg-[var(--panel-2)] text-[var(--muted)] hover:text-white transition-colors text-xs">
                  ?
                </button>
                <div className="absolute right-0 top-full mt-2 w-64 p-3 rounded-lg border border-[var(--border)] bg-[var(--panel-2)] shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="text-[10px] tracking-[0.2em] text-[var(--muted)] mb-2">EDGE LOGIC</div>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-semibold text-emerald-400">EDGE FOUND:</span>
                      <span className="text-[var(--muted)] ml-1">Signal diverges from market price</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[var(--muted)]">NEUTRAL:</span>
                      <span className="text-[var(--muted)] ml-1">Signal and market agree</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Category Filter */}
            {categories.slice(1).map((cat) => (
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
        {/* Edge Found Stats (Free Account) */}
        {userTier === "free" && (
          <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--panel-2)] p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-[var(--muted)] mb-1">Edge Engine Performance</div>
                <div className="text-lg font-bold">
                  {edgeStats.edgeFound} Edge Found Events
                </div>
                <div className="text-sm text-[var(--muted)]">
                  {edgeStats.accuracy}% Accuracy Rate
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-[var(--muted)] mb-1">Free Account Limit</div>
                <div className="text-lg font-bold text-[var(--accent)]">3 / ∞</div>
                <button className="mt-2 rounded-lg bg-[var(--accent)] px-4 py-1.5 text-xs font-medium text-black">
                  Upgrade to Pro
                </button>
              </div>
            </div>
          </div>
        )}
        
        {/* Segment Stats */}
        {selectedCategory === "all" && (
          <div className="grid grid-cols-5 gap-4 mb-6">
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
              <p className="mt-4 text-sm text-[var(--muted)]">Analyzing markets with Edge Engine...</p>
              <p className="mt-1 text-xs text-[var(--muted)]">This may take a few seconds</p>
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

        {/* Markets Grid - Compact 3 columns */}
        {!loading && !error && (
          <div className="grid gap-3 lg:grid-cols-3 md:grid-cols-2">
            {filteredMarkets.map((market) => {
              // Free account: blur markets after first 3 edge found
              const isBlurred = userTier === "free" && 
                market.edge.edgeType === "positive" && 
                filteredMarkets.filter(m => m.edge.edgeType === "positive").indexOf(market) >= 3;
              
              return (
                <MarketCard key={market.id} market={market} isBlurred={isBlurred} />
              );
            })}
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

function MarketCard({ market, isBlurred }: { market: EnrichedMarket; isBlurred?: boolean }) {
  const { edge } = market;
  const yesOutcome = market.outcomes.find(o => o.outcome.toLowerCase() === "yes");
  const noOutcome = market.outcomes.find(o => o.outcome.toLowerCase() === "no");
  
  const edgeColor = edge.edgeType === "positive" 
    ? "border-emerald-500/20" 
    : edge.edgeType === "negative"
    ? "border-red-500/20"
    : "border-[var(--border)]";

  return (
    <GlowCard className={`p-3 ${edgeColor} ${isBlurred ? "opacity-50 blur-sm" : ""} relative`}>
      {/* Free Account Overlay */}
      {isBlurred && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-[var(--bg)]/80 rounded-xl">
          <div className="text-center p-4">
            <div className="text-sm font-semibold mb-2">Upgrade to Pro</div>
            <div className="text-xs text-[var(--muted)]">View unlimited Edge Found events</div>
          </div>
        </div>
      )}
      
      {/* Header - Compact */}
      <div className="flex items-start gap-2.5 mb-2.5">
        {market.image && (
          <div className="relative w-8 h-8 rounded overflow-hidden bg-[var(--panel-2)] shrink-0">
            <Image
              src={market.image}
              alt=""
              width={32}
              height={32}
              className="object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white leading-tight line-clamp-2">
            {market.question}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-[10px] text-[var(--muted)]">
            <span>Vol: {formatCurrency(market.volume)}</span>
            <span>•</span>
            <span>Liq: {formatCurrency(market.liquidity)}</span>
          </div>
        </div>
      </div>

      {/* Outcomes - Compact */}
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div className="rounded border border-[var(--border)] bg-[var(--panel-2)] p-1.5">
          <div className="text-[9px] text-[var(--muted)]">YES</div>
          <div className="text-sm font-bold text-emerald-400">
            {yesOutcome?.probability || 0}%
          </div>
        </div>
        <div className="rounded border border-[var(--border)] bg-[var(--panel-2)] p-1.5">
          <div className="text-[9px] text-[var(--muted)]">NO</div>
          <div className="text-sm font-bold text-red-400">
            {noOutcome?.probability || 0}%
          </div>
        </div>
      </div>

      {/* Edge Signal - Compact */}
      <div className="rounded border border-[var(--border)] bg-[var(--panel-2)] p-2">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[9px] tracking-[0.15em] text-[var(--muted)]">
            EDGE ENGINE
          </span>
          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
            edge.edgeType === "positive" 
              ? "bg-emerald-500/20 text-emerald-400"
              : edge.edgeType === "negative"
              ? "bg-red-500/20 text-red-400"
              : "bg-[var(--accent)]/20 text-[var(--accent)]"
          }`}>
            {edge.edgeType === "positive" ? "EDGE FOUND" : edge.edgeType === "negative" ? "AVOID" : "NEUTRAL"}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-1.5 text-xs">
          <span className="text-[var(--muted)]">Sentiment</span>
          <span className={`font-medium ${sentimentColor(edge.signal.overall)}`}>
            {sentimentLabel(edge.signal.overall)}
          </span>
        </div>
        
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-[var(--muted)]">Confidence</span>
          <span className="capitalize">{edge.signal.confidence}</span>
        </div>

        {/* Social Signals - Compact */}
        <div className="space-y-1.5 pt-2 border-t border-[var(--border)]">
          {edge.signal.signals.map((signal, i) => {
            const sourceName = signal.source === "x" ? "X" : signal.source === "reddit" ? "Reddit" : "News";
            const dateStr = new Date(signal.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const rating = signal.sentiment > 0.1 ? "YES" : signal.sentiment < -0.1 ? "NO" : "NEUTRAL";
            const ratingColor = signal.sentiment > 0.1 ? "text-emerald-400" : signal.sentiment < -0.1 ? "text-red-400" : "text-[var(--muted)]";
            
            return (
              <div key={i} className="flex items-start justify-between gap-2 text-[10px]">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-medium">{sourceName}</span>
                    <span className="text-[var(--muted)]">•</span>
                    <span className="text-[var(--muted)]">{dateStr}</span>
                  </div>
                  <div className="text-[var(--muted)] line-clamp-1 text-[9px]">{signal.summary}</div>
                </div>
                <div className={`font-semibold ${ratingColor} shrink-0 text-[10px]`}>
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
