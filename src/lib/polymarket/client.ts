/**
 * Polymarket API Client
 * 
 * Uses Gamma API for market data (public, no auth required)
 * https://gamma-api.polymarket.com
 */

// Use custom API if provided, otherwise use public Polymarket API
const GAMMA_API_BASE = process.env.POLYMARKET_API_URL || "https://gamma-api.polymarket.com";

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
 * Fetch active markets from Polymarket Gamma API
 * 
 * Documentation: https://docs.polymarket.com/developers/gamma-endpoints/markets
 */
export async function fetchPolymarketMarkets(options?: {
  limit?: number;
  active?: boolean;
  closed?: boolean;
  cursor?: string;
}): Promise<GammaMarketsResponse> {
  const params = new URLSearchParams();
  
  // Gamma API uses different parameter names
  if (options?.limit) params.set("limit", String(options.limit));
  if (options?.active !== undefined) params.set("active", String(options.active));
  if (options?.closed !== undefined) params.set("closed", String(options.closed));
  if (options?.cursor) params.set("cursor", options.cursor);
  
  const url = `${GAMMA_API_BASE}/markets?${params.toString()}`;
  
  console.log(`[Polymarket Client] Fetching: ${url}`);
  
  const headers: HeadersInit = {
    "Accept": "application/json",
    "User-Agent": "Orakel-Edge-Engine/1.0",
  };
  
  // Add API key if provided
  if (process.env.POLYMARKET_API_KEY) {
    headers["Authorization"] = `Bearer ${process.env.POLYMARKET_API_KEY}`;
  }
  
  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 }, // Cache for 60 seconds
    });
    
    if (!res.ok) {
      const errorText = await res.text().catch(() => res.statusText);
      console.error(`[Polymarket Client] API error ${res.status}:`, errorText);
      throw new Error(`Polymarket API error: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    
    // Handle different response formats
    // Gamma API might return data directly or wrapped
    let markets: PolymarketMarket[] = [];
    let count = 0;
    let next_cursor = "";
    
    if (Array.isArray(data)) {
      // Direct array response
      markets = data;
      count = data.length;
    } else if (data.data && Array.isArray(data.data)) {
      // Wrapped response with data property
      markets = data.data;
      count = data.count ?? data.data.length;
      next_cursor = data.next_cursor || data.cursor || "";
    } else if (data.markets && Array.isArray(data.markets)) {
      // Alternative structure
      markets = data.markets;
      count = data.count ?? data.markets.length;
      next_cursor = data.next_cursor || data.cursor || "";
    } else {
      console.warn("[Polymarket Client] Unexpected response structure:", Object.keys(data));
      markets = [];
    }
    
    console.log(`[Polymarket Client] Parsed response:`, {
      marketsFound: markets.length,
      count,
      hasNextCursor: !!next_cursor,
    });
    
    return {
      limit: options?.limit || 20,
      count,
      next_cursor,
      data: markets,
    };
  } catch (error) {
    console.error("[Polymarket Client] Fetch error:", error);
    throw error;
  }
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
 * 
 * Handles different data formats from Polymarket API
 */
export function parseOutcomePrices(market: PolymarketMarket): { outcome: string; probability: number }[] {
  try {
    // Handle different formats
    let outcomes: string[] = [];
    let prices: string[] = [];
    
    // Try parsing outcomes
    if (typeof market.outcomes === "string") {
      try {
        outcomes = JSON.parse(market.outcomes);
      } catch {
        // Might be comma-separated
        outcomes = market.outcomes.split(",").map(s => s.trim());
      }
    } else if (Array.isArray(market.outcomes)) {
      outcomes = market.outcomes;
    }
    
    // Try parsing prices
    if (typeof market.outcomePrices === "string") {
      try {
        prices = JSON.parse(market.outcomePrices);
      } catch {
        // Might be comma-separated
        prices = market.outcomePrices.split(",").map(s => s.trim());
      }
    } else if (Array.isArray(market.outcomePrices)) {
      prices = market.outcomePrices;
    }
    
    // Fallback: try to get prices from market object directly
    const marketWithPrices = market as PolymarketMarket & { prices?: string | string[] };
    if (prices.length === 0 && marketWithPrices.prices) {
      if (Array.isArray(marketWithPrices.prices)) {
        prices = marketWithPrices.prices;
      } else if (typeof marketWithPrices.prices === "string") {
        try {
          prices = JSON.parse(marketWithPrices.prices);
        } catch {
          prices = marketWithPrices.prices.split(",").map(s => s.trim());
        }
      }
    }
    
    // If still no outcomes, use defaults
    if (outcomes.length === 0) {
      outcomes = ["YES", "NO"];
    }
    
    // Map outcomes to prices
    return outcomes.map((outcome, i) => {
      const priceStr = prices[i] || "0";
      const price = parseFloat(priceStr);
      return {
        outcome: outcome.trim(),
        probability: Math.round((isNaN(price) ? 0 : price) * 100),
      };
    });
  } catch (error) {
    console.error("[parseOutcomePrices] Error:", error, market);
    // Return default YES/NO with 50/50
    return [
      { outcome: "YES", probability: 50 },
      { outcome: "NO", probability: 50 },
    ];
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

