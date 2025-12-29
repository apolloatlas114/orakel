/**
 * Market Edge Generator
 * 
 * Generates edge data for markets using real API signals
 */

import type { MarketEdgeData } from "./types";
import { aggregateSignals } from "./aggregator";

/**
 * Generate aggregated signal for a market using real APIs
 */
export async function generateMarketSignal(marketQuestion: string) {
  return await aggregateSignals(marketQuestion);
}

/**
 * Generate edge data for a market
 */
export async function generateMarketEdge(
  marketId: string,
  marketQuestion: string,
  yesPrice: number,
  volume: number,
  liquidity: number
): Promise<MarketEdgeData> {
  const signal = await generateMarketSignal(marketQuestion);
  
  // Calculate edge score
  // Positive signal + low yes price = positive edge for YES
  // Negative signal + high yes price = positive edge for NO
  const priceDeviation = 0.5 - yesPrice; // How far from 50/50
  const edgeScore = Math.round(signal.score * 0.6 + priceDeviation * 100 * 0.4);
  
  const edgeType = edgeScore > 15 ? "positive" : edgeScore < -15 ? "negative" : "neutral";
  
  // Determine suggested action based on signal AND market price
  // Edge = divergence between signal and market price
  let suggestedAction: MarketEdgeData["suggestedAction"] = "wait";
  
  if (edgeType === "positive") {
    // Edge found: Signal diverges from market
    
    // Case 1: Market says NO (0-10% YES) but signal is bullish → Edge for NO (market is wrong, bet NO)
    if (yesPrice < 0.1 && signal.score > 20) {
      suggestedAction = "consider_no";
    }
    // Case 2: Market says YES (90-100% YES) but signal is bearish → Edge for YES (market is wrong, bet YES)
    else if (yesPrice > 0.9 && signal.score < -20) {
      suggestedAction = "consider_yes";
    }
    // Case 3: Signal bullish, market low (10-50% YES) → Edge for YES (signal suggests market should be higher)
    else if (signal.score > 20 && yesPrice < 0.5) {
      suggestedAction = "consider_yes";
    }
    // Case 4: Signal bearish, market high (50-90% YES) → Edge for NO (signal suggests market should be lower)
    else if (signal.score < -20 && yesPrice > 0.5) {
      suggestedAction = "consider_no";
    }
    // Case 5: Moderate divergence - wait for clearer signal
    else {
      suggestedAction = "wait";
    }
  } else if (edgeType === "negative") {
    // No clear edge or conflicting signals
    suggestedAction = "avoid";
  } else {
    // Neutral edge - no clear divergence
    suggestedAction = "wait";
  }
  
  // Generate reasoning
  const reasoning = [
    `Signal sentiment: ${signal.overall.replace("_", " ")}`,
    `Market price implies ${Math.round(yesPrice * 100)}% YES probability`,
    `Volume: $${formatNumber(volume)} | Liquidity: $${formatNumber(liquidity)}`,
  ];
  
  if (edgeType === "positive") {
    reasoning.push("Edge detected: Signal diverges from market price");
  }
  
  return {
    marketId,
    marketQuestion,
    yesPrice,
    noPrice: 1 - yesPrice,
    volume,
    liquidity,
    signal,
    edgeScore,
    edgeType,
    suggestedAction,
    reasoning,
  };
}


function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toFixed(0);
}

