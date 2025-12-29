/**
 * Signal Types for Edge Engine
 * 
 * Signals from X, Reddit, and News RSS
 */

export type SignalSource = "x" | "reddit" | "news";

export type SentimentLevel = 
  | "very_bullish" 
  | "bullish" 
  | "slightly_bullish" 
  | "neutral" 
  | "slightly_bearish" 
  | "bearish" 
  | "very_bearish";

export interface SignalData {
  source: SignalSource;
  sentiment: number; // -1 to 1
  confidence: number; // 0 to 1
  velocity: number; // activity rate multiplier
  sampleSize: number;
  keywords: string[];
  summary: string;
  updatedAt: Date;
}

export interface AggregatedSignal {
  overall: SentimentLevel;
  score: number; // -100 to 100
  confidence: "low" | "moderate" | "high";
  signals: SignalData[];
  reasons: string[];
}

export interface MarketEdgeData {
  marketId: string;
  marketQuestion: string;
  
  // Market data
  yesPrice: number;
  noPrice: number;
  volume: number;
  liquidity: number;
  
  // Edge Engine data
  signal: AggregatedSignal;
  edgeScore: number; // -100 to 100
  edgeType: "positive" | "neutral" | "negative";
  
  // Recommendation
  suggestedAction: "consider_yes" | "consider_no" | "wait" | "avoid";
  reasoning: string[];
}

/**
 * Convert sentiment score (-1 to 1) to level
 */
export function scoreToSentiment(score: number): SentimentLevel {
  if (score >= 0.6) return "very_bullish";
  if (score >= 0.3) return "bullish";
  if (score >= 0.1) return "slightly_bullish";
  if (score >= -0.1) return "neutral";
  if (score >= -0.3) return "slightly_bearish";
  if (score >= -0.6) return "bearish";
  return "very_bearish";
}

/**
 * Get display label for sentiment
 */
export function sentimentLabel(level: SentimentLevel): string {
  const labels: Record<SentimentLevel, string> = {
    very_bullish: "Very Bullish",
    bullish: "Bullish",
    slightly_bullish: "Slightly Bullish",
    neutral: "Neutral",
    slightly_bearish: "Slightly Bearish",
    bearish: "Bearish",
    very_bearish: "Very Bearish",
  };
  return labels[level];
}

/**
 * Get color class for sentiment
 */
export function sentimentColor(level: SentimentLevel): string {
  if (level.includes("bullish")) return "text-emerald-400";
  if (level.includes("bearish")) return "text-red-400";
  return "text-[var(--muted)]";
}

