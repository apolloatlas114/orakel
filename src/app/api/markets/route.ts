import { NextResponse } from "next/server";
import { fetchPolymarketMarkets, parseOutcomePrices } from "@/lib/polymarket/client";
import { generateMarketEdge } from "@/lib/signals/mock";

export const runtime = "nodejs";
export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  
  try {
    console.log("[Markets API] Fetching from Polymarket...");
    
    const response = await fetchPolymarketMarkets({
      limit,
      active: true,
      closed: false,
    });
    
    console.log("[Markets API] Response:", {
      count: response.count,
      dataLength: response.data?.length || 0,
      hasNextCursor: !!response.next_cursor,
    });
    
    if (!response.data || response.data.length === 0) {
      console.warn("[Markets API] No markets returned from Polymarket");
      return NextResponse.json({
        success: true,
        count: 0,
        markets: [],
        warning: "No active markets found",
      });
    }
    
    // Validate response structure
    if (!response.data || !Array.isArray(response.data)) {
      console.error("[Markets API] Invalid response structure:", response);
      throw new Error("Invalid response format from Polymarket API");
    }
    
    // Filter valid markets first
    const validMarkets = response.data.filter((market) => {
      if (!market.id || !market.question) {
        console.warn("[Markets API] Skipping invalid market:", market);
        return false;
      }
      return true;
    });
    
    // Enrich markets with edge data (parallel processing)
    const enrichedMarketsPromises = validMarkets.map(async (market) => {
      try {
        const outcomes = parseOutcomePrices(market);
        const yesOutcome = outcomes.find(o => o.outcome.toLowerCase() === "yes" || o.outcome.toLowerCase().includes("yes"));
        const yesPrice = yesOutcome ? yesOutcome.probability / 100 : 0.5;
        
        const volume = parseFloat(market.volume) || 0;
        const liquidity = parseFloat(market.liquidity) || 0;
        
        // Generate edge with real API signals
        const edge = await generateMarketEdge(
          market.id,
          market.question,
          yesPrice,
          volume,
          liquidity
        );
        
        return {
          id: market.id,
          question: market.question,
          slug: market.slug || market.id,
          image: market.image || "",
          endDate: market.endDate || "",
          outcomes,
          volume,
          liquidity,
          active: market.active !== false, // Default to true if not specified
          closed: market.closed === true,
          edge,
        };
      } catch (e) {
        console.error(`[Markets API] Error enriching market ${market.id}:`, e);
        return null;
      }
    });
    
    const enrichedMarketsResults = await Promise.all(enrichedMarketsPromises);
    const enrichedMarkets = enrichedMarketsResults.filter((m): m is NonNullable<typeof m> => m !== null);
    
    console.log(`[Markets API] Successfully enriched ${enrichedMarkets.length} markets`);
    
    return NextResponse.json({
      success: true,
      count: enrichedMarkets.length,
      markets: enrichedMarkets,
    });
  } catch (error) {
    console.error("[Markets API] Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined,
      },
      { status: 500 }
    );
  }
}

