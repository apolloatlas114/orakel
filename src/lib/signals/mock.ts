/**
 * Mock Signal Generator
 * 
 * Generates realistic mock signals for development
 * TODO: Replace with real X/Reddit/News API integrations
 */

import type { SignalData, AggregatedSignal, MarketEdgeData } from "./types";
import { scoreToSentiment } from "./types";

/**
 * Generate mock signal for a market
 */
export function generateMockSignal(marketQuestion: string): AggregatedSignal {
  // Seed based on question for consistent results
  const seed = hashString(marketQuestion);
  const random = seededRandom(seed);
  
  // Generate individual signals
  const xSignal = generateSourceSignal("x", random);
  const redditSignal = generateSourceSignal("reddit", random);
  const newsSignal = generateSourceSignal("news", random);
  
  const signals = [xSignal, redditSignal, newsSignal];
  
  // Calculate overall score (weighted average)
  const weights = { x: 0.3, reddit: 0.25, news: 0.45 };
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  const overallScore = signals.reduce((sum, s) => {
    const w = weights[s.source];
    return sum + s.sentiment * s.confidence * w;
  }, 0) / totalWeight;
  
  // Determine confidence
  const avgConfidence = signals.reduce((sum, s) => sum + s.confidence, 0) / signals.length;
  const confidence = avgConfidence > 0.7 ? "high" : avgConfidence > 0.4 ? "moderate" : "low";
  
  // Generate reasons
  const reasons = generateReasons(signals);
  
  return {
    overall: scoreToSentiment(overallScore),
    score: Math.round(overallScore * 100),
    confidence,
    signals,
    reasons,
  };
}

/**
 * Generate edge data for a market
 */
export function generateMarketEdge(
  marketId: string,
  marketQuestion: string,
  yesPrice: number,
  volume: number,
  liquidity: number
): MarketEdgeData {
  const signal = generateMockSignal(marketQuestion);
  
  // Calculate edge score
  // Positive signal + low yes price = positive edge for YES
  // Negative signal + high yes price = positive edge for NO
  const priceDeviation = 0.5 - yesPrice; // How far from 50/50
  const edgeScore = Math.round(signal.score * 0.6 + priceDeviation * 100 * 0.4);
  
  const edgeType = edgeScore > 15 ? "positive" : edgeScore < -15 ? "negative" : "neutral";
  
  // Determine suggested action
  let suggestedAction: MarketEdgeData["suggestedAction"] = "wait";
  if (edgeType === "positive") {
    suggestedAction = signal.score > 0 ? "consider_yes" : "consider_no";
  } else if (edgeType === "negative") {
    suggestedAction = "avoid";
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

function generateSourceSignal(source: SignalData["source"], random: () => number): SignalData {
  const sentiment = (random() * 2 - 1) * 0.8; // -0.8 to 0.8
  const confidence = 0.3 + random() * 0.6; // 0.3 to 0.9
  const velocity = 0.5 + random() * 2; // 0.5 to 2.5
  const sampleSize = Math.floor(50 + random() * 500);
  
  const keywords = generateKeywords(source, sentiment, random);
  const summary = generateSummary(source, sentiment);
  
  return {
    source,
    sentiment,
    confidence,
    velocity,
    sampleSize,
    keywords,
    summary,
    updatedAt: new Date(),
  };
}

function generateKeywords(source: SignalData["source"], sentiment: number, random: () => number): string[] {
  const bullishWords = ["bullish", "moon", "pump", "breakout", "rally", "surge"];
  const bearishWords = ["bearish", "dump", "crash", "selloff", "decline", "risk"];
  const neutralWords = ["watch", "monitor", "uncertain", "mixed", "sideways"];
  
  const pool = sentiment > 0.2 ? bullishWords : sentiment < -0.2 ? bearishWords : neutralWords;
  const count = 2 + Math.floor(random() * 3);
  
  return pool.slice(0, count);
}

function generateSummary(source: SignalData["source"], sentiment: number): string {
  const sourceNames = { x: "X/Twitter", reddit: "Reddit", news: "News" };
  const sourceName = sourceNames[source];
  
  if (sentiment > 0.3) {
    return `${sourceName} shows positive sentiment with increased activity`;
  } else if (sentiment < -0.3) {
    return `${sourceName} reflects negative sentiment and caution`;
  }
  return `${sourceName} sentiment is mixed with moderate activity`;
}

function generateReasons(signals: SignalData[]): string[] {
  const reasons: string[] = [];
  
  const x = signals.find(s => s.source === "x");
  const reddit = signals.find(s => s.source === "reddit");
  const news = signals.find(s => s.source === "news");
  
  if (x && Math.abs(x.sentiment) > 0.2) {
    reasons.push(x.sentiment > 0 
      ? "Positive momentum detected on X in the last 4 hours"
      : "Negative sentiment trending on X recently"
    );
  }
  
  if (reddit && Math.abs(reddit.sentiment) > 0.2) {
    reasons.push(reddit.sentiment > 0
      ? "Reddit discussions show optimism and interest"
      : "Reddit discussions show uncertainty and concern"
    );
  }
  
  if (news && Math.abs(news.sentiment) > 0.2) {
    reasons.push(news.sentiment > 0
      ? "Recent news headlines are favorable"
      : "Recent news headlines emphasize risks"
    );
  }
  
  if (reasons.length === 0) {
    reasons.push("Sentiment is neutral across sources");
  }
  
  return reasons;
}

// Utility functions
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
  return num.toFixed(0);
}

