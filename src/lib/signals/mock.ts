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
  
  // Calculate edge score based on DIVERGENCE between signal and market
  // Edge only exists when signal and market disagree!
  
  // Convert signal score (-100 to 100) to implied probability (0 to 1)
  // Positive signal = higher YES probability, negative = lower YES probability
  const signalImpliedYes = 0.5 + (signal.score / 100) * 0.5; // 0 to 1
  
  // Calculate divergence: how much does signal differ from market?
  const divergence = Math.abs(signalImpliedYes - yesPrice);
  
  // Edge score: high divergence = high edge potential
  // But only if signal and market point in different directions
  const signalDirection = signal.score > 0 ? 1 : signal.score < 0 ? -1 : 0;
  const marketDirection = yesPrice > 0.5 ? 1 : yesPrice < 0.5 ? -1 : 0;
  
  // Edge only if they disagree (different directions)
  const hasDivergence = signalDirection !== 0 && marketDirection !== 0 && signalDirection !== marketDirection;
  
  let edgeScore = 0;
  let edgeType: "positive" | "neutral" | "negative" = "neutral";
  
  if (hasDivergence && divergence > 0.15) {
    // Strong divergence = positive edge
    edgeScore = Math.round(divergence * 100);
    edgeType = "positive";
  } else if (hasDivergence && divergence > 0.05) {
    // Moderate divergence = still positive but weaker
    edgeScore = Math.round(divergence * 50);
    edgeType = "positive";
  } else {
    // No divergence or weak divergence = neutral
    edgeScore = 0;
    edgeType = "neutral";
  }
  
  // Determine suggested action based on divergence
  let suggestedAction: MarketEdgeData["suggestedAction"] = "wait";
  
  if (edgeType === "positive" && hasDivergence) {
    // Signal bullish but market says NO → Edge for YES
    if (signal.score > 20 && yesPrice < 0.3) {
      suggestedAction = "consider_yes";
    }
    // Signal bearish but market says YES → Edge for NO
    else if (signal.score < -20 && yesPrice > 0.7) {
      suggestedAction = "consider_no";
    }
    // Moderate divergence
    else if (signal.score > 10 && yesPrice < 0.4) {
      suggestedAction = "consider_yes";
    }
    else if (signal.score < -10 && yesPrice > 0.6) {
      suggestedAction = "consider_no";
    }
    else {
      suggestedAction = "wait";
    }
  } else {
    // No edge - signal and market agree
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

