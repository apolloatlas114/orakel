import { NextResponse } from "next/server";
import { fetchPolymarketMarkets, parseOutcomePrices } from "@/lib/polymarket/client";
import { generateMarketEdge } from "@/lib/signals/mock";

export const runtime = "nodejs";
export const revalidate = 60; // Cache for 60 seconds

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(parseInt(searchParams.get("limit") || "20"), 50);
  
  try {
    const response = await fetchPolymarketMarkets({
      limit,
      active: true,
      closed: false,
    });
    
    // Enrich markets with edge data
    const enrichedMarkets = response.data.map((market) => {
      const outcomes = parseOutcomePrices(market);
      const yesOutcome = outcomes.find(o => o.outcome.toLowerCase() === "yes");
      const yesPrice = yesOutcome ? yesOutcome.probability / 100 : 0.5;
      
      const volume = parseFloat(market.volume) || 0;
      const liquidity = parseFloat(market.liquidity) || 0;
      
      const edge = generateMarketEdge(
        market.id,
        market.question,
        yesPrice,
        volume,
        liquidity
      );
      
      return {
        id: market.id,
        question: market.question,
        slug: market.slug,
        image: market.image,
        endDate: market.endDate,
        outcomes,
        volume,
        liquidity,
        active: market.active,
        closed: market.closed,
        edge,
      };
    });
    
    return NextResponse.json({
      success: true,
      count: enrichedMarkets.length,
      markets: enrichedMarkets,
    });
  } catch (error) {
    console.error("Markets API error:", error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

