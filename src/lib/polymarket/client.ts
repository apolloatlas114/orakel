/**
 * Polymarket API Client
 * 
 * Uses Gamma API for market data (public, no auth required)
 * https://gamma-api.polymarket.com
 */

const GAMMA_API_BASE = "https://gamma-api.polymarket.com";

export interface PolymarketEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  archived: boolean;
  new: boolean;
  featured: boolean;
  restricted: boolean;
  liquidity: number;
  volume: number;
  openInterest: number;
  competitionId: string | null;
  markets: PolymarketMarket[];
}

export interface PolymarketMarket {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: string;
  startDate: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string;
  outcomePrices: string;
  volume: string;
  active: boolean;
  closed: boolean;
  marketType: string;
  groupItemTitle: string;
  groupItemThreshold: string;
}

export interface GammaMarketsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: PolymarketMarket[];
}

export interface GammaEventsResponse {
  limit: number;
  count: number;
  next_cursor: string;
  data: PolymarketEvent[];
}

/**
 * Fetch active markets from Polymarket
 */
export async function fetchPolymarketMarkets(options?: {
  limit?: number;
  active?: boolean;
  closed?: boolean;
  cursor?: string;
}): Promise<GammaMarketsResponse> {
  const params = new URLSearchParams();
  
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.active !== undefined) params.set("active", String(options.active));
  if (options?.closed !== undefined) params.set("closed", String(options.closed));
  if (options?.cursor) params.set("next_cursor", options.cursor);
  
  const url = `${GAMMA_API_BASE}/markets?${params.toString()}`;
  
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  });
  
  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Fetch events (grouped markets) from Polymarket
 */
export async function fetchPolymarketEvents(options?: {
  limit?: number;
  active?: boolean;
  closed?: boolean;
  cursor?: string;
}): Promise<GammaEventsResponse> {
  const params = new URLSearchParams();
  
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.active !== undefined) params.set("active", String(options.active));
  if (options?.closed !== undefined) params.set("closed", String(options.closed));
  if (options?.cursor) params.set("next_cursor", options.cursor);
  
  const url = `${GAMMA_API_BASE}/events?${params.toString()}`;
  
  const res = await fetch(url, {
    headers: {
      "Accept": "application/json",
    },
    next: { revalidate: 60 },
  });
  
  if (!res.ok) {
    throw new Error(`Polymarket API error: ${res.status} ${res.statusText}`);
  }
  
  return res.json();
}

/**
 * Parse outcome prices from market
 * Returns array of probabilities (0-100)
 */
export function parseOutcomePrices(market: PolymarketMarket): { outcome: string; probability: number }[] {
  try {
    const outcomes = JSON.parse(market.outcomes) as string[];
    const prices = JSON.parse(market.outcomePrices) as string[];
    
    return outcomes.map((outcome, i) => ({
      outcome,
      probability: Math.round(parseFloat(prices[i] || "0") * 100),
    }));
  } catch {
    return [];
  }
}

/**
 * Format volume for display
 */
export function formatVolume(volume: string | number): string {
  const num = typeof volume === "string" ? parseFloat(volume) : volume;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

/**
 * Format liquidity for display
 */
export function formatLiquidity(liquidity: string | number): string {
  const num = typeof liquidity === "string" ? parseFloat(liquidity) : liquidity;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

